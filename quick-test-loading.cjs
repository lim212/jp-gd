/**
 * Quick Test Script for Super Loading Screen
 * 
 * Run this to verify all files are in place
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Super Loading Screen - Quick Test\n');
console.log('=====================================\n');

// Files to check
const filesToCheck = [
  {
    path: 'app/components/SuperLoadingScreen.vue',
    name: 'SuperLoadingScreen Component',
    required: true
  },
  {
    path: 'plugins/smart-resource-tracker.client.ts',
    name: 'Smart Resource Tracker Plugin',
    required: true
  },
  {
    path: 'app/assets/css/super-loading-screen.css',
    name: 'Super Loading CSS',
    required: true
  },
  {
    path: 'app/app.vue',
    name: 'App.vue (Integration)',
    required: true
  },
  {
    path: 'SUPER-LOADING-SCREEN-COMPLETE.md',
    name: 'Complete Documentation',
    required: false
  },
  {
    path: 'CARA-PAKAI-SUPER-LOADING.md',
    name: 'Quick Start Guide',
    required: false
  },
  {
    path: 'TEST-SUPER-LOADING-CHECKLIST.md',
    name: 'Test Checklist',
    required: false
  },
  {
    path: 'TROUBLESHOOTING-LOADING.md',
    name: 'Troubleshooting Guide',
    required: false
  }
];

let allPassed = true;
let requiredPassed = true;

console.log('📁 Checking Files:\n');

filesToCheck.forEach((file, index) => {
  const filePath = path.join(process.cwd(), file.path);
  const exists = fs.existsSync(filePath);
  
  const status = exists ? '✅' : '❌';
  const required = file.required ? '[REQUIRED]' : '[OPTIONAL]';
  
  console.log(`${index + 1}. ${status} ${file.name} ${required}`);
  console.log(`   Path: ${file.path}`);
  
  if (exists) {
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`   Size: ${sizeKB} KB`);
  } else {
    console.log(`   ⚠️  File not found!`);
    if (file.required) {
      requiredPassed = false;
    }
    allPassed = false;
  }
  
  console.log('');
});

console.log('=====================================\n');

// Check app.vue integration
console.log('🔧 Checking app.vue Integration:\n');

try {
  const appVuePath = path.join(process.cwd(), 'app/app.vue');
  const appVueContent = fs.readFileSync(appVuePath, 'utf8');
  
  const checks = [
    {
      name: 'Import SuperLoadingScreen',
      pattern: /import SuperLoadingScreen from/,
      required: true
    },
    {
      name: 'showLoader ref',
      pattern: /const showLoader = ref\(true\)/,
      required: true
    },
    {
      name: 'appReady ref',
      pattern: /const appReady = ref\(false\)/,
      required: true
    },
    {
      name: 'handleLoaderComplete function',
      pattern: /const handleLoaderComplete/,
      required: true
    },
    {
      name: 'SuperLoadingScreen component in template',
      pattern: /<SuperLoadingScreen/,
      required: true
    },
    {
      name: 'CSS import',
      pattern: /@import url\('\.\/assets\/css\/super-loading-screen\.css'\)/,
      required: true
    }
  ];
  
  checks.forEach((check, index) => {
    const found = check.pattern.test(appVueContent);
    const status = found ? '✅' : '❌';
    console.log(`${index + 1}. ${status} ${check.name}`);
    
    if (!found && check.required) {
      requiredPassed = false;
      allPassed = false;
    }
  });
  
  console.log('');
} catch (error) {
  console.log('❌ Error reading app.vue:', error.message);
  console.log('');
  allPassed = false;
  requiredPassed = false;
}

console.log('=====================================\n');

// Final results
console.log('📊 Test Results:\n');

if (allPassed) {
  console.log('✅ ALL TESTS PASSED!');
  console.log('🎉 Super Loading Screen is ready to use!\n');
  console.log('Next steps:');
  console.log('  1. Run: npm run dev');
  console.log('  2. Open browser: http://localhost:3000');
  console.log('  3. Check console for: 🚀 Super Loading Screen initialized');
  console.log('  4. Test smart mode: DevTools → Network → Slow 3G\n');
} else if (requiredPassed) {
  console.log('⚠️  OPTIONAL FILES MISSING');
  console.log('✅ Required files are OK - Should work!');
  console.log('💡 Missing optional files (documentation only)\n');
} else {
  console.log('❌ REQUIRED FILES MISSING!');
  console.log('⚠️  Super Loading Screen may not work properly\n');
  console.log('🔧 Fixes needed:');
  
  filesToCheck.forEach((file) => {
    if (file.required) {
      const filePath = path.join(process.cwd(), file.path);
      if (!fs.existsSync(filePath)) {
        console.log(`  ❌ Create: ${file.path}`);
      }
    }
  });
  
  console.log('\n📖 See: TROUBLESHOOTING-LOADING.md for help\n');
}

console.log('=====================================\n');

// Exit code
process.exit(allPassed ? 0 : 1);

