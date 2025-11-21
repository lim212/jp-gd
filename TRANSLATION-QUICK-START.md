# 🚀 Translation System - Quick Start Guide

## ⚡ Setup Cepat (5 Menit)

### 1. Set Environment Variables

Edit `.env` file:

```env
# Required: OpenAI API Key
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxx

# Optional: Enable scheduler (default: true)
NUXT_ENABLE_SCHEDULER=true

# Optional: Enable in dev mode
ENABLE_DEV_CRON=true
```

### 2. Start Server

```bash
npm run dev
# atau
npm run build && npm start
```

✅ **That's it!** Sistem akan jalan otomatis setiap hari jam 02:00 WIB.

---

## 📝 Command Cheat Sheet

### Quick Commands

```bash
# Full sync (scan + translate + cleanup)
npm run translate:full

# Scan halaman untuk perubahan
npm run translate:scan

# Translate pending content
npm run translate:sync

# Lihat statistics
npm run translate:stats

# Retry failed translations
npm run translate:retry
```

### Windows Quick Sync

```batch
scripts\quick-translate.bat
```

### Linux/Mac Quick Sync

```bash
./scripts/quick-translate.sh
```

---

## 🔍 Monitoring

### Check Status

```bash
npm run translate:stats
```

Output:
```
📊 Statistics:
   Total Pages: 150
   Pending: 5
   Translated: 140
   Failed: 5
   Last Scan: 19/10/2025 02:00:00
   Last Translation: 19/10/2025 02:00:00
```

### View Dashboard

```bash
# Di browser
http://localhost:3000/api/i18n/dashboard

# Atau via command
npm run translate:dashboard
```

---

## 🎯 How It Works

### Automatic Flow (No Action Needed!)

```
1. Scheduler runs at 02:00 WIB daily
   ↓
2. Scans all pages for changes
   ↓
3. Detects new/changed content
   ↓
4. Translates ID → EN automatically
   ↓
5. Cleans up old cache
   ↓
6. Done! ✅
```

### Manual Trigger (When Needed)

```bash
# When you add new content and want immediate translation
npm run translate:full

# When translation fails
npm run translate:retry
```

---

## 🐛 Quick Troubleshooting

### Translation tidak jalan?

```bash
# 1. Check API key configured
echo $OPENAI_API_KEY

# 2. Check scheduler enabled
# In .env: NUXT_ENABLE_SCHEDULER=true

# 3. Manual trigger
npm run translate:sync
```

### Halaman baru tidak terdeteksi?

```bash
# Manual scan
npm run translate:scan

# Then translate
npm run translate:sync
```

### Translation gagal terus?

```bash
# View failed pages
npm run translate:stats

# Retry failed
npm run translate:retry
```

---

## 📚 More Info

Untuk dokumentasi lengkap, lihat:
- `ENHANCED-TRANSLATION-SYSTEM-COMPLETE.md` - Full documentation
- `SISTEM-TRANSLASI-SUPER-PINTAR.md` - Sistem lama (reference)

---

## 💡 Pro Tips

1. **Otomatis adalah raja** - Biarkan scheduler yang handle, jangan manual kecuali urgent
2. **Monitor regularly** - Check `npm run translate:stats` seminggu sekali
3. **Immediate translation** - Hanya untuk urgent content, don't overuse
4. **Check logs** - Console akan kasih tau kalau ada masalah

---

## ✅ Quick Verification

Cek sistem running dengan baik:

```bash
# 1. Check stats
npm run translate:stats

# 2. Check OpenAI API key configured
# Should show: API Key Configured: ✅ Yes

# 3. Check scheduler enabled  
# Should show: Scheduler Enabled: ✅ Yes

# 4. All good? You're set! 🎉
```

---

**Need help?** Check `ENHANCED-TRANSLATION-SYSTEM-COMPLETE.md` untuk dokumentasi lengkap.

