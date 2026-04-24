# setup-azure-graph.ps1
# Creates an Azure AD app registration with Mail.Send permission
# and outputs the values to paste into appsettings.json.
#
# Prerequisites: Azure CLI (https://aka.ms/installazurecliwindows)
#
# Usage:
#   .\setup-azure-graph.ps1 -AppName "AngesbackMailSender" -SenderAddress "noreply@yourdomain.com"

param(
    [string]$AppName = "AngesbackMailSender",
    [string]$SenderAddress = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Step([string]$msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Ok([string]$msg) { Write-Host "    $msg"   -ForegroundColor Green }

# ── Check az CLI ──────────────────────────────────────────────────────────────

if (-not (Get-Command az -ErrorAction SilentlyContinue)) {
    Write-Error "Azure CLI not found. Install from https://aka.ms/installazurecliwindows"
    exit 1
}

# ── Login ─────────────────────────────────────────────────────────────────────

$requiredAccount = "admin@alfonsdotter.onmicrosoft.com"

Step "Checking Azure login"
$account = az account show 2>$null | ConvertFrom-Json

if ($account -and $account.user.name -ne $requiredAccount) {
    Write-Host "    Currently logged in as $($account.user.name) — logging out" -ForegroundColor Yellow
    az logout | Out-Null
    $account = $null
}

if (-not $account) {
    Step "Logging in — follow the instructions below"
    az login --use-device-code | Out-Null
    $account = az account show | ConvertFrom-Json
}

if ($account.user.name -ne $requiredAccount) {
    Write-Error "Wrong account logged in: '$($account.user.name)'. Only '$requiredAccount' is allowed."
    exit 1
}

Ok "Logged in as $($account.user.name)"
Ok "Tenant: $($account.tenantId)"

$tenantId = $account.tenantId

# ── Create app registration ───────────────────────────────────────────────────

Step "Creating app registration '$AppName'"
$existing = az ad app list --display-name $AppName --query "[0]" | ConvertFrom-Json
if ($existing) {
    Ok "App already exists (clientId=$($existing.appId)) — reusing"
    $clientId = $existing.appId
    $objectId = $existing.id
}
else {
    $app = az ad app create --display-name $AppName --query "{appId:appId,id:id}" | ConvertFrom-Json
    $clientId = $app.appId
    $objectId = $app.id
    Ok "Created (clientId=$clientId)"
}

# ── Add Mail.Send application permission ─────────────────────────────────────
# Microsoft Graph resource appId: 00000003-0000-0000-c000-000000000000
# Mail.Send application permission id: b633e1c5-b582-4048-a93e-9f11b44c7e96

Step "Adding Mail.Send application permission"
$graphAppId = "00000003-0000-0000-c000-000000000000"
$mailSendId = "b633e1c5-b582-4048-a93e-9f11b44c7e96"

$currentPerms = az ad app show --id $objectId --query "requiredResourceAccess" | ConvertFrom-Json
$alreadyAdded = $currentPerms | Where-Object { $_.resourceAppId -eq $graphAppId } |
ForEach-Object { $_.resourceAccess } |
Where-Object { $_.id -eq $mailSendId }

if ($alreadyAdded) {
    Ok "Mail.Send permission already present"
}
else {
    $body = @{
        requiredResourceAccess = @(
            @{
                resourceAppId  = $graphAppId
                resourceAccess = @(
                    @{ id = $mailSendId; type = "Role" }
                )
            }
        )
    } | ConvertTo-Json -Depth 5 -Compress

    az ad app update --id $objectId --set "requiredResourceAccess=$body" | Out-Null
    Ok "Permission added"
}

# ── Grant admin consent ───────────────────────────────────────────────────────

Step "Granting admin consent"
# Ensure service principal exists first
$sp = az ad sp show --id $clientId 2>$null | ConvertFrom-Json
if (-not $sp) {
    az ad sp create --id $clientId | Out-Null
}
az ad app permission admin-consent --id $clientId 2>$null
Ok "Admin consent granted"

# ── Create client secret ──────────────────────────────────────────────────────

Step "Creating client secret (valid 2 years)"
$secretResult = az ad app credential reset `
    --id $clientId `
    --display-name "AngesbackDeploy" `
    --years 2 `
    --query "{secretText:password}" | ConvertFrom-Json

$clientSecret = $secretResult.secretText
Ok "Secret created"

# ── Output ────────────────────────────────────────────────────────────────────

Write-Host ""
Write-Host "==> Paste these values into API\appsettings.json under ""Graph"":" -ForegroundColor Yellow
Write-Host ""
Write-Host "  ""Graph"": {" -ForegroundColor White
Write-Host "    ""TenantId"":         ""$tenantId""," -ForegroundColor White
Write-Host "    ""ClientId"":         ""$clientId""," -ForegroundColor White
Write-Host "    ""ClientSecret"":     ""$clientSecret""," -ForegroundColor White
if ($SenderAddress) {
    Write-Host "    ""SenderAddress"":    ""$SenderAddress""," -ForegroundColor White
}
else {
    Write-Host "    ""SenderAddress"":    ""<licensed M365 mailbox to send from>""," -ForegroundColor Yellow
}
Write-Host "    ""RecipientAddress"": ""<where orders should go>""" -ForegroundColor Yellow
Write-Host "  }" -ForegroundColor White
Write-Host ""
Write-Host "Note: SenderAddress must be a licensed Microsoft 365 mailbox in your tenant." -ForegroundColor DarkYellow
Write-Host "      The app has Mail.Send permission to send on behalf of any mailbox in the tenant." -ForegroundColor DarkYellow
