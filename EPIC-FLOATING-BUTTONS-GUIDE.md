# 🎨 Epic Floating Buttons - Super Keren & Menarik!

## 📍 Lokasi
Button floating terletak di **pojok kiri bawah** layar dengan posisi tetap (fixed positioning).

## ✨ Fitur-Fitur Keren

### 🔼 Scroll Up Button (Ke Atas)
- **Warna Light Mode**: Gradient Orange (#f97316 → #fb923c)
- **Warna Dark Mode**: Gradient Blue (#3b82f6 → #60a5fa)
- **Fungsi**: Scroll ke atas halaman dengan smooth animation
- **Tampil**: Ketika user sudah scroll ke bawah (lebih dari 50px)

### 🔽 Scroll Down Button (Ke Bawah)
- **Warna Light Mode**: Gradient Orange (#f97316 → #fb923c)
- **Warna Dark Mode**: Gradient Blue (#3b82f6 → #60a5fa)
- **Fungsi**: Scroll ke bawah halaman dengan smooth animation
- **Tampil**: Ketika belum mencapai bagian bawah halaman

### 💬 WhatsApp Button
- **Warna Light Mode**: Gradient Green WhatsApp (#25d366 → #20ba5a)
- **Warna Dark Mode**: Gradient Emerald (#059669 → #10b981)
- **Fungsi**: Membuka chat WhatsApp langsung
- **Tampil**: Di semua halaman kecuali halaman blog (/blog dan /blog/[slug])
- **Fitur Tambahan**: 
  - Online indicator (dot hijau berkedip)
  - Haptic feedback untuk mobile

## 🎯 Efek Interaktif

### 1. **Hover Effect** 🖱️
- Transform naik ke atas 4px + scale 1.08x
- Glow effect dengan blur yang cantik
- Icon membesar 1.15x
- WhatsApp icon berputar 5 derajat saat hover
- Tooltip muncul dengan animasi smooth

### 2. **Active/Click Effect** 👆
- Transform turun 2px + scale 1.02x
- Shadow lebih kecil untuk efek "ditekan"
- Haptic feedback pada mobile (vibrate 10ms)

### 3. **Floating Animation** 🎈
- Animasi naik-turun gentle setiap 4 detik
- WhatsApp button memiliki delay 0.5s untuk variasi
- Smooth cubic-bezier transition

### 4. **Pulse Animation** 💚
- Online indicator berkedip dengan pulse effect
- Scale 1 → 1.1 → 1
- Opacity 1 → 0.8 → 1
- Duration 2 detik infinite

### 5. **Glow Effect** ✨
- Blur 12px-14px pada hover
- Gradient background yang sama dengan button
- Z-index -1 agar tidak menghalangi klik

## 🌈 Mode Light & Dark

### Light Mode (Default)
- **Scroll Buttons**: Orange gradient yang vibrant
- **WhatsApp**: Green gradient sesuai brand WhatsApp
- **Shadow**: Lebih soft dengan opacity rendah
- **Tooltip**: Dark background dengan white text

### Dark Mode
- **Scroll Buttons**: Blue gradient yang elegan
- **WhatsApp**: Emerald green yang lebih gelap
- **Shadow**: Lebih kuat untuk visibility
- **Tooltip**: White background dengan dark text
- **Online Indicator**: Emerald green dengan dark border

## 📱 Responsive Design

### Mobile (≤ 640px)
- Scroll buttons: 48px × 48px
- WhatsApp button: 56px × 56px
- Icon lebih kecil untuk menghemat space
- Tooltip disembunyikan (tidak relevan di mobile)
- Online indicator: 14px dengan border 2px

### Desktop (> 640px)
- Scroll buttons: 56px × 56px
- WhatsApp button: 64px × 64px
- Tooltip muncul saat hover
- Online indicator: 16px dengan border 3px

## 🎨 Design Tokens

```css
/* Light Mode Scroll Buttons */
background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
box-shadow: 
  0 4px 14px rgba(249, 115, 22, 0.4),
  0 2px 6px rgba(0, 0, 0, 0.1),
  inset 0 1px 0 rgba(255, 255, 255, 0.3);

/* Dark Mode Scroll Buttons */
background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
box-shadow: 
  0 4px 14px rgba(59, 130, 246, 0.5),
  0 2px 6px rgba(0, 0, 0, 0.3),
  inset 0 1px 0 rgba(255, 255, 255, 0.2);

/* WhatsApp Button (Light) */
background: linear-gradient(135deg, #25d366 0%, #20ba5a 100%);
box-shadow: 
  0 4px 16px rgba(37, 211, 102, 0.4),
  0 2px 8px rgba(0, 0, 0, 0.1),
  inset 0 1px 0 rgba(255, 255, 255, 0.3);

/* WhatsApp Button (Dark) */
background: linear-gradient(135deg, #059669 0%, #10b981 100%);
box-shadow: 
  0 4px 16px rgba(5, 150, 105, 0.5),
  0 2px 8px rgba(0, 0, 0, 0.3),
  inset 0 1px 0 rgba(255, 255, 255, 0.2);
```

## ♿ Accessibility

### Keyboard Navigation
- Focus visible dengan outline 3px solid
- Blue outline di light mode (#3b82f6)
- Light blue outline di dark mode (#60a5fa)
- Offset 4px untuk visibility

### Screen Readers
- ARIA labels untuk setiap button
- Semantic HTML (button & anchor tags)
- Title attributes untuk context

### Reduced Motion
- Semua animasi dimatikan untuk users dengan `prefers-reduced-motion: reduce`
- Transitions tetap smooth tapi tidak ada floating/pulse

## 🔧 File Location
- **Component**: `app/components/ChatWhatsapp.vue`
- **Included in**: `app/layouts/default.vue`

## 💡 Tips Penggunaan

1. **Tooltip**: Hover pada button untuk melihat label yang jelas
2. **Smooth Scroll**: Semua scroll menggunakan `behavior: 'smooth'`
3. **Smart Visibility**: 
   - Up button muncul setelah scroll 50px
   - Down button hilang ketika hampir di bawah
   - WhatsApp selalu ada (kecuali di blog)
4. **Haptic Feedback**: Vibration pada mobile saat klik
5. **Teleport to Body**: Menggunakan Vue Teleport untuk z-index consistency

## 🎉 Keunggulan

✅ **Super Keren**: Desain modern dengan gradient & glow effects  
✅ **Responsive**: Optimized untuk mobile & desktop  
✅ **Dark Mode**: Support penuh dengan warna yang berbeda & elegan  
✅ **Smooth**: Semua animasi menggunakan cubic-bezier  
✅ **Accessible**: Keyboard navigation & screen reader friendly  
✅ **Performance**: GPU-accelerated transforms & will-change  
✅ **Clean Code**: Well-organized dengan comments yang jelas  

## 🚀 Teknologi

- **Vue 3**: Composition API
- **Teleport**: Portal to body for z-index
- **Transitions**: Vue transition components
- **CSS3**: Advanced gradients, shadows, animations
- **SVG**: Crisp icons di semua ukuran screen
- **Responsive**: Mobile-first design approach

---

**Dibuat dengan ❤️ untuk JasaPembayaran.com**  
*Super keren, menarik, dan mendukung light & dark mode!* ✨

