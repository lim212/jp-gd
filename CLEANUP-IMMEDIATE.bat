@echo off
REM ========================================
REM IMMEDIATE CLEANUP SCRIPT
REM Menghapus file duplikat dan backup
REM ========================================

echo.
echo ========================================
echo   CLEANUP SCRIPT - FASE 1
echo   Menghapus File Duplikat dan Backup
echo ========================================
echo.

REM Create backup directory first
if not exist "backup-before-cleanup" mkdir "backup-before-cleanup"

echo [1/5] Backing up files sebelum dihapus...
if exist "app\components\BlogList.vue.backup" copy "app\components\BlogList.vue.backup" "backup-before-cleanup\" >nul
if exist "components\Testimonial.vue.save" copy "components\Testimonial.vue.save" "backup-before-cleanup\" >nul
if exist "app\components\Home\Information.backup.vue" copy "app\components\Home\Information.backup.vue" "backup-before-cleanup\" >nul
if exist "app\assets\css\main.css.backup" copy "app\assets\css\main.css.backup" "backup-before-cleanup\" >nul
if exist "app\assets\css\blog-mobile-fix.css.backup" copy "app\assets\css\blog-mobile-fix.css.backup" "backup-before-cleanup\" >nul
if exist "app\assets\css\mobile-blog-and-extras.css.backup" copy "app\assets\css\mobile-blog-and-extras.css.backup" "backup-before-cleanup\" >nul
if exist "app\layouts\default-backup.vue" copy "app\layouts\default-backup.vue" "backup-before-cleanup\" >nul
echo   ✓ Backup selesai di folder backup-before-cleanup\

echo.
echo [2/5] Menghapus Component Backup Files...
if exist "app\components\BlogList.vue.backup" (
    del "app\components\BlogList.vue.backup"
    echo   ✓ Deleted: app\components\BlogList.vue.backup
)
if exist "components\Testimonial.vue.save" (
    del "components\Testimonial.vue.save"
    echo   ✓ Deleted: components\Testimonial.vue.save
)
if exist "app\components\Home\Information.backup.vue" (
    del "app\components\Home\Information.backup.vue"
    echo   ✓ Deleted: app\components\Home\Information.backup.vue
)

echo.
echo [3/5] Menghapus CSS Backup Files...
if exist "app\assets\css\main.css.backup" (
    del "app\assets\css\main.css.backup"
    echo   ✓ Deleted: app\assets\css\main.css.backup
)
if exist "app\assets\css\blog-mobile-fix.css.backup" (
    del "app\assets\css\blog-mobile-fix.css.backup"
    echo   ✓ Deleted: app\assets\css\blog-mobile-fix.css.backup
)
if exist "app\assets\css\mobile-blog-and-extras.css.backup" (
    del "app\assets\css\mobile-blog-and-extras.css.backup"
    echo   ✓ Deleted: app\assets\css\mobile-blog-and-extras.css.backup
)

echo.
echo [4/5] Menghapus Layout Backup Files...
if exist "app\layouts\default-backup.vue" (
    del "app\layouts\default-backup.vue"
    echo   ✓ Deleted: app\layouts\default-backup.vue
)

echo.
echo [5/5] Menghapus Error Page Duplicates...
if exist "pages\404-fun.vue" (
    copy "pages\404-fun.vue" "backup-before-cleanup\" >nul
    del "pages\404-fun.vue"
    echo   ✓ Deleted: pages\404-fun.vue
)
if exist "pages\404-enhanced.vue" (
    copy "pages\404-enhanced.vue" "backup-before-cleanup\" >nul
    del "pages\404-enhanced.vue"
    echo   ✓ Deleted: pages\404-enhanced.vue
)
if exist "pages\500-fun.vue" (
    copy "pages\500-fun.vue" "backup-before-cleanup\" >nul
    del "pages\500-fun.vue"
    echo   ✓ Deleted: pages\500-fun.vue
)
if exist "pages\500-enhanced.vue" (
    copy "pages\500-enhanced.vue" "backup-before-cleanup\" >nul
    del "pages\500-enhanced.vue"
    echo   ✓ Deleted: pages\500-enhanced.vue
)
if exist "pages\500-super-fun.vue" (
    copy "pages\500-super-fun.vue" "backup-before-cleanup\" >nul
    del "pages\500-super-fun.vue"
    echo   ✓ Deleted: pages\500-super-fun.vue
)

echo.
echo ========================================
echo   ✓ CLEANUP SELESAI!
echo ========================================
echo.
echo File yang dihapus telah di-backup di:
echo backup-before-cleanup\
echo.
echo NEXT STEPS:
echo 1. Test website: npm run dev
echo 2. Jika ada masalah, restore dari backup-before-cleanup\
echo 3. Jika OK, jalankan: CLEANUP-DOCS.bat
echo.
pause


