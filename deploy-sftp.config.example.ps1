# deploy-sftp.config.example.ps1
# Copy this file to deploy-sftp.config.ps1 and fill in your values.
# deploy-sftp.config.ps1 is excluded from source control (.gitignore).

$FtpHost = "iis2.ilait.se"
$FtpPort = 21
$FtpUser = "uwwas403210"
$FtpPassword = "your-ftp-password"

# Remote path where the app should be deployed (the IIS site root)
$RemotePath = "/Content"
