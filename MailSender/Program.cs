using Renci.SshNet;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Allow the Vite dev server to call us during local development
builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader()));

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

app.Run();

// ── helpers ───────────────────────────────────────────────────────────────────

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

