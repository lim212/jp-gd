@echo off
echo ========================================
echo   FORCE CLEAR CACHE AND RESTART
echo ========================================
echo.

echo Step 1: Kill all Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Step 2: Delete .nuxt cache...
if exist .nuxt (
    rmdir /S /Q .nuxt
    echo   - .nuxt deleted
) else (
    echo   - .nuxt not found
)

echo Step 3: Delete node_modules cache...
if exist node_modules\.cache (
    rmdir /S /Q node_modules\.cache
    echo   - node_modules\.cache deleted
) else (
    echo   - node_modules\.cache not found
)

echo Step 4: Delete .output cache...
if exist .output (
    rmdir /S /Q .output
    echo   - .output deleted
) else (
    echo   - .output not found
)

echo.
echo ========================================
echo   CACHE CLEARED! Starting fresh...
echo ========================================
echo.
timeout /t 2 /nobreak >nul

echo Starting dev server (fresh build)...
npm run dev

