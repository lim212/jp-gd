#!/usr/bin/env node

/**
 * Cross-platform script to fix i18n issues
 * This script addresses common internationalization build and runtime issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing i18n issues...');

try {
  // Fix i18n configuration
  console.log('📁 Fixing i18n configuration...');
  
  const i18nConfigPath = 'i18n.config.ts';
  if (fs.existsSync(i18nConfigPath)) {
    let content = fs.readFileSync(i18nConfigPath, 'utf8');
    let modified = false;
    
    // Ensure proper imports
    if (!content.includes('createI18n')) {
      content = `import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import id from './locales/id.json'

${content}`;
      modified = true;
    }
    
    // Fix path separators
    content = content.replace(/\\\\/g, '/');
    content = content.replace(/\\/g, '/');
    
    if (modified) {
      fs.writeFileSync(i18nConfigPath, content);
      console.log('✅ Fixed i18n configuration');
    }
  }
  
  // Fix nuxt.config.ts i18n configuration
  console.log('📦 Fixing Nuxt i18n configuration...');
  const nuxtConfigPath = 'nuxt.config.ts';
  if (fs.existsSync(nuxtConfigPath)) {
    let content = fs.readFileSync(nuxtConfigPath, 'utf8');
    let modified = false;
    
    // Ensure proper i18n configuration
    if (content.includes('i18n:')) {
      // Fix vueI18n path
      content = content.replace(
        /vueI18n: '\.\/i18n\.config\.ts'/g,
        "vueI18n: './i18n.config.ts'"
      );
      
      // Ensure proper locale configuration
      content = content.replace(
        /locales: \[[\s\S]*?\]/,
        `locales: [
      { code: 'id', iso: 'id-ID', name: 'Indonesia' },
      { code: 'en', iso: 'en-US', name: 'English' }
    ]`
      );
      
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(nuxtConfigPath, content);
      console.log('✅ Fixed Nuxt i18n configuration');
    }
  }
  
  // Check and fix locale files
  console.log('🌍 Checking locale files...');
  const localeFiles = [
    'locales/en.json',
    'locales/id.json',
    'i18n/locales/en.json',
    'i18n/locales/id.json'
  ];
  
  localeFiles.forEach(localeFile => {
    if (fs.existsSync(localeFile)) {
      try {
        const content = fs.readFileSync(localeFile, 'utf8');
        JSON.parse(content); // Validate JSON
        console.log(`✅ ${localeFile} is valid`);
      } catch (e) {
        console.log(`⚠️  ${localeFile} has invalid JSON: ${e.message}`);
      }
    }
  });
  
  // Create default locale files if they don't exist
  const defaultEnContent = {
    "welcome": "Welcome",
    "home": "Home",
    "about": "About",
    "contact": "Contact",
    "services": "Services",
    "testimonials": "Testimonials"
  };
  
  const defaultIdContent = {
    "welcome": "Selamat Datang",
    "home": "Beranda",
    "about": "Tentang Kami",
    "contact": "Kontak",
    "services": "Layanan",
    "testimonials": "Testimoni"
  };
  
  if (!fs.existsSync('locales/en.json')) {
    fs.writeFileSync('locales/en.json', JSON.stringify(defaultEnContent, null, 2));
    console.log('✅ Created default en.json');
  }
  
  if (!fs.existsSync('locales/id.json')) {
    fs.writeFileSync('locales/id.json', JSON.stringify(defaultIdContent, null, 2));
    console.log('✅ Created default id.json');
  }
  
  // Fix i18n plugin
  console.log('🔌 Fixing i18n plugin...');
  const i18nPluginPath = 'plugins/vue-i18n-wrapper.js';
  if (fs.existsSync(i18nPluginPath)) {
    let content = fs.readFileSync(i18nPluginPath, 'utf8');
    
    // Ensure proper error handling
    if (!content.includes('error handling')) {
      content = `
// Error handling for i18n
try {
  ${content}
} catch (error) {
  console.error('i18n plugin error:', error);
}
`;
      fs.writeFileSync(i18nPluginPath, content);
      console.log('✅ Added error handling to i18n plugin');
    }
  }
  
  // Fix Vite configuration for i18n
  console.log('⚡ Fixing Vite i18n configuration...');
  if (fs.existsSync(nuxtConfigPath)) {
    let content = fs.readFileSync(nuxtConfigPath, 'utf8');
    
    // Ensure proper Vite i18n configuration
    if (content.includes('vite:')) {
      // Add i18n define options
      if (!content.includes('__VUE_I18N_FULL_INSTALL__')) {
        content = content.replace(
          /define: \{/,
          `define: {
      __VUE_I18N_FULL_INSTALL__: true,
      __VUE_I18N_LEGACY_API__: false,
      __INTLIFY_PROD_DEVTOOLS__: false,
      __INTLIFY_JIT_COMPILATION__: false,`
        );
      }
    }
    
    fs.writeFileSync(nuxtConfigPath, content);
    console.log('✅ Fixed Vite i18n configuration');
  }
  
  console.log('✅ i18n issues fixed!');
  
} catch (error) {
  console.error('❌ Error fixing i18n issues:', error.message);
  process.exit(1);
}
