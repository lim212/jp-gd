# 🧪 Cara Test Sistem Translasi Super Pintar

## 📋 Prerequisites

1. Server harus running (development atau production)
2. Node.js installed
3. (Optional) OpenAI API key untuk test translation

## 🚀 Cara Test

### 1. Test Otomatis (Recommended)

```bash
# Test di development (localhost:3000)
node test-smart-translation.js

# Test di production atau custom URL
TEST_URL=https://jasapembayaran.com node test-smart-translation.js
```

### 2. Test Manual via Browser

#### A. Test Toggle Bahasa ID/EN

1. **Buka website**
   ```
   http://localhost:3000
   ```

2. **Buka Console Browser** (F12 → Console)

3. **Click toggle ID → EN**
   - ✅ Harus muncul log: `[i18n] Fetched and cached messages for en`
   - ✅ Website berubah ke bahasa Inggris
   - ✅ Tidak ada error di console

4. **Click toggle EN → ID**
   - ✅ Harus muncul log: `[i18n] Using cached messages for id` (karena sudah di-cache)
   - ✅ Website berubah ke bahasa Indonesia
   - ✅ Loading cepat (dari cache)

5. **Toggle lagi ID → EN**
   - ✅ Harus muncul log: `[i18n] Using cached messages for en` (dari cache)
   - ✅ Loading instant

#### B. Test Smart Caching

1. **Clear cache browser** (Ctrl+Shift+Delete)
2. **Reload page**
3. **Toggle ke EN** 
   - ✅ First load: fetch dari API
   - ✅ Cache duration: 30 menit untuk EN, 24 jam untuk ID
4. **Tunggu 31 menit, toggle lagi**
   - ✅ Cache EN expired, fetch ulang dari API
   - ✅ Cache ID masih valid (24 jam)

#### C. Test di Mobile Menu

1. **Resize browser ke mobile view** (Ctrl+Shift+M di Chrome)
2. **Buka mobile menu**
3. **Click toggle ID/EN di menu**
   - ✅ Toggle berfungsi
   - ✅ Menu auto-close setelah toggle
   - ✅ Bahasa berubah dengan smooth

### 3. Test API Endpoints

#### A. Test Messages API

```bash
# Get ID messages
curl http://localhost:3000/api/i18n/messages?locale=id

# Get EN messages
curl http://localhost:3000/api/i18n/messages?locale=en

# Expected response:
{
  "locale": "id",
  "messages": { ... },
  "cached": true,
  "timestamp": 1234567890
}
```

#### B. Test Translation Stats

```bash
curl http://localhost:3000/api/i18n/stats

# Expected response:
{
  "success": true,
  "stats": {
    "totalPages": 150,
    "translatedPages": 140,
    "pendingPages": 10,
    "lastSync": 1704067200000,
    ...
  }
}
```

#### C. Test Translation Sync

```bash
# Manual trigger translation
curl -X POST http://localhost:3000/api/i18n/sync

# Expected response:
{
  "success": true,
  "updated": true,
  "translatedCount": 25,
  "message": "Translated 25 keys"
}
```

#### D. Test Translation System

```bash
curl http://localhost:3000/api/i18n/test-translation

# Expected response: comprehensive test results
{
  "success": true,
  "tests": {
    "localeFiles": { "status": "passed", ... },
    "cacheManager": { "status": "passed", ... },
    "openAI": { "status": "passed", ... },
    "scheduler": { "status": "passed", ... }
  },
  "summary": {
    "total": 4,
    "passed": 4,
    "message": "4/4 tests passed"
  }
}
```

### 4. Test Auto-Detect Halaman Baru

1. **Buka halaman baru** (misalnya `/blog/artikel-baru`)
2. **Check console browser**
   - ✅ Harus muncul log: `[PageTranslation] Registration`
3. **Check stats API**
   ```bash
   curl http://localhost:3000/api/i18n/stats
   ```
   - ✅ `pendingPages` bertambah untuk EN
   - ✅ `totalPages` bertambah

### 5. Test Scheduler (Jam 2 Pagi)

#### A. Test Manual

```bash
# Trigger manual sync
curl -X POST http://localhost:3000/api/i18n/sync
```

#### B. Test Scheduled (Development)

1. **Set environment**
   ```bash
   ENABLE_DEV_CRON=true npm run dev
   ```

2. **Check logs di console**
   - Setiap 24 jam akan muncul:
   ```
   [i18n-cron] ===== Starting scheduled sync at ...
   [i18n-cron] Cache stats: { total: 150, ... }
   [i18n-cron] Translation sync completed: ...
   [i18n-cron] ===== Sync completed =====
   ```

#### C. Test Production

1. **Deploy ke server**
2. **Check logs jam 2 pagi**
   ```bash
   pm2 logs
   # atau
   tail -f logs/output.log
   ```

### 6. Test Cache Headers

```bash
# Check ID cache headers (should be 24h)
curl -I http://localhost:3000/api/i18n/messages?locale=id

# Expected headers:
Cache-Control: public, max-age=86400, stale-while-revalidate=86400

# Check EN cache headers (should be 30m)
curl -I http://localhost:3000/api/i18n/messages?locale=en

# Expected headers:
Cache-Control: public, max-age=1800, stale-while-revalidate=3600
```

## ✅ Checklist Test

### Toggle Bahasa
- [ ] Toggle ID → EN berfungsi
- [ ] Toggle EN → ID berfungsi
- [ ] Toggle di desktop header berfungsi
- [ ] Toggle di mobile menu berfungsi
- [ ] Toggle di LanguageSwitcherComponent berfungsi

### Smart Caching
- [ ] First load fetch dari API
- [ ] Second load pakai cache
- [ ] Cache ID bertahan 24 jam
- [ ] Cache EN bertahan 30 menit
- [ ] Cache expired fetch ulang

### Auto-Detect
- [ ] Halaman baru ter-register otomatis
- [ ] Konten berubah ter-detect
- [ ] Pending pages tracked di stats

### Translation Sync
- [ ] Manual sync berfungsi
- [ ] Batch translation (50 keys/chunk)
- [ ] Missing keys ditranslate
- [ ] Changed keys ditranslate
- [ ] Meta hash di-update

### Scheduler
- [ ] Cron berjalan jam 2 pagi
- [ ] Cache stats di-log
- [ ] Translation sync otomatis
- [ ] Old cache di-cleanup (30 hari)
- [ ] Snapshots ditulis

### API Endpoints
- [ ] GET /api/i18n/messages?locale=id
- [ ] GET /api/i18n/messages?locale=en
- [ ] GET /api/i18n/stats
- [ ] GET /api/i18n/test-translation
- [ ] POST /api/i18n/sync
- [ ] POST /api/i18n/register-page

## 🐛 Troubleshooting

### Problem: Toggle tidak berfungsi

**Solution:**
1. Check console errors
2. Check network tab (API calls)
3. Clear browser cache
4. Restart server

### Problem: Cache tidak update

**Solution:**
```javascript
// Clear cache manual di console browser
messageCache.clear()
localStorage.clear()
```

### Problem: Translation tidak jalan

**Solution:**
1. Check OPENAI_API_KEY
   ```bash
   echo $OPENAI_API_KEY
   ```
2. Check API response
   ```bash
   curl -X POST http://localhost:3000/api/i18n/sync
   ```
3. Check logs
   ```bash
   [i18n-cron] Translation skipped: OPENAI_API_KEY not configured
   ```

### Problem: Scheduler tidak jalan

**Solution:**
1. Check environment
   ```bash
   # Development
   ENABLE_DEV_CRON=true npm run dev
   
   # Production
   NUXT_ENABLE_SCHEDULER=true npm start
   ```
2. Check logs untuk `[i18n-cron]`

### Problem: Halaman baru tidak terdeteksi

**Solution:**
1. Ensure `usePageTranslation()` dipanggil di component
2. Check network tab: POST /api/i18n/register-page
3. Check stats: `curl http://localhost:3000/api/i18n/stats`

## 📊 Expected Performance

### Loading Times
- **ID (cached)**: < 10ms
- **EN (cached)**: < 10ms
- **ID (fresh)**: 100-200ms
- **EN (fresh)**: 100-200ms

### Cache Hit Rate
- **Target**: > 95%
- **ID**: Should be 99%+ (stable content)
- **EN**: Should be 90%+ (may update)

### Translation Speed
- **Batch (50 keys)**: 2-5 seconds
- **Full sync (1000 keys)**: 40-100 seconds

## 🎯 Success Criteria

Sistem dianggap berhasil jika:

1. ✅ Semua toggle bahasa berfungsi
2. ✅ Cache hit rate > 95%
3. ✅ Tidak ada error di console
4. ✅ API response < 200ms
5. ✅ Scheduler berjalan jam 2 pagi
6. ✅ Auto-detect halaman baru
7. ✅ Translation akurat (manual check)
8. ✅ Mobile-friendly
9. ✅ SEO-friendly (lang attribute)
10. ✅ Zero downtime pada translation

---

**Made with ❤️ by JasaPembayaran.com Team**

Last Updated: 2024 - Test Guide v2.0

