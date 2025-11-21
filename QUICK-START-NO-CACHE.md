# 🚀 Quick Start - No Cache Development

## ⚡ Cara Cepat (Recommended)

### 1️⃣ Setup Awal (Sekali Saja)

**Windows:**
```bash
setup-no-cache.bat
```

**Linux/Mac:**
```bash
chmod +x setup-no-cache.sh
./setup-no-cache.sh
```

### 2️⃣ Jalankan Development Server

```bash
npm run dev:nocache
```

### 3️⃣ Setup Browser

1. Buka DevTools: **F12**
2. Go to **Network** tab
3. ✅ Check: **"Disable cache"**
4. **Keep DevTools open!** (ini penting!)

---

## 🔥 Masalah Umum & Solusi Cepat

### ❌ Perubahan masih tidak muncul?

```bash
# Hard reload browser
Ctrl + Shift + R

# Atau clear cache manual
npm run clear:cache
```

### ❌ CSS tidak update?

```bash
# Restart dev server
Ctrl + C
npm run dev:nocache
```

### ❌ Component tidak update?

```bash
# Clear cache + restart
npm run dev:fresh
```

### ❌ Masih bermasalah?

```bash
# Nuclear option (hapus semua + install ulang)
npm run nuclear

# Linux/Mac
npm run nuclear:linux
```

---

## 📝 Checklist Sebelum Komplain

- [ ] File sudah di-save (**Ctrl + S**)
- [ ] DevTools open + cache disabled
- [ ] Sudah hard reload (**Ctrl + Shift + R**)
- [ ] Console tidak ada error merah
- [ ] Dev server masih running (check terminal)
- [ ] Sudah coba `npm run clear:cache`

---

## 💡 Tips Pro

### Use Incognito Mode
Untuk testing fresh tanpa cache:
- Chrome/Edge: `Ctrl + Shift + N`
- Firefox: `Ctrl + Shift + P`

### Keyboard Shortcuts
| Shortcut | Fungsi |
|----------|--------|
| `Ctrl + S` | Save file |
| `Ctrl + Shift + R` | Hard reload |
| `F12` | Open DevTools |
| `Ctrl + Shift + Delete` | Clear browser data |
| `Ctrl + C` | Stop dev server |

### Dev Workflow yang Benar
1. Buka DevTools (F12)
2. Enable "Disable cache"
3. Edit code → Save (Ctrl+S)
4. HMR akan auto-refresh (tunggu 1-2 detik)
5. Jika tidak update → Ctrl+Shift+R

---

## 🎯 Available Commands

| Command | Fungsi |
|---------|--------|
| `npm run dev` | Normal dev server |
| `npm run dev:nocache` | Dev server dengan auto clear cache |
| `npm run dev:fresh` | Clear cache + start dev |
| `npm run clear:cache` | Clear cache manual |
| `npm run clear:all` | Clear cache + node_modules |
| `npm run nuclear` | Nuclear option (Windows) |
| `npm run nuclear:linux` | Nuclear option (Linux/Mac) |

---

## 🔍 Debug Mode

Jika perlu debug lebih lanjut:

```bash
# Windows
set DEBUG=nuxt:* && npm run dev:nocache

# Linux/Mac
DEBUG=nuxt:* npm run dev:nocache
```

---

## 📱 Test di Mobile

```bash
# 1. Get IP address
ipconfig  # Windows
ifconfig  # Linux/Mac

# 2. Start dev server
npm run dev:nocache

# 3. Akses dari mobile
http://192.168.x.x:3000
```

---

**Created:** October 2025  
**Status:** ✅ Ready to Use  
**Version:** 1.0.0

Dokumentasi lengkap: [SOLUSI-NO-CACHE-DEVELOPMENT.md](./SOLUSI-NO-CACHE-DEVELOPMENT.md)

