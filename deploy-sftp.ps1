# deploy-sftp.ps1 — Build and deploy the full app (SPA + API) to a remote server
#                   via FTP with explicit TLS (FTPES) using FluentFTP.
#                   FluentFTP is downloaded automatically from NuGet on first run.
#
# Credentials are read from deploy-sftp.config.ps1 (git-ignored).
# Copy deploy-sftp.config.example.ps1 to deploy-sftp.config.ps1 and fill in your values.
#
# Usage:
#   .\deploy-sftp.ps1
#
# Optional flags:
#   -SkipBuild    Re-use last build output without rebuilding
#   -DeployTarget Choose what to build/deploy: Both, Client, or Api (default: Both)

param(
    [switch]$SkipBuild,
    [ValidateSet("Both", "Client", "Api")]
    [string]$DeployTarget = "Both"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot

$deployClient = $DeployTarget -in @("Both", "Client")
$deployApi = $DeployTarget -in @("Both", "Api")

function Step([string]$msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Ok([string]$msg) { Write-Host "    $msg"   -ForegroundColor Green }

# ── Load config ───────────────────────────────────────────────────────────────

$configFile = Join-Path $Root "deploy-sftp.config.ps1"
if (-not (Test-Path $configFile)) {
    Write-Error "Missing config file: $configFile`nCopy deploy-sftp.config.example.ps1 and fill in your credentials."
    exit 1
}
. $configFile
# Expected variables: $FtpHost, $FtpPort, $FtpUser, $FtpPassword, $RemotePath

# ── Bootstrap FluentFTP (downloads once, cached in .tools/) ──────────────────

$toolsDir = Join-Path $Root ".tools\FluentFTP"
$dllTarget = Join-Path $toolsDir "FluentFTP.dll"

if (-not (Test-Path $dllTarget)) {
    Step "Downloading FluentFTP from NuGet"
    New-Item -ItemType Directory -Path $toolsDir -Force | Out-Null
    $nupkg = Join-Path $toolsDir "FluentFTP.nupkg"
    Invoke-WebRequest "https://www.nuget.org/api/v2/package/FluentFTP" -OutFile $nupkg
    $expanded = Join-Path $toolsDir "expanded"
    Expand-Archive -Path $nupkg -DestinationPath $expanded -Force
    $dll = Get-ChildItem "$expanded\lib" -Recurse -Filter "FluentFTP.dll" |
    Sort-Object { $_.Directory.Name } | Select-Object -Last 1
    Copy-Item $dll.FullName $dllTarget
    Remove-Item $expanded -Recurse -Force
    Remove-Item $nupkg -Force
    Ok "FluentFTP ready"
}

Add-Type -Path $dllTarget

# ── Build ─────────────────────────────────────────────────────────────────────

# Publish output goes into API\bin\Release\publish (inside bin\ which is git-ignored).
$publishDir = Join-Path $Root "API\bin\Release\publish"
$distDir = Join-Path $Root "dist"

if ($deployClient) {
    Step "Stopping dev server (node/vite processes)"
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
    Ok "Dev server stopped (if it was running)"
}

if (-not $SkipBuild) {
    if ($deployClient) {
        Step "Building React SPA (Vite)"
        Push-Location $Root
        npx vite build
        if ($LASTEXITCODE -ne 0) { throw "Vite build failed" }
        Pop-Location

        Step "Staging SPA files into API\wwwroot"
        $wwwroot = Join-Path $Root "API\wwwroot"
        if (-not (Test-Path $wwwroot)) { New-Item -ItemType Directory -Path $wwwroot | Out-Null }
        Get-ChildItem "$Root\dist" | Where-Object {
            $_.Name -notin @("pages.json", "img", "images.json")
        } | ForEach-Object {
            if ($_.PSIsContainer) { Copy-Item $_.FullName $wwwroot -Recurse -Force }
            else { Copy-Item $_.FullName $wwwroot -Force }
        }
        Ok "SPA staged"
    }

    if ($deployApi) {
        Step "Publishing .NET API"
        # Remove old API\publish\ folder (leftover from earlier runs) so the SDK does not
        # pick up its appsettings.json files via content globs and nest them in the output.
        $legacyPublish = Join-Path $Root "API\publish"
        if (Test-Path $legacyPublish) { Remove-Item $legacyPublish -Recurse -Force }
        if (Test-Path $publishDir) { Remove-Item $publishDir    -Recurse -Force }
        # Target the .csproj explicitly so the -o flag works (avoids the .sln multi-project warning).
        dotnet publish "$Root\API\API.csproj" -c Release -o $publishDir --nologo
        if ($LASTEXITCODE -ne 0) { throw "dotnet publish failed" }
        Ok "Published to $publishDir"
    }
}
else {
    Write-Host "    (build skipped)" -ForegroundColor Yellow
}

if ($deployApi -and -not (Test-Path $publishDir)) {
    throw "API publish output not found at $publishDir. Run without -SkipBuild or deploy Client only."
}

$staticSourceDir = if ($deployApi) { Join-Path $publishDir "wwwroot" } else { $distDir }
if ($deployClient -and -not (Test-Path $staticSourceDir)) {
    throw "Static build output not found at $staticSourceDir. Run without -SkipBuild or verify previous build output exists."
}

# ── Connect via FluentFTP ─────────────────────────────────────────────────────

Step "Connecting to $FtpHost"

$ftp = New-Object FluentFTP.FtpClient($FtpHost, $FtpUser, $FtpPassword, $FtpPort)
$ftp.Config.ValidateAnyCertificate = $true
$ftp.Config.DataConnectionType = [FluentFTP.FtpDataConnectionType]::PASV

# Auto-detect the best encryption mode supported by the server.
$profile = $ftp.AutoDetect($true)
if ($profile -and $profile.Count -gt 0) {
    $p = $profile[0]
    $ftp.Config.EncryptionMode = $p.Encryption
    $ftp.Config.DataConnectionType = $p.DataConnection
    if ($p.Protocols) { $ftp.Config.SslProtocols = $p.Protocols }
    Ok "Auto-detected profile: encryption=$($p.Encryption)"
}
else {
    $ftp.Config.EncryptionMode = [FluentFTP.FtpEncryptionMode]::Explicit
}

$ftp.Connect()
Ok "Connected"

# ── Upload ────────────────────────────────────────────────────────────────────

function Upload-Directory {
    param(
        [string]   $localDir,
        [string]   $remoteDir,
        [string[]] $exclude = @()
    )

    Get-ChildItem $localDir | Where-Object { $_.Name -notin $exclude } | ForEach-Object {
        $remotePath = "$remoteDir/$($_.Name)"
        if ($_.PSIsContainer) {
            Upload-Directory -localDir $_.FullName -remoteDir $remotePath
        }
        else {
            Write-Host "    -> $remotePath"
            $uploaded = $false
            for ($attempt = 1; $attempt -le 4; $attempt++) {
                try {
                    $ftp.UploadFile($_.FullName, $remotePath, [FluentFTP.FtpRemoteExists]::Overwrite, $true) | Out-Null
                    $uploaded = $true
                    break
                }
                catch {
                    if ($attempt -lt 4) {
                        Write-Host "      (locked, retrying in ${attempt}s…)" -ForegroundColor Yellow
                        Start-Sleep -Seconds $attempt
                    }
                    else {
                        throw
                    }
                }
            }
        }
    }
}

if ($deployApi) {
    # Upload DLLs, web.config, appsettings, etc. — skip the wwwroot folder itself.
    # Put app_offline.htm first so ASP.NET Core shuts down and releases file locks.
    Step "Taking app offline"
    $offlineContent = [System.Text.Encoding]::UTF8.GetBytes("<html><body>Deploying, please wait...</body></html>")
    $ftp.UploadBytes($offlineContent, "$RemotePath/app_offline.htm", [FluentFTP.FtpRemoteExists]::Overwrite, $true) | Out-Null
    Start-Sleep -Seconds 6
    Ok "App offline"

    Step "Uploading app files to $RemotePath"
    Upload-Directory -localDir $publishDir -remoteDir $RemotePath -exclude @("wwwroot", "appsettings.json", "appsettings.Development.json")

    # Upload production secrets (git-ignored, not included in publish output)
    $prodSettings = Join-Path $Root "API\appsettings.Production.json"
    if (Test-Path $prodSettings) {
        Write-Host "    -> $RemotePath/appsettings.Production.json"
        $ftp.UploadFile($prodSettings, "$RemotePath/appsettings.Production.json", [FluentFTP.FtpRemoteExists]::Overwrite, $true) | Out-Null
        Ok "Production settings uploaded"
    }
    else {
        Write-Host "    (appsettings.Production.json not found — skipping)" -ForegroundColor Yellow
    }

    # Ensure logs/ directory exists on server (required for stdout logging)
    if (-not $ftp.DirectoryExists("$RemotePath/logs")) {
        $ftp.CreateDirectory("$RemotePath/logs") | Out-Null
        Ok "Created logs/ directory"
    }
}

if ($deployClient) {
    # Upload static files directly into the site root (no wwwroot subfolder on server).
    # Exclude web.config — the API's web.config must not be overwritten.
    # Skip content files that are managed independently on the server.
    Step "Uploading static files to $RemotePath"
    Upload-Directory -localDir $staticSourceDir -remoteDir $RemotePath `
        -exclude @("pages.json", "images.json", "img", "web.config")
}

if ($deployApi) {
    # Remove app_offline.htm to bring the app back online.
    Step "Bringing app back online"
    $ftp.DeleteFile("$RemotePath/app_offline.htm")
    Ok "App online"
}

$ftp.Disconnect()
Ok "Disconnected"

# ── Done ──────────────────────────────────────────────────────────────────────

Write-Host "`n==> Deployment complete." -ForegroundColor Green
Write-Host "    Remote: $FtpHost$RemotePath"
Write-Host ""
Write-Host "First-time server checklist:" -ForegroundColor Yellow
Write-Host "  1. Install the ASP.NET Core Hosting Bundle on the server"
Write-Host "  2. Point the IIS site root to $RemotePath"
Write-Host "  3. Set the app pool Identity and Managed Code to 'No Managed Code'"
Write-Host "  4. Copy pages.json and img\ directly into $RemotePath/  (content — deployed once)"
