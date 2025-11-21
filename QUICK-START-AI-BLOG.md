# 🚀 Quick Start - AI Blog Generator

## Setup dalam 5 Menit! ⚡

### **Step 1: Set OpenAI API Key** (2 menit)

1. Buka https://platform.openai.com/api-keys
2. Daftar/Login
3. Klik "Create new secret key"
4. Copy key (starts with `sk-`)

### **Step 2: Update .env File** (1 menit)

Tambahkan ke file `.env` Anda:

```bash
OPENAI_API_KEY=sk-your-key-here
NUXT_ENABLE_AI_BLOG=true
ADMIN_API_TOKEN=rahasia-admin-token-123
```

### **Step 3: Ganti Nomor WhatsApp** (1 menit)

Edit `app/components/BeritaKamiBox.vue` line 88:

```typescript
const whatsappNumber = '+6281234567890' // ← GANTI!
```

### **Step 4: Restart Server** (1 menit)

```bash
npm run build
npm run start
```

### **Step 5: Test!** (30 detik)

```bash
# Cek status
curl http://localhost:3000/api/ai-blog/status

# Test generate 1 artikel (optional)
node test-ai-blog.js
```

---

## ✅ Selesai!

Sistem akan auto-generate **10 artikel SETIAP HARI** jam **03:00**

### **Cek Hasil:**
- 📁 Database: `database/content/generated-blogs.json`
- 🖼️ Images: `public/images/blog/`
- 📄 Markdown: `content/blog/`
- 🌐 URL: `https://yoursite.com/blog/[slug]`

---

## 📱 Fitur Mobile

### **WhatsApp Button:**
- Desktop: Kiri bawah (dengan tooltip)
- Mobile: Kanan bawah (pulse animation)

### **Touch Gestures:**
- Swipe kiri/kanan: Navigasi halaman
- Pull to refresh: Reload data
- Tap menu: Quick actions

---

## 💰 Cost

**~$1.50/bulan** untuk 300 artikel berkualitas tinggi!

---

## 📞 Support

Ada masalah? Baca: `AI-BLOG-GENERATOR-SETUP.md`

