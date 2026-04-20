# publish.ps1 — Build the React client for production.
#
# Output: dist/   (static files ready to deploy to /public_html/demo/)
#
# CONTENT FILES (managed independently via FTP — do NOT overwrite on the server):
#   /public_html/pages.json   ← edit directly on server or via the editor tool
#   /public_html/img/         ← upload images directly; never replaced by a build
#
# The dist/ folder will also contain pages.json and img/ from public/ but these
# are only for local development — exclude them when uploading to the server.

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot

Write-Host "==> Building React client (Vite)..."
Set-Location $Root
npx vite build
if ($LASTEXITCODE -ne 0) { throw "Vite build failed" }

Write-Host "==> Done. Output: $Root\dist"
