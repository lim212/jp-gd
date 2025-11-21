# PowerShell script untuk fix Ubuntu build (Windows)
Write-Host "Fixing Ubuntu Build Issues..." -ForegroundColor Green

Write-Host "Instructions for Ubuntu VPS:" -ForegroundColor Yellow
Write-Host "1. Upload files to VPS" -ForegroundColor White
Write-Host "2. Run: chmod +x fix-ubuntu-build.sh" -ForegroundColor White
Write-Host "3. Run: ./fix-ubuntu-build.sh" -ForegroundColor White
Write-Host "4. Or run: npm run fix:ubuntu-build" -ForegroundColor White

Write-Host "`nFiles created:" -ForegroundColor Cyan
Write-Host "- fix-ubuntu-build.sh (Linux script)" -ForegroundColor White
Write-Host "- ecosystem.ubuntu.config.js (PM2 config)" -ForegroundColor White
Write-Host "- UBUNTU-BUILD-FIX.md (Documentation)" -ForegroundColor White

Write-Host "`nReady for Ubuntu VPS deployment!" -ForegroundColor Green
