@echo off
color 0C
title BUKA PORT 3000 - BUKAN 3004!
echo.
echo ╔══════════════════════════════════════════════════════╗
echo ║  🔴 PERINGATAN PENTING!                               ║
echo ╚══════════════════════════════════════════════════════╝
echo.
echo ❌ JANGAN BUKA: localhost:3004
echo ✅ YANG BENAR:  localhost:3000
echo.
echo Server yang benar running di PORT 3000!
echo.
echo [1/3] Membuka browser ke PORT 3000...
timeout /t 2 /nobreak >nul

REM Generate timestamp untuk cache buster
set timestamp=%date:~-4%%date:~3,2%%date:~0,2%%time:~0,2%%time:~3,2%%time:~6,2%
set timestamp=%timestamp: =0%

REM URL dengan cache buster
set URL=http://localhost:3000/?_nocache=true^&_v=%timestamp%

echo.
echo 🚀 Membuka: %URL%
echo.
echo [2/3] Tunggu browser terbuka...

REM Open di default browser
start "" "%URL%"

timeout /t 3 /nobreak >nul

echo.
echo [3/3] ✅ SELESAI!
echo.
echo ╔══════════════════════════════════════════════════════╗
echo ║  📋 CHECKLIST:                                        ║
echo ║                                                       ║
echo ║  1. URL harus: localhost:3000 (BUKAN 3004!)         ║
echo ║  2. Ada ?_nocache=true di URL                        ║
echo ║  3. Tekan Ctrl+Shift+R untuk hard refresh            ║
echo ║  4. Lihat border MERAH, BIRU, HIJAU putus-putus     ║
echo ║  5. Jarak antar kotak BESAR dan JELAS               ║
echo ║                                                       ║
echo ╚══════════════════════════════════════════════════════╝
echo.
echo Press any key to close...
pause >nul

