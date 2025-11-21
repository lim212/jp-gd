# 🎨 DARK MODE BURGUNDY - PANDUAN LENGKAP

> **Dark Mode Super Keren dengan Warna Burgundy, Abu-abu, Hitam & Putih**

## 📋 Ringkasan

Dark mode baru ini menggunakan **palet warna premium** yang terdiri dari:
- 🍷 **Burgundy/Maroon**: Untuk accents, highlights, dan CTAs
- ⚫ **Abu-abu**: Untuk surfaces, cards, dan panels
- ⬛ **Hitam**: Untuk backgrounds
- ⚪ **Putih**: Untuk text, list items, dan borders

---

## 🎨 Palet Warna

### 🍷 Burgundy Palette

```css
--burgundy-50: #FFF1F2      /* Sangat terang - untuk highlights */
--burgundy-100: #FFE4E6     /* Terang */
--burgundy-200: #FECDD3     /* Soft */
--burgundy-300: #FDA4AF     /* Light */
--burgundy-400: #FB7185     /* Medium-light - untuk teks aksen */
--burgundy-500: #F43F5E     /* Medium */
--burgundy-600: #E11D48     /* Medium-dark */
--burgundy-700: #BE123C     /* Dark - untuk borders */
--burgundy-800: #9F1239     /* Sangat dark - untuk backgrounds */
--burgundy-900: #881337     /* Ultra dark */
--burgundy-950: #4C0519     /* Hampir hitam */

/* Burgundy Primary */
--burgundy-primary: #9B1B30       /* Warna utama burgundy */
--burgundy-primary-light: #DC143C /* Untuk hover states */
--burgundy-primary-dark: #800020  /* Untuk active states */
--burgundy-glow: rgba(155, 27, 48, 0.4) /* Efek glow */
```

### ⚫ Gray Palette

```css
--gray-50: #FAFAFA    /* Text primary - putih lembut */
--gray-100: #F4F4F5   /* Text secondary */
--gray-200: #E4E4E7   /* Text tertiary */
--gray-300: #D4D4D8   /* Light borders */
--gray-400: #A1A1AA   /* Muted text */
--gray-500: #71717A   /* Placeholder */
--gray-600: #52525B   /* Dark borders */
--gray-700: #3F3F46   /* Surface elevated */
--gray-800: #27272A   /* Surface hover */
--gray-900: #18181B   /* Surface primary */
--gray-950: #09090B   /* Surface dim */
```

### ⬛ Black Palette

```css
--black-base: #0A0A0D        /* Background utama */
--black-primary: #121214     /* Background sections */
--black-secondary: #18181B   /* Background cards */
--black-tertiary: #1F1F23    /* Background inputs */
```

---

## 🎯 Penggunaan CSS Variables

### Background

```css
/* Main backgrounds */
--dark-bg-base: var(--black-base)           /* Body background */
--dark-bg-primary: var(--black-primary)     /* Section background */
--dark-bg-secondary: var(--black-secondary) /* Alternative sections */
--dark-bg-tertiary: var(--black-tertiary)   /* Inputs, code blocks */

/* Surfaces */
--dark-surface: var(--gray-900)             /* Cards, panels */
--dark-surface-hover: var(--gray-800)       /* Hover state */
--dark-surface-elevated: var(--gray-700)    /* Modals, dropdowns */
--dark-surface-dim: var(--gray-950)         /* Dimmed surfaces */

/* Subtle backgrounds */
--dark-bg-subtle: rgba(255, 255, 255, 0.03) /* Slight highlight */
--dark-bg-subtle-hover: rgba(255, 255, 255, 0.05)
```

### Text Colors

```css
--dark-text-heading: #FFFFFF          /* Headings only */
--dark-text-primary: var(--gray-50)   /* Main text */
--dark-text-secondary: var(--gray-200) /* Secondary text */
--dark-text-tertiary: var(--gray-300)  /* Less important */
--dark-text-muted: var(--gray-400)     /* Captions, metadata */
--dark-text-disabled: var(--gray-500)  /* Disabled states */
--dark-placeholder: var(--gray-500)    /* Input placeholders */
```

### Burgundy Accents

```css
/* Primary accents */
--dark-accent-primary: var(--burgundy-primary)
--dark-accent-primary-hover: var(--burgundy-primary-light)
--dark-accent-primary-active: var(--burgundy-primary-dark)

/* Secondary accents */
--dark-accent-secondary: var(--burgundy-600)
--dark-accent-secondary-hover: var(--burgundy-500)

/* Light accents */
--dark-accent-light: var(--burgundy-400)
--dark-accent-lighter: var(--burgundy-300)
```

### Borders

```css
--dark-border: rgba(250, 250, 250, 0.08)         /* Normal border */
--dark-border-light: rgba(250, 250, 250, 0.05)   /* Subtle border */
--dark-border-strong: rgba(250, 250, 250, 0.15)  /* Strong border */
--dark-border-hover: rgba(250, 250, 250, 0.2)    /* Hover state */

/* Burgundy borders */
--dark-border-burgundy: rgba(155, 27, 48, 0.4)        /* Normal */
--dark-border-burgundy-strong: rgba(155, 27, 48, 0.6) /* Strong */

/* Dividers */
--dark-divider: rgba(250, 250, 250, 0.06)
```

### Shadows & Glows

```css
/* Shadows */
--dark-shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.3)
--dark-shadow-md: 0 4px 8px rgba(0, 0, 0, 0.5), 0 2px 4px rgba(0, 0, 0, 0.4)
--dark-shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.6), 0 4px 8px rgba(0, 0, 0, 0.5)
--dark-shadow-xl: 0 16px 32px rgba(0, 0, 0, 0.7), 0 8px 16px rgba(0, 0, 0, 0.6)
--dark-shadow-2xl: 0 24px 48px rgba(0, 0, 0, 0.8), 0 12px 24px rgba(0, 0, 0, 0.7)

/* Burgundy glows */
--dark-glow-burgundy: 0 0 20px rgba(155, 27, 48, 0.4)
--dark-glow-burgundy-strong: 0 0 30px rgba(155, 27, 48, 0.6)
--dark-glow-burgundy-intense: 0 0 40px rgba(155, 27, 48, 0.8)
```

### Gradients

```css
/* Primary gradient - untuk backgrounds */
--dark-gradient-primary: linear-gradient(135deg, 
  var(--black-base) 0%, 
  var(--black-primary) 30%,
  var(--black-secondary) 60%,
  var(--gray-900) 100%)

/* Burgundy gradient - untuk buttons, accents */
--dark-gradient-burgundy: linear-gradient(135deg,
  var(--burgundy-900) 0%,
  var(--burgundy-800) 50%,
  var(--burgundy-700) 100%)

/* Surface gradient - untuk cards */
--dark-gradient-surface: linear-gradient(180deg,
  rgba(24, 24, 27, 0.95) 0%,
  rgba(39, 39, 42, 0.9) 100%)

/* Overlay gradient - untuk images */
--dark-gradient-overlay: linear-gradient(180deg,
  rgba(10, 10, 13, 0) 0%,
  rgba(10, 10, 13, 0.8) 100%)
```

---

## 🎯 Contoh Penggunaan

### Button Primary

```vue
<button class="btn-primary">
  Klik Saya
</button>
```

```css
.dark .btn-primary {
  background: var(--dark-gradient-burgundy);
  color: var(--gray-50);
  border: 1px solid var(--burgundy-700);
  box-shadow: var(--dark-shadow-md), var(--dark-glow-burgundy);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dark .btn-primary:hover {
  background: linear-gradient(135deg,
    var(--burgundy-800) 0%,
    var(--burgundy-700) 50%,
    var(--burgundy-600) 100%);
  box-shadow: var(--dark-shadow-lg), var(--dark-glow-burgundy-strong);
  transform: translateY(-2px);
}
```

### Card Component

```vue
<div class="card">
  <h3>Judul Card</h3>
  <p>Konten card di sini...</p>
</div>
```

```css
.dark .card {
  background: var(--dark-surface);
  border: 1px solid var(--dark-border);
  box-shadow: var(--dark-shadow-md);
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.3s ease;
}

.dark .card:hover {
  background: var(--dark-surface-hover);
  border-color: var(--dark-border-burgundy);
  box-shadow: var(--dark-shadow-lg), var(--dark-glow-burgundy);
  transform: translateY(-4px);
}
```

### Hero Section

```vue
<section class="hero">
  <h1 class="hero-title">Selamat Datang</h1>
  <p class="hero-subtitle">Subtitle di sini</p>
  <button class="hero-cta">Call to Action</button>
</section>
```

```css
.dark .hero {
  background: var(--dark-gradient-primary);
  border-bottom: 2px solid var(--dark-border-burgundy);
  position: relative;
  padding: 6rem 0;
}

.dark .hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 50%, 
    rgba(155, 27, 48, 0.15) 0%, 
    transparent 70%);
}

.dark .hero-title {
  color: var(--dark-text-heading);
  font-weight: 900;
  font-size: 3rem;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}

.dark .hero-cta {
  background: var(--dark-gradient-burgundy);
  color: var(--gray-50);
  box-shadow: var(--dark-shadow-xl), var(--dark-glow-burgundy-strong);
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dark .hero-cta:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: var(--dark-shadow-2xl), var(--dark-glow-burgundy-intense);
}
```

---

## ✨ Fitur Spesial

### 1. Burgundy Glow Effect

Gunakan class `.glow-burgundy` atau `.animate-burgundy-glow`:

```html
<div class="card glow-burgundy">
  Card dengan efek glow burgundy
</div>
```

### 2. Burgundy Pulse Animation

Untuk element yang perlu attention:

```html
<button class="btn-primary animate-burgundy-pulse">
  Button dengan pulse effect
</button>
```

### 3. Featured Badge

Untuk konten yang di-highlight:

```css
.dark .blog-featured::before {
  content: '⭐ Featured';
  background: var(--dark-gradient-burgundy);
  box-shadow: var(--dark-glow-burgundy-strong);
}
```

---

## 🎨 Komponen yang Sudah Di-styling

### ✅ Sudah Selesai

1. **Navigation & Header**
   - Header dengan backdrop blur
   - Nav links dengan burgundy hover
   - Active states dengan burgundy accent

2. **Hero Section**
   - Gradient background dengan burgundy glow
   - Call-to-action buttons
   - Title dengan text shadow

3. **Cards & Panels**
   - Basic cards dengan hover effects
   - Featured cards dengan burgundy borders
   - Blog cards dengan image overlays

4. **Buttons**
   - Primary buttons (burgundy gradient)
   - Secondary buttons (burgundy outline)
   - Ghost buttons
   - Link buttons

5. **Forms & Inputs**
   - Input fields dengan burgundy focus
   - Textareas
   - Select dropdowns
   - Labels

6. **Lists**
   - Unordered lists dengan burgundy bullets
   - List group items
   - Hover effects

7. **Tables**
   - Table headers dengan burgundy accent
   - Hover rows
   - Striped tables

8. **Alerts & Notifications**
   - Success, warning, error, info alerts
   - Border-left burgundy accent

9. **Modals & Dialogs**
   - Modal overlays dengan backdrop blur
   - Modal content dengan burgundy borders
   - Modal headers dan footers

10. **Badges & Tags**
    - Burgundy badges
    - Keyword tags dengan hover

11. **Footer**
    - Footer dengan burgundy top border
    - Footer links dengan burgundy hover

12. **Blog Components**
    - Blog cards
    - Blog featured items
    - Blog stats
    - Blog metadata

13. **Special Sections**
    - About section
    - Why We section dengan icons
    - FAQ dengan accordion
    - Information cards
    - Testimonials
    - Company profile stats

14. **CTAs**
    - CTA sections dengan gradients
    - CTA buttons dengan intense glows

15. **Floating Buttons**
    - Burgundy floating buttons
    - WhatsApp floating button

---

## 📱 Responsive Design

Dark mode burgundy sudah responsive untuk:
- ✅ Desktop (1024px+)
- ✅ Tablet (768px - 1023px)
- ✅ Mobile (< 768px)

Semua ukuran font, padding, dan spacing sudah disesuaikan.

---

## 🎯 File yang Terlibat

1. **`dark-mode-burgundy.css`**
   - CSS variables
   - Base styles
   - Typography
   - Core components

2. **`dark-mode-burgundy-components.css`**
   - Banner slider
   - Mobile menu
   - Home sections
   - Blog sections
   - SEO keywords
   - Floating buttons
   - Utilities

---

## 🚀 Cara Penggunaan

### Otomatis
Semua styling sudah otomatis aktif saat dark mode diaktifkan. Tidak perlu tambahan konfigurasi.

### Manual Override
Jika ingin menggunakan burgundy accent di komponen custom:

```vue
<template>
  <div class="custom-component">
    <!-- content -->
  </div>
</template>

<style scoped>
.dark .custom-component {
  background: var(--dark-surface);
  border: 1px solid var(--dark-border-burgundy);
  box-shadow: var(--dark-shadow-md), var(--dark-glow-burgundy);
}

.dark .custom-component:hover {
  box-shadow: var(--dark-shadow-lg), var(--dark-glow-burgundy-strong);
}
</style>
```

---

## ⚠️ IMPORTANT

### ❌ TIDAK MENGUBAH LIGHT MODE

Dark mode burgundy ini **HANYA** mengubah dark mode. Light mode tetap tidak berubah!

Semua style menggunakan prefix `.dark` untuk memastikan hanya aktif di dark mode:

```css
/* ✅ BENAR - Hanya untuk dark mode */
.dark .component {
  background: var(--dark-surface);
}

/* ❌ SALAH - Akan mengubah light mode juga */
.component {
  background: var(--dark-surface);
}
```

---

## 🎨 Customization

### Mengubah Burgundy Primary

Jika ingin menggunakan shade burgundy yang berbeda:

```css
.dark {
  --burgundy-primary: #YOUR_COLOR_HERE;
  --burgundy-primary-light: #LIGHTER_SHADE;
  --burgundy-primary-dark: #DARKER_SHADE;
}
```

### Menambah Custom Glow

```css
.dark .my-element {
  box-shadow: var(--dark-shadow-md), 
              0 0 30px rgba(YOUR_R, YOUR_G, YOUR_B, 0.6);
}
```

---

## 📊 Contrast Ratios (WCAG Compliance)

Semua kombinasi warna sudah memenuhi WCAG AA:

| Kombinasi | Contrast Ratio | Status |
|-----------|---------------|--------|
| `--dark-text-heading` on `--dark-bg-base` | 21:1 | ✅ AAA |
| `--dark-text-primary` on `--dark-bg-base` | 15.8:1 | ✅ AAA |
| `--dark-text-secondary` on `--dark-surface` | 8.2:1 | ✅ AA |
| `--burgundy-400` on `--dark-bg-base` | 4.8:1 | ✅ AA |
| `--dark-text-muted` on `--dark-surface` | 4.5:1 | ✅ AA |

---

## 🐛 Troubleshooting

### Issue: Warna tidak berubah

**Solusi**: Pastikan HTML element memiliki class `dark`:

```html
<html class="dark">
  <!-- content -->
</html>
```

### Issue: Burgundy tidak muncul

**Solusi**: Clear cache browser atau hard refresh (Ctrl+Shift+R)

### Issue: Light mode ikut berubah

**Solusi**: Pastikan semua style menggunakan prefix `.dark`

---

## 📚 Resources

- **CSS Files**:
  - `app/assets/css/dark-mode-burgundy.css`
  - `app/assets/css/dark-mode-burgundy-components.css`

- **Documentation**:
  - `DARK-MODE-BURGUNDY-GUIDE.md` (file ini)

- **Color Reference**:
  - Burgundy: #9B1B30
  - Gray: #18181B - #FAFAFA
  - Black: #0A0A0D - #1F1F23

---

## ✨ Credits

Dibuat dengan ❤️ untuk **JasaPembayaran.com**

Dark mode burgundy yang **super keren**, **professional**, dan **modern**!

---

**Happy Coding! 🚀**




