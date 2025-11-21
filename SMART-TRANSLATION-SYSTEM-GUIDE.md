# 🌐 Sistem Translasi Super Pintar - Panduan Lengkap

## 📋 Ringkasan Fitur

Sistem translasi ID/EN yang super pintar dengan fitur:

### ✨ Fitur Utama

1. **Smart Caching System** 
   - Cache ID: 24 jam (konten stabil)
   - Cache EN: 30 menit (dapat berubah)
   - Tidak ada API calls yang tidak perlu
   - Auto-refresh saat cache expired

2. **Auto-Detect Halaman Baru**
   - Otomatis mendeteksi konten baru
   - Tracking perubahan halaman
   - Register otomatis ke cache manager

3. **Scheduled Translation**
   - Berjalan setiap jam 02:00 WIB
   - Translate semua konten yang pending
   - Cleanup cache lama (> 30 hari)

4. **Background Sync**
   - Non-blocking translation check
   - Tidak mengganggu user experience
   - Timeout 5 detik untuk responsivitas

5. **Statistics & Monitoring**
   - Real-time translation stats
   - Pending pages tracking
   - History log (100 entries terakhir)

## 🏗️ Struktur File

### Server-Side Components

```
server/
├── api/
│   └── i18n/
│       ├── sync.post.ts           # Trigger manual translation
│       ├── messages.ts             # Get messages dengan caching
│       ├── register-page.post.ts  # Register halaman baru
│       └── stats.get.ts            # Translation statistics
├── plugins/
│   └── i18n-cron.server.ts        # Scheduler jam 2 pagi
└── utils/
    ├── i18nAuto.ts                # Auto translation logic
    ├── i18nStore.ts               # File storage management
    └── i18nTranslationCache.ts    # Cache management system
```

### Client-Side Components

```
components/
└── LanguageSwitcherComponent.vue  # Toggle ID/EN dengan cache

composables/
└── usePageTranslation.ts          # Auto-track halaman baru

app/
├── components/
│   └── AppHeader.vue              # Header dengan toggle bahasa
└── layouts/
    └── default.vue                # Layout dengan toggle bahasa
```

## 🚀 Cara Kerja

### 1. User Toggle Bahasa (ID ↔ EN)

```
User Click ID/EN
      ↓
Check Cache (ada & fresh?)
      ↓
  Ya        Tidak
   ↓          ↓
Pakai    Fetch API
Cache    + Cache
   ↓          ↓
Apply Messages
```

### 2. Auto-Detect Halaman Baru

```
User Navigate
      ↓
usePageTranslation()
      ↓
Extract Content
      ↓
POST /api/i18n/register-page
      ↓
Check Hash Changes
      ↓
Update Cache Manager
      ↓
Mark as Pending (if EN)
```

### 3. Scheduled Translation (Jam 2 Pagi)

```
02:00 WIB Trigger
      ↓
Step 1: Cache Stats
      ↓
Step 2: Translate Pending
      ↓
Step 3: Cleanup Old Cache
      ↓
Step 4: Write Snapshots
      ↓
Complete ✓
```

## 🔧 Konfigurasi

### Environment Variables

```bash
# Required: OpenAI API Key untuk translation
CHATGPT_API_KEYS=sk-xxx
# atau
OPENAI_API_KEY=sk-xxx

# Optional: Disable scheduler (default: enabled)
NUXT_ENABLE_SCHEDULER=false

# Optional: Enable cron di development
ENABLE_DEV_CRON=true
```

### Cache Duration

Di `LanguageSwitcherComponent.vue`, `AppHeader.vue`, dan `default.vue`:

```javascript
const CACHE_DURATION_ID = 24 * 60 * 60 * 1000 // 24 jam
const CACHE_DURATION_EN = 30 * 60 * 1000      // 30 menit
```

### Scheduler Time

Di `server/plugins/i18n-cron.server.ts`:

```javascript
// Jam 02:00 WIB setiap hari
const initialDelay = msUntilNext(2, 0)
```

## 📊 API Endpoints

### 1. POST /api/i18n/sync
Trigger manual translation

**Response:**
```json
{
  "success": true,
  "updated": true,
  "translatedCount": 25,
  "missingCount": 10,
  "changedCount": 15,
  "message": "Translated 25 keys"
}
```

### 2. GET /api/i18n/messages?locale=id|en
Get messages dengan caching

**Headers:**
```
Cache-Control: public, max-age=86400 (ID) / 1800 (EN)
```

**Response:**
```json
{
  "locale": "id",
  "messages": {
    "navigation": {
      "home": "Beranda",
      ...
    }
  },
  "cached": true
}
```

### 3. POST /api/i18n/register-page
Register halaman untuk tracking

**Request:**
```json
{
  "path": "/blog/my-article",
  "locale": "id",
  "content": {
    "title": "Article Title",
    "messages": {...}
  }
}
```

**Response:**
```json
{
  "success": true,
  "hasChanges": true,
  "message": "Page registered with changes"
}
```

### 4. GET /api/i18n/stats
Translation statistics

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalPages": 150,
    "translatedPages": 140,
    "pendingPages": 10,
    "lastSync": 1704067200000,
    "pendingPagesDetails": [...]
  }
}
```

## 💡 Best Practices

### 1. Penggunaan di Component

```vue
<script setup>
import { usePageTranslation } from '~/composables/usePageTranslation'

// Auto-track halaman
const { registerPageContent } = usePageTranslation()

// Manual register jika perlu
registerPageContent({
  title: 'My Page Title',
  description: 'Page description',
  content: 'Main content'
})
</script>
```

### 2. Language Toggle

Gunakan `LanguageSwitcherComponent`:

```vue
<template>
  <LanguageSwitcherComponent @switched="onLanguageChange" />
</template>
```

### 3. Manual Translation Trigger

```javascript
// Trigger manual sync (development/testing)
await $fetch('/api/i18n/sync', { method: 'POST' })
```

## 🧪 Testing

### 1. Test Language Toggle
1. Buka website
2. Click ID → EN
3. Check console: "Using cached messages" atau "Fetched and cached"
4. Toggle ulang, harus "Using cached messages"

### 2. Test Auto-Detection
1. Navigate ke halaman baru
2. Check console: "[PageTranslation] Registration"
3. Check API: GET /api/i18n/stats
4. Lihat `pendingPages` bertambah

### 3. Test Scheduled Translation
```bash
# Set environment
ENABLE_DEV_CRON=true npm run dev

# Atau manual trigger
curl -X POST http://localhost:3000/api/i18n/sync
```

## 📈 Monitoring

### Cache Statistics

```javascript
// Get translation stats
const stats = await $fetch('/api/i18n/stats')
console.log(stats)
```

### Cache Manager

```typescript
// Server-side
import { getTranslationCacheManager } from '~/server/utils/i18nTranslationCache'

const manager = await getTranslationCacheManager()
const stats = manager.getStats()
const pending = manager.getPendingPages()
```

## 🔒 Security & Performance

### Caching Headers
- ID messages: `max-age=86400` (24 jam)
- EN messages: `max-age=1800` (30 menit)
- CDN-friendly dengan `stale-while-revalidate`

### Rate Limiting
- Background sync: 5s timeout
- Non-blocking untuk UX
- Batch translation: 50 keys per chunk

### Data Persistence
- Atomic file writes (`.tmp` → rename)
- Hash-based change detection
- Auto-cleanup old entries (30 hari)

## 🎯 Troubleshooting

### Cache Tidak Update
```javascript
// Clear cache manual
messageCache.clear()
```

### Translation Tidak Jalan
1. Check OPENAI_API_KEY
2. Check `/api/i18n/sync` response
3. Check logs: `[i18n-cron]`

### Halaman Tidak Terdeteksi
1. Ensure `usePageTranslation()` dipanggil
2. Check network tab: POST /api/i18n/register-page
3. Check stats: GET /api/i18n/stats

## 📝 Changelog

### Version 2.0 - Super Pintar Update
- ✅ Smart caching system (24h ID, 30m EN)
- ✅ Auto-detect halaman baru
- ✅ Scheduled translation jam 2 pagi
- ✅ Background sync non-blocking
- ✅ Translation statistics & monitoring
- ✅ Cache cleanup automation
- ✅ Improved error handling

### Previous Version
- Basic translation system
- Manual sync required
- No caching
- Jam 3 pagi scheduler

## 🚀 Future Improvements

- [ ] Real-time translation updates via WebSocket
- [ ] Multi-language support (ID/EN/CN/JP)
- [ ] AI-powered translation quality scoring
- [ ] Dashboard untuk monitoring translation
- [ ] Incremental translation (translate saat scroll)

---

**Made with ❤️ by JasaPembayaran.com Team**

Last Updated: 2024 - Sistem Translasi Super Pintar v2.0

