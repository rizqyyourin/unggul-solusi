# Setup script untuk PC baru - Buat folder yang diperlukan
Write-Host "🚀 Setting up Toko Application..." -ForegroundColor Green

# Navigate to project directory
Set-Location $PSScriptRoot

Write-Host "📁 Creating required directories..." -ForegroundColor Yellow

# Laravel directories
$laravelDirs = @(
    "toko-api\storage\app\public",
    "toko-api\storage\framework\cache\data",
    "toko-api\storage\framework\sessions",
    "toko-api\storage\framework\testing",
    "toko-api\storage\framework\views",
    "toko-api\storage\logs",
    "toko-api\bootstrap\cache"
)

foreach ($dir in $laravelDirs) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "  ✅ Created: $dir" -ForegroundColor Green
    } else {
        Write-Host "  ✓ Exists: $dir" -ForegroundColor Gray
    }
}

Write-Host "🔐 Setting up Laravel environment..." -ForegroundColor Yellow

# Copy .env file if not exists
if (!(Test-Path "toko-api\.env") -and (Test-Path "toko-api\.env.docker")) {
    Copy-Item "toko-api\.env.docker" "toko-api\.env" -Force
    Write-Host "  ✅ Created .env from .env.docker" -ForegroundColor Green
}

# Create .env for React if not exists
if (!(Test-Path "toko-web\.env")) {
    @"
VITE_API_URL=http://localhost:8000/api
"@ | Out-File -FilePath "toko-web\.env" -Encoding utf8
    Write-Host "  ✅ Created React .env" -ForegroundColor Green
}

Write-Host "🎉 Setup completed!" -ForegroundColor Green
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Make sure Docker Desktop is running" -ForegroundColor White
Write-Host "  2. Run: .\start.ps1" -ForegroundColor White
Write-Host "  3. Open: http://localhost:5173" -ForegroundColor White