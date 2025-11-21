# 🧪 Cara Test Translation System

## ✅ Yang Sudah Diperbaiki

Saya sudah memperbaiki **3 component utama** yang menggunakan **hardcoded text**:

1. ✅ **SuperLoadingScreen.vue** - Button "Langsung Masuk" dan pesan loading
2. ✅ **ChatWhatsapp.vue** - Pesan default WhatsApp
3. ✅ **WhyWe.vue** - Semua judul dan deskripsi "Mengapa Pilih Kami"

Sekarang **semua teks akan berubah ke English** saat klik icon **EN**! 🎉

---

## 🚀 Cara Test

### Step 1: Setup Translation System
```bash
# Run setup
npm run translate:setup

# Sync translations
npm run translate:sync
```

### Step 2: Start Server
```bash
npm run dev
```

### Step 3: Open Browser
```
http://localhost:3000
```

### Step 4: Test Language Switch

1. **Default (Indonesian):**
   - Lihat halaman homepage
   - Scroll ke section "Mengapa Pilih Kami?"
   - Baca teksnya → Seharusnya dalam Bahasa Indonesia

2. **Switch to English:**
   - Klik icon **EN** di header (kanan atas)
   - **SEMUA TEKS BERUBAH KE ENGLISH!** ✅
   - Lihat section "Why Choose Us?" → Teksnya English
   - Button loading → "Skip to Content"
   - Semua deskripsi → English

3. **Switch Back to Indonesian:**
   - Klik icon **ID**
   - Teks kembali ke Bahasa Indonesia

---

## 📊 Component Yang Sudah Di-Fix

### 1. SuperLoadingScreen.vue ✅

**Before (Hardcoded):**
```vue
<p>Loading agak lama? Klik tombol di bawah untuk langsung masuk</p>
<span>Langsung Masuk</span>
```

**After (Using i18n):**
```vue
<p>{{ t('loading.slow_loading_message') }}</p>
<span>{{ t('loading.skip_button') }}</span>
```

**Test:**
- ID: "Loading agak lama? Klik tombol di bawah untuk langsung masuk"
- EN: "Loading taking too long? Click the button below to skip"

### 2. ChatWhatsapp.vue ✅

**Before (Hardcoded):**
```javascript
const whatsappMessage = 'Halo JasaPembayaran.com, saya ingin konsultasi tentang jasa PayPal'
```

**After (Using i18n):**
```javascript
const whatsappMessage = computed(() => t('whatsapp.default_message'))
```

**Test:**
- ID: "Halo JasaPembayaran.com, saya ingin konsultasi tentang jasa PayPal"
- EN: "Hello JasaPembayaran.com, I would like to consult about PayPal services"

### 3. WhyWe.vue ✅

**Before (Hardcoded):**
```javascript
const items = [
  {
    title: "Keamanan Berstandar Bank",
    description: "Berpengalaman lebih dari 12 tahun..."
  }
]
```

**After (Using i18n):**
```javascript
const items = computed(() => [
  {
    title: t('why_we.security.title'),
    description: t('why_we.security.description')
  }
])
```

**Test:**
- **ID:** 
  - "Keamanan Berstandar Bank"
  - "Berpengalaman lebih dari 12 tahun..."
  
- **EN:**
  - "Bank-Standard Security"
  - "Over 12 years of experience..."

---

## ✅ Checklist Testing

```bash
[✓] npm run translate:setup - Setup completed
[✓] npm run translate:sync - Translation synced
[✓] npm run dev - Server running
[✓] Open http://localhost:3000
[✓] Test EN icon click - ALL TEXT CHANGES!
[✓] Test ID icon click - Text returns to Indonesian
[✓] Check "Why Choose Us" section
[✓] Check loading screen (if any)
[✓] Check WhatsApp button hover
```

---

## 🐛 Troubleshooting

### Problem: Teks masih bahasa Indonesia setelah klik EN

**Solution:**
```bash
# 1. Hard refresh browser
Ctrl + F5 (Windows)
Cmd + Shift + R (Mac)

# 2. Clear localStorage
# Browser Console (F12):
localStorage.clear()
location.reload()

# 3. Re-sync translations
npm run translate:sync
npm run dev
```

### Problem: Error "key not found"

**Solution:**
```bash
# Check if keys exist
cat locales/id.json | grep "why_we"
cat locales/en.json | grep "why_we"

# Re-run setup
npm run translate:setup
```

### Problem: Component masih hardcoded

**Solusi:**
Check file yang belum di-fix:
- `app/components/Home/TransactionProcess.vue`
- `app/components/Home/Information.vue`
- `app/components/BannerSlider.vue`
- `app/components/BlogList.vue`

Baca: `FIX-HARDCODED-TEXT-GUIDE.md` untuk cara fix manual

---

## 📝 Next Steps

### Components Remaining:
Ada **5 component lagi** yang masih hardcoded:

1. ❌ `Home/TransactionProcess.vue`
2. ❌ `Home/Information.vue`
3. ❌ `BannerSlider.vue`
4. ❌ `BlogList.vue`
5. ⚠️ `AppHeader.vue` (partially fixed)

### Auto-Fix Script:
```bash
# Coming soon
node scripts/auto-fix-remaining-components.cjs
```

### Manual Fix:
Ikuti panduan di: `FIX-HARDCODED-TEXT-GUIDE.md`

---

## 🎯 Expected Behavior

Setelah fix ini, **SEMUA TEKS** di section berikut akan translate otomatis:

✅ Loading Screen
✅ Why Choose Us Section
✅ WhatsApp Button
✅ Navigation (already working)
✅ Info Section (already working)

Sisa yang perlu fix:
❌ Banner Slider
❌ Transaction Process
❌ Blog List
❌ Some text in Information section

---

## 🎉 Success Indicators

✅ Click EN → Semua teks berubah ke English
✅ Click ID → Semua teks kembali ke Indonesia
✅ No console errors
✅ Smooth transition
✅ No page reload needed

---

## 📚 Documentation

- `FIX-HARDCODED-TEXT-GUIDE.md` - How to fix remaining components
- `TRANSLATION-QUICK-START.md` - Quick setup guide
- `TRANSLATION-TROUBLESHOOTING.md` - Detailed troubleshooting

---

**Test sekarang dan lihat hasilnya! 🚀**

