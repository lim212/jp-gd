# Fix Missing Nuxt Assets

## Masalah
File assets Nuxt (`_nuxt/*.js`) tidak ditemukan setelah build. Error: `ENOENT: no such file or directory`

## Solusi

### 1. Clean Build
```bash
cd /home/nuxt/jasapembayaran-new

# Hapus semua build artifacts
rm -rf .output .nuxt node_modules/.cache

# Build ulang
npm run build
```

### 2. Verifikasi Build Output
```bash
# Cek apakah file assets ada
ls -la .output/public/_nuxt/ | head -20

# Jika folder tidak ada, cek struktur output
ls -la .output/
```

### 3. Jika Assets Tidak Ada
Kemungkinan build tidak lengkap. Coba:

```bash
# Build dengan verbose output
npm run build 2>&1 | tee build.log

# Cek apakah ada error di build.log
grep -i error build.log
```

### 4. Restart PM2
```bash
pm2 restart jasapembayaran-new
pm2 logs jasapembayaran-new --lines 50
```

### 5. Jika Masih Error
Mungkin perlu rebuild dengan clean install:

```bash
# Hapus node_modules dan reinstall
rm -rf node_modules package-lock.json
npm install

# Build ulang
npm run build
```

## Catatan
- Error `Object.entries` sudah teratasi ✅
- Sekarang masalahnya adalah missing assets
- Pastikan build berhasil dan file assets ter-copy ke `.output/public/_nuxt/`

