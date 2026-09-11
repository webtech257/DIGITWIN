@echo off
title TwinShield - SOC Security Dashboard (Port 5174)
set "PATH=C:\Users\Malavika\.tools\nodejs;%PATH%"
cd /d "%~dp0security-dashboard"
call npm run dev
