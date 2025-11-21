# ✅ Testing No-Cache Setup

## 🧪 Test 1: Perubahan Text

1. Buka `pages/index.vue`
2. Ubah text apapun (misal di heading)
3. Save file (Ctrl+S)
4. **Expected:** Perubahan muncul dalam 1-2 detik tanpa refresh manual

## 🧪 Test 2: Perubahan CSS

1. Buka file CSS mana saja (misal `app/assets/css/main.css`)
2. Ubah warna atau style
3. Save file (Ctrl+S)
4. **Expected:** Style langsung berubah tanpa refresh

## 🧪 Test 3: Perubahan Component

1. Buat/edit component di `app/components/`
2. Ubah content atau props
3. Save file (Ctrl+S)
4. **Expected:** Component update tanpa full page reload

## 🧪 Test 4: Hard Reload

1. Ubah file apapun
2. Save (Ctrl+S)
3. Tunggu 1-2 detik
4. Jika tidak update → Hard reload (Ctrl+Shift+R)
5. **Expected:** Perubahan muncul setelah hard reload

## ✅ Test Checklist

Sebelum report masalah, pastikan:

- [ ] Dev server running tanpa error
- [ ] DevTools open (F12)
- [ ] "Disable cache" checked di Network tab
- [ ] File tersimpan (Ctrl+S)
- [ ] Console tidak ada error
- [ ] Port 24679 (HMR) tidak conflict
- [ ] Sudah coba hard reload (Ctrl+Shift+R)
- [ ] Sudah coba `npm run clear:cache`

## 🔍 Debugging Steps

### 1. Check Console Errors

Buka DevTools Console (F12), check untuk:
- ❌ Error merah
- ⚠️ Warning kuning tentang HMR
- 🔌 WebSocket connection errors

### 2. Check Network Tab

Buka Network tab, check:
- Cache-Control header: should be "no-store, no-cache"
- Status: should be 200 (not 304 Not Modified)
- Size: should show actual size (not "from disk cache")

### 3. Check Terminal

Look for:
- ✅ "✓ Client" message setelah save
- ✅ HMR update messages
- ❌ Any error messages

### 4. Check File Save

- Windows Explorer might delay save
- Try save twice (Ctrl+S Ctrl+S)
- Check file modification time

## 🎯 Expected Behavior

### Normal HMR Flow:

1. Edit file → Save (Ctrl+S)
2. Terminal shows: `✓ Client`
3. Browser shows: `[vite] hot updated: ...`
4. Page updates automatically (1-2 seconds)

### If HMR Fails:

1. Edit file → Save (Ctrl+S)
2. No terminal message
3. Do hard reload: Ctrl+Shift+R
4. Changes appear after reload

## 📊 Performance Metrics

| Action | Expected Time |
|--------|--------------|
| HMR Update | 1-2 seconds |
| Hard Reload | 2-3 seconds |
| Clear Cache | 3-5 seconds |
| Full Restart | 10-15 seconds |

## 🚨 Common Issues

### Issue: "HMR disconnected"

**Solution:**
```bash
# Stop server
Ctrl + C

# Clear cache
npm run clear:cache

# Restart
npm run dev:nocache
```

### Issue: "Port 24679 already in use"

**Solution:**
```bash
# Windows - Kill process on port
netstat -ano | findstr :24679
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:24679 | xargs kill -9

# Restart
npm run dev:nocache
```

### Issue: "Changes not visible in Chrome"

**Solution:**
1. Close all Chrome tabs
2. Clear Chrome cache: Ctrl+Shift+Delete
3. Open in Incognito: Ctrl+Shift+N
4. Open DevTools and disable cache

### Issue: "Service Worker interfering"

**Solution:**
1. Open DevTools → Application tab
2. Click "Service Workers"
3. Click "Unregister" for all workers
4. Hard reload

## 🎓 Advanced Testing

### Test with Multiple Files:

1. Open 2-3 files in editor
2. Edit all files
3. Save all (Ctrl+K S in VS Code)
4. **Expected:** All changes reflect

### Test with Different File Types:

- [ ] `.vue` files
- [ ] `.ts` files
- [ ] `.css` files
- [ ] `.js` files
- [ ] Configuration files (nuxt.config.ts)

Note: Config files usually require full restart!

## 📝 Report Template

If still having issues, report with:

```
**Problem:**
Perubahan di [file] tidak muncul

**Steps:**
1. Edit [file]
2. Save
3. Wait [X] seconds
4. Result: [tidak ada perubahan]

**Environment:**
- OS: [Windows/Linux/Mac]
- Browser: [Chrome/Firefox/Edge]
- Node version: [run: node -v]
- npm version: [run: npm -v]

**Console Errors:**
[paste console errors]

**Terminal Output:**
[paste terminal output]

**Already Tried:**
- [ ] Hard reload (Ctrl+Shift+R)
- [ ] Clear cache (npm run clear:cache)
- [ ] DevTools disable cache enabled
- [ ] Restart dev server
- [ ] Nuclear option (npm run nuclear)
```

---

**Created:** October 2025  
**Status:** ✅ Ready for Testing  
**Version:** 1.0.0

