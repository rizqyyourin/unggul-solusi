# Start Toko Application
Write-Host "Starting Toko Application..." -ForegroundColor Green

# Check Docker
if (!(Get-Process "Docker Desktop" -ErrorAction SilentlyContinue)) {
    Write-Host "Docker Desktop not running!" -ForegroundColor Red
    exit 1
}

Set-Location $PSScriptRoot

# Run setup first (create required directories)
Write-Host "Running setup..." -ForegroundColor Yellow
& ".\setup.ps1"

# Copy env
Copy-Item "toko-api\.env.docker" "toko-api\.env" -Force

# Start Docker containers
Write-Host "Starting containers..." -ForegroundColor Yellow
docker-compose up --build -d

# Wait for everything to be ready
Write-Host "Waiting for services..." -ForegroundColor Yellow
Start-Sleep -Seconds 25

Write-Host "APPLICATION READY!" -ForegroundColor Green
Write-Host "URLs:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "  API: http://localhost:8000/api" -ForegroundColor White
Write-Host "  phpMyAdmin: http://localhost:8080" -ForegroundColor White