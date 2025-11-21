# 🔧 Translation System - Troubleshooting Guide

## 🚨 Masalah Umum & Solusinya

### 1. ❌ Translation Tidak Jalan / Sistem Error

#### Gejala:
- Console menunjukkan error
- Translation tidak ter-update
- Scheduler tidak jalan

#### Diagnosis:
```bash
# 1. Check health status
curl http://localhost:3000/api/i18n/health

# atau via npm
npm run translate:stats
```

#### Solusi:

**A. API Key Tidak Dikonfigurasi**
```bash
# Check .env file
cat .env | grep OPENAI_API_KEY

# Jika kosong, tambahkan:
echo "OPENAI_API_KEY=sk-xxxxxxxxxxxxxxx" >> .env

# Restart server
npm run dev
```

**B. Directory/File Tidak Ada**
```bash
# Run setup script
node scripts/setup-translation-system.js

# Check hasil
ls -la data/
ls -la locales/
```

**C. Permission Issues (Linux/Mac)**
```bash
# Fix permissions
chmod -R 755 scripts/
chmod 755 scripts/*.sh

# Fix data directory
chmod -R 755 data/
```

---

### 2. ⚠️ Scheduler Tidak Jalan

#### Gejala:
- Jam 02:00 WIB lewat tapi tidak ada translation
- Console tidak menunjukkan log scheduler

#### Diagnosis:
```bash
# Check environment
echo "NUXT_ENABLE_SCHEDULER: $NUXT_ENABLE_SCHEDULER"
echo "NODE_ENV: $NODE_ENV"
echo "ENABLE_DEV_CRON: $ENABLE_DEV_CRON"
```

#### Solusi:

**A. Scheduler Disabled**
```env
# Edit .env
NUXT_ENABLE_SCHEDULER=true
```

**B. Development Mode**
```env
# Enable di dev mode
ENABLE_DEV_CRON=true
```

**C. Manual Trigger untuk Test**
```bash
# Trigger manual
npm run translate:full

# Check apakah berfungsi
npm run translate:stats
```

---

### 3. 🔄 Translation Gagal Terus

#### Gejala:
- Status menunjukkan failed translations
- Error message di console

#### Diagnosis:
```bash
# Check failed items
npm run translate:stats

# Look for "Failed Pages" section
```

#### Solusi:

**A. OpenAI API Quota Exceeded**
```bash
# Check usage di OpenAI dashboard
# Upgrade plan atau tunggu reset quota

# Sementara, pakai retry dengan delay
npm run translate:retry
```

**B. Network/Timeout Issues**
```bash
# Check internet connection
ping api.openai.com

# Retry dengan manual trigger
npm run translate:retry
```

**C. Invalid API Key**
```bash
# Test API key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# Jika error, update API key di .env
```

---

### 4. 📝 Halaman Baru Tidak Terdeteksi

#### Gejala:
- Tambah halaman baru tapi tidak masuk queue
- Pending count tidak bertambah

#### Diagnosis:
```bash
# Check queue file
cat data/translation-queue.json

# Check last scan time
npm run translate:stats
```

#### Solusi:

**A. Manual Scan**
```bash
# Scan semua halaman
npm run translate:scan

# Check hasil
npm run translate:stats
```

**B. Force Register via Code**
```vue
<script setup>
// Di page component
const { registerPageContent } = usePageTranslation()

onMounted(async () => {
  await registerPageContent({
    title: 'Page Title',
    description: 'Page Description'
  }, { force: true })
})
</script>
```

**C. Wait untuk Scheduler**
```bash
# Scheduler akan auto-scan jam 02:00 WIB
# Atau trigger manual:
npm run translate:full
```

---

### 5. 💾 Cache Tidak Update

#### Gejala:
- Translation lama masih muncul
- Switch bahasa tidak berubah

#### Diagnosis:
```bash
# Check browser console untuk cache age
# Look for: [AutoTranslation] Using cached messages...
```

#### Solusi:

**A. Clear Browser Cache**
```javascript
// Di browser console
localStorage.clear()
location.reload()
```

**B. Force Fresh Translation**
```bash
# Trigger immediate translation
npm run translate:sync

# Restart server
npm run dev
```

**C. Adjust Cache Duration**
```typescript
// Edit plugins/auto-translation-loader.client.ts
const CACHE_DURATION_EN = 5 * 60 * 1000  // Reduce to 5 minutes for testing
```

---

### 6. 🌐 API Endpoints 404 / Not Found

#### Gejala:
- `/api/i18n/dashboard` returns 404
- API calls fail

#### Diagnosis:
```bash
# Check server is running
curl http://localhost:3000/api/i18n/health

# Check build output
ls -la .output/server/routes/
```

#### Solusi:

**A. Rebuild Server**
```bash
# Clean rebuild
rm -rf .nuxt .output
npm run build
npm start
```

**B. Check File Exists**
```bash
# Check API files exist
ls -la server/api/i18n/

# Should show:
# - dashboard.get.ts
# - health.get.ts
# - translate-immediate.post.ts
# etc.
```

---

### 7. 🔴 TypeScript Errors

#### Gejala:
- Build fails dengan TS errors
- Type errors di editor

#### Diagnosis:
```bash
# Check linter errors
npm run dev
# Look for TypeScript errors in console
```

#### Solusi:

**A. Install Missing Types**
```bash
# Install type definitions
npm install --save-dev @types/node

# Rebuild
npm run build
```

**B. Check tsconfig.json**
```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "strict": false  // If too strict
  }
}
```

---

### 8. 📦 Module Not Found Errors

#### Gejala:
- Cannot find module 'xxx'
- Import errors

#### Diagnosis:
```bash
# Check if module installed
npm list | grep module-name
```

#### Solusi:

**A. Reinstall Dependencies**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

**B. Check Imports**
```typescript
// Use correct import paths
import { getTranslationManager } from '../../utils/enhancedTranslationManager'

// NOT: from '../enhancedTranslationManager'
```

---

## 🔍 Diagnostic Commands

### Quick Health Check
```bash
# All-in-one health check
curl http://localhost:3000/api/i18n/health | json_pp

# Expected output:
# {
#   "status": "healthy",
#   "healthy": true,
#   "checks": { ... }
# }
```

### Check System Status
```bash
# Stats
npm run translate:stats

# Dashboard
open http://localhost:3000/api/i18n/dashboard
```

### Test Translation Flow
```bash
# 1. Scan
npm run translate:scan

# 2. Translate
npm run translate:sync

# 3. Check results
npm run translate:stats
```

---

## 🛠️ Advanced Debugging

### Enable Verbose Logging
```env
# Add to .env
NODE_ENV=development
DEBUG=nuxt:*
```

### Check Queue File Manually
```bash
# View queue
cat data/translation-queue.json | json_pp

# Check specific page
cat data/translation-queue.json | jq '.pages["/app/pages/index.vue"]'
```

### Monitor Scheduler
```bash
# Watch logs in real-time
tail -f logs/translation-*.log

# or console output
npm run dev | grep "i18n-cron"
```

### Test API Endpoints
```bash
# Health
curl http://localhost:3000/api/i18n/health

# Stats
curl http://localhost:3000/api/i18n/check-status

# Dashboard
curl http://localhost:3000/api/i18n/dashboard

# Trigger scan
curl -X POST http://localhost:3000/api/i18n/scan-pages

# Trigger translation
curl -X POST http://localhost:3000/api/i18n/sync
```

---

## 🆘 Emergency Recovery

### Complete Reset
```bash
# 1. Stop server
# Ctrl+C

# 2. Clean everything
rm -rf .nuxt .output node_modules
rm -rf data/translation-queue.json data/i18n-meta.json

# 3. Reinstall
npm install

# 4. Setup
node scripts/setup-translation-system.js

# 5. Restart
npm run dev

# 6. Test
npm run translate:stats
```

### Reset Translation Data Only
```bash
# Backup first
cp data/translation-queue.json data/translation-queue.json.backup
cp data/i18n-meta.json data/i18n-meta.json.backup

# Reset
rm data/translation-queue.json data/i18n-meta.json

# Re-initialize
node scripts/setup-translation-system.js

# Scan and translate
npm run translate:full
```

---

## 📞 Getting Help

### 1. Check Documentation
- `TRANSLATION-QUICK-START.md` - Quick guide
- `ENHANCED-TRANSLATION-SYSTEM-COMPLETE.md` - Full docs
- `RINGKASAN-PERBAIKAN-TRANSLASI-COMPLETE.md` - Bahasa Indonesia

### 2. Check Health Status
```bash
curl http://localhost:3000/api/i18n/health
```

### 3. Run Diagnostics
```bash
npm run translate:stats
```

### 4. Check Logs
```bash
# Console output
npm run dev

# Look for errors marked with ❌ or ⚠️
```

---

## ✅ Prevention Tips

### 1. Regular Monitoring
```bash
# Check weekly
npm run translate:stats
```

### 2. Keep API Key Valid
- Monitor OpenAI dashboard
- Check quota usage
- Renew before expiry

### 3. Regular Backups
```bash
# Backup translation data
cp -r data/ data-backup-$(date +%Y%m%d)/
cp -r locales/ locales-backup-$(date +%Y%m%d)/
```

### 4. Monitor Scheduler
```bash
# Check logs for scheduler runs
# Should see daily at 02:00 WIB
grep "i18n-cron" logs/app.log
```

### 5. Test After Updates
```bash
# After code changes
npm run translate:full
npm run translate:stats
```

---

## 🎯 Common Error Messages & Fixes

| Error Message | Cause | Solution |
|---------------|-------|----------|
| `OPENAI_API_KEY not configured` | No API key | Set in .env |
| `Translation skipped: OPENAI_ON_HOLD` | API rate limited | Wait or upgrade plan |
| `ENOENT: no such file or directory` | Missing files | Run setup script |
| `Cannot find module` | Missing import | Check file paths |
| `Network timeout` | Connection issues | Check internet |
| `Invalid API key` | Wrong/expired key | Update in .env |
| `Queue file corrupted` | Bad JSON | Reset queue file |
| `Permission denied` | File permissions | chmod 755 |

---

**Remember:** Most issues can be fixed by running:
```bash
node scripts/setup-translation-system.js
npm run translate:full
```

Good luck! 🍀

