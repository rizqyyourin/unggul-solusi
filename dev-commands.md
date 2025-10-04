# Development Commands

## Daily Development
```powershell
# Edit code -> Stop -> Start
.\stop.ps1
# Edit your files...
.\start.ps1
```

## Database Commands
```powershell
# Check if data persists
.\start.ps1
# Access: http://localhost:8080 (phpMyAdmin)

# Fresh database (WARNING: deletes all data)
.\stop.ps1
docker-compose down -v  # Delete volumes
.\start.ps1             # Will reseed fresh data
```

## Troubleshooting
```powershell
# View logs
docker-compose logs api
docker-compose logs web
docker-compose logs db

# Rebuild containers (if Dockerfile changed)
.\stop.ps1
docker-compose up --build -d

# Clean restart
.\stop.ps1
docker-compose down
docker system prune -f
.\start.ps1
```

## Git Workflow
```powershell
# After making changes
git add .
git commit -m "your changes"
git push origin main

# On another PC
git pull origin main
.\stop.ps1
.\start.ps1  # Get latest changes
```