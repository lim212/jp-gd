<template>
  <img
    src="/logos/jasapembayaran.com.png"
    alt="Jasa PayPal Terpercaya - JasaPembayaran.com"
    title="JasaPembayaran.com - Jasa Bayar PayPal Terpercaya"
    width="auto"
    height="auto"
    loading="eager"
    class="logo-img w-full h-auto min-h-[40px] sm:min-h-[48px] md:min-h-[56px] lg:min-h-[64px] max-h-[80px] object-contain"
  />
  <!-- BADGES REMOVED FOR MOBILE RESPONSIVENESS -->
</template>

<style scoped>
/* Default: keep original logo colors in light mode */
.logo-img {
  filter: none;
  opacity: 1;
  background: transparent;
}

/* Dark mode: make logo high-contrast on dark background */
.dark .logo-img,
html.dark .logo-img,
[data-theme="dark"] .logo-img,
.dark-mode .logo-img,
body.dark .logo-img {
  filter: invert(1) brightness(1.1) contrast(1.2);
  opacity: 1;
  background: transparent;
}
</style>
