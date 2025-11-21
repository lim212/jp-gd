#!/usr/bin/env node

/**
 * Cross-platform script to fix PWA glob warning issues
 * This script addresses common PWA glob pattern warning issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing PWA glob warning issues...');

try {
  // Function to fix PWA glob warnings in a file
  const fixPWAGlobWarningsInFile = (filePath) => {
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix PWA glob patterns
    if (content.includes('globPatterns:')) {
      // Ensure proper glob patterns
      content = content.replace(
        /globPatterns:\s*\[.*?\]/s,
        `globPatterns: [
          '**/*.{js,css,html,ico,png,svg,webp,woff,woff2}'
        ]`
      );
      modified = true;
    }
    
    // Fix PWA glob ignores
    if (content.includes('globIgnores:')) {
      // Ensure proper glob ignores
      content = content.replace(
        /globIgnores:\s*\[.*?\]/s,
        `globIgnores: [
          '**/node_modules/**/*',
          'sw.js',
          'workbox-*.js',
          '**/macbook.svg',
          '**/Cikt8pox.js',
          '**/CYqdmDV6.js'
        ]`
      );
      modified = true;
    }
    
    // Fix PWA navigate fallback denylist
    if (content.includes('navigateFallbackDenylist:')) {
      // Ensure proper navigate fallback denylist
      content = content.replace(
        /navigateFallbackDenylist:\s*\[.*?\]/s,
        `navigateFallbackDenylist: [
          /^\\/api\\//,
          /^\\/admin\\//,
          /^\\/login\\//
        ]`
      );
      modified = true;
    }
    
    // Fix PWA runtime caching
    if (content.includes('runtimeCaching:')) {
      // Ensure proper runtime caching configuration
      content = content.replace(
        /runtimeCaching:\s*\[.*?\]/s,
        `runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 200, maxAgeSeconds: 2592000 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            urlPattern: /^https?:\\/\\/[^/]+\\/api\\/.*$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 50, maxAgeSeconds: 60 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages',
              networkTimeoutSeconds: 3,
              expiration: { maxEntries: 50, maxAgeSeconds: 86400 },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]`
      );
      modified = true;
    }
    
    // Fix path separators
    content = content.replace(/\\\\/g, '/');
    content = content.replace(/\\/g, '/');
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed PWA glob warnings in ${filePath}`);
    }
  };
  
  // Function to recursively find and fix files
  const findAndFixFiles = (dir) => {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        // Skip node_modules and build directories
        if (!['node_modules', '.nuxt', '.output', 'dist'].includes(file)) {
          findAndFixFiles(filePath);
        }
      } else if (stat.isFile()) {
        // Fix TypeScript and JavaScript files
        if (file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.vue')) {
          fixPWAGlobWarningsInFile(filePath);
        }
      }
    });
  };
  
  // Fix files in common directories
  console.log('📁 Scanning for files with PWA glob warnings...');
  const directoriesToScan = [
    'app',
    'components',
    'assets',
    'pages',
    'layouts',
    'plugins',
    'server',
    'utils',
    'composables'
  ];
  
  directoriesToScan.forEach(dir => {
    if (fs.existsSync(dir)) {
      console.log(`🔍 Scanning ${dir}...`);
      findAndFixFiles(dir);
    }
  });
  
  // Fix specific known problematic files
  const knownFiles = [
    'nuxt.config.ts',
    'nitroConfig.ts',
    'viteHMRConfig.ts',
    'app/app.config.ts'
  ];
  
  knownFiles.forEach(file => {
    if (fs.existsSync(file)) {
      fixPWAGlobWarningsInFile(file);
    }
  });
  
  // Fix PWA configuration in nuxt.config.ts
  console.log('📦 Fixing PWA configuration...');
  const nuxtConfigPath = 'nuxt.config.ts';
  if (fs.existsSync(nuxtConfigPath)) {
    let content = fs.readFileSync(nuxtConfigPath, 'utf8');
    
    // Ensure proper PWA module configuration
    if (content.includes('@vite-pwa/nuxt')) {
      // Fix PWA configuration
      content = content.replace(
        /enablePWA = process\.env\.NUXT_ENABLE_PWA === 'true'/g,
        'enablePWA = process.env.NODE_ENV === \'production\' && process.env.NUXT_ENABLE_PWA !== \'false\''
      );
      
      // Fix workbox configuration
      content = content.replace(
        /workbox:\s*\{[^}]*\}/s,
        `workbox: {
          clientsClaim: true,
          skipWaiting: true,
          cleanupOutdatedCaches: true,
          navigateFallbackDenylist: [/^\\/api\\//, /^\\/admin\\//, /^\\/login\\//],
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2}'],
          globIgnores: [
            '**/node_modules/**/*',
            'sw.js',
            'workbox-*.js',
            '**/macbook.svg',
            '**/Cikt8pox.js',
            '**/CYqdmDV6.js'
          ],
          mode: 'production',
          sourcemap: false,
          dontCacheBustURLsMatching: /\\.\\w{8}\\./,
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.destination === 'image',
              handler: 'CacheFirst',
              options: {
                cacheName: 'images',
                expiration: { maxEntries: 200, maxAgeSeconds: 2592000 },
                cacheableResponse: { statuses: [0, 200] }
              }
            },
            {
              urlPattern: /^https?:\\/\\/[^/]+\\/api\\/.*$/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api',
                networkTimeoutSeconds: 5,
                expiration: { maxEntries: 50, maxAgeSeconds: 60 },
                cacheableResponse: { statuses: [0, 200] }
              }
            },
            {
              urlPattern: ({ request }) => request.mode === 'navigate',
              handler: 'NetworkFirst',
              options: {
                cacheName: 'pages',
                networkTimeoutSeconds: 3,
                expiration: { maxEntries: 50, maxAgeSeconds: 86400 },
                cacheableResponse: { statuses: [0, 200] }
              }
            }
          ]
        }`
      );
      
      fs.writeFileSync(nuxtConfigPath, content);
      console.log('✅ Fixed PWA configuration');
    }
  }
  
  // Fix service worker file
  console.log('🔧 Fixing service worker...');
  const swPath = 'public/service-worker.js';
  if (fs.existsSync(swPath)) {
    let swContent = fs.readFileSync(swPath, 'utf8');
    
    // Add proper error handling
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
  
  console.log('✅ PWA glob warning issues fixed!');
  
} catch (error) {
  console.error('❌ Error fixing PWA glob warning issues:', error.message);
  process.exit(1);
}
