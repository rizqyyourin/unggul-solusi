# Setup untuk PC Windows Baru

## Langkah-langkah Setup

### 1. 🐳 Install Docker Desktop
1. Download dari: https://www.docker.com/products/docker-desktop/
2. Jalankan installer sebagai Administrator
3. **PENTING**: Pilih "Use WSL 2 instead of Hyper-V" saat install
4. Restart PC setelah install
5. Buka Docker Desktop dan tunggu sampai status "Engine running"

### 2. 🔧 Enable Windows Features (Jika Docker minta)
1. Buka "Turn Windows features on or off"
2. Centang:
   - Windows Subsystem for Linux
   - Virtual Machine Platform
   - Hyper-V (jika tersedia)
3. Restart PC

### 3. 📁 Download Project
**Option A: Via Git**
```powershell
# Install Git dulu: https://git-scm.com/download/win
git clone <repo-url>
cd unggul-solusi
```

**Option B: Download ZIP**
- Download project sebagai ZIP dari GitHub
- Extract ke folder (misal: `D:\Projects\unggul-solusi`)

**Note**: Project di GitHub sudah exclude folder berat seperti `node_modules`, `vendor`, dll.

### 4. 🚀 PowerShell Setup
```powershell
# Buka PowerShell sebagai Administrator
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

# Masuk ke folder project
cd "D:\path\to\unggul-solusi"

# Test Docker
docker --version
```

### 5. ▶️ Jalankan Aplikasi
```powershell
# Start aplikasi (otomatis setup folders)
.\start.ps1

# Buka browser ke:
# http://localhost:5173 (Frontend)
# http://localhost:8000/api (API)
```

**Note**: `start.ps1` otomatis jalanin `setup.ps1` untuk buat folder yang diperlukan seperti `storage`, `cache`, dll.

## Minimum System Requirements

- **OS**: Windows 10/11 (64-bit)
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 10GB free space
- **Processor**: Intel/AMD 64-bit dengan virtualization support

## Common Issues & Solutions

### ❌ "Docker Desktop failed to start"
```powershell
# 1. Restart Docker Desktop
# 2. Restart PC  
# 3. Check WSL 2:
wsl --update
wsl --set-default-version 2
```

### ❌ "PowerShell execution policy"
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### ❌ "Port already in use"
```powershell
# Check what's using the ports
netstat -ano | findstr ":3306"
netstat -ano | findstr ":8000"
netstat -ano | findstr ":5173"

# Kill process (replace PID with actual PID)
taskkill /PID <PID> /F
```

### ❌ "Containers keep restarting"
```powershell
# Check logs
docker-compose logs

# Clean restart
.\stop.ps1
docker system prune -f
.\start.ps1
```

## First Time Setup Checklist

- [ ] Docker Desktop installed and running
- [ ] WSL 2 enabled (jika diminta Docker)
- [ ] PowerShell execution policy set
- [ ] Project files downloaded
- [ ] Ports 3306, 5173, 8000, 8080 available
- [ ] Internet connection available (untuk download images)

## Success Indicators

✅ Docker Desktop shows "Engine running"  
✅ `.\start.ps1` completes without errors  
✅ http://localhost:5173 shows React app  
✅ http://localhost:8000/api returns JSON  
✅ No error messages in PowerShell  

## Getting Help

Jika stuck, check:
1. Docker Desktop status
2. Windows Event Viewer untuk error messages
3. PowerShell error messages
4. Antivirus interference (temporarily disable)

## Performance Tips

- Allocate minimal 4GB RAM untuk Docker Desktop
- Close unnecessary applications
- Use SSD untuk project folder
- Enable Windows fast startup