# PowerShell script untuk menghentikan Docker Compose
Write-Host "Stopping Toko Application..." -ForegroundColor Yellow

# Navigate to project directory
Set-Location $PSScriptRoot

# Stop and remove containers
docker-compose down

Write-Host "Application stopped successfully!" -ForegroundColor Green
Write-Host "To remove all data (including database), run: docker-compose down -v" -ForegroundColor Yellow