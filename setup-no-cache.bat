@echo off
REM ============================================
REM 🚀 Setup No-Cache Development Environment
REM ============================================

echo.
echo ========================================
echo   🚀 SETUP NO-CACHE ENVIRONMENT
echo ========================================
echo.

REM Step 1: Copy environment file
if exist .env.development (
    echo ✅ .env.development already exists
) else (
    if exist env.development.example (
        echo 📝 Creating .env.development...
        copy env.development.example .env.development
        echo ✅ .env.development created!
    ) else (
        echo ⚠️  env.development.example not found
    )
)

echo.
echo ========================================
echo   ✅ SETUP COMPLETE!
echo ========================================
echo.
echo 📝 Next steps:
echo   1. Review .env.development
echo   2. Run: npm run dev:nocache
echo   3. Open DevTools (F12) and enable "Disable cache"
echo.
echo 💡 Tips:
echo   - Gunakan Ctrl+Shift+R untuk hard reload
echo   - Keep DevTools open saat development
echo   - Jika masih bermasalah: npm run clear:cache
echo.

pause

