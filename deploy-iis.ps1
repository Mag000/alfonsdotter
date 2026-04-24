# deploy-iis.ps1 — Build and deploy the full app (SPA + API) to an IIS site root.
#
# The .NET API serves everything:
#   - Static SPA files from wwwroot\
#   - API endpoints at /api/...
#   - SPA routing fallback (index.html) for all other paths
#
# No URL Rewrite Module, no sub-applications, no Windows Services needed.
# IIS only needs the ASP.NET Core Hosting Bundle installed.
#
# Layout on the IIS server after deployment:
#   <SiteRoot>\
#       API.dll, web.config, appsettings.json, ...  ← .NET app files
#       wwwroot\
#           index.html, assets\, manifest.json, ...  ← SPA build output
#           pages.json                               ← content, NOT overwritten
#           img\                                     ← content, NOT overwritten
#
# Usage:
#   .\deploy-iis.ps1 -SiteRoot "C:\inetpub\wwwroot\alfonsdotter"
#
# Optional: -AppPool to stop/start the IIS app pool around the deploy
#   .\deploy-iis.ps1 -SiteRoot "C:\inetpub\wwwroot\alfonsdotter" -AppPool "DefaultAppPool"

param(
    [Parameter(Mandatory)]
    [string]$SiteRoot,
    [string]$AppPool = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot

function Step([string]$msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Ok([string]$msg) { Write-Host "    $msg" -ForegroundColor Green }

$appcmd = "$env:SystemRoot\System32\inetsrv\appcmd.exe"

# ── 1. Build SPA ──────────────────────────────────────────────────────────────

Step "Building React SPA (Vite)"
Push-Location $Root
npx vite build
if ($LASTEXITCODE -ne 0) { throw "Vite build failed" }
Pop-Location

# Copy SPA output into API\wwwroot so it gets included in dotnet publish
Step "Staging SPA files into API\wwwroot"
$wwwroot = "$Root\API\wwwroot"
if (-not (Test-Path $wwwroot)) { New-Item -ItemType Directory -Path $wwwroot | Out-Null }

Get-ChildItem "$Root\dist" | Where-Object {
    $_.Name -notin @("pages.json", "img", "images.json")
} | ForEach-Object {
    if ($_.PSIsContainer) {
        Copy-Item $_.FullName $wwwroot -Recurse -Force
    } else {
        Copy-Item $_.FullName $wwwroot -Force
    }
}
Ok "SPA staged to $wwwroot"

# ── 2. Publish .NET API ───────────────────────────────────────────────────────

Step "Publishing .NET API"
Push-Location "$Root\API"
dotnet publish -c Release -o "$Root\API\publish" --nologo
if ($LASTEXITCODE -ne 0) { throw "dotnet publish failed" }
Pop-Location
Ok "Published to $Root\API\publish"

# ── 3. Deploy to IIS site root ────────────────────────────────────────────────

if (-not (Test-Path $SiteRoot)) {
    New-Item -ItemType Directory -Path $SiteRoot | Out-Null
    Ok "Created $SiteRoot"
}

if ($AppPool -and (Test-Path $appcmd)) {
    & $appcmd stop apppool /apppool.name:$AppPool 2>$null
    Ok "Stopped app pool '$AppPool'"
}

Step "Copying files to $SiteRoot"

# Copy all publish output EXCEPT wwwroot (handled separately to protect content files)
Get-ChildItem "$Root\API\publish" | Where-Object { $_.Name -ne "wwwroot" } | ForEach-Object {
    if ($_.PSIsContainer) {
        Copy-Item $_.FullName $SiteRoot -Recurse -Force
    } else {
        Copy-Item $_.FullName $SiteRoot -Force
    }
}

# Copy wwwroot contents EXCEPT content files managed independently on the server
$wwwDest = Join-Path $SiteRoot "wwwroot"
if (-not (Test-Path $wwwDest)) { New-Item -ItemType Directory -Path $wwwDest | Out-Null }

Get-ChildItem "$Root\API\publish\wwwroot" | Where-Object {
    $_.Name -notin @("pages.json", "img", "images.json")
} | ForEach-Object {
    if ($_.PSIsContainer) {
        Copy-Item $_.FullName $wwwDest -Recurse -Force
    } else {
        Copy-Item $_.FullName $wwwDest -Force
    }
}

Ok "Files deployed to $SiteRoot"

if ($AppPool -and (Test-Path $appcmd)) {
    & $appcmd start apppool /apppool.name:$AppPool 2>$null
    Ok "Started app pool '$AppPool'"
}

# ── Done ──────────────────────────────────────────────────────────────────────

Write-Host "`n==> Deployment complete." -ForegroundColor Green
Write-Host "    Site root : $SiteRoot"
Write-Host ""
Write-Host "First-time checklist:" -ForegroundColor Yellow
Write-Host "  1. Install the ASP.NET Core Hosting Bundle on the IIS server"
Write-Host "  2. Point the IIS site to $SiteRoot"
Write-Host "  3. Set the app pool to 'No Managed Code'"
Write-Host "  4. Place pages.json and img\ inside $SiteRoot\wwwroot\  (content files)"

#
# The API runs on a separate server. Set VITE_API_BASE in .env.production
# to point the SPA at the API server, e.g.:
#   VITE_API_BASE=https://api.myserver.com/api
#
# No URL Rewrite Module or sub-applications required.
# SPA routing is handled by the web.config httpErrors fallback.
#
# Layout expected on the IIS server:
#   <IIS site root>\              ← $SiteRoot   (e.g. C:\inetpub\wwwroot\alfonsdotter)
#       index.html
#       assets\
#       web.config                ← SPA routing fallback via httpErrors + WebP MIME type
#       pages.json                ← content file, NOT overwritten by this script
#       img\                      ← content images, NOT overwritten by this script
#
# Usage:
#   .\deploy-iis.ps1 -SiteRoot "C:\inetpub\wwwroot\alfonsdotter"

param(
    [Parameter(Mandatory)]
    [string]$SiteRoot
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot

function Step([string]$msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Ok([string]$msg) { Write-Host "    $msg" -ForegroundColor Green }

# ── Validate destination ──────────────────────────────────────────────────────

if (-not (Test-Path $SiteRoot)) {
    New-Item -ItemType Directory -Path $SiteRoot | Out-Null
    Ok "Created $SiteRoot"
}

$SpaDest = $SiteRoot

# ── 1. Build SPA ─────────────────────────────────────────────────────────────

Step "Building React SPA (Vite)"
Push-Location $Root
npx vite build
if ($LASTEXITCODE -ne 0) { throw "Vite build failed" }
Pop-Location

# ── 2. Deploy SPA ────────────────────────────────────────────────────────────

Step "Deploying SPA to $SpaDest"
if (-not (Test-Path $SpaDest)) { New-Item -ItemType Directory -Path $SpaDest | Out-Null }

# Copy all dist/ files except content files managed independently on the server
Get-ChildItem "$Root\dist" | Where-Object {
    $_.Name -notin @("pages.json", "img", "images.json")
} | ForEach-Object {
    if ($_.PSIsContainer) {
        Copy-Item $_.FullName $SpaDest -Recurse -Force
    }
    else {
        Copy-Item $_.FullName $SpaDest -Force
    }
}

Ok "SPA deployed to $SpaDest"

# ── 3. API (Windows Service) ──────────────────────────────────────────────────

$ApiDest = Join-Path $SiteRoot "api-service"
$ServiceName = "AngesbackGardApi"

Step "Publishing .NET API"
Push-Location "$Root\API"
dotnet publish -c Release -o "$Root\API\publish" --nologo
if ($LASTEXITCODE -ne 0) { throw "dotnet publish failed" }
Pop-Location

Step "Deploying API to $ApiDest"
if (-not (Test-Path $ApiDest)) { New-Item -ItemType Directory -Path $ApiDest | Out-Null }

$svc = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
if ($svc) {
    Stop-Service -Name $ServiceName -Force
    Ok "Stopped service '$ServiceName'"
}

Copy-Item "$Root\API\publish\*" $ApiDest -Recurse -Force
Ok "API files copied to $ApiDest"

if (-not $svc) {
    $exePath = Join-Path $ApiDest "API.exe"
    New-Service -Name $ServiceName -BinaryPathName $exePath -DisplayName "Ängesbäck Gård API" -StartupType Automatic
    Ok "Windows Service '$ServiceName' created"
}

Start-Service -Name $ServiceName
Ok "Started service '$ServiceName'"

# ── Done ──────────────────────────────────────────────────────────────────────

Write-Host "`n==> Deployment complete." -ForegroundColor Green
Write-Host "    Site root : $SiteRoot"
Write-Host "    SPA       : $SpaDest"
Write-Host "    API       : $ApiDest  (Windows Service: $ServiceName, port 5100)"
Write-Host ""
Write-Host "First-time checklist:" -ForegroundColor Yellow
Write-Host "  1. Point the IIS site to $SiteRoot"
Write-Host "  2. Place pages.json and img\ in $SiteRoot  (content — not managed by this script)"
Write-Host "  3. Set VITE_API_BASE=http://localhost:5100 in .env.production and rebuild SPA"
Write-Host "  4. Open port 5100 in the Windows Firewall if the API must be reachable externally"

#
# Prerequisites:
#   - IIS installed with ASP.NET Core Hosting Bundle (for AspNetCoreModuleV2)
#   - URL Rewrite Module installed in IIS
#   - The target site/application already created in IIS Manager
#
# Layout expected on the IIS server:
#   <IIS site root>\              ← $SiteRoot   (e.g. C:\inetpub\wwwroot\alfonsdotter)
#       web.config                ← server-root.web.config (URL rewrite + MIME types)
#       pages.json                ← content file, NOT overwritten by this script
#       img\                      ← content images, NOT overwritten by this script
#       demo\                     ← SPA static files (IIS application)
#           index.html
#           assets\
#           web.config
#       api\                      ← ASP.NET Core app (IIS application)
#           API.dll
#           web.config
#           ...
#
# Usage:
#   .\deploy-iis.ps1 -SiteRoot "C:\inetpub\wwwroot\alfonsdotter"
#
# Optional flags:
#   -SkipSpa    Skip building/deploying the React SPA
#   -SkipApi    Skip building/deploying the .NET API

param(
    [Parameter(Mandatory)]
    [string]$SiteRoot,

    [switch]$SkipSpa,
    [switch]$SkipApi
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot

# ── Helpers ──────────────────────────────────────────────────────────────────

function Step([string]$msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Ok([string]$msg) { Write-Host "    $msg" -ForegroundColor Green }

# ── Validate destination ──────────────────────────────────────────────────────

if (-not (Test-Path $SiteRoot)) {
    New-Item -ItemType Directory -Path $SiteRoot | Out-Null
    Ok "Created $SiteRoot"
}

$SpaDest = Join-Path $SiteRoot "demo"
$ApiDest = Join-Path $SiteRoot "api"

# ── 1. Deploy server-root web.config ─────────────────────────────────────────

Step "Copying server-root web.config to site root"
Copy-Item "$Root\server-root.web.config" "$SiteRoot\web.config" -Force
Ok "Copied to $SiteRoot\web.config"

# ── 2. SPA ────────────────────────────────────────────────────────────────────

if (-not $SkipSpa) {
    Step "Building React SPA (Vite)"
    Push-Location $Root
    npx vite build
    if ($LASTEXITCODE -ne 0) { throw "Vite build failed" }
    Pop-Location

    Step "Deploying SPA to $SpaDest"
    if (-not (Test-Path $SpaDest)) { New-Item -ItemType Directory -Path $SpaDest | Out-Null }

    # Copy all dist/ files except content files managed independently on the server
    Get-ChildItem "$Root\dist" | Where-Object {
        $_.Name -notin @("pages.json", "img", "images.json")
    } | ForEach-Object {
        if ($_.PSIsContainer) {
            Copy-Item $_.FullName $SpaDest -Recurse -Force
        }
        else {
            Copy-Item $_.FullName $SpaDest -Force
        }
    }

    Ok "SPA deployed to $SpaDest"
}
else {
    Write-Host "    (SPA skipped)" -ForegroundColor Yellow
}

# ── 3. API ────────────────────────────────────────────────────────────────────

if (-not $SkipApi) {
    Step "Publishing .NET API"
    Push-Location "$Root\API"
    dotnet publish -c Release -o "$Root\API\publish" --nologo
    if ($LASTEXITCODE -ne 0) { throw "dotnet publish failed" }
    Pop-Location

    Step "Deploying API to $ApiDest"
    if (-not (Test-Path $ApiDest)) { New-Item -ItemType Directory -Path $ApiDest | Out-Null }

    # Stop the IIS app pool before overwriting locked DLLs (best-effort)
    $poolName = Read-Host "    Enter the IIS app pool name for /api (leave blank to skip pool recycle)"
    if ($poolName) {
        & "$env:SystemRoot\System32\inetsrv\appcmd.exe" stop apppool /apppool.name:$poolName 2>$null
        Ok "Stopped app pool '$poolName'"
    }

    Copy-Item "$Root\API\publish\*" $ApiDest -Recurse -Force
    Ok "API deployed to $ApiDest"

    if ($poolName) {
        & "$env:SystemRoot\System32\inetsrv\appcmd.exe" start apppool /apppool.name:$poolName 2>$null
        Ok "Started app pool '$poolName'"
    }
}
else {
    Write-Host "    (API skipped)" -ForegroundColor Yellow
}

# ── Done ──────────────────────────────────────────────────────────────────────

Write-Host "`n==> Deployment complete." -ForegroundColor Green
Write-Host "    Site root : $SiteRoot"
if (-not $SkipSpa) { Write-Host "    SPA       : $SpaDest" }
if (-not $SkipApi) { Write-Host "    API       : $ApiDest" }
Write-Host ""
Write-Host "IIS setup checklist (first time only):" -ForegroundColor Yellow
Write-Host "  1. Install the ASP.NET Core Hosting Bundle on the IIS machine"
Write-Host "  2. Install the IIS URL Rewrite Module"
Write-Host "  3. Create the site pointing to $SiteRoot"
Write-Host "  4. Add 'demo' and 'api' as IIS Applications under that site"
Write-Host "  5. Set the 'api' app pool to 'No Managed Code'"
Write-Host "  6. Place pages.json and img\ in $SiteRoot (content — not managed by this script)"
