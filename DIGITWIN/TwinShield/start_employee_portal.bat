@echo off
title TwinShield - Employee Banking Portal (Port 5173)
set "PATH=C:\Users\Malavika\.tools\nodejs;%PATH%"
cd /d "%~dp0employee-portal"
call npm run dev
