# 🧪 Testing Update/Reload Popup System

## 🎯 Langkah-langkah Testing

### **Test 1: Normal Update Popup**

1. Buka aplikasi di browser
2. Buka Developer Console (F12)
3. Ketik dan enter:
   ```javascript
   window.triggerUpdate()
   ```

**Expected Result:**
- ✅ Popup muncul di tengah layar
- ✅ Background blur/gelap
- ✅ Icon refresh berputar
- ✅ Countdown mulai dari 30
- ✅ Progress ring berkurang
- ✅ Text "Otomatis reload dalam X detik"
- ✅ 2 tombol terlihat

---

### **Test 2: Tombol "Reload Sekarang"**

1. Trigger popup: `window.triggerUpdate()`
2. Klik tombol **"Reload Sekarang"**

**Expected Result:**
- ✅ Halaman langsung reload
- ✅ Attempt tersimpan di localStorage
- ✅ Tidak ada error di console

**Verify:**
```javascript
// Check attempts
JSON.parse(localStorage.getItem('jp_reload_attempts'))
// Should show array with 1 timestamp
```

---

### **Test 3: Tombol "Nanti Saja"**

1. Trigger popup: `window.triggerUpdate()`
2. Klik tombol **"Nanti Saja"**

**Expected Result:**
- ✅ Popup hilang/tutup
- ✅ Countdown berhenti
- ✅ Tidak ada reload
- ✅ Halaman tetap normal

---

### **Test 4: Auto Reload (30 detik)**

1. Trigger popup: `window.triggerUpdate()`
2. **JANGAN** klik apa-apa
3. Tunggu countdown sampai 0

**Expected Result:**
- ✅ Countdown berkurang setiap detik: 30 → 29 → 28 ... → 0
- ✅ Progress ring berkurang smooth
- ✅ Saat mencapai 0 → Halaman auto reload
- ✅ Attempt tersimpan

---

### **Test 5: Security - 3 Strike Rule**

**Scenario A: Test Rate Limiting**

1. Trigger dan reload (1x):
   ```javascript
   window.triggerUpdate()
   // Klik "Reload Sekarang"
   ```

2. Setelah page reload, trigger lagi (2x):
   ```javascript
   window.triggerUpdate()
   // Klik "Reload Sekarang"
   ```

3. Setelah page reload, trigger lagi (3x):
   ```javascript
   window.triggerUpdate()
   // Klik "Reload Sekarang"
   ```

4. Setelah page reload, trigger lagi (4x):
   ```javascript
   window.triggerUpdate()
   ```

**Expected Result:**
- ✅ Reload 1-3: Normal popup muncul
- ✅ Reload ke-4: **BLOCKED POPUP** muncul
- ✅ Icon berubah jadi shield warning
- ✅ Warna berubah jadi merah
- ✅ Text: "Terlalu Banyak Percobaan"
- ✅ Countdown block muncul
- ✅ Menunjukkan waktu remaining (hampir 1 jam)

**Verify:**
```javascript
// Check block status
console.log(localStorage.getItem('jp_block_until'))
// Should show timestamp 1 hour from now

// Check attempts count
JSON.parse(localStorage.getItem('jp_reload_attempts')).length
// Should be 3 or more
```

---

**Scenario B: Block Countdown**

1. Buat user ter-block (lakukan test scenario A)
2. Observe blocked popup

**Expected Result:**
- ✅ Countdown time menunjukkan "X jam X menit"
- ✅ Countdown berkurang setiap detik
- ✅ Format: "59 menit 59 detik" → "59 menit 58 detik"
- ✅ Icon clock berkedip/pulse
- ✅ Tidak ada tombol reload (disabled)

---

**Scenario C: Auto Unblock**

1. Buat user ter-block
2. Wait atau simulate time:
   ```javascript
   // Set block expired (untuk testing cepat)
   localStorage.setItem('jp_block_until', Date.now() - 1000)
   ```
3. Trigger popup:
   ```javascript
   window.triggerUpdate()
   ```

**Expected Result:**
- ✅ Block otomatis clear
- ✅ Popup normal muncul (bukan blocked)
- ✅ Reload attempts counter reset
- ✅ Bisa reload normal lagi

**Verify:**
```javascript
// Should be null/empty
console.log(localStorage.getItem('jp_block_until'))
console.log(localStorage.getItem('jp_reload_attempts'))
```

---

### **Test 6: Responsive Design**

**Desktop:**
1. Trigger popup di full screen
2. Check layout

**Expected:**
- ✅ Popup width max 600px
- ✅ Centered horizontal & vertical
- ✅ Buttons side by side
- ✅ Icon size besar
- ✅ Text readable

**Mobile:**
1. Resize browser ke mobile (DevTools)
2. Trigger popup

**Expected:**
- ✅ Popup fit screen dengan padding
- ✅ Buttons stacked (vertical)
- ✅ Icon size lebih kecil tapi masih jelas
- ✅ Text tidak terpotong
- ✅ Scrollable jika perlu

---

### **Test 7: Dark Mode**

1. Toggle dark mode di aplikasi
2. Trigger popup

**Expected:**
- ✅ Background dark
- ✅ Text color light
- ✅ Gradient tetap terlihat
- ✅ Icons visible
- ✅ Buttons contrast baik

---

### **Test 8: Browser Compatibility**

Test di:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Chrome
- [ ] Mobile Safari

**Expected:** Semua works perfect tanpa bug

---

### **Test 9: Performance**

1. Trigger popup
2. Check DevTools Performance tab

**Expected:**
- ✅ Smooth 60fps animation
- ✅ Tidak ada memory leak
- ✅ Countdown precise (1 detik = 1000ms)
- ✅ Tidak lag saat hover button

---

### **Test 10: Edge Cases**

**Test A: Multiple Triggers**
```javascript
window.triggerUpdate()
window.triggerUpdate()
window.triggerUpdate()
```

**Expected:**
- ✅ Only 1 popup shows
- ✅ Countdown tidak reset multiple times
- ✅ Tidak ada duplicate popups

---

**Test B: Trigger saat Blocked**
```javascript
// Set block
localStorage.setItem('jp_block_until', Date.now() + 3600000)
window.triggerUpdate()
```

**Expected:**
- ✅ Blocked popup muncul (bukan normal popup)
- ✅ Warning message clear
- ✅ Countdown block visible

---

**Test C: Corrupt LocalStorage**
```javascript
// Set invalid data
localStorage.setItem('jp_reload_attempts', 'invalid json')
localStorage.setItem('jp_block_until', 'not a number')
window.triggerUpdate()
```

**Expected:**
- ✅ Tidak crash
- ✅ Popup tetap muncul normal
- ✅ Error handled gracefully
- ✅ LocalStorage di-reset otomatis

---

## 📊 Test Results Template

```
Date: __________
Tester: __________
Browser: __________
Device: __________

[ ] Test 1: Normal Popup - PASS/FAIL
[ ] Test 2: Reload Sekarang - PASS/FAIL
[ ] Test 3: Nanti Saja - PASS/FAIL
[ ] Test 4: Auto Reload - PASS/FAIL
[ ] Test 5: Security 3 Strike - PASS/FAIL
[ ] Test 6: Responsive - PASS/FAIL
[ ] Test 7: Dark Mode - PASS/FAIL
[ ] Test 8: Browser Compat - PASS/FAIL
[ ] Test 9: Performance - PASS/FAIL
[ ] Test 10: Edge Cases - PASS/FAIL

Overall: PASS/FAIL
Notes: _______________
```

---

## 🐛 Common Issues & Solutions

### Issue: Popup tidak muncul
**Solution:**
```javascript
// Check console errors
// Clear localStorage
localStorage.clear()
location.reload()
```

### Issue: Countdown tidak berkurang
**Solution:**
```javascript
// Check interval running
// Refresh page
// Check browser console for errors
```

### Issue: Block tidak clear setelah 1 jam
**Solution:**
```javascript
// Manual clear
localStorage.removeItem('jp_block_until')
localStorage.removeItem('jp_reload_attempts')
```

### Issue: Multiple popups muncul
**Solution:**
- Seharusnya tidak terjadi
- Check component mounting multiple times
- Pastikan hanya 1 AppFooter component

---

## ✅ Final Checklist

Sebelum deploy ke production:

- [ ] Semua test PASS
- [ ] Tidak ada console errors
- [ ] Tidak ada memory leaks
- [ ] Works di semua browser target
- [ ] Responsive di semua screen sizes
- [ ] Dark mode works
- [ ] Security system works
- [ ] Auto unblock works
- [ ] LocalStorage handling correct
- [ ] Tidak ada infinite reload bug
- [ ] Performance optimal (60fps)
- [ ] Dokumentasi lengkap
- [ ] Tim sudah trained cara pakai

---

## 🎉 Testing Passed?

Jika semua test **PASS**, sistem siap digunakan! 🚀

**Next Steps:**
1. Deploy to staging
2. QA team testing
3. User acceptance testing
4. Deploy to production
5. Monitor logs & analytics

---

**Happy Testing! 🧪**

