# Flutter Installation Script for Windows
# This script downloads and configures Flutter for mobile app development

# Step 1: Download Flutter SDK
Write-Host "Downloading Flutter SDK..." -ForegroundColor Green

$flutterUrl = "https://storage.googleapis.com/flutter_infra_release/releases/stable/windows/flutter_windows_3.24.0-stable.zip"
$downloadPath = "$env:USERPROFILE\Downloads\flutter.zip"
$installPath = "C:\flutter"

# Download Flutter
if (!(Test-Path $downloadPath)) {
    Write-Host "Downloading from: $flutterUrl"
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -Uri $flutterUrl -OutFile $downloadPath
    Write-Host "Download complete!" -ForegroundColor Green
} else {
    Write-Host "Flutter ZIP already downloaded." -ForegroundColor Yellow
}

# Step 2: Extract Flutter
Write-Host "Extracting Flutter..." -ForegroundColor Green
if (Test-Path $installPath) {
    Remove-Item -Path $installPath -Recurse -Force
}
Expand-Archive -Path $downloadPath -DestinationPath "C:\" -Force
Write-Host "Extraction complete!" -ForegroundColor Green

# Step 3: Add Flutter to PATH
Write-Host "Adding Flutter to system PATH..." -ForegroundColor Green
$flutterBin = "$installPath\bin"
$currentPath = [Environment]::GetEnvironmentVariable("PATH", [EnvironmentVariableTarget]::User)

if ($currentPath -notlike "*$flutterBin*") {
    $newPath = "$currentPath;$flutterBin"
    [Environment]::SetEnvironmentVariable("PATH", $newPath, [EnvironmentVariableTarget]::User)
    Write-Host "Flutter bin added to PATH!" -ForegroundColor Green
} else {
    Write-Host "Flutter bin already in PATH." -ForegroundColor Yellow
}

# Step 4: Verify Installation
Write-Host "`nVerifying Flutter installation..." -ForegroundColor Green
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

& flutter --version
& flutter doctor

Write-Host "`nFlutter installation complete!" -ForegroundColor Green
Write-Host "Close and reopen your terminal/VS Code for PATH changes to take effect." -ForegroundColor Cyan
