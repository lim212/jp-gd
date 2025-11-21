@echo off
REM Quick Translation Script for Windows
REM Fast way to scan and translate without opening browser

echo.
echo 🌐 Quick Translation Sync
echo ======================================
echo.

REM Check if node is available
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed
    exit /b 1
)

REM Run full sync
node scripts/translation-sync.js full

echo.
echo ======================================
echo ✅ Done!
echo.

pause

