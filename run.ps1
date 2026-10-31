# MarketPulse 1-Click Launch Script
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "              MarketPulse Terminal & Desk               " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

Set-Location $PSScriptRoot

$python = "python"
if (Test-Path "C:\Users\siddh\AppData\Local\Programs\Python\Python313\python.exe") {
    $python = "C:\Users\siddh\AppData\Local\Programs\Python\Python313\python.exe"
}

# 1. Seed if DB not present
if (-not (Test-Path "marketpulse.db")) {
    Write-Host "[1/3] Seeding demo database..." -ForegroundColor Yellow
    & $python seed.py
} else {
    Write-Host "[1/3] Database found: marketpulse.db" -ForegroundColor Green
}

# 2. Open browser
Write-Host "[2/3] Opening MarketPulse UI at http://localhost:8000 ..." -ForegroundColor Yellow
Start-Process "http://localhost:8000"

# 3. Start server
Write-Host "[3/3] Starting Uvicorn server on http://127.0.0.1:8000 ..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server." -ForegroundColor DarkGray
Write-Host ""
& $python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

