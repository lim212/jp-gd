@echo off
echo ========================================
echo CLEAR CACHE DAN RESTART SERVER
echo Banner Slider Fix - 5X Lebih Jauh
echo ========================================
echo.

echo [1/4] Menghentikan server...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/4] Menghapus cache .nuxt...
if exist ".nuxt" (
    rmdir /s /q ".nuxt"
    echo Cache .nuxt berhasil dihapus!
) else (
    echo Folder .nuxt tidak ditemukan.
)

echo [3/4] Menghapus node_modules/.cache...
if exist "node_modules\.cache" (
    rmdir /s /q "node_modules\.cache"
    echo Cache node_modules berhasil dihapus!
)

echo [4/4] Memulai development server...
echo.
echo ========================================
echo SERVER AKAN DIMULAI...
echo Setelah server jalan, buka browser dan tekan:
echo   Ctrl + Shift + R (untuk hard refresh)
echo ATAU buka Incognito/Private mode
echo ========================================
echo.

npm run dev





















