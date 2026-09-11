@echo off
title TwinShield - ML Engine (Port 8000)
cd /d "%~dp0ml-engine"
call "%~dp0ml-engine\.venv\Scripts\python.exe" -m uvicorn app.main:app --host 0.0.0.0 --port 8000
