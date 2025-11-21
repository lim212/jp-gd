# 🧪 Test Guide - Blog Cards Homepage

## 🎯 Quick Test Checklist

### 1. **Visual Test - Desktop (1024px+)**

#### Blog Section Header
- [ ] Badge "📚 BLOG & ARTIKEL" muncul dengan decorative lines
- [ ] Judul "Artikel & Tips Terbaru" tampil dengan gradient
- [ ] Pulse decoration beranimasi di sudut judul
- [ ] Subtitle menjelaskan tentang blog dengan keywords highlighted
- [ ] Background blur effects visible (subtle)

#### Stats Cards
- [ ] 4 cards tampil dalam 1 baris
- [ ] Card "500+ Artikel" → gradient biru
- [ ] Card "15+ Kategori" → gradient ungu
- [ ] Card "50K+ Pembaca" → gradient hijau
- [ ] Card "Daily Update" → gradient oranye
- [ ] Hover effect: scale up + shadow enhancement
- [ ] Dark mode: colors adjust properly

#### CTA Button
- [ ] Button "Lihat Semua Artikel" tampil centered
- [ ] Gradient biru-cyan-indigo
- [ ] Arrow icon tampil
- [ ] Hover: gradient darkens + scale up + shadow enhance
- [ ] Klik membawa ke `/blog` page

#### Blog Cards
- [ ] 8 blog cards tampil dalam grid 4 kolom
- [ ] Gambar featured_image load dengan benar
- [ ] Judul artikel tampil lengkap
- [ ] Tanggal publish tampil
- [ ] Hover: card lift up + shadow enhance
- [ ] Klik membawa ke artikel detail

---

### 2. **Visual Test - Tablet (768px - 1024px)**

#### Header
- [ ] Judul resize ke text-5xl
- [ ] Stats cards tetap 4 kolom (atau adjust ke 2x2 di 768px)
- [ ] Spacing adjust properly

#### Blog Cards
- [ ] Grid adjust ke 3 kolom
- [ ] Cards tidak terlalu lebar
- [ ] Gap proporsional

---

### 3. **Visual Test - Mobile (< 768px)**

#### Header
- [ ] Judul resize ke text-3xl atau 4xl
- [ ] Stats cards jadi 2 kolom (2x2 grid)
- [ ] Cards tidak terlalu kecil, text readable
- [ ] CTA button full width atau centered

#### Blog Cards
- [ ] Grid jadi 1 kolom di < 480px
- [ ] Grid jadi 2 kolom di 480px - 768px
- [ ] Cards touch-friendly
- [ ] Scroll smooth

---

### 4. **Dark Mode Test**

#### Colors
- [ ] Background gradients adjust (darker, lower opacity)
- [ ] Text colors switch (white/slate-300)
- [ ] Stats cards backgrounds darken
- [ ] Borders adjust (blue-700/30 instead of blue-200/50)
- [ ] Gradient text still visible and vibrant

#### Contrast
- [ ] All text readable
- [ ] No color clash
- [ ] Hover states still clear

---

### 5. **Performance Test**

#### Lazy Loading
- [ ] Blog section lazy loads when scrolling down
- [ ] Skeleton placeholder appears during load
- [ ] Fade animation smooth when content appears

#### Images
- [ ] Featured images lazy load
- [ ] Loading spinner or placeholder shows
- [ ] Images don't cause layout shift

#### Animations
- [ ] Hover animations smooth (no jank)
- [ ] Transitions 300ms feels right
- [ ] No excessive repaints

---

### 6. **Functionality Test**

#### Navigation
- [ ] CTA button links to `/blog` page
- [ ] Blog card clicks navigate to `/blog/[slug]`
- [ ] Browser back button works
- [ ] No 404 errors

#### Data Loading
- [ ] 8 artikel terbaru muncul (sesuai limit)
- [ ] Data fetch dari API berhasil
- [ ] Fallback seeds muncul jika API gagal
- [ ] Error handling graceful

#### Props
- [ ] `mode="home"` applied correctly
- [ ] `:limit="8"` respected
- [ ] Component renders in homepage context

---

### 7. **Accessibility Test**

#### Semantic HTML
- [ ] Section has proper structure
- [ ] Headings hierarchical (h2 for main title)
- [ ] Links have proper aria-labels
- [ ] Images have alt text

#### Keyboard Navigation
- [ ] Tab through stats cards
- [ ] Tab to CTA button
- [ ] Tab to blog cards
- [ ] Enter activates links
- [ ] Focus visible with outline

#### Screen Reader
- [ ] Section announced properly
- [ ] Stats read correctly ("500+ Artikel")
- [ ] CTA button text clear
- [ ] Blog cards have accessible names

---

### 8. **Cross-Browser Test**

#### Chrome/Edge
- [ ] All gradients render
- [ ] Blur effects work
- [ ] Animations smooth

#### Firefox
- [ ] Gradients display correctly
- [ ] backdrop-filter works
- [ ] No layout issues

#### Safari
- [ ] -webkit-background-clip works
- [ ] Blur effects supported
- [ ] Mobile Safari scrolling smooth

---

## 🚀 How to Test

### Start Development Server:
```bash
npm run dev
```

### Open Browser:
```
http://localhost:3000
```

### Navigate to Homepage:
- Scroll down past FAQ section
- Blog section should appear
- Check all elements above

### Test Dark Mode:
- Toggle dark mode switch
- Verify colors adjust

### Test Responsive:
- Open DevTools
- Toggle device toolbar
- Test at: 320px, 375px, 768px, 1024px, 1440px

### Test Interactions:
- Hover over stats cards
- Hover over CTA button
- Click CTA → should go to `/blog`
- Click blog card → should go to article

---

## 🐛 Common Issues & Fixes

### Issue 1: Blog cards tidak muncul
**Symptom:** Section header muncul, tapi tidak ada cards
**Fix:**
```bash
# Check API endpoint
curl http://localhost:3000/api/blog

# Check browser console for errors
# Pastikan BlogListComponent di-import dengan benar
```

### Issue 2: Stats cards layout broken
**Symptom:** Cards tidak dalam grid 2x2 atau 4 cols
**Fix:**
```css
/* Verify Tailwind classes applied */
grid-cols-2 md:grid-cols-4
/* Check if CSS file loaded */
```

### Issue 3: Gradients tidak tampil
**Symptom:** Text hitam/putih polos, tidak ada gradient
**Fix:**
```css
/* Verify bg-clip-text utility */
background-clip: text;
-webkit-background-clip: text;
color: transparent;
```

### Issue 4: Dark mode tidak switch
**Symptom:** Colors tidak berubah saat toggle dark mode
**Fix:**
```vue
<!-- Verify dark: prefix in classes -->
dark:from-slate-800 dark:via-blue-900/20
```

### Issue 5: Hover effects tidak smooth
**Symptom:** Animations jittery atau instant
**Fix:**
```css
/* Verify transition classes */
transition-all duration-300
/* Check for conflicting CSS */
```

### Issue 6: Mobile layout broken
**Symptom:** Cards terlalu kecil atau terlalu besar
**Fix:**
```vue
<!-- Check responsive classes -->
text-3xl sm:text-4xl md:text-5xl lg:text-6xl
grid-cols-2 md:grid-cols-4
```

### Issue 7: Images tidak load
**Symptom:** Broken image icons atau 404
**Fix:**
```javascript
// Check featured_image path di data
// Verify getSafeImage() function
// Check public/ folder atau external URLs
```

### Issue 8: Lazy loading tidak trigger
**Symptom:** Content tidak muncul saat scroll
**Fix:**
```vue
<!-- Check AdvancedLazySection props -->
rootMargin="0px 0px 400px 0px"
<!-- Verify IntersectionObserver support -->
```

---

## ✅ Expected Results

### Desktop View (1440px):
```
┌─────────────────────────────────────────────┐
│         📚 BLOG & ARTIKEL                   │
│                                             │
│     Artikel & Tips Terbaru (huge title)    │
│     Temukan panduan lengkap... (subtitle)  │
│                                             │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐      │
│  │ 500+ │ │ 15+  │ │ 50K+ │ │Daily │      │
│  │Artikel│Kategori│Pembaca│Update│      │
│  └──────┘ └──────┘ └──────┘ └──────┘      │
│                                             │
│      [Lihat Semua Artikel →]               │
│                                             │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐               │
│  │IMG │ │IMG │ │IMG │ │IMG │               │
│  │Tile│ │Tile│ │Tile│ │Tile│               │
│  └────┘ └────┘ └────┘ └────┘               │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐               │
│  │IMG │ │IMG │ │IMG │ │IMG │               │
│  │Tile│ │Tile│ │Tile│ │Tile│               │
│  └────┘ └────┘ └────┘ └────┘               │
└─────────────────────────────────────────────┘
```

### Mobile View (375px):
```
┌───────────────────┐
│  📚 BLOG & ARTIKEL│
│                   │
│  Artikel & Tips   │
│  Terbaru          │
│  (smaller title)  │
│                   │
│  Temukan panduan  │
│  lengkap...       │
│                   │
│  ┌──────┬──────┐  │
│  │ 500+ │ 15+  │  │
│  │Artikel│Kateg│  │
│  ├──────┼──────┤  │
│  │ 50K+ │Daily │  │
│  │Pembaca│Update│  │
│  └──────┴──────┘  │
│                   │
│  [Lihat Semua]    │
│                   │
│  ┌────┐ ┌────┐    │
│  │IMG │ │IMG │    │
│  │Tile│ │Tile│    │
│  └────┘ └────┘    │
│  ┌────┐ ┌────┐    │
│  │IMG │ │IMG │    │
│  │Tile│ │Tile│    │
│  └────┘ └────┘    │
│  (continues...)   │
└───────────────────┘
```

---

## 📊 Performance Metrics

### Target Metrics:
- **First Paint:** < 1.5s
- **Lazy Load Trigger:** 400px before viewport
- **Animation Frame Rate:** 60 FPS
- **Image Load Time:** < 2s each
- **Total Section Load:** < 3s

### Measurement Tools:
- Chrome DevTools Performance tab
- Lighthouse audit
- Network tab for image loading
- FPS meter for animations

---

## 🎓 Testing Script

### Automated Test Commands:
```bash
# Test development build
npm run dev

# Test production build
npm run build
npm run preview

# Check for console errors
# Open browser console (F12)
# Look for red error messages

# Test API endpoint
curl http://localhost:3000/api/blog
# Should return JSON with posts array

# Verify files exist
ls app/components/BlogList.vue
ls app/assets/css/blog-section-homepage.css
```

### Manual Test Flow:
1. Open homepage
2. Scroll to FAQ section
3. Continue scrolling down
4. Blog section should load with skeleton
5. Content fades in after ~400ms
6. Check all visual elements
7. Test interactions (hover, click)
8. Toggle dark mode
9. Test on mobile (DevTools)
10. Check all browsers

---

## 📝 Test Results Log

### Date: ___________
### Tester: ___________
### Browser: ___________
### Device: ___________

| Test Case | Result | Notes |
|-----------|--------|-------|
| Desktop visual | ☐ Pass ☐ Fail | |
| Tablet visual | ☐ Pass ☐ Fail | |
| Mobile visual | ☐ Pass ☐ Fail | |
| Dark mode | ☐ Pass ☐ Fail | |
| Performance | ☐ Pass ☐ Fail | |
| Functionality | ☐ Pass ☐ Fail | |
| Accessibility | ☐ Pass ☐ Fail | |
| Cross-browser | ☐ Pass ☐ Fail | |

### Issues Found:
1. ______________________________
2. ______________________________
3. ______________________________

### Overall Status:
☐ All tests passed - Ready for production
☐ Minor issues found - Needs fixes
☐ Major issues found - Requires rework

---

## ✅ Sign-Off

- [ ] Visual design approved
- [ ] Functionality verified
- [ ] Performance acceptable
- [ ] Accessibility compliant
- [ ] Dark mode working
- [ ] Mobile responsive
- [ ] Cross-browser compatible
- [ ] Ready for production

**Approved by:** ___________
**Date:** ___________

---

**Happy Testing! 🎉**










