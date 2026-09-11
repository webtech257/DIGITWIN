@echo off
title TwinShield - Core Security Backend (Port 8080)
set "JAVA_HOME=C:\Users\Malavika\.tools\jdk-17"
set "PATH=C:\Users\Malavika\.tools\jdk-17\bin;C:\Users\Malavika\.tools\maven\bin;%PATH%"
cd /d "%~dp0backend"
call mvn spring-boot:run
