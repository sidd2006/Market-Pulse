@echo off
title MarketPulse Server
echo ========================================================
echo               MarketPulse Terminal & Desk
echo ========================================================
echo.

cd /d "%~dp0"

REM Find python executable
set PYTHON_CMD=python
py -3.13 --version >nul 2>&1 && set PYTHON_CMD=py -3.13
if exist "C:\Users\siddh\AppData\Local\Programs\Python\Python313\python.exe" set PYTHON_CMD="C:\Users\siddh\AppData\Local\Programs\Python\Python313\python.exe"

echo [1/3] Checking database...
if not exist "marketpulse.db" (
    echo Seeding demo database...
    %PYTHON_CMD% seed.py
)

echo [2/3] Opening MarketPulse in browser...
start http://localhost:8000

echo [3/3] Starting backend server on port 8000...
echo Visit: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
%PYTHON_CMD% -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
pause

