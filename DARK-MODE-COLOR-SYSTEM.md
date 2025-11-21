# 🎨 DARK MODE COLOR SYSTEM - Sistem Warna Lengkap

## 🌙 Color Palette Professional untuk Semua Halaman

Sistem warna ini dirancang khusus untuk:
- ✅ Konsistensi di semua halaman
- ✅ Tidak bentrok dengan light mode
- ✅ Accessibility (WCAG AA compliant)
- ✅ Professional dan modern
- ✅ Easy maintenance

---

## 📐 STRUKTUR COLOR SYSTEM

### Layer 1: Background Colors (Latar Belakang)

```css
:root.dark {
  /* ===== BACKGROUNDS ===== */
  
  /* Main Background - Paling gelap */
  --dark-bg-base: #0a0a0f;
  --dark-bg-primary: #0f1117;
  
  /* Surface - Card, Panel, Container */
  --dark-surface: #1a1a2e;
  --dark-surface-hover: #1f1f35;
  --dark-surface-elevated: #24243d;
  
  /* Subtle Background - Section yang perlu dibedakan */
  --dark-bg-subtle: #16213e;
  
  /* Input & Form Background */
  --dark-input-bg: #1f2937;
  --dark-input-bg-focus: #374151;
  
  /* Code Block */
  --dark-code-bg: #1e293b;
  
  /* Table Row Alternate */
  --dark-table-row: #1a1f2e;
  --dark-table-row-hover: #2d3748;
}
```

**Penggunaan:**
- `--dark-bg-base`: Body background
- `--dark-surface`: Cards, modals, panels
- `--dark-bg-subtle`: Sections yang perlu subtle differentiation
- `--dark-input-bg`: Form inputs, textareas

---

### Layer 2: Text Colors (Warna Teks)

```css
:root.dark {
  /* ===== TEXT COLORS ===== */
  
  /* Primary Text - Teks utama */
  --dark-text-primary: #f1f5f9;     /* Putih lembut, BUKAN pure white */
  --dark-text-primary-rgb: 241, 245, 249;
  
  /* Heading Text - Lebih terang untuk emphasis */
  --dark-text-heading: #ffffff;     /* Pure white untuk heading saja */
  
  /* Secondary Text - Teks pendukung */
  --dark-text-secondary: #cbd5e1;   /* Gray terang */
  
  /* Muted Text - Caption, helper text */
  --dark-text-muted: #94a3b8;       /* Gray medium */
  
  /* Disabled Text */
  --dark-text-disabled: #64748b;    /* Gray gelap */
  
  /* Placeholder */
  --dark-placeholder: #64748b;
}
```

**Hierarchy:**
```
Heading (#ffffff) > Primary (#f1f5f9) > Secondary (#cbd5e1) > Muted (#94a3b8)
```

---

### Layer 3: Accent Colors (Warna Aksen)

```css
:root.dark {
  /* ===== ACCENT COLORS ===== */
  
  /* Primary Accent - Blue (Brand) */
  --dark-accent-primary: #60a5fa;          /* Blue 400 - Main */
  --dark-accent-primary-hover: #93c5fd;    /* Blue 300 - Hover */
  --dark-accent-primary-active: #3b82f6;   /* Blue 500 - Active */
  
  /* Secondary Accent - Cyan (Highlights) */
  --dark-accent-secondary: #22d3ee;        /* Cyan 400 */
  --dark-accent-secondary-hover: #67e8f9;  /* Cyan 300 */
  
  /* Purple Accent - Special elements */
  --dark-accent-purple: #a78bfa;           /* Violet 400 */
  --dark-accent-purple-hover: #c4b5fd;     /* Violet 300 */
  
  /* Success - Green */
  --dark-success: #34d399;                 /* Emerald 400 */
  --dark-success-bg: rgba(52, 211, 153, 0.1);
  --dark-success-border: rgba(52, 211, 153, 0.3);
  
  /* Warning - Amber */
  --dark-warning: #fbbf24;                 /* Amber 400 */
  --dark-warning-bg: rgba(251, 191, 36, 0.1);
  --dark-warning-border: rgba(251, 191, 36, 0.3);
  
  /* Error - Rose */
  --dark-error: #fb7185;                   /* Rose 400 */
  --dark-error-bg: rgba(251, 113, 133, 0.1);
  --dark-error-border: rgba(251, 113, 133, 0.3);
  
  /* Info - Sky */
  --dark-info: #38bdf8;                    /* Sky 400 */
  --dark-info-bg: rgba(56, 189, 248, 0.1);
  --dark-info-border: rgba(56, 189, 248, 0.3);
}
```

**Penggunaan:**
- `--dark-accent-primary`: Links, buttons, CTAs
- `--dark-accent-secondary`: Secondary buttons, badges
- `--dark-success/warning/error`: Alert boxes, notifications
- `--dark-info`: Information boxes

---

### Layer 4: Border & Divider

```css
:root.dark {
  /* ===== BORDERS & DIVIDERS ===== */
  
  /* Border - Normal */
  --dark-border: rgba(255, 255, 255, 0.1);
  --dark-border-hover: rgba(255, 255, 255, 0.2);
  
  /* Border - Colored (untuk emphasis) */
  --dark-border-blue: rgba(96, 165, 250, 0.3);
  --dark-border-purple: rgba(167, 139, 250, 0.3);
  --dark-border-green: rgba(52, 211, 153, 0.3);
  
  /* Divider */
  --dark-divider: rgba(255, 255, 255, 0.08);
  
  /* Focus Ring */
  --dark-focus-ring: rgba(96, 165, 250, 0.5);
}
```

**Pro Tip:** Gunakan `rgba` dengan opacity untuk borders agar adaptif dengan background!

---

### Layer 5: Shadows & Glows

```css
:root.dark {
  /* ===== SHADOWS ===== */
  
  /* Elevation Shadows */
  --dark-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.5),
                    0 1px 2px rgba(0, 0, 0, 0.3);
  
  --dark-shadow-md: 0 4px 6px rgba(0, 0, 0, 0.6),
                    0 2px 4px rgba(0, 0, 0, 0.4);
  
  --dark-shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.7),
                    0 4px 6px rgba(0, 0, 0, 0.5);
  
  --dark-shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.8),
                    0 10px 10px rgba(0, 0, 0, 0.6);
  
  /* Colored Glows - Untuk effects */
  --dark-glow-blue: 0 0 20px rgba(96, 165, 250, 0.3);
  --dark-glow-purple: 0 0 20px rgba(167, 139, 250, 0.3);
  --dark-glow-green: 0 0 20px rgba(52, 211, 153, 0.3);
  
  /* Inner Shadow - Untuk inputs */
  --dark-inner-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}
```

**Penggunaan:**
- `--dark-shadow-sm`: Small cards
- `--dark-shadow-md`: Normal cards, dropdowns
- `--dark-shadow-lg`: Modals, large panels
- `--dark-shadow-xl`: Hero sections, featured content

---

## 🎨 APLIKASI PER KOMPONEN

### 1. **Navigation / Header**

```css
.dark .header,
.dark .navbar {
  background: var(--dark-surface);
  border-bottom: 1px solid var(--dark-border);
  box-shadow: var(--dark-shadow-md);
}

.dark .nav-link {
  color: var(--dark-text-secondary);
  transition: color 0.2s ease;
}

.dark .nav-link:hover {
  color: var(--dark-accent-primary);
}

.dark .nav-link.active {
  color: var(--dark-accent-primary);
  border-bottom: 2px solid var(--dark-accent-primary);
}
```

---

### 2. **Hero Section**

```css
.dark .hero {
  background: linear-gradient(135deg, 
    var(--dark-bg-base) 0%, 
    var(--dark-bg-primary) 50%,
    var(--dark-surface) 100%);
  border-bottom: 1px solid var(--dark-border-blue);
}

.dark .hero-title {
  color: var(--dark-text-heading);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.dark .hero-subtitle {
  color: var(--dark-text-secondary);
}

.dark .hero-cta {
  background: var(--dark-accent-primary);
  color: var(--dark-bg-base);
  box-shadow: var(--dark-shadow-lg), var(--dark-glow-blue);
}

.dark .hero-cta:hover {
  background: var(--dark-accent-primary-hover);
  transform: translateY(-2px);
}
```

---

### 3. **Card / Panel**

```css
.dark .card {
  background: var(--dark-surface);
  border: 1px solid var(--dark-border);
  box-shadow: var(--dark-shadow-md);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.dark .card:hover {
  background: var(--dark-surface-hover);
  border-color: var(--dark-border-hover);
  box-shadow: var(--dark-shadow-lg);
  transform: translateY(-2px);
}

.dark .card-title {
  color: var(--dark-text-heading);
  font-weight: 600;
}

.dark .card-description {
  color: var(--dark-text-secondary);
}

.dark .card-meta {
  color: var(--dark-text-muted);
  font-size: 0.875rem;
}
```

---

### 4. **Button / CTA**

```css
/* Primary Button */
.dark .btn-primary {
  background: var(--dark-accent-primary);
  color: var(--dark-bg-base);
  border: none;
  box-shadow: var(--dark-shadow-md);
}

.dark .btn-primary:hover {
  background: var(--dark-accent-primary-hover);
  box-shadow: var(--dark-shadow-lg), var(--dark-glow-blue);
}

/* Secondary Button */
.dark .btn-secondary {
  background: transparent;
  color: var(--dark-accent-primary);
  border: 1px solid var(--dark-border-blue);
}

.dark .btn-secondary:hover {
  background: rgba(96, 165, 250, 0.1);
  border-color: var(--dark-accent-primary);
}

/* Ghost Button */
.dark .btn-ghost {
  background: transparent;
  color: var(--dark-text-primary);
  border: 1px solid var(--dark-border);
}

.dark .btn-ghost:hover {
  background: var(--dark-surface-hover);
  border-color: var(--dark-border-hover);
}
```

---

### 5. **Form & Input**

```css
.dark .form-group {
  margin-bottom: 1.5rem;
}

.dark .form-label {
  color: var(--dark-text-secondary);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.dark .form-input,
.dark .form-textarea,
.dark .form-select {
  background: var(--dark-input-bg);
  color: var(--dark-text-primary);
  border: 1px solid var(--dark-border);
  box-shadow: var(--dark-inner-shadow);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.dark .form-input:focus {
  background: var(--dark-input-bg-focus);
  border-color: var(--dark-accent-primary);
  box-shadow: 0 0 0 3px var(--dark-focus-ring);
  outline: none;
}

.dark .form-input::placeholder {
  color: var(--dark-placeholder);
}

.dark .form-input:disabled {
  background: var(--dark-bg-subtle);
  color: var(--dark-text-disabled);
  cursor: not-allowed;
}
```

---

### 6. **Alert / Notification**

```css
/* Success Alert */
.dark .alert-success {
  background: var(--dark-success-bg);
  border: 1px solid var(--dark-success-border);
  color: var(--dark-success);
  border-left: 4px solid var(--dark-success);
}

/* Warning Alert */
.dark .alert-warning {
  background: var(--dark-warning-bg);
  border: 1px solid var(--dark-warning-border);
  color: var(--dark-warning);
  border-left: 4px solid var(--dark-warning);
}

/* Error Alert */
.dark .alert-error {
  background: var(--dark-error-bg);
  border: 1px solid var(--dark-error-border);
  color: var(--dark-error);
  border-left: 4px solid var(--dark-error);
}

/* Info Alert */
.dark .alert-info {
  background: var(--dark-info-bg);
  border: 1px solid var(--dark-info-border);
  color: var(--dark-info);
  border-left: 4px solid var(--dark-info);
}
```

---

### 7. **Table**

```css
.dark .table {
  background: var(--dark-surface);
  border: 1px solid var(--dark-border);
  border-radius: 8px;
  overflow: hidden;
}

.dark .table-header {
  background: var(--dark-bg-subtle);
  border-bottom: 1px solid var(--dark-border);
}

.dark .table-header th {
  color: var(--dark-text-heading);
  font-weight: 600;
  padding: 1rem;
}

.dark .table-row {
  border-bottom: 1px solid var(--dark-divider);
}

.dark .table-row:hover {
  background: var(--dark-table-row-hover);
}

.dark .table-row:nth-child(even) {
  background: var(--dark-table-row);
}

.dark .table-cell {
  color: var(--dark-text-secondary);
  padding: 0.75rem 1rem;
}
```

---

### 8. **Modal / Dialog**

```css
.dark .modal-overlay {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
}

.dark .modal-content {
  background: var(--dark-surface-elevated);
  border: 1px solid var(--dark-border);
  box-shadow: var(--dark-shadow-xl);
  border-radius: 16px;
}

.dark .modal-header {
  border-bottom: 1px solid var(--dark-divider);
  padding: 1.5rem;
}

.dark .modal-title {
  color: var(--dark-text-heading);
  font-weight: 600;
}

.dark .modal-close {
  color: var(--dark-text-muted);
}

.dark .modal-close:hover {
  color: var(--dark-text-primary);
}

.dark .modal-body {
  padding: 1.5rem;
  color: var(--dark-text-secondary);
}

.dark .modal-footer {
  border-top: 1px solid var(--dark-divider);
  padding: 1.5rem;
}
```

---

### 9. **Footer**

```css
.dark .footer {
  background: var(--dark-surface);
  border-top: 1px solid var(--dark-border);
  padding: 3rem 0;
}

.dark .footer-title {
  color: var(--dark-text-heading);
  font-weight: 600;
  margin-bottom: 1rem;
}

.dark .footer-link {
  color: var(--dark-text-secondary);
  transition: color 0.2s ease;
}

.dark .footer-link:hover {
  color: var(--dark-accent-primary);
}

.dark .footer-copyright {
  color: var(--dark-text-muted);
  border-top: 1px solid var(--dark-divider);
  padding-top: 2rem;
  text-align: center;
}
```

---

### 10. **Blog / Article**

```css
.dark .article {
  background: var(--dark-surface);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--dark-shadow-md);
}

.dark .article-title {
  color: var(--dark-text-heading);
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.dark .article-meta {
  color: var(--dark-text-muted);
  font-size: 0.875rem;
  margin-bottom: 2rem;
}

.dark .article-content {
  color: var(--dark-text-secondary);
  line-height: 1.8;
}

.dark .article-content h2,
.dark .article-content h3 {
  color: var(--dark-text-heading);
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.dark .article-content a {
  color: var(--dark-accent-primary);
  text-decoration: underline;
}

.dark .article-content a:hover {
  color: var(--dark-accent-primary-hover);
}

.dark .article-content code {
  background: var(--dark-code-bg);
  color: var(--dark-accent-purple);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.875em;
}

.dark .article-content pre {
  background: var(--dark-code-bg);
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  border: 1px solid var(--dark-border);
}
```

---

## 🎯 PENGGUNAAN PRAKTIS

### Quick Reference

```css
/* Background */
Body        → --dark-bg-base
Card        → --dark-surface
Section     → --dark-bg-subtle
Input       → --dark-input-bg

/* Text */
Heading     → --dark-text-heading
Paragraph   → --dark-text-secondary
Caption     → --dark-text-muted

/* Interactive */
Link        → --dark-accent-primary
Button      → --dark-accent-primary
Hover       → --dark-accent-primary-hover

/* States */
Success     → --dark-success
Warning     → --dark-warning
Error       → --dark-error
Info        → --dark-info

/* Structure */
Border      → --dark-border
Divider     → --dark-divider
Shadow      → --dark-shadow-md
```

---

## ✅ CHECKLIST IMPLEMENTASI

```
□ Define semua CSS variables di :root.dark
□ Tidak ada hardcoded colors (#fff, #000)
□ Gunakan rgba() untuk borders dengan opacity
□ Shadow lebih kuat (opacity 0.5-0.8)
□ Text contrast ratio minimal 4.5:1 (WCAG AA)
□ Test di semua halaman (home, about, blog, etc)
□ Test semua komponen (button, card, form, etc)
□ Test interaksi (hover, focus, active)
□ Test di berbagai browser
□ Test di mobile dan desktop
```

---

**File ini adalah sumber tunggal untuk warna dark mode!**  
Simpan sebagai referensi dan gunakan CSS variables ini untuk konsistensi. 🎨✨


