# 🚀 Cheat Sheet: No Cache Development

## ⚡ Quick Commands

```bash
# Daily use (recommended)
npm run dev:nocache

# Clear cache
npm run clear:cache

# Fresh start
npm run dev:fresh

# Nuclear option (last resort)
npm run nuclear
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `F12` | Open DevTools |
| `Ctrl + S` | Save file |
| `Ctrl + Shift + R` | Hard reload (force refresh) |
| `Ctrl + Shift + Delete` | Clear browser data |
| `Ctrl + Shift + N` | Open Incognito (Chrome) |
| `Ctrl + C` | Stop dev server |

---

## ✅ Setup Checklist

- [ ] Run `setup-no-cache.bat`
- [ ] Start `npm run dev:nocache`
- [ ] Open DevTools (F12)
- [ ] Enable "Disable cache" in Network tab
- [ ] Keep DevTools open while coding

---

## 🔧 Troubleshooting Steps

### Level 1: Quick Fix
```bash
Ctrl + Shift + R    # Hard reload
```

### Level 2: Clear Cache
```bash
npm run clear:cache
```

### Level 3: Restart Server
```bash
Ctrl + C
npm run dev:nocache
```

### Level 4: Nuclear Option
```bash
npm run nuclear
```

---

## 📊 Expected Behavior

| Action | Expected Time |
|--------|--------------|
| HMR Update | 1-2 seconds |
| Hard Reload | 2-3 seconds |
| Clear Cache | 3-5 seconds |
| Dev Restart | 10-15 seconds |

---

## 🚨 Common Issues

### Issue: Changes not visible
```bash
# Solution
Ctrl + Shift + R
npm run clear:cache
npm run dev:nocache
```

### Issue: HMR disconnect
```bash
# Solution
Ctrl + C
npm run clear:cache
npm run dev:nocache
```

### Issue: Port conflict
```bash
# Solution
netstat -ano | findstr :24679
taskkill /PID <PID> /F
npm run dev:nocache
```

---

## 💡 Pro Tips

1. **Always keep DevTools open**
2. **Enable "Disable cache" in Network tab**
3. **Use Ctrl+Shift+R for hard reload**
4. **Use Incognito for testing**
5. **Wait 1-2s after save for HMR**

---

## 📁 Quick Reference

### Important Files
- `nuxt.config.ts` - Main config
- `package.json` - Scripts
- `env.development.example` - Environment template

### Documentation
- `README-NO-CACHE-SOLUTION.md` - Full guide
- `QUICK-START-NO-CACHE.md` - Quick start
- `SOLUSI-NO-CACHE-DEVELOPMENT.md` - Troubleshooting
- `TEST-NO-CACHE.md` - Testing guide

---

## 🎯 Workflow

```
1. npm run dev:nocache
   ↓
2. Open DevTools (F12)
   ↓
3. Enable "Disable cache"
   ↓
4. Edit code
   ↓
5. Save (Ctrl+S)
   ↓
6. Wait 1-2s
   ↓
7. Changes appear! ✅
```

If not appear → `Ctrl + Shift + R`

---

**Print this and stick to your monitor!** 📌

