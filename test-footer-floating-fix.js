#!/usr/bin/env node

/**
 * 🧪 Test Script untuk Verifikasi Perbaikan Footer & Floating Buttons
 * 
 * Script ini memeriksa apakah semua file sudah diperbaiki dengan benar
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Memulai verifikasi perbaikan...\n');

const tests = [
  {
    name: '1. ChatWhatsapp.vue menggunakan class yang benar',
    file: 'app/components/ChatWhatsapp.vue',
    checks: [
      { content: 'class="scroll-button scroll-button-up"', desc: 'Class scroll button up' },
      { content: 'class="scroll-button scroll-button-down"', desc: 'Class scroll button down' },
      { content: 'class="whatsapp-button-container"', desc: 'Class WhatsApp button' },
      { content: 'class="scroll-button-icon"', desc: 'Icon SVG scroll' },
      { content: 'class="whatsapp-icon"', desc: 'Icon SVG WhatsApp' },
      { content: 'class="online-indicator"', desc: 'Online indicator' }
    ]
  },
  {
    name: '2. super-keren-floating-buttons.css konfigurasi yang benar',
    file: 'app/assets/css/super-keren-floating-buttons.css',
    checks: [
      { content: 'display: flex !important;', desc: 'Display flex' },
      { content: 'flex-direction: column !important;', desc: 'Flex direction' },
      { content: 'pointer-events: none !important;', desc: 'Pointer events container' },
      { content: 'button.scroll-button', desc: 'Scroll button styles' },
      { content: '.whatsapp-button-container', desc: 'WhatsApp container styles' }
    ]
  },
  {
    name: '3. floating-buttons-clean.css tidak menyembunyikan buttons',
    file: 'app/assets/css/floating-buttons-clean.css',
    checks: [
      { 
        content: 'display: none !important;', 
        desc: 'Tidak ada display:none yang berlebihan',
        shouldNotExist: true,
        allowedCount: 1  // Hanya untuk @media print
      }
    ]
  },
  {
    name: '4. AppFooter.vue component ada',
    file: 'app/components/AppFooter.vue',
    checks: [
      { content: 'footer-super-keren', desc: 'Footer class' },
      { content: '<footer', desc: 'Footer tag' }
    ]
  },
  {
    name: '5. Layout memuat footer dengan benar',
    file: 'app/layouts/default.vue',
    checks: [
      { content: '<AppFooter />', desc: 'AppFooter component' },
      { content: '<ChatWhatsapp />', desc: 'ChatWhatsapp component' },
      { content: '<ClientOnly>', desc: 'ClientOnly wrapper' }
    ]
  },
  {
    name: '6. nuxt.config.ts memuat CSS yang benar',
    file: 'nuxt.config.ts',
    checks: [
      { content: 'super-keren-floating-buttons.css', desc: 'Floating buttons CSS' }
    ]
  }
];

let passedTests = 0;
let failedTests = 0;
let totalChecks = 0;
let passedChecks = 0;

tests.forEach((test, index) => {
  console.log(`\n📋 ${test.name}`);
  console.log(`   File: ${test.file}`);
  
  const filePath = path.join(process.cwd(), test.file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`   ❌ File tidak ditemukan!`);
    failedTests++;
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  let testPassed = true;
  
  test.checks.forEach(check => {
    totalChecks++;
    const occurrences = (content.match(new RegExp(check.content.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    
    if (check.shouldNotExist) {
      if (check.allowedCount && occurrences <= check.allowedCount) {
        console.log(`   ✅ ${check.desc} - OK (${occurrences} occurrences, allowed: ${check.allowedCount})`);
        passedChecks++;
      } else if (!check.allowedCount && occurrences === 0) {
        console.log(`   ✅ ${check.desc} - OK (tidak ada)`);
        passedChecks++;
      } else {
        console.log(`   ❌ ${check.desc} - GAGAL (ditemukan ${occurrences} kali)`);
        testPassed = false;
      }
    } else {
      if (occurrences > 0) {
        console.log(`   ✅ ${check.desc} - OK (${occurrences} occurrences)`);
        passedChecks++;
      } else {
        console.log(`   ❌ ${check.desc} - GAGAL (tidak ditemukan)`);
        testPassed = false;
      }
    }
  });
  
  if (testPassed) {
    passedTests++;
  } else {
    failedTests++;
  }
});

console.log('\n' + '='.repeat(60));
console.log('📊 HASIL VERIFIKASI');
console.log('='.repeat(60));
console.log(`✅ Test Passed: ${passedTests}/${tests.length}`);
console.log(`❌ Test Failed: ${failedTests}/${tests.length}`);
console.log(`✅ Checks Passed: ${passedChecks}/${totalChecks}`);
console.log(`❌ Checks Failed: ${totalChecks - passedChecks}/${totalChecks}`);

if (failedTests === 0) {
  console.log('\n🎉 SEMUA TEST BERHASIL!');
  console.log('✅ Footer dan Floating Buttons sudah diperbaiki dengan benar');
  console.log('\n📝 Langkah selanjutnya:');
  console.log('   1. Jalankan: npm run dev');
  console.log('   2. Buka browser dan cek pojok kiri bawah');
  console.log('   3. Scroll ke bawah untuk cek footer');
  console.log('   4. Test di berbagai ukuran layar (mobile, tablet, desktop)');
} else {
  console.log('\n⚠️  Ada beberapa test yang gagal!');
  console.log('   Silakan cek error di atas dan perbaiki file yang bermasalah.');
}

console.log('\n');


