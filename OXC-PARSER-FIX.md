# ✅ Perbaikan oxc-parser Native Binding Error

## 🎯 Masalah

Error saat build di Ubuntu VPS:
```
ERROR  Cannot find native binding. npm has a bug related to optional dependencies (https://github.com/npm/cli/issues/4828).
Please try npm i again after removing both package-lock.json and node_modules directory.

Cannot find module '@oxc-parser/binding-linux-x64-gnu'
Cannot find module './parser.linux-x64-gnu.node'
```

## 🔍 Analisis

**Penyebab:**
- `oxc-parser` adalah dependency dari Nuxt 3.20+ yang memerlukan native bindings
- npm tidak menginstal optional dependencies dengan benar (bug npm issue #4828)
- Native binding untuk platform Linux tidak terinstal

**Dampak:**
- Build gagal di Ubuntu VPS
- Error terjadi saat Nuxt mencoba load oxc-parser

## ✅ Solusi

### 1. Script Otomatis (Recommended)

**File:** `scripts/fix-oxc-parser.sh`

Script ini akan:
- Membersihkan npm cache dan lock files
- Menginstal native binding untuk platform Linux yang terdeteksi
- Menginstal ulang dependencies dengan optional dependencies enabled
- Memverifikasi instalasi

**Cara penggunaan:**
```bash
chmod +x scripts/fix-oxc-parser.sh
./scripts/fix-oxc-parser.sh
```

### 2. Manual Fix

**Metode 1: Clean Install**
```bash
# Hapus node_modules dan package-lock.json
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force

# Install dengan optional dependencies enabled
npm install --no-optional=false
```

**Metode 2: Install Native Binding Explicitly**
```bash
# Untuk x86_64 Linux
npm install --save-optional "@oxc-parser/binding-linux-x64-gnu"

# Untuk ARM64 Linux
npm install --save-optional "@oxc-parser/binding-linux-arm64-gnu"

# Lalu reinstall dependencies
npm install --no-optional=false
```

**Metode 3: Force Reinstall oxc-parser**
```bash
# Uninstall oxc-parser
npm uninstall oxc-parser

# Reinstall dengan optional dependencies
npm install --no-optional=false oxc-parser

# Verify
npm list oxc-parser
```

### 3. Integrasi dengan Build Script

Script `build-ubuntu-no-warnings.sh` sudah diperbarui untuk:
- Otomatis menjalankan fix-oxc-parser.sh sebelum build
- Fallback ke manual fix jika script tidak ditemukan

## 🔧 Detil Perbaikan

### Script fix-oxc-parser.sh

Script akan:
1. **Deteksi platform** - Mengidentifikasi architecture (x86_64 atau ARM64)
2. **Clean npm cache** - Menghapus package-lock.json dan cache
3. **Install native binding** - Menginstal binding untuk platform yang terdeteksi
4. **Reinstall dependencies** - Menginstal ulang dengan `--no-optional=false`
5. **Verifikasi** - Memastikan oxc-parser dan native binding terinstal

### Platform Support

- ✅ Linux x86_64 (GNU) - `@oxc-parser/binding-linux-x64-gnu`
- ✅ Linux ARM64 (GNU) - `@oxc-parser/binding-linux-arm64-gnu`

## 📋 Checklist Troubleshooting

Jika masih error setelah fix:

1. **Check Node.js version**
   ```bash
   node --version  # Harus 18+
   ```

2. **Check npm version**
   ```bash
   npm --version  # Harus 9+
   ```

3. **Verify oxc-parser installation**
   ```bash
   npm list oxc-parser
   npm list @oxc-parser/binding-linux-x64-gnu
   ```

4. **Check node_modules structure**
   ```bash
   ls -la node_modules/oxc-parser/
   ls -la node_modules/@oxc-parser/ 2>/dev/null || echo "Not found"
   ```

5. **Try alternative: Install oxc-parser directly**
   ```bash
   npm install --no-optional=false --force
   npm rebuild oxc-parser
   ```

6. **Nuclear option: Complete clean**
   ```bash
   rm -rf node_modules package-lock.json
   npm cache clean --force
   npm install --no-optional=false --force
   ```

## 🚀 Integrasi dengan Build Process

### Build Script Ubuntu

Script `build-ubuntu-no-warnings.sh` sudah diperbarui untuk:
- ✅ Otomatis fix oxc-parser sebelum build
- ✅ Handle error gracefully
- ✅ Continue build jika fix berhasil

### Manual Build

Jika menggunakan build manual:
```bash
# Fix oxc-parser first
./scripts/fix-oxc-parser.sh

# Then build
npm run build:ubuntu
```

## 🔍 Verification

Setelah fix, verifikasi:
```bash
# Check oxc-parser exists
npm list oxc-parser

# Try to require oxc-parser (should not error)
node -e "require('oxc-parser'); console.log('✅ oxc-parser loaded successfully')"
```

## 📝 Notes

- **Native bindings adalah optional** - oxc-parser bisa berjalan tanpa native binding (tapi lebih lambat)
- **npm bug #4828** - Masalah dengan optional dependencies, sudah diketahui oleh npm team
- **Workaround** - Menggunakan `--no-optional=false` memaksa npm untuk menginstal optional dependencies

## 🆘 Jika Masih Error

1. Check error message dengan detail
2. Verify platform detection: `uname -m`
3. Try installing specific binding: `npm install --save-optional @oxc-parser/binding-linux-x64-gnu`
4. Check npm logs: `npm install --loglevel=verbose`
5. Try different npm version or use yarn/pnpm as alternative

## 📚 Related Files

- `scripts/fix-oxc-parser.sh` - Script untuk fix oxc-parser
- `build-ubuntu-no-warnings.sh` - Build script dengan auto-fix
- `UBUNTU-BUILD-CHECKLIST.md` - Checklist build Ubuntu

---

**Status:** ✅ Fixed
**Last Updated:** $(date)

