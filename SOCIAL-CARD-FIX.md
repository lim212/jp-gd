# ✅ Perbaikan Error social-card.png - ENOENT

## 🎯 Masalah

Error saat build di Ubuntu VPS:
```
ERROR  Error: Could not load virtual:#nitro-internal-virtual/public-assets-data (imported by virtual:#nitro-internal-virtual/public-assets): ENOENT: no such file or directory, stat '/home/nuxt/jp-gd/.output/public/social-card.png'
```

## 🔍 Analisis

**Penyebab:**
- File `social-card.png` ada di `public/social-card.png`
- Nitro mencoba mengakses file di `.output/public/social-card.png` sebelum file di-copy
- Timing issue: Nitro build process mencoba stat file sebelum public assets di-copy

**Dampak:**
- Build gagal dengan error ENOENT
- Nitro tidak bisa load virtual public assets data

## ✅ Solusi yang Diterapkan

### 1. ✅ Hook di nuxt.config.ts

Menambahkan hook `nitro:build:before` untuk:
- Memastikan `.output/public` directory ada
- Copy critical files (`social-card.png`, `landing-page.png`) sebelum Nitro mencoba mengaksesnya

**Lokasi:** `nuxt.config.ts` - hooks section

### 2. ✅ Script prepare-public-assets.js

Script untuk memastikan public assets siap sebelum build:
- Copy critical files dari `public/` ke `.output/public/`
- Handle missing files gracefully
- Log summary dari files yang di-copy

**File:** `scripts/prepare-public-assets.js`

**Cara penggunaan:**
```bash
node scripts/prepare-public-assets.js
```

Atau via npm:
```bash
npm run prepare:public-assets
```

### 3. ✅ Integrasi dengan Build Scripts

Build scripts diperbarui untuk:
- Auto-run `prepare-public-assets.js` sebelum build
- `build-ubuntu-no-warnings.sh` sudah diperbarui
- `build` script di package.json sudah diperbarui

## 📝 Detail Perbaikan

### Hook di nuxt.config.ts

```typescript
hooks: {
  // Ensure public assets exist before Nitro tries to access them
  'nitro:build:before'(nitro: any) {
    try {
      const fs = require('fs')
      const path = require('path')
      const publicDir = path.join(process.cwd(), 'public')
      const outputPublicDir = path.join(process.cwd(), '.output', 'public')
      
      // Ensure .output/public exists
      if (!fs.existsSync(outputPublicDir)) {
        fs.mkdirSync(outputPublicDir, { recursive: true })
      }
      
      // Copy critical files if they exist
      const criticalFiles = ['social-card.png', 'landing-page.png']
      
      for (const file of criticalFiles) {
        const sourceFile = path.join(publicDir, file)
        const destFile = path.join(outputPublicDir, file)
        
        if (fs.existsSync(sourceFile) && !fs.existsSync(destFile)) {
          try {
            fs.copyFileSync(sourceFile, destFile)
          } catch (e) {
            // Ignore copy errors, Nitro will handle it
          }
        }
      }
    } catch (e) {
      // Ignore errors - Nitro will handle public assets
    }
  }
}
```

### Script prepare-public-assets.js

Script ini:
1. **Membuat .output/public directory** jika belum ada
2. **Copy critical files** dari `public/` ke `.output/public/`:
   - `social-card.png`
   - `landing-page.png`
   - `favicon.ico`
   - `favicon-16x16.png`
   - `favicon-32x32.png`
   - `apple-touch-icon.png`
3. **Log summary** dari files yang di-copy/missing
4. **Handle errors gracefully** untuk missing files

## 🚀 Cara Menggunakan

### Otomatis (Recommended)

Build scripts sudah diperbarui untuk auto-run script ini:

```bash
# Build standard (auto-prepare public assets)
npm run build

# Build Ubuntu (auto-prepare public assets)
npm run build:ubuntu

# Build Ubuntu clean (auto-prepare public assets)
./build-ubuntu-no-warnings.sh
```

### Manual

Jika perlu run manual:

```bash
# Prepare public assets before build
npm run prepare:public-assets

# Or directly
node scripts/prepare-public-assets.js

# Then build
npm run build
```

## ✅ Verifikasi

Setelah perbaikan:
- ✅ File `social-card.png` akan di-copy ke `.output/public/` sebelum Nitro mencoba mengaksesnya
- ✅ Build tidak akan error dengan ENOENT untuk social-card.png
- ✅ Missing files di-handle dengan graceful (warning, bukan error)

## 🔍 Troubleshooting

Jika masih ada error:

1. **Check file exists in public/**
   ```bash
   ls -la public/social-card.png
   ```

2. **Check .output/public exists**
   ```bash
   ls -la .output/public/social-card.png
   ```

3. **Run prepare script manually**
   ```bash
   node scripts/prepare-public-assets.js
   ```

4. **Check permissions**
   ```bash
   chmod -R 755 public/
   ```

5. **Clean and retry**
   ```bash
   rm -rf .output
   node scripts/prepare-public-assets.js
   npm run build
   ```

## 📚 Related Files

- `nuxt.config.ts` - Hook untuk copy public assets before build
- `scripts/prepare-public-assets.js` - Script untuk prepare public assets
- `build-ubuntu-no-warnings.sh` - Build script dengan auto-prepare
- `nitroConfig.ts` - Nitro configuration (simplified)

## 🎉 Hasil

Setelah perbaikan:
- ✅ Build akan berjalan tanpa error ENOENT untuk social-card.png
- ✅ Public assets akan di-copy sebelum Nitro mencoba mengaksesnya
- ✅ Missing files di-handle dengan graceful
- ✅ Build output akan konsisten di Ubuntu VPS

---

**Status:** ✅ Fixed
**Last Updated:** $(date)


