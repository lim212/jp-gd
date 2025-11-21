/**
 * 🧪 TEST SCRIPT - SUPER CACHE UPDATE SYSTEM
 * 
 * Script untuk testing sistem update notification
 * Bisa dijalankan di browser console atau sebagai bookmarklet
 */

// ==================== TEST FUNCTIONS ====================

/**
 * Test 1: Show Update Popup
 */
function testShowPopup() {
  console.log('🧪 TEST 1: Show Update Popup');
  console.log('=====================================');
  
  if (typeof window.showUpdatePopup === 'function') {
    console.log('✅ Function found!');
    console.log('📢 Showing popup...');
    window.showUpdatePopup();
    console.log('✅ Popup triggered!');
    console.log('👀 Check if popup is visible with animations');
  } else {
    console.error('❌ window.showUpdatePopup not found!');
    console.log('💡 Make sure app is fully loaded');
  }
  
  console.log('');
}

/**
 * Test 2: Check Version API
 */
async function testVersionAPI() {
  console.log('🧪 TEST 2: Check Version API');
  console.log('=====================================');
  
  try {
    const response = await fetch('/api/version?t=' + Date.now(), {
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
    console.log('📡 Response Status:', response.status);
    console.log('📋 Response Headers:');
    console.log('  - Cache-Control:', response.headers.get('cache-control'));
    console.log('  - Content-Type:', response.headers.get('content-type'));
    
    const data = await response.json();
    console.log('📦 Response Data:');
    console.log('  - buildId:', data.buildId);
    console.log('  - timestamp:', data.timestamp);
    console.log('  - version:', data.version);
    console.log('  - env:', data.env);
    
    console.log('✅ API working correctly!');
  } catch (error) {
    console.error('❌ API Error:', error);
  }
  
  console.log('');
}

/**
 * Test 3: Check Cache Status
 */
async function testCacheStatus() {
  console.log('🧪 TEST 3: Check Cache Status');
  console.log('=====================================');
  
  try {
    // Check Cache API
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      console.log('💾 Cache Storage:');
      console.log('  - Total Caches:', cacheNames.length);
      console.log('  - Cache Names:', cacheNames);
      
      for (const name of cacheNames) {
        const cache = await caches.open(name);
        const keys = await cache.keys();
        console.log(`  - ${name}: ${keys.length} items`);
      }
    } else {
      console.log('⚠️ Cache API not available');
    }
    
    // Check localStorage
    console.log('');
    console.log('🗄️ LocalStorage:');
    console.log('  - Total Items:', localStorage.length);
    
    const versionKeys = [
      'jp_app_version',
      'jp_build_id',
      'jp_last_version'
    ];
    
    versionKeys.forEach(key => {
      const value = localStorage.getItem(key);
      console.log(`  - ${key}:`, value || 'null');
    });
    
    console.log('✅ Cache status checked!');
  } catch (error) {
    console.error('❌ Cache Error:', error);
  }
  
  console.log('');
}

/**
 * Test 4: Simulate Version Change
 */
async function testVersionChange() {
  console.log('🧪 TEST 4: Simulate Version Change');
  console.log('=====================================');
  console.log('⚠️ This will show update popup!');
  console.log('');
  
  try {
    // Get current version
    const response = await fetch('/api/version?t=' + Date.now());
    const data = await response.json();
    
    console.log('📦 Current Version:');
    console.log('  - buildId:', data.buildId);
    
    // Simulate new version detected
    console.log('');
    console.log('🔄 Simulating new version...');
    
    setTimeout(() => {
      console.log('🎉 New version detected!');
      console.log('📢 Showing update popup...');
      
      if (typeof window.showUpdatePopup === 'function') {
        window.showUpdatePopup();
        console.log('✅ Popup shown!');
      } else {
        console.error('❌ window.showUpdatePopup not found!');
      }
    }, 1000);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
  
  console.log('');
}

/**
 * Test 5: Clear All Cache
 */
async function testClearCache() {
  console.log('🧪 TEST 5: Clear All Cache');
  console.log('=====================================');
  console.log('⚠️ This will clear all caches!');
  console.log('');
  
  try {
    // Clear Cache API
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      console.log('🗑️ Clearing Cache Storage...');
      
      for (const name of cacheNames) {
        await caches.delete(name);
        console.log(`  ✅ Deleted: ${name}`);
      }
      
      console.log('✅ All caches cleared!');
    }
    
    // Clear version-related localStorage
    console.log('');
    console.log('🗑️ Clearing LocalStorage...');
    
    const versionKeys = [
      'jp_app_version',
      'jp_build_id',
      'jp_last_version'
    ];
    
    versionKeys.forEach(key => {
      localStorage.removeItem(key);
      console.log(`  ✅ Removed: ${key}`);
    });
    
    console.log('✅ LocalStorage cleared!');
    console.log('');
    console.log('💡 Tip: Reload page to see fresh content');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
  
  console.log('');
}

/**
 * Test 6: Run All Tests
 */
async function runAllTests() {
  console.clear();
  console.log('🚀 SUPER CACHE UPDATE SYSTEM - TEST SUITE');
  console.log('===========================================');
  console.log('');
  
  await testVersionAPI();
  await new Promise(resolve => setTimeout(resolve, 500));
  
  await testCacheStatus();
  await new Promise(resolve => setTimeout(resolve, 500));
  
  testShowPopup();
  
  console.log('');
  console.log('===========================================');
  console.log('✅ ALL TESTS COMPLETED!');
  console.log('');
  console.log('💡 Available Commands:');
  console.log('  - testShowPopup()        : Show update popup');
  console.log('  - testVersionAPI()       : Check version API');
  console.log('  - testCacheStatus()      : Check cache status');
  console.log('  - testVersionChange()    : Simulate version change');
  console.log('  - testClearCache()       : Clear all cache');
  console.log('  - runAllTests()          : Run all tests');
  console.log('');
}

// ==================== EXPOSE TO WINDOW ====================

window.testShowPopup = testShowPopup;
window.testVersionAPI = testVersionAPI;
window.testCacheStatus = testCacheStatus;
window.testVersionChange = testVersionChange;
window.testClearCache = testClearCache;
window.runAllTests = runAllTests;

// ==================== AUTO RUN ====================

console.log('🧪 TEST FUNCTIONS LOADED!');
console.log('');
console.log('💡 Available Commands:');
console.log('  - testShowPopup()        : Show update popup');
console.log('  - testVersionAPI()       : Check version API');
console.log('  - testCacheStatus()      : Check cache status');
console.log('  - testVersionChange()    : Simulate version change');
console.log('  - testClearCache()       : Clear all cache');
console.log('  - runAllTests()          : Run all tests');
console.log('');
console.log('🚀 Run: runAllTests()');
console.log('');

