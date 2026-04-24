using FluentFTP;
using System.Text;

var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = args,
    // Serve static files from the app root so no wwwroot/ subfolder is needed on the server.
    WebRootPath = "."
});

// CORS — allow the production domain and local dev
var allowedOrigins = builder.Environment.IsDevelopment()
    ? (builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? ["http://localhost:5173"])
    : ["https://angesbackgard.se", "https://www.angesbackgard.se",
       "http://angesbackgard.se",  "http://www.angesbackgard.se",
       "https://alfonsdotter.se",  "https://www.alfonsdotter.se",
       "http://alfonsdotter.se",   "http://www.alfonsdotter.se"];

builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader()));

var app = builder.Build();

app.UseCors();

// Block direct HTTP access to server-side config files before static files are served.
app.Use(async (ctx, next) =>
{
    var name = Path.GetFileName(ctx.Request.Path.Value ?? "");
    if (name.StartsWith("appsettings", StringComparison.OrdinalIgnoreCase) ||
        name.Equals("local.settings.json", StringComparison.OrdinalIgnoreCase))
    {
        ctx.Response.StatusCode = 404;
        return;
    }
    await next(ctx);
});

// Serve SPA static files from the app root directory (index.html, assets/, img/, pages.json …)
app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        // Never cache pages.json — it is updated by the admin and must always be fresh.
        if (ctx.File.Name.Equals("pages.json", StringComparison.OrdinalIgnoreCase))
        {
            ctx.Context.Response.Headers["Cache-Control"] = "no-store, no-cache, must-revalidate";
            ctx.Context.Response.Headers["Pragma"] = "no-cache";
        }
    }
});

// ── API routes under /api ─────────────────────────────────────────────────────
var api = app.MapGroup("/api");

// ── GET /api/test ────────────────────────────────────────────────────────────
api.MapGet("/test", () => Results.Ok(new { message = "testing api" }));

// ── POST /api/deploy/pages ──────────────────────────────────────────────────
// Body: raw JSON content of pages.json
api.MapPost("/deploy/pages", async (HttpRequest req, IConfiguration config) =>
{
    var content = await new StreamReader(req.Body).ReadToEndAsync();

    if (string.IsNullOrWhiteSpace(content))
        return Results.BadRequest(new { success = false, error = "Request body is empty" });

    var remotePath = config["Ftp:PagesPath"] ?? "/Content/pages.json";

    try
    {
        await using var ftp = await CreateFtpClient(config);
        using var stream = new MemoryStream(Encoding.UTF8.GetBytes(content));
        await ftp.UploadStream(stream, remotePath, FtpRemoteExists.Overwrite, true);
        await ftp.Disconnect();
        return Results.Ok(new { success = true, path = remotePath });
    }
    catch (Exception ex)
    {
        return Results.Problem(detail: ex.Message, statusCode: 500);
    }
});

// ── POST /api/deploy/upload ─────────────────────────────────────────────────
// Form fields: file (binary), folder (optional subfolder under img/)
api.MapPost("/deploy/upload", async (HttpRequest req, IConfiguration config) =>
{
    if (!req.HasFormContentType)
        return Results.BadRequest(new { success = false, error = "Expected multipart/form-data" });

    var form = await req.ReadFormAsync();
    var folder = form["folder"].ToString();
    var file = form.Files.GetFile("file");

    if (file is null)
        return Results.BadRequest(new { success = false, error = "No file provided" });

    var remoteBase = config["Ftp:ImgBasePath"] ?? "/Content/img";
    var safeName = Path.GetFileName(file.FileName);
    var remoteDir = string.IsNullOrEmpty(folder) ? remoteBase : $"{remoteBase}/{folder}";
    var remotePath = $"{remoteDir}/{safeName}";

    try
    {
        await using var ftp = await CreateFtpClient(config);
        await ftp.CreateDirectory(remoteDir, true);
        using var stream = file.OpenReadStream();
        await ftp.UploadStream(stream, remotePath, FtpRemoteExists.Overwrite, true);
        await ftp.Disconnect();

        var publicPath = string.IsNullOrEmpty(folder)
            ? $"/img/{safeName}"
            : $"/img/{folder}/{safeName}";

        return Results.Ok(new { success = true, path = publicPath });
    }
    catch (Exception ex)
    {
        return Results.Problem(detail: ex.Message, statusCode: 500);
    }
});

// ── POST /api/send-order ─────────────────────────────────────────────────────
// Body: { name, email, message?, items: [{title, quantity, unitPrice?}], total? }
api.MapPost("/send-order", async (HttpRequest req, IConfiguration config) =>
{
    var order = await req.ReadFromJsonAsync<OrderRequest>();
    if (order is null || string.IsNullOrWhiteSpace(order.Name) || string.IsNullOrWhiteSpace(order.Email))
        return Results.BadRequest(new { success = false, error = "Name and email are required" });

    var sender = config["Graph:SenderAddress"];
    var recipient = config["Graph:RecipientAddress"];

    if (string.IsNullOrEmpty(sender) || string.IsNullOrEmpty(recipient))
        return Results.Problem(detail: "Microsoft Graph is not configured (Graph:SenderAddress/RecipientAddress)", statusCode: 500);

    var itemLines = order.Items.Select(i =>
        i.UnitPrice.HasValue
            ? $"  {i.Title} x{i.Quantity} = {i.UnitPrice.Value * i.Quantity} kr"
            : $"  {i.Title} x{i.Quantity} = Kontakta för pris");

    var totalLine = order.Total.HasValue ? $"{order.Total.Value} kr" : "—";
    var bodyText = $"Ny beställning från {order.Name} ({order.Email})\n\n" +
                   $"Artiklar:\n{string.Join("\n", itemLines)}\n\n" +
                   $"Totalt: {totalLine}\n\n" +
                   $"Meddelande:\n{order.Message ?? "(inget meddelande)"}";

    try
    {
        using var http = new HttpClient();
        var accessToken = await GetGraphToken(http, config);
        http.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

        var mailPayload = new
        {
            message = new
            {
                subject = $"Ny beställning – {order.Name}",
                body = new { contentType = "Text", content = bodyText },
                toRecipients = new[] { new { emailAddress = new { address = recipient } } },
                replyTo = new[] { new { emailAddress = new { address = order.Email, name = order.Name } } },
            },
            saveToSentItems = false,
        };

        var sendResp = await http.PostAsJsonAsync(
            $"https://graph.microsoft.com/v1.0/users/{sender}/sendMail", mailPayload);

        if (!sendResp.IsSuccessStatusCode)
        {
            var body = await sendResp.Content.ReadAsStringAsync();
            return Results.Problem(detail: $"Graph {(int)sendResp.StatusCode}: {body}", statusCode: 500);
        }
        return Results.Ok(new { success = true });
    }
    catch (Exception ex)
    {
        return Results.Problem(detail: ex.Message, statusCode: 500);
    }
});

// ── POST /api/send-contact ─────────────────────────────────────────────────────────
// Body: { namn, epost, telefon?, meddelande } — from the contact form (Swedish field names)
api.MapPost("/send-contact", async (HttpRequest req, IConfiguration config) =>
{
    var form = await req.ReadFromJsonAsync<ContactRequest>();
    if (form is null || string.IsNullOrWhiteSpace(form.Namn) || string.IsNullOrWhiteSpace(form.Epost))
        return Results.BadRequest(new { success = false, error = "Namn och epost krävs" });

    var bodyText = $"Meddelande från {form.Namn} ({form.Epost})\n" +
                   (string.IsNullOrEmpty(form.Telefon) ? "" : $"Telefon: {form.Telefon}\n") +
                   $"\n{form.Meddelande}";

    try
    {
        using var http = new HttpClient();
        var token = await GetGraphToken(http, config);
        http.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

        var sender = config["Graph:SenderAddress"]!;
        var recipient = config["Graph:RecipientAddress"]!;

        var mailPayload = new
        {
            message = new
            {
                subject = $"Kontaktformulär – {form.Namn}",
                body = new { contentType = "Text", content = bodyText },
                toRecipients = new[] { new { emailAddress = new { address = recipient } } },
                replyTo = new[] { new { emailAddress = new { address = form.Epost, name = form.Namn } } },
            },
            saveToSentItems = false,
        };

        var sendResp = await http.PostAsJsonAsync(
            $"https://graph.microsoft.com/v1.0/users/{sender}/sendMail", mailPayload);
        if (!sendResp.IsSuccessStatusCode)
        {
            var body = await sendResp.Content.ReadAsStringAsync();
            return Results.Problem(detail: $"Graph {(int)sendResp.StatusCode}: {body}", statusCode: 500);
        }
        return Results.Ok(new { success = true });
    }
    catch (Exception ex)
    {
        return Results.Problem(detail: ex.Message, statusCode: 500);
    }
});

// SPA fallback — serve index.html for any route not matched above (React Router)
app.MapFallbackToFile("index.html");

app.Run();

// ── helpers ───────────────────────────────────────────────────────────────────

static async Task<AsyncFtpClient> CreateFtpClient(IConfiguration config)
{
    var host = config["Ftp:Host"] ?? throw new InvalidOperationException("Ftp:Host not configured");
    var user = config["Ftp:User"] ?? throw new InvalidOperationException("Ftp:User not configured");
    var password = config["Ftp:Password"] ?? throw new InvalidOperationException("Ftp:Password not configured");
    var port = int.TryParse(config["Ftp:Port"], out var p) ? p : 21;

    var ftp = new AsyncFtpClient(host, user, password, port);
    ftp.Config.ValidateAnyCertificate = true;

    var profiles = await ftp.AutoDetect();
    if (profiles.Count > 0)
    {
        var profile = profiles[0];
        ftp.Config.EncryptionMode = profile.Encryption;
        ftp.Config.DataConnectionType = profile.DataConnection;
        ftp.Config.SslProtocols = profile.Protocols;
    }
    else
    {
        ftp.Config.EncryptionMode = FtpEncryptionMode.Explicit;
    }

    await ftp.Connect();
    return ftp;
}

static async Task<string> GetGraphToken(HttpClient http, IConfiguration config)
{
    var tenantId = config["Graph:TenantId"] ?? throw new InvalidOperationException("Graph:TenantId not configured");
    var clientId = config["Graph:ClientId"] ?? throw new InvalidOperationException("Graph:ClientId not configured");
    var secret = config["Graph:ClientSecret"] ?? throw new InvalidOperationException("Graph:ClientSecret not configured");

    var resp = await http.PostAsync(
        $"https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/token",
        new FormUrlEncodedContent(new Dictionary<string, string>
        {
            ["grant_type"] = "client_credentials",
            ["client_id"] = clientId,
            ["client_secret"] = secret,
            ["scope"] = "https://graph.microsoft.com/.default",
        }));
    resp.EnsureSuccessStatusCode();
    var doc = await resp.Content.ReadFromJsonAsync<System.Text.Json.JsonDocument>();
    return doc!.RootElement.GetProperty("access_token").GetString()!;
}

// ── records ───────────────────────────────────────────────────────────────────
record OrderItem(string Title, int Quantity, decimal? UnitPrice);
record OrderRequest(string Name, string Email, string? Message, List<OrderItem> Items, decimal? Total);
record ContactRequest(string Namn, string Epost, string? Telefon, string Meddelande);

