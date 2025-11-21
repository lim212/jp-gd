# ✅ Quick Test Guide - Floating Buttons

## 🚀 How to Test

### 1. Start Development Server
```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
```

### 2. Open Browser
```
http://localhost:3000
```

### 3. Look at Bottom-Left Corner
Anda harus melihat 3 button:
- 🔼 Scroll Up (Orange di light mode, Blue di dark mode)
- 🔽 Scroll Down (Orange di light mode, Blue di dark mode)
- 💬 WhatsApp (Green di light mode, Emerald di dark mode)

---

## ✨ Testing Checklist

### Visual Tests

#### Light Mode (Default)
- [ ] **Scroll Up**: Orange gradient (#f97316 → #fb923c)
- [ ] **Scroll Down**: Orange gradient (#f97316 → #fb923c)
- [ ] **WhatsApp**: Green gradient (#25d366 → #20ba5a)
- [ ] **Online Indicator**: Green dot berkedip
- [ ] **Position**: Bottom-left corner (16px dari edge)
- [ ] **Shadows**: Soft shadows terlihat

#### Dark Mode
Toggle dark mode dengan:
- Ctrl/Cmd + Switch di header
- Atau tombol dark mode di website

Lalu check:
- [ ] **Scroll Up**: Blue gradient (#3b82f6 → #60a5fa)
- [ ] **Scroll Down**: Blue gradient (#3b82f6 → #60a5fa)
- [ ] **WhatsApp**: Emerald gradient (#059669 → #10b981)
- [ ] **Online Indicator**: Light emerald berkedip
- [ ] **Shadows**: Stronger shadows untuk visibility
- [ ] **Contrast**: Buttons jelas terlihat di dark background

---

### Interaction Tests

#### Hover Effects
- [ ] **Hover Scroll Up**:
  - [ ] Button naik 4px
  - [ ] Scale 1.08x
  - [ ] Glow effect muncul
  - [ ] Tooltip "Ke Atas" muncul di kanan
  - [ ] Icon membesar 1.15x
  
- [ ] **Hover Scroll Down**:
  - [ ] Button naik 4px
  - [ ] Scale 1.08x
  - [ ] Glow effect muncul
  - [ ] Tooltip "Ke Bawah" muncul di kanan
  - [ ] Icon membesar 1.15x
  
- [ ] **Hover WhatsApp**:
  - [ ] Button naik 4px
  - [ ] Scale 1.08x
  - [ ] Glow effect muncul
  - [ ] Tooltip "WhatsApp" muncul di kanan
  - [ ] Icon membesar 1.15x + rotate 5°

#### Click/Active Effects
- [ ] **Click Scroll Up**:
  - [ ] Button turun 2px (pressed effect)
  - [ ] Scale 1.02x
  - [ ] Halaman scroll ke atas dengan smooth
  
- [ ] **Click Scroll Down**:
  - [ ] Button turun 2px (pressed effect)
  - [ ] Scale 1.02x
  - [ ] Halaman scroll ke bawah dengan smooth
  
- [ ] **Click WhatsApp**:
  - [ ] Button turun 2px (pressed effect)
  - [ ] Scale 1.02x
  - [ ] Buka WhatsApp di tab baru
  - [ ] URL benar dengan nomor & pesan

---

### Animation Tests

#### Float Animation
- [ ] Semua buttons float naik-turun gentle
- [ ] Duration 4 detik per cycle
- [ ] WhatsApp delay 0.5s (tidak bersamaan)
- [ ] Smooth cubic-bezier transition

#### Pulse Animation
- [ ] Online indicator (green dot) berkedip
- [ ] Scale 1 → 1.1 → 1
- [ ] Opacity 1 → 0.8 → 1
- [ ] Duration 2 detik per cycle
- [ ] Infinite loop

#### Slide Animation
Scroll ke bawah lalu kembali ke atas untuk test:
- [ ] Scroll Up button slide in dari bawah saat muncul
- [ ] Scroll Down button slide out ke bawah saat hilang
- [ ] Duration 300ms
- [ ] Smooth transition

---

### Functional Tests

#### Scroll Behavior
- [ ] **Scroll Up**: 
  - [ ] Muncul saat scroll > 50px
  - [ ] Hilang saat di top (< 50px)
  - [ ] Click scroll ke top dengan smooth
  
- [ ] **Scroll Down**:
  - [ ] Muncul saat belum di bottom
  - [ ] Hilang saat hampir di bottom (< 50px dari bottom)
  - [ ] Click scroll ke bottom dengan smooth
  
- [ ] **WhatsApp**:
  - [ ] Selalu muncul di homepage
  - [ ] TIDAK muncul di /blog
  - [ ] TIDAK muncul di /blog/[slug]
  - [ ] Link benar ke WhatsApp

---

### Responsive Tests

#### Desktop (> 1024px)
- [ ] Scroll buttons: 56px × 56px
- [ ] WhatsApp button: 64px × 64px
- [ ] Gap between: 12px
- [ ] Tooltips muncul saat hover
- [ ] All animations smooth

#### Tablet (640px - 1024px)
- [ ] Scroll buttons: 56px × 56px
- [ ] WhatsApp button: 64px × 64px
- [ ] Gap between: 12px
- [ ] Tooltips muncul saat hover
- [ ] All animations smooth

#### Mobile (< 640px)
- [ ] Scroll buttons: 48px × 48px
- [ ] WhatsApp button: 56px × 56px
- [ ] Gap between: 12px
- [ ] Icons smaller (20px & 24px)
- [ ] Tooltips TIDAK muncul (hidden)
- [ ] Touch-friendly size
- [ ] No overlap dengan konten

---

### Accessibility Tests

#### Keyboard Navigation
- [ ] Tab bisa fokus ke buttons
- [ ] Focus visible dengan outline
- [ ] Light mode: Blue outline (#3b82f6)
- [ ] Dark mode: Light blue outline (#60a5fa)
- [ ] Enter/Space untuk klik
- [ ] Outline offset 4px

#### Screen Reader
- [ ] Scroll Up: ARIA label "Scroll to top"
- [ ] Scroll Down: ARIA label "Scroll to bottom"
- [ ] WhatsApp: ARIA label "Hubungi kami via WhatsApp"
- [ ] Title attributes ada
- [ ] Semantic HTML (button & a tags)

#### Reduced Motion
Enable "Reduce Motion" di OS:
- Windows: Settings > Ease of Access > Display
- Mac: System Preferences > Accessibility > Display

Lalu check:
- [ ] Float animation TIDAK ada
- [ ] Pulse animation TIDAK ada
- [ ] Slide animation TIDAK ada
- [ ] Hover transitions tetap ada (tapi instant)

---

### Browser Compatibility

#### Chrome/Edge
- [ ] All features work
- [ ] Gradients smooth
- [ ] Shadows correct
- [ ] Animations smooth

#### Firefox
- [ ] All features work
- [ ] Gradients smooth
- [ ] Shadows correct
- [ ] Animations smooth
- [ ] Backdrop-filter support

#### Safari
- [ ] All features work
- [ ] Gradients smooth
- [ ] Shadows correct
- [ ] Animations smooth
- [ ] -webkit-backdrop-filter works

#### Mobile Browsers
- [ ] Chrome Mobile
- [ ] Safari Mobile
- [ ] Firefox Mobile
- [ ] Samsung Internet
- [ ] Touch events work
- [ ] Haptic feedback (if supported)

---

### Performance Tests

#### CPU Usage
- [ ] Float animation tidak heavy
- [ ] Pulse animation tidak heavy
- [ ] Hover smooth (no lag)
- [ ] Click responsive

#### Memory
- [ ] No memory leaks saat hover repeatedly
- [ ] No memory leaks saat scroll
- [ ] Event listeners cleaned up

#### Network
- [ ] No external dependencies
- [ ] SVG inline (no requests)
- [ ] CSS scoped (minimal bundle impact)

---

## 🐛 Common Issues & Solutions

### Issue 1: Buttons Tidak Terlihat
**Solution:**
- Check console untuk errors
- Pastikan `ChatWhatsapp` component imported di layout
- Check z-index conflicts
- Hard refresh (Ctrl + Shift + R)

### Issue 2: Warna Tidak Berubah di Dark Mode
**Solution:**
- Check dark mode toggle works
- Inspect element untuk `.dark` class di html/body
- Clear browser cache
- Check CSS specificity

### Issue 3: Hover Effect Tidak Smooth
**Solution:**
- Check browser hardware acceleration
- Disable browser extensions
- Test di incognito mode
- Check GPU usage

### Issue 4: Tooltip Tidak Muncul
**Solution:**
- Check screen size (hidden di mobile)
- Test hover dengan mouse (not touch)
- Inspect element untuk opacity
- Check tooltip positioning

### Issue 5: WhatsApp Link Tidak Bekerja
**Solution:**
- Check `whatsappPhone` di config
- Check `whatsappMessage` di config
- Check URL format
- Test di different browser

---

## 📸 Screenshots Checklist

Take screenshots for documentation:

### Light Mode
- [ ] Normal state (all 3 buttons)
- [ ] Hover state (with tooltip)
- [ ] Active state (pressed)
- [ ] Mobile view
- [ ] Tablet view
- [ ] Desktop view

### Dark Mode
- [ ] Normal state (all 3 buttons)
- [ ] Hover state (with tooltip)
- [ ] Active state (pressed)
- [ ] Mobile view
- [ ] Tablet view
- [ ] Desktop view

### Animations
- [ ] Float animation (GIF/Video)
- [ ] Pulse animation (GIF/Video)
- [ ] Slide animation (GIF/Video)
- [ ] Hover transition (GIF/Video)

---

## ✅ Final Verification

Before marking as complete:

- [ ] All visual tests pass
- [ ] All interaction tests pass
- [ ] All animation tests pass
- [ ] All functional tests pass
- [ ] All responsive tests pass
- [ ] All accessibility tests pass
- [ ] All browser tests pass
- [ ] All performance tests pass
- [ ] No console errors
- [ ] No console warnings
- [ ] Screenshots taken
- [ ] Documentation complete

---

## 🎯 Quick Test Commands

### Start Server
```bash
npm run dev
```

### Open Browser
```bash
# Auto-open default browser
npm run dev -- --open

# Or manually:
open http://localhost:3000
```

### Test Dark Mode
```bash
# Toggle dark mode di browser:
- Look for dark mode switch
- Or press keyboard shortcut (if available)
```

### Test Mobile
```bash
# Chrome DevTools:
1. F12 atau Ctrl+Shift+I
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select mobile device
4. Test interactions
```

### Test Performance
```bash
# Chrome DevTools:
1. F12
2. Performance tab
3. Start recording
4. Interact with buttons
5. Stop recording
6. Analyze flame chart
```

---

## 🎉 Success Criteria

✅ All buttons visible di pojok kiri bawah  
✅ Colors correct di light & dark mode  
✅ Hover effects smooth & attractive  
✅ Click functions work correctly  
✅ Animations smooth & gentle  
✅ Responsive di all screen sizes  
✅ Accessible via keyboard  
✅ No console errors  
✅ Performance optimal  
✅ Cross-browser compatible  

---

**Happy Testing!** 🚀

*Pastikan semua test pass sebelum production deployment* ✨

