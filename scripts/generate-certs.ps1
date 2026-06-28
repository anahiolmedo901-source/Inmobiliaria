param(
  [string]$OutputDir = (Join-Path (Split-Path $PSScriptRoot -Parent) "ssl"),
  [string]$Password = "viviana-dev",
  [int]$Years = 5
)

$ErrorActionPreference = "Stop"
$OutputDir = Resolve-Path $OutputDir -ErrorAction SilentlyContinue
if (-not $OutputDir) { $OutputDir = (Join-Path (Split-Path $PSScriptRoot -Parent) "ssl") }
New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null

$cert = New-SelfSignedCertificate `
  -DnsName "localhost", "127.0.0.1" `
  -CertStoreLocation "cert:\CurrentUser\My" `
  -FriendlyName "Viviana Development HTTPS ($(Get-Date -Format yyyy))" `
  -NotAfter (Get-Date).AddYears($Years) `
  -KeyUsageProperty All `
  -KeyUsage DigitalSignature, KeyEncipherment `
  -KeyExportPolicy Exportable

$securePass = ConvertTo-SecureString -String $Password -Force -AsPlainText
$pfxPath = Join-Path $OutputDir "viviana-dev.pfx"
Export-PfxCertificate -Cert $cert -FilePath $pfxPath -Password $securePass | Out-Null

$certPath = Join-Path $OutputDir "viviana-dev.crt"
$keyPath = Join-Path $OutputDir "viviana-dev.key"

# Export PEM certificate
$certBytes = $cert.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Cert)
$certBuilder = New-Object System.Text.StringBuilder
$certBuilder.AppendLine("-----BEGIN CERTIFICATE-----") | Out-Null
$base64Cert = [Convert]::ToBase64String($certBytes, [System.Base64FormattingOptions]::InsertLineBreaks)
$certBuilder.AppendLine($base64Cert) | Out-Null
$certBuilder.AppendLine("-----END CERTIFICATE-----") | Out-Null
[System.IO.File]::WriteAllText($certPath, $certBuilder.ToString())

# Export private key as PEM using .NET
$rsa = [System.Security.Cryptography.X509Certificates.RSACertificateExtensions]::GetRSAPrivateKey($cert)
if (-not $rsa) { throw "No RSA private key found" }

$keyBytes = $rsa.Key.Export([System.Security.Cryptography.CngKeyBlobFormat]::Pkcs8PrivateBlob)
$keyBuilder = New-Object System.Text.StringBuilder
$keyBuilder.AppendLine("-----BEGIN PRIVATE KEY-----") | Out-Null
$base64 = [Convert]::ToBase64String($keyBytes, [System.Base64FormattingOptions]::InsertLineBreaks)
$keyBuilder.AppendLine($base64) | Out-Null
$keyBuilder.AppendLine("-----END PRIVATE KEY-----") | Out-Null
[System.IO.File]::WriteAllText($keyPath, $keyBuilder.ToString())

# Remove from store (we keep only the files)
Remove-Item "Cert:\CurrentUser\My\$($cert.Thumbprint)" -Force

Write-Output "Certificates generated:"
Write-Output "  CRT: $certPath"
Write-Output "  KEY: $keyPath"
Write-Output "  PFX: $pfxPath"
Write-Output ""
Write-Output "Add these to your .env:"
Write-Output "  SSL_KEY_PATH=$keyPath"
Write-Output "  SSL_CERT_PATH=$certPath"
Write-Output "  HTTPS_PORT=4100"
