#!/usr/bin/env node

/**
 * Cross-platform script to fix PWA issues
 * This script addresses common PWA build and runtime issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing PWA issues...');

try {
  // Fix PWA configuration in nuxt.config.ts
  console.log('📁 Fixing PWA configuration...');
  
  const nuxtConfigPath = 'nuxt.config.ts';
  if (fs.existsSync(nuxtConfigPath)) {
    let content = fs.readFileSync(nuxtConfigPath, 'utf8');
    let modified = false;
    
    // Fix PWA module configuration
    if (content.includes('@vite-pwa/nuxt')) {
      // Ensure PWA is only enabled in production
      content = content.replace(
        /enablePWA = process\.env\.NUXT_ENABLE_PWA === 'true'/g,
        'enablePWA = process.env.NODE_ENV === \'production\' && process.env.NUXT_ENABLE_PWA !== \'false\''
      );
      modified = true;
    }
    
    // Fix workbox configuration
    if (content.includes('workbox:')) {
      // Ensure proper workbox configuration
      content = content.replace(
        /navigateFallbackDenylist: \[\/\^\\\/api\\\/\/\]/g,
        'navigateFallbackDenylist: [/^\\/api\\//, /^\\/admin\\//, /^\\/login\\//]'
      );
      modified = true;
    }
    
    // Fix glob patterns
    if (content.includes('globPatterns:')) {
      content = content.replace(
        /globPatterns: \[.*?\]/s,
        `globPatterns: [
          '**/*.{js,css,html,ico,png,svg,webp,woff,woff2}'
        ]`
      );
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(nuxtConfigPath, content);
      console.log('✅ Fixed PWA configuration in nuxt.config.ts');
    }
  }
  
  // Fix service worker file
  console.log('🔧 Fixing service worker...');
  const swPath = 'public/service-worker.js';
  if (fs.existsSync(swPath)) {
    let swContent = fs.readFileSync(swPath, 'utf8');
    
    // Add error handling
    if (!swContent.includes('error handling')) {
      swContent = `
// Error handling for service worker
self.addEventListener('error', (event) => {
  console.error('Service Worker Error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker Unhandled Rejection:', event.reason);
});

${swContent}
`;
      fs.writeFileSync(swPath, swContent);
      console.log('✅ Added error handling to service worker');
    }
  }
  
  // Fix manifest.json
  console.log('📱 Fixing manifest.json...');
  const manifestPath = 'public/manifest.json';
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    // Ensure required fields
    if (!manifest.name) manifest.name = 'JasaPembayaran.com';
    if (!manifest.short_name) manifest.short_name = 'JasaPembayaran';
    if (!manifest.start_url) manifest.start_url = '/';
    if (!manifest.display) manifest.display = 'standalone';
    if (!manifest.background_color) manifest.background_color = '#ffffff';
    if (!manifest.theme_color) manifest.theme_color = '#1D4ED8';
    
    // Ensure icons array exists
    if (!manifest.icons || !Array.isArray(manifest.icons)) {
      manifest.icons = [
        { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
        { src: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { src: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
      ];
    }
    
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('✅ Fixed manifest.json');
  }
  
  // Create PWA plugin if it doesn't exist
  console.log('🔌 Creating PWA plugin...');
  const pwaPluginPath = 'plugins/pwa.client.ts';
  if (!fs.existsSync(pwaPluginPath)) {
    const pwaPluginContent = `
// PWA Plugin for client-side PWA functionality
export default defineNuxtPlugin(() => {
  // Only run on client side
  if (process.server) return;
  
  // Register service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
  
  // Handle PWA install prompt
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });
  
  // Handle PWA install
  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    deferredPrompt = null;
  });
});
`;
    fs.writeFileSync(pwaPluginPath, pwaPluginContent);
    console.log('✅ Created PWA plugin');
  }
  
  console.log('✅ PWA issues fixed!');
  
} catch (error) {
  console.error('❌ Error fixing PWA issues:', error.message);
  process.exit(1);
}
