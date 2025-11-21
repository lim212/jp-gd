@echo off
echo Starting Development Server with Maximum Performance...
echo.

REM Clear previous build artifacts for clean start
if exist .nuxt rmdir /s /q .nuxt
if exist .output rmdir /s /q .output

REM Set environment variables for faster development
set NODE_ENV=development
set NUXT_TELEMETRY_DISABLED=1
set NO_UPDATE_NOTIFIER=1

REM Start Nuxt with optimized settings
npm run dev

pause


