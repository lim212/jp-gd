# 🤖 AI Blog Generator - Setup Guide

## Sistem Auto-Generate 10 Artikel Berkualitas Setiap Hari dengan OpenAI GPT-4

---

## ✨ Fitur Utama

### 1. **REAL AI Content Generation**
- ✅ Menggunakan OpenAI GPT-4o-mini
- ✅ Generate judul yang SEO-optimized (50-60 karakter)
- ✅ Generate konten lengkap (1500-2000 kata)
- ✅ Generate meta description yang compelling
- ✅ Generate keywords dan tags yang relevan
- ✅ 100% konten unik, bukan template

### 2. **Smart Image Handling**
- ✅ Generate image dengan AI (Pollinations AI)
- ✅ Download dan simpan image secara lokal
- ✅ Image dimensions: 1200x630 (optimal untuk social sharing)
- ✅ SEO-friendly filenames
- ✅ Fallback image jika download gagal

### 3. **Google SEO Optimization**
- ✅ Schema.org markup (Article schema)
- ✅ Meta tags optimization
- ✅ Keyword density optimal
- ✅ SEO score calculator (0-100)
- ✅ Sitemap auto-update
- ✅ Semantic HTML structure

### 4. **Quality Assurance**
- ✅ Word count validator (min 1500 kata)
- ✅ SEO score > 70/100
- ✅ Retry logic (max 3 attempts)
- ✅ Error handling yang robust
- ✅ Quality metrics tracking

---

## 🚀 Cara Setup

### Step 1: Dapatkan OpenAI API Key

1. Buka: https://platform.openai.com/api-keys
2. Login atau daftar akun
3. Klik "Create new secret key"
4. Copy API key (format: sk-...)
5. **JANGAN SHARE API KEY!**

### Step 2: Setup Environment Variables

Buat file `.env` di root project atau tambahkan ke existing .env:

```bash
# OpenAI API Key (REQUIRED untuk AI generation)
OPENAI_API_KEY=sk-your-openai-api-key-here
# atau
NUXT_OPENAI_API_KEY=sk-your-openai-api-key-here

# Enable AI Blog Scheduler
NUXT_ENABLE_AI_BLOG=true

# Admin API Token (untuk manual trigger)
ADMIN_API_TOKEN=your-secret-admin-token-here

# WhatsApp Number (untuk CTA button)
WHATSAPP_NUMBER=+6281234567890
```

### Step 3: Ganti Nomor WhatsApp

Edit file: `app/components/BeritaKamiBox.vue` (line 88)

```typescript
const whatsappNumber = '+6281234567890' // ← GANTI dengan nomor Anda
const whatsappMessage = 'Halo! Saya tertarik dengan layanan Jasa Pembayaran. Bisa dibantu?'
```

### Step 4: Restart Server

```bash
npm run build
npm run start

# Atau untuk development
npm run dev
```

---

## 📝 Cara Menggunakan

### **Automatic Mode (Recommended)**

Scheduler akan otomatis jalan setiap hari jam **03:00** dan generate **10 artikel**.

**Cek Status:**
```bash
curl http://localhost:3000/api/ai-blog/status
```

**Output:**
```json
{
  "status": "healthy",
  "scheduler": {
    "enabled": true,
    "hasAIKey": true,
    "nextRunTime": "2025-10-17T03:00:00.000Z",
    "hoursUntilNextRun": "12.5"
  },
  "rotation": {
    "currentIndex": 50,
    "totalKeywords": 500,
    "totalGenerated": 50,
    "progress": "10%"
  }
}
```

### **Manual Mode (Testing)**

Generate artikel secara manual:

```bash
# Generate 1 artikel
curl -X POST http://localhost:3000/api/ai-blog/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-admin-token-here" \
  -d '{"keyword": "jasa pembayaran paypal", "count": 1}'

# Generate 10 artikel sekaligus
curl -X POST http://localhost:3000/api/ai-blog/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-admin-token-here" \
  -d '{"keyword": "jasa pembayaran paypal", "count": 10}'
```

**Response:**
```json
{
  "success": true,
  "generated": 10,
  "failed": 0,
  "results": [
    {
      "success": true,
      "title": "Jasa Pembayaran PayPal Terpercaya 2025",
      "wordCount": 1847,
      "seo": {
        "metaDescription": "...",
        "tags": ["PayPal", "Jasa Pembayaran", ...],
        "category": "PayPal"
      }
    }
  ]
}
```

---

## 📊 Monitoring & Analytics

### **Dashboard Metrics:**

```typescript
// Total articles generated
const totalBlogs = await fetch('/api/ai-blog/status')
console.log(totalBlogs.database.totalBlogs)

// SEO Score average
// Word count statistics
// Generation success rate
// API usage tracking
```

### **Log Monitoring:**

Logs akan tampil di console:
```
🤖 === Generating AI Blog 1 for: "jasa paypal" ===
1️⃣ Generating AI title...
   ✅ Title: "Jasa PayPal Terpercaya..." (58 chars)
2️⃣ Generating AI content (1500-2000 words)...
   ✅ Content: 8543 characters
3️⃣ Generating and saving image...
   ✅ Image: /images/blog/jasa-paypal-1729123456.jpg
   📊 Word Count: 1847
   ⏱️ Read Time: 9 minutes
   🎯 SEO Score: 95/100
4️⃣ Saving blog to database...
   ✅ Blog saved successfully
🎉 === Blog 1 completed successfully! ===
```

---

## 🎯 SEO Score Breakdown

### **Scoring System (0-100):**

| Criteria | Points | Requirements |
|----------|--------|--------------|
| **Word Count** | 30 | ≥1500 words = 30pts, ≥1000 = 20pts |
| **Meta Description** | 20 | 150-160 chars = 20pts |
| **Title Length** | 20 | 50-60 chars = 20pts |
| **Tags** | 10 | ≥6 tags = 10pts |
| **Keywords** | 10 | ≥8 keywords = 10pts |
| **Structure** | 10 | H1+H2+Lists = 10pts |

**Target: ≥70/100** untuk kualitas optimal

---

## 📁 File Structure

```
project/
├── server/
│   ├── plugins/
│   │   └── ai-blog-scheduler.server.ts   ← Main scheduler
│   ├── utils/
│   │   └── ai-content-generator.ts        ← AI generator
│   └── api/
│       └── ai-blog/
│           ├── generate.post.ts            ← Manual trigger
│           └── status.get.ts               ← Status monitor
├── data/
│   ├── keywords/
│   │   └── 2025-08-21/
│   │       └── list-keyword.txt           ← Keywords source
│   ├── keyword-rotation.json              ← Rotation tracker
│   └── blog/
│       ├── generated/                     ← Individual JSON files
│       └── latest-posts.json              ← Latest posts cache
├── database/
│   └── content/
│       └── generated-blogs.json           ← Main database
├── public/
│   └── images/
│       └── blog/                          ← Downloaded images
└── content/
    └── blog/                              ← Markdown files (Nuxt Content)
```

---

## 🔧 Troubleshooting

### **Problem: Artikel tidak ter-generate**

**Cek:**
1. Apakah `NUXT_ENABLE_AI_BLOG=true`?
2. Apakah `OPENAI_API_KEY` sudah diset?
3. Cek logs: Apakah ada error OpenAI API?
4. Cek status: `curl http://localhost:3000/api/ai-blog/status`

### **Problem: Image tidak tersimpan**

**Cek:**
1. Folder `public/images/blog/` writable?
2. Network connection OK?
3. Check logs untuk error download

### **Problem: SEO score rendah**

**Solution:**
- AI akan retry jika score < 70
- Adjust AI prompt di `ai-content-generator.ts`
- Increase word count requirement

### **Problem: API rate limit**

**Solution:**
- Increase delay between generation (line 5000ms)
- Use fallback generator jika quota habis
- Monitor OpenAI usage dashboard

---

## 💰 Cost Estimation

### **OpenAI API Cost** (GPT-4o-mini):

| Item | Tokens | Cost per Run | Monthly Cost |
|------|--------|--------------|--------------|
| Title Generation | ~100 | $0.0001 | $0.003 |
| Content (2000 words) | ~3000 | $0.0045 | $0.135 |
| Meta Description | ~200 | $0.0003 | $0.009 |
| Keywords | ~100 | $0.0001 | $0.003 |
| **Total per Article** | ~3400 | **$0.0050** | **$0.15** |
| **10 Articles/day** | 34,000 | **$0.05** | **$1.50** |
| **300 Articles/month** | 1M | **$1.50** | **$1.50** |

**Total Monthly Cost: ~$1.50 - $5** (sangat murah!)

*Note: Harga per Oktober 2025. Cek pricing terbaru di OpenAI.*

---

## 🎯 Best Practices

### **1. Keyword Selection:**
- Pilih keywords yang relevan dengan bisnis
- Mix antara long-tail dan short-tail keywords
- Target 500-1000 keywords untuk rotasi

### **2. Content Quality:**
- Review sample artikel pertama
- Adjust AI prompts jika perlu
- Monitor SEO scores
- Keep SEO score > 70

### **3. Performance:**
- Run scheduler di jam sepi (3 AM)
- Monitor API usage dan costs
- Setup error notifications
- Regular backup data

### **4. SEO Optimization:**
- Submit sitemap ke Google Search Console
- Monitor Google Analytics
- Track keyword rankings
- Update popular content

---

## 🔐 Security

### **API Key Protection:**
- ❌ NEVER commit .env to git
- ✅ Use environment variables
- ✅ Rotate keys regularly
- ✅ Monitor API usage for anomalies

### **Admin API Token:**
- ❌ Don't use default token
- ✅ Use strong random token (min 32 chars)
- ✅ Keep token secret
- ✅ Rotate quarterly

---

## 📈 Success Metrics

### **Track These KPIs:**

1. **Generation Success Rate:** Target >95%
2. **Average SEO Score:** Target >80/100
3. **Average Word Count:** Target >1500 words
4. **Image Save Success:** Target 100%
5. **Blog Published:** 10/day = 300/month
6. **API Cost:** <$5/month
7. **Organic Traffic Growth:** Track in Google Analytics

---

## 🎉 Ready to Go!

Setelah setup selesai, sistem akan:

✅ Generate 10 artikel berkualitas SETIAP HARI jam 3 pagi
✅ Konten 100% unique dengan AI (bukan template!)
✅ SEO-optimized sesuai standar Google  
✅ Image downloaded dan saved locally
✅ Auto-update sitemap dan database
✅ Track semua metrics dan analytics

---

## 📞 Support

Jika ada masalah atau pertanyaan:
- 📧 Email: dev@jasapembayaran.com
- 💬 WhatsApp: +62-xxx-xxxx-xxxx
- 📚 Docs: /docs/ai-blog-generator

---

**Last Updated:** October 2025  
**Version:** 2.0.0 (AI-Powered)  
**Status:** ✅ Production Ready

