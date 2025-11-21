@echo off
color 0A
title START FRESH - Clear Cache & Run Dev Server
echo.
echo ╔══════════════════════════════════════════════════════╗
echo ║  🚀 START FRESH - Clear All Cache                    ║
echo ╚══════════════════════════════════════════════════════╝
echo.

echo [1/5] Stopping all Node.js processes...
taskkill /F /IM node.exe /T 2>nul
timeout /t 2 /nobreak >nul

echo [2/5] Clearing .nuxt cache...
if exist .nuxt rmdir /s /q .nuxt
echo ✅ .nuxt cleared

echo [3/5] Clearing .output cache...
if exist .output rmdir /s /q .output
echo ✅ .output cleared

echo [4/5] Clearing node_modules cache...
if exist node_modules\.vite rmdir /s /q node_modules\.vite
if exist node_modules\.cache rmdir /s /q node_modules\.cache
echo ✅ node_modules cache cleared

echo [5/5] Starting fresh dev server...
echo.
echo ╔══════════════════════════════════════════════════════╗
echo ║  ✅ READY!                                            ║
echo ║                                                       ║
echo ║  Server akan start di: http://localhost:3000/        ║
echo ║                                                       ║
echo ║  📌 PENTING:                                          ║
echo ║  1. Tunggu 30-60 detik sampai server ready          ║
echo ║  2. Buka browser BARU (atau Incognito)              ║
echo ║  3. Akses: http://localhost:3000/                    ║
echo ║  4. Hard Refresh: Ctrl + Shift + R                   ║
echo ║  5. Lihat tombol ungu (🟣) di kiri bawah            ║
echo ║                                                       ║
echo ╚══════════════════════════════════════════════════════╝
echo.

npm run dev

