@echo off
title TwinShield Platform Launcher
echo ===================================================
echo     Starting TwinShield Cybersecurity Platform
echo ===================================================

echo [1/4] Starting Python ML & Risk Engine (Port 8000)...
start "TwinShield - ML Engine (8000)" cmd /k "%~dp0start_ml_engine.bat"
timeout /t 4 /nobreak >nul

echo [2/4] Starting Spring Boot Backend (Port 8080)...
start "TwinShield - Backend (8080)" cmd /k "%~dp0start_backend.bat"
timeout /t 6 /nobreak >nul

echo [3/4] Starting Employee Banking Portal (Port 5173)...
start "TwinShield - Employee Portal (5173)" cmd /k "%~dp0start_employee_portal.bat"

echo [4/4] Starting SOC Security Dashboard (Port 5174)...
start "TwinShield - Security Dashboard (5174)" cmd /k "%~dp0start_security_dashboard.bat"

echo.
echo ===================================================
echo   All TwinShield platform services launched!
echo   - ML Risk Engine:        http://localhost:8000/docs
echo   - Core Backend APIs:     http://localhost:8080
echo   - Employee Portal:       http://localhost:5173
echo   - SOC Security Dashboard:http://localhost:5174
echo ===================================================
