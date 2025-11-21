@echo off
REM ========================================
REM DOCUMENTATION CLEANUP SCRIPT
REM Mengorganisir file dokumentasi
REM ========================================

echo.
echo ========================================
echo   CLEANUP SCRIPT - FASE 2
echo   Mengorganisir Dokumentasi
echo ========================================
echo.

echo [1/3] Membuat folder docs/archive...
if not exist "docs" mkdir "docs"
if not exist "docs\archive" mkdir "docs\archive"
if not exist "docs\archive\dark-mode" mkdir "docs\archive\dark-mode"
if not exist "docs\archive\loading" mkdir "docs\archive\loading"
if not exist "docs\archive\blog" mkdir "docs\archive\blog"
if not exist "docs\archive\floating-buttons" mkdir "docs\archive\floating-buttons"
if not exist "docs\archive\translation" mkdir "docs\archive\translation"
if not exist "docs\archive\optimization" mkdir "docs\archive\optimization"
if not exist "docs\archive\mobile" mkdir "docs\archive\mobile"
if not exist "docs\archive\misc" mkdir "docs\archive\misc"
echo   ✓ Folder structure created

echo.
echo [2/3] Memindahkan dokumentasi Dark Mode (36 files)...
for %%f in (
    "AUDIT-FINAL-DARK-MODE.md"
    "BLOG-DARK-MODE-SELESAI.md"
    "DARK-MODE-1000-PLAN.md"
    "DARK-MODE-1000-TASK-PLAN.md"
    "DARK-MODE-ADVANCED-SUGGESTIONS.md"
    "DARK-MODE-BEST-PRACTICES-GUIDE.md"
    "DARK-MODE-BURGUNDY-CHECKLIST.md"
    "DARK-MODE-BURGUNDY-COMPLETE-FIX.md"
    "DARK-MODE-BURGUNDY-FINAL-CHECK.md"
    "DARK-MODE-BURGUNDY-FINAL-FIX.md"
    "DARK-MODE-BURGUNDY-FIXES-TAMBAHAN.md"
    "DARK-MODE-BURGUNDY-PREVIEW.md"
    "DARK-MODE-BURGUNDY-RINGKASAN.md"
    "DARK-MODE-COLOR-SYSTEM.md"
    "DARK-MODE-COMPREHENSIVE-CHECK.md"
    "DARK-MODE-FINAL-COMPLETE.md"
    "DARK-MODE-FIX-SUMMARY.md"
    "DARK-MODE-FIXED-SUMMARY.md"
    "DARK-MODE-IMPLEMENTATION-COMPLETE.md"
    "DARK-MODE-PROFESSIONAL-FIX-SUMMARY.md"
    "DARK-MODE-QUICK-START.md"
    "DARK-MODE-SARAN-BLOG-COMPONENT.md"
    "DARK-MODE-SARAN-TAMBAHAN.md"
    "DARK-MODE-SUPER-KEREN-FIX-SUMMARY.md"
    "DARK-MODE-TEST-GUIDE.md"
    "DARK-MODE-TESTING-GUIDE.md"
    "DARK-MODE-VISUAL-COMPARISON.md"
    "FLOATING-BUTTONS-DARK-MODE-SUPER-KEREN.md"
    "HASIL-CEK-ULANG-DARK-MODE.md"
    "IMPLEMENTASI-DARK-MODE-SELESAI.md"
    "RINGKASAN-DARK-MODE-COMPREHENSIVE.md"
    "RINGKASAN-DARK-MODE-KEREN.md"
    "RINGKASAN-FINAL-DARK-MODE.md"
    "THEME-MODE-FIX-SUMMARY.md"
) do (
    if exist %%f (
        move %%f "docs\archive\dark-mode\" >nul 2>&1
        echo   ✓ Moved: %%f
    )
)

echo.
echo Memindahkan dokumentasi Loading Screen (31 files)...
for %%f in (
    "CARA-PAKAI-PROGRESSIVE-LOADING.md"
    "CARA-PAKAI-SUPER-LOADING.md"
    "EPIC-LOADING-SCREEN-COMPLETE.md"
    "FINAL-SUMMARY-WITH-LOADING-FIX.md"
    "LOADING-DETAIL-FEATURES.md"
    "LOADING-ENHANCEMENT-PLAN.md"
    "LOADING-ENHANCEMENT-VISUAL.md"
    "LOADING-IMPROVEMENT-IDEAS.md"
    "LOADING-OPTIMIZATION-SUMMARY.md"
    "LOADING-PREVIEW.md"
    "LOADING-SCREEN-ENHANCED-UPDATE.md"
    "LOADING-SCREEN-FINAL-SUMMARY.md"
    "LOADING-SCREEN-SUMMARY.md"
    "LOADING-SCREEN-SUPER-KEREN-GUIDE.md"
    "LOADING-SUPER-KEREN-FINAL.md"
    "LOADING-SUPER-KEREN.md"
    "OPTIMISASI-LOADING.md"
    "PERBAIKAN-LOADING-SCREEN-CONFLICT.md"
    "PROFESSIONAL-LOADING-SCREEN-COMPLETE.md"
    "PROGRESSIVE-LOADING-COMPLETE.md"
    "RINGKASAN-LOADING-PINTAR.md"
    "SMART-LOADING-COMPLETE.md"
    "SUPER-DETAIL-LOADING-SCREEN-COMPLETE.md"
    "SUPER-LOADING-RINGKASAN.md"
    "SUPER-LOADING-SCREEN-COMPLETE.md"
    "SUPER-LOADING-SCREEN-GUIDE.md"
    "SUPER-LOADING-ULTIMATE-FEATURES.md"
    "TEST-LOADING-KEREN.md"
    "TEST-SMART-LOADING.md"
    "TEST-SUPER-LOADING-CHECKLIST.md"
    "TROUBLESHOOTING-LOADING.md"
) do (
    if exist %%f (
        move %%f "docs\archive\loading\" >nul 2>&1
        echo   ✓ Moved: %%f
    )
)

echo.
echo Memindahkan dokumentasi Blog System (19 files)...
for %%f in (
    "AI-BLOG-GENERATOR-SETUP.md"
    "AI-BLOG-QUALITY-CHECKLIST.md"
    "AI-BLOG-SYSTEM-COMPLETE-REPORT.md"
    "BLOG-ENHANCEMENT-COMPLETE.md"
    "BLOG-GRID-FIX-FINAL-SUMMARY.md"
    "BLOG-GRID-FIX-SUMMARY.md"
    "BLOG-SORTING-FIX-COMPLETE.md"
    "FINAL-AI-BLOG-COMPLETE.md"
    "FIX-BLOG-COMPLETE-FINAL.md"
    "PERBAIKAN-BLOG-CARDS-HILANG.md"
    "PERBAIKAN-BLOG-CARDS-HOMEPAGE.md"
    "PERBAIKAN-BLOG-SUPER-KEREN-COMPLETE.md"
    "QUICK-START-AI-BLOG.md"
    "RINGKASAN-PERBAIKAN-BLOG-HOMEPAGE.md"
    "RINGKASAN-SISTEM-AI-BLOG.md"
    "TEST-BLOG-CARDS-HOMEPAGE.md"
    "TEST-BLOG-GRID-FIX.md"
) do (
    if exist %%f (
        move %%f "docs\archive\blog\" >nul 2>&1
        echo   ✓ Moved: %%f
    )
)

echo.
echo Memindahkan dokumentasi Floating Buttons...
for %%f in (
    "EPIC-FLOATING-BUTTONS-GUIDE.md"
    "FINAL-FLOATING-BUTTONS-SUMMARY.md"
    "FLOATING-BUTTONS-FIX-SUMMARY.md"
    "FLOATING-BUTTONS-PROFESSIONAL-COMPLETE.md"
    "FLOATING-BUTTONS-PROFESSIONAL-GUIDE.md"
    "FLOATING-BUTTONS-REMAKE-SUMMARY.md"
    "FLOATING-BUTTONS-TEST-GUIDE.md"
    "FLOATING-BUTTONS-VISUAL-PREVIEW.md"
    "FLOATING-ICON-ENHANCEMENT.md"
    "FLOATING-MENU-ENHANCEMENT.md"
    "PERBAIKAN-FOOTER-DAN-FLOATING-BUTTONS.md"
) do (
    if exist %%f (
        move %%f "docs\archive\floating-buttons\" >nul 2>&1
        echo   ✓ Moved: %%f
    )
)

echo.
echo Memindahkan dokumentasi Translation...
for %%f in (
    "CARA-TEST-TRANSLATION-SYSTEM.md"
    "CARA-TEST-TRANSLATION.md"
    "ENHANCED-TRANSLATION-SYSTEM-COMPLETE.md"
    "README-TRANSLATION-FIX.md"
    "README-TRANSLATION-SYSTEM.md"
    "RINGKASAN-PERBAIKAN-TRANSLASI-COMPLETE.md"
    "SISTEM-TRANSLASI-SUPER-PINTAR.md"
    "SMART-TRANSLATION-SYSTEM-GUIDE.md"
    "SOLUSI-TRANSLATION-LENGKAP.md"
    "TRANSLATION-QUICK-START.md"
    "TRANSLATION-TROUBLESHOOTING.md"
) do (
    if exist %%f (
        move %%f "docs\archive\translation\" >nul 2>&1
        echo   ✓ Moved: %%f
    )
)

echo.
echo Memindahkan dokumentasi Mobile...
for %%f in (
    "MOBILE-COMPREHENSIVE-FIX-COMPLETE.md"
    "MOBILE-FIXES-COMPLETE.md"
    "MOBILE-HEADER-FIX-COMPLETE.md"
    "MOBILE-OPTIMIZATION-GUIDE.md"
    "MOBILE-SUMMARY.md"
) do (
    if exist %%f (
        move %%f "docs\archive\mobile\" >nul 2>&1
        echo   ✓ Moved: %%f
    )
)

echo.
echo Memindahkan dokumentasi Optimization...
for %%f in (
    "ADVANCED-OPTIMIZATION-SUMMARY.md"
    "COMPREHENSIVE-IMPROVEMENT-SUGGESTIONS.md"
    "COMPREHENSIVE-SYSTEM-ANALYSIS.md"
    "OPTIMIZATION-FINAL-NOTES.md"
    "PERFORMANCE-OPTIMIZATION-SUMMARY.md"
    "README-OPTIMIZATIONS.md"
) do (
    if exist %%f (
        move %%f "docs\archive\optimization\" >nul 2>&1
        echo   ✓ Moved: %%f
    )
)

echo.
echo Memindahkan dokumentasi Misc...
for %%f in (
    "BLANK-PAGE-FIX-COMPLETE.md"
    "BLUE-SUPER-KEREN-COMPLETE-SUMMARY.md"
    "CARA-LIHAT-PERUBAHAN.md"
    "CEK-ULANG-SELESAI-PERFECT.md"
    "COLOR-SYSTEM-GUIDE.md"
    "ENHANCED-COMPONENTS-GUIDE.md"
    "ENHANCEMENT-CHECKLIST.md"
    "ERROR-PAGES-ENHANCEMENT-GUIDE.md"
    "FINAL-BLUE-CLEANUP-COMPLETE.md"
    "FINAL-VERIFICATION.md"
    "FIX-HARDCODED-TEXT-GUIDE.md"
    "HEADER-COLOR-FIX-COMPLETE.md"
    "IKUTI-INI-SAJA.md"
    "IMPLEMENTATION-README.md"
    "INSTRUKSI-PENTING.md"
    "INSTRUKSI-TEST-FINAL.md"
    "LIGHT-MODE-REDESIGN-COMPLETE.md"
    "NAVIGATION-HOVER-FIX-COMPLETE.md"
    "NAVIGATION-HOVER-ULTIMATE-FIX.md"
    "POPUP-INFORMASI-UMUM-FIX-COMPLETE.md"
    "RELATED-ARTICLES-COMPLETE.md"
    "RESPONSIVE-FIX-COMPLETE.md"
    "RINGKASAN-ANALISIS.md"
    "RINGKASAN-PERBAIKAN-LENGKAP.md"
    "RINGKASAN-PERBAIKAN-SPACING.md"
    "SARAN-AUTO-TRANSLATE-KEREN.md"
    "SARAN-PERBAIKAN-FINAL.md"
    "SARAN-TAMBAHAN-FINAL.md"
    "SEMUA-HALAMAN-SUDAH-DICEK.md"
    "SEMUANYA-SUDAH-BERES.md"
    "SMART-SLIDE-MENU-IMPLEMENTATION.md"
    "VISUAL-PROOF.md"
    "WEBSITE-COMPARISON-FINAL.md"
    "WEBSITE-MIGRATION-ANALYSIS.md"
    "WHYWE-SUPER-KEREN-REMAKE.md"
) do (
    if exist %%f (
        move %%f "docs\archive\misc\" >nul 2>&1
        echo   ✓ Moved: %%f
    )
)

echo.
echo [3/3] Membuat Master Documentation...
echo Creating docs\README.md...
echo # JasaPembayaran.com Documentation > docs\README.md
echo. >> docs\README.md
echo ## Quick Links >> docs\README.md
echo. >> docs\README.md
echo - [Dark Mode Implementation Guide](DARK-MODE-IMPLEMENTATION-GUIDE.md) >> docs\README.md
echo - [AI Blog System](archive\blog\) >> docs\README.md
echo - [Loading Screen Guide](archive\loading\) >> docs\README.md
echo - [Floating Buttons](archive\floating-buttons\) >> docs\README.md
echo - [Translation System](archive\translation\) >> docs\README.md
echo. >> docs\README.md
echo ## Archive >> docs\README.md
echo All historical documentation is in the `archive/` folder. >> docs\README.md

echo   ✓ Created docs\README.md

echo.
echo ========================================
echo   ✓ DOKUMENTASI CLEANUP SELESAI!
echo ========================================
echo.
echo Dokumentasi telah diorganisir di:
echo docs\archive\
echo.
echo Root directory sekarang lebih bersih!
echo.
pause


