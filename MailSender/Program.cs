using Azure.Identity;
using Microsoft.Graph;
using Microsoft.Graph.Models;
using Microsoft.Graph.Users.Item.SendMail;
using Renci.SshNet;
using System.Text;
using WebApplication = Microsoft.AspNetCore.Builder.WebApplication;

var builder = WebApplication.CreateBuilder(args);

// Allow the Vite dev server (dev) and the live site (production)
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? ["http://localhost:5173"];

builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader()));

builder.Services.AddSingleton(sp =>
{
    var cfg = sp.GetRequiredService<IConfiguration>();
    var credential = new ClientSecretCredential(
        cfg["Graph:TenantId"],
        cfg["Graph:ClientId"],
        cfg["Graph:ClientSecret"]);
    return new GraphServiceClient(credential, ["https://graph.microsoft.com/.default"]);
});

var app = builder.Build();

// When hosted as an IIS sub-application at /api, strip that prefix so routing works
app.UsePathBase("/api");

if (app.Environment.IsDevelopment())
    app.UseCors();

// ── POST /deploy/pages ────────────────────────────────────────────────────────
// Body: raw JSON content of pages.json
app.MapPost("/deploy/pages", async (HttpRequest req, IConfiguration config) =>
{
    using var client = CreateClient(config, out var err);
    if (client is null)
        return Results.Problem(detail: err, statusCode: 500);

    var remotePath = config["Sftp:PagesPath"] ?? "/public_html/pages.json";
    var content = await new StreamReader(req.Body).ReadToEndAsync();

    if (string.IsNullOrWhiteSpace(content))
        return Results.BadRequest(new { success = false, error = "Request body is empty" });

    try
    {
        client.Connect();
        using var stream = new MemoryStream(Encoding.UTF8.GetBytes(content));
        client.UploadFile(stream, remotePath, true);
        return Results.Ok(new { success = true, path = remotePath });
    }
    catch (Exception ex)
    {
        return Results.Problem(detail: ex.Message, statusCode: 500);
    }
    finally
    {
        if (client.IsConnected) client.Disconnect();
    }
});

// ── POST /deploy/upload ───────────────────────────────────────────────────────
// Form fields: file (binary), folder (optional subfolder under img/)
app.MapPost("/deploy/upload", async (HttpRequest req, IConfiguration config) =>
{
    if (!req.HasFormContentType)
        return Results.BadRequest(new { success = false, error = "Expected multipart/form-data" });

    var form = await req.ReadFormAsync();
    var folder = form["folder"].ToString();
    var file = form.Files.GetFile("file");

    if (file is null)
        return Results.BadRequest(new { success = false, error = "No file provided" });

    var remoteBase = config["Sftp:ImgBasePath"] ?? "/public_html/img";
    var safeName = Path.GetFileName(file.FileName);
    var remoteDir = string.IsNullOrEmpty(folder) ? remoteBase : $"{remoteBase}/{folder}";
    var remotePath = $"{remoteDir}/{safeName}";

    using var client = CreateClient(config, out var err);
    if (client is null)
        return Results.Problem(detail: err, statusCode: 500);

    try
    {
        client.Connect();
        EnsureDirectory(client, remoteDir);
        using var stream = file.OpenReadStream();
        client.UploadFile(stream, remotePath, true);

        var publicPath = string.IsNullOrEmpty(folder)
            ? $"/img/{safeName}"
            : $"/img/{folder}/{safeName}";

        return Results.Ok(new { success = true, path = publicPath });
    }
    catch (Exception ex)
    {
        return Results.Problem(detail: ex.Message, statusCode: 500);
    }
    finally
    {
        if (client.IsConnected) client.Disconnect();
    }
});

// ── POST /send-contact ────────────────────────────────────────────────────────
// Body: { namn, epost, telefon?, meddelande }
app.MapPost("/send-contact", async (HttpRequest req, IConfiguration config, GraphServiceClient graph) =>
{
    var form = await req.ReadFromJsonAsync<ContactRequest>();
    if (form is null || string.IsNullOrWhiteSpace(form.Namn) || string.IsNullOrWhiteSpace(form.Epost))
        return Results.BadRequest(new { success = false, error = "Namn och e-post är obligatoriska" });

    var from = config["Graph:From"];
    var to = config["Graph:To"];
    if (string.IsNullOrEmpty(from) || string.IsNullOrEmpty(to))
        return Results.Problem(detail: "Graph:From / Graph:To are not configured", statusCode: 500);

    var body = $"""
        Nytt kontaktmeddelande

        Namn:     {form.Namn}
        E-post:   {form.Epost}
        Telefon:  {form.Telefon ?? "—"}

        Meddelande:
        {form.Meddelande}
        """;

    try
    {
        await SendGraphMailAsync(graph, from, to, $"Nytt meddelande från {form.Namn}", body);
        return Results.Ok(new { success = true });
    }
    catch (Exception ex)
    {
        return Results.Problem(detail: ex.Message, statusCode: 500);
    }
});

// ── POST /send-order ─────────────────────────────────────────────────────────
// Body: { name, email, message?, items: [{title, quantity, unitPrice?}], total? }
app.MapPost("/send-order", async (HttpRequest req, IConfiguration config, GraphServiceClient graph) =>
{
    var order = await req.ReadFromJsonAsync<OrderRequest>();
    if (order is null || string.IsNullOrWhiteSpace(order.Name) || string.IsNullOrWhiteSpace(order.Email))
        return Results.BadRequest(new { success = false, error = "Name and email are required" });

    var from = config["Graph:From"];
    var to = config["Graph:To"];
    if (string.IsNullOrEmpty(from) || string.IsNullOrEmpty(to))
        return Results.Problem(detail: "Graph:From / Graph:To are not configured", statusCode: 500);

    var itemLines = order.Items.Select(i =>
        i.UnitPrice.HasValue
            ? $"  {i.Title} x{i.Quantity} = {i.UnitPrice.Value * i.Quantity} kr"
            : $"  {i.Title} x{i.Quantity} = Kontakta för pris");

    var totalLine = order.Total.HasValue ? $"{order.Total.Value} kr" : "—";

    var body = $"""
        Ny beställning från {order.Name} ({order.Email})

        Artiklar:
        {string.Join("\n", itemLines)}

        Totalt: {totalLine}

        Meddelande:
        {order.Message ?? "(inget meddelande)"}
        """;

    try
    {
        await SendGraphMailAsync(graph, from, to, $"Ny beställning – {order.Name}", body);
        return Results.Ok(new { success = true });
    }
    catch (Exception ex)
    {
        return Results.Problem(detail: ex.Message, statusCode: 500);
    }
});

app.Run();

// ── helpers ───────────────────────────────────────────────────────────────────

static async Task SendGraphMailAsync(GraphServiceClient graph, string from, string to, string subject, string body)
{
    var message = new Message
    {
        Subject = subject,
        Body = new ItemBody { ContentType = BodyType.Text, Content = body },
        ToRecipients = [new Recipient { EmailAddress = new EmailAddress { Address = to } }],
    };
    await graph.Users[from].SendMail.PostAsync(new SendMailPostRequestBody { Message = message });
}

static SftpClient? CreateClient(IConfiguration config, out string? error)
{
    var host = config["Sftp:Host"];
    var user = config["Sftp:User"];
    var password = config["Sftp:Password"];

    if (string.IsNullOrEmpty(host) || string.IsNullOrEmpty(user) || string.IsNullOrEmpty(password))
    {
        error = "SFTP credentials not configured (Sftp:Host / Sftp:User / Sftp:Password)";
        return null;
    }

    var port = int.TryParse(config["Sftp:Port"], out var p) ? p : 22;
    error = null;
    return new SftpClient(host, port, user, password);
}

static void EnsureDirectory(SftpClient client, string path)
{
    var parts = path.TrimStart('/').Split('/');
    var current = "";
    foreach (var part in parts)
    {
        current += "/" + part;
        if (!client.Exists(current))
            client.CreateDirectory(current);
    }
}

// ── records ───────────────────────────────────────────────────────────────────
record ContactRequest(string Namn, string Epost, string? Telefon, string Meddelande);
record OrderItem(string Title, int Quantity, decimal? UnitPrice);
record OrderRequest(string Name, string Email, string? Message, List<OrderItem> Items, decimal? Total);
