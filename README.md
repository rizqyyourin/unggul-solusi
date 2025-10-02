# Toko Application - Docker Setup

Simple Docker setup untuk Laravel API + React Frontend.

## Prerequisites (PC Windows Baru)

### 1. Install Docker Desktop
- Download: https://www.docker.com/products/docker-desktop/
- Install dan restart PC
- Enable WSL 2 (Windows Subsystem for Linux) jika diminta
- Start Docker Desktop dan pastikan running

### 2. Install Git (Optional - untuk clone repo)
- Download: https://git-scm.com/download/win
- Install dengan default settings

### 3. PowerShell (Biasanya sudah ada di Windows)
- Buka PowerShell sebagai Administrator
- Set execution policy: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`

## Quick Start

```powershell
# Clone repo dari GitHub
git clone <repo-url>
cd unggul-solusi

# Setup folders & environment (otomatis dipanggil saat start)
.\setup.ps1

# Start aplikasi
.\start.ps1

# Stop aplikasi  
.\stop.ps1
```

**Note**: `start.ps1` otomatis jalanin `setup.ps1` untuk buat folder yang diperlukan.

## URLs

- **Frontend**: http://localhost:5173
- **API**: http://localhost:8000/api
- **phpMyAdmin**: http://localhost:8080
- **Database**: localhost:3306 (user: toko_user, pass: toko_pass)

## What it does

1. Start Docker containers
2. Laravel auto-seed database 
3. API ready at `/api`
4. React app connects to API

## Troubleshooting

### Docker Desktop tidak start
- Restart PC
- Enable Hyper-V di Windows Features
- Enable WSL 2

### PowerShell execution policy error
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Port sudah dipakai
- Stop services yang pakai port 3306, 5173, 8000, 8080
- Atau restart PC

## Files

- `start.ps1` - Start everything
- `stop.ps1` - Stop everything
- `docker-compose.yml` - Container orchestration
- `toko-api/Dockerfile` - Laravel container
- `toko-api/.env.docker` - Laravel environment
- `toko-web/Dockerfile` - React container

That's it! 🚀