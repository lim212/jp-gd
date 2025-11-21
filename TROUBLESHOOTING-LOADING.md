# 🔧 TROUBLESHOOTING - Super Loading Screen

## ❓ Loading Screen Tidak Muncul

### **Langkah 1: Check Console Browser**

1. Buka browser (Chrome/Firefox)
2. Tekan F12 untuk DevTools
3. Tab "Console"
4. Refresh halaman (Ctrl+R)
5. Lihat logs:

**Expected logs:**
```
🚀 Super Loading Screen initialized: { showLoader: true, appReady: false }
✅ Loading completed!
```

**Jika tidak ada log:**
- Component tidak ter-load
- Check langkah 2

**Jika ada error merah:**
- Lihat error message
- Check langkah 3

---

### **Langkah 2: Check File Exists**

Pastikan files ada:

```bash
# Check component
dir app\components\SuperLoadingScreen.vue

# Check plugin
dir plugins\smart-resource-tracker.client.ts

# Check CSS
dir app\assets\css\super-loading-screen.css
```

**Expected output:**
- ✅ Semua file ada
- ❌ File missing → Re-create file

---

### **Langkah 3: Check Import Errors**

Buka file `app/app.vue` dan pastikan:

```vue
<script setup lang="ts">
import SuperLoadingScreen from './components/SuperLoadingScreen.vue';

const showLoader = ref(true);  // ← Harus true
const appReady = ref(false);   // ← Harus false
</script>

<template>
  <SuperLoadingScreen 
    v-if="showLoader"          // ← Check ini
    :is-visible="showLoader"
    @complete="handleLoaderComplete"
  />
  
  <UApp v-show="appReady">     // ← Harus v-show, bukan v-if
    <!-- Content -->
  </UApp>
</template>
```

---

### **Langkah 4: Hard Refresh**

1. Clear cache browser
2. Hard refresh:
   - **Chrome/Firefox:** Ctrl + Shift + R
   - **Safari:** Cmd + Shift + R

---

### **Langkah 5: Check Dev Server**

```bash
# Stop server (Ctrl+C)
# Start fresh
npm run dev
```

Lihat output untuk errors.

---

### **Langkah 6: Manual Test**

Tambahkan di `app/app.vue`:

```vue
<script setup>
// Debug: Force show loader
onMounted(() => {
  console.log('Mounted - showLoader:', showLoader.value);
  console.log('Mounted - appReady:', appReady.value);
});
</script>

<template>
  <!-- Debug: Always show -->
  <div v-if="showLoader" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: red; z-index: 99999;">
    <h1 style="color: white; text-align: center; padding-top: 50vh;">
      LOADING TEST - If you see this, showLoader is TRUE
    </h1>
  </div>
</template>
```

**Jika muncul layar merah:**
- ✅ showLoader working
- Problem di SuperLoadingScreen component

**Jika tidak muncul:**
- ❌ showLoader tidak working
- Check reactive state

---

## 🐛 Common Issues

### **Issue 1: Component Not Found**

**Error:**
```
Cannot find module './components/SuperLoadingScreen.vue'
```

**Solution:**
```bash
# Check file path
dir app\components\SuperLoadingScreen.vue

# If missing, recreate it
# Copy from backup or template
```

---

### **Issue 2: CSS Not Loading**

**Symptoms:**
- Loading screen muncul tapi tidak ada style
- Background putih/hitam polos

**Solution:**

Check `app/app.vue`:
```vue
<style>
@import url('./assets/css/super-loading-screen.css');
</style>
```

Check CSS file exists:
```bash
dir app\assets\css\super-loading-screen.css
```

---

### **Issue 3: Blank Screen**

**Symptoms:**
- Loading muncul
- Tidak selesai
- Stuck di loading

**Solution:**

Add timeout fallback:

```vue
<script setup>
// Auto-complete after 10 seconds
onMounted(() => {
  setTimeout(() => {
    if (showLoader.value) {
      console.warn('⚠️ Loading timeout - forcing complete');
      handleLoaderComplete();
    }
  }, 10000); // 10 seconds
});
</script>
```

---

### **Issue 4: Smart Mode Not Activating**

**Symptoms:**
- Loading > 5 seconds
- Smart mode badge tidak muncul

**Solution:**

Check `SuperLoadingScreen.vue`:
```javascript
// Should have timer
setTimeout(() => {
  if (totalProgress.value < 100) {
    activateSmartMode();
  }
}, props.smartModeDelay) // Check this value
```

Test with slow network:
1. DevTools (F12)
2. Network tab
3. Select "Slow 3G"
4. Refresh

---

### **Issue 5: Skip Button Not Working**

**Symptoms:**
- Click skip button
- Tidak terjadi apa-apa

**Solution:**

Check event handler:
```vue
<template>
  <button @click="skipToContent">  <!-- ← Check this -->
    Langsung Masuk
  </button>
</template>

<script setup>
const skipToContent = () => {
  emit('skip')      // ← Emit event
  emit('complete')  // ← Also emit complete
}
</script>
```

Check parent handler:
```vue
<!-- app.vue -->
<SuperLoadingScreen
  @skip="handleLoaderSkip"  <!-- ← Handler ada? -->
/>
```

---

## 🔍 Debug Checklist

- [ ] Files exist (component, plugin, CSS)
- [ ] No console errors
- [ ] Import statements correct
- [ ] `showLoader` is `true` on mount
- [ ] `appReady` is `false` on mount
- [ ] `v-if="showLoader"` on component
- [ ] `v-show="appReady"` on UApp
- [ ] CSS imported
- [ ] Dev server running
- [ ] Hard refresh done

---

## 🚀 Quick Fix

**Jika semua gagal, coba ini:**

1. **Backup current app.vue**
   ```bash
   copy app\app.vue app\app.vue.backup
   ```

2. **Simplify to minimal**
   ```vue
   <script setup lang="ts">
   import { ref } from 'vue'
   import SuperLoadingScreen from './components/SuperLoadingScreen.vue'
   
   const showLoader = ref(true)
   const appReady = ref(false)
   
   const handleLoaderComplete = () => {
     showLoader.value = false
     appReady.value = true
   }
   </script>
   
   <template>
     <SuperLoadingScreen 
       v-if="showLoader"
       :is-visible="showLoader"
       @complete="handleLoaderComplete"
     />
     
     <div v-show="appReady">
       <h1>App Loaded!</h1>
     </div>
   </template>
   ```

3. **Test minimal version**

4. **If works, gradually add back features**

---

## 📞 Still Not Working?

### **Collect Debug Info:**

```javascript
// Add to app.vue
console.log('=== DEBUG INFO ===');
console.log('showLoader:', showLoader.value);
console.log('appReady:', appReady.value);
console.log('Component imported:', !!SuperLoadingScreen);
console.log('Environment:', process.client ? 'client' : 'server');
```

### **Check Browser:**
- Browser version
- Extensions disabled?
- JavaScript enabled?
- Cookies enabled?

### **Check Network:**
```bash
# Test localhost
curl http://localhost:3000

# Check port
netstat -ano | findstr :3000
```

---

## ✅ Expected Behavior

### **Normal Flow:**

```
1. Page loads
   ↓
2. showLoader = true (Loading screen muncul)
   ↓
3. Resources loading (0% → 100%)
   ↓
4. @complete event fires
   ↓
5. showLoader = false, appReady = true
   ↓
6. Loading screen fade out
   ↓
7. Main app muncul
```

### **Smart Mode Flow:**

```
1. Page loads
   ↓
2. Loading screen muncul
   ↓
3. Loading > 5 seconds
   ↓
4. Smart mode badge muncul
   ↓
5. Progressive loading aktif
   ↓
6. Skip button muncul
   ↓
7. User can:
   a) Wait → auto complete
   b) Click skip → instant complete
```

---

## 🎯 Success Indicators

Jika berhasil, Anda akan lihat:

1. ✅ Loading screen muncul instantly
2. ✅ Animated background (waves, particles)
3. ✅ Logo dengan pulse animation
4. ✅ Progress bar bergerak 0% → 100%
5. ✅ Resource cards update status
6. ✅ Statistics update real-time
7. ✅ Tips rotate setiap 3 detik
8. ✅ (Optional) Smart mode badge setelah 5 detik
9. ✅ Smooth fade out transition
10. ✅ Main app muncul

---

## 📝 Console Logs to Expect

**Successful loading:**
```
🚀 Super Loading Screen initialized: { showLoader: true, appReady: false }
📊 Resources: { css: {...}, js: {...}, ... }
⚡ Progressive loading active
✅ Loading completed!
✅ Page loaded in 3542ms
```

**With smart mode:**
```
🚀 Super Loading Screen initialized: { showLoader: true, appReady: false }
📊 Resources: { css: {...}, js: {...}, ... }
🚀 Smart Mode Activated - Progressive loading enabled
⚡ Progressive Loading Strategy: [...]
📦 Loading css: /path/to/file.css
📦 Loading js: /path/to/file.js
✅ Progressive loading completed
✅ Loading completed!
```

**With skip:**
```
🚀 Super Loading Screen initialized: { showLoader: true, appReady: false }
🚀 Smart Mode Activated
⏭️ Loading skipped by user
✅ Loading completed!
```

---

## 🔄 Reset Everything

Jika benar-benar stuck:

```bash
# 1. Stop server
Ctrl+C

# 2. Clear node_modules
rmdir /s /q node_modules

# 3. Clear cache
rmdir /s /q .nuxt
rmdir /s /q dist

# 4. Reinstall
npm install

# 5. Fresh start
npm run dev
```

---

**Good luck! 🍀**

