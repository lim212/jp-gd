@echo off
echo Starting optimized development server...

REM Set environment variables for better performance
set NODE_ENV=development
set NUXT_DEVTOOLS=true
set NODE_OPTIONS=--max-old-space-size=4096

REM Clear caches
if exist .nuxt rmdir /s /q .nuxt
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo Starting server with optimized settings...
npm run dev

pause

