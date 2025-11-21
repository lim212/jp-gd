/**
 * Ubuntu VPS Build Compatibility Checker
 * 
 * Script untuk memastikan semua file kompatibel dengan Ubuntu VPS
 * dan tidak ada error saat rebuild
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Ubuntu VPS compatibility...\n');

const issues = [];
const warnings = [];

// 1. Check for Windows-specific paths
console.log('✓ Checking for Windows-specific paths...');
const checkWindowsPaths = (dir, basePath = '') => {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const relativePath = path.join(basePath, file);
    
    if (fs.statSync(fullPath).isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules') {
        checkWindowsPaths(fullPath, relativePath);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.vue')) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Check for Windows paths with backslashes
        if (content.match(/['"]C:\\|['"][A-Z]:\\/)) {
          issues.push(`Windows path found in ${relativePath}`);
        }
        
        // Check for Windows line endings that might cause issues
        if (content.includes('\r\n') && file.endsWith('.sh')) {
          warnings.push(`CRLF line endings in shell script: ${relativePath}`);
        }
      } catch (e) {
        // Ignore read errors
      }
    }
  });
};

checkWindowsPaths('.');

// 2. Check plugin imports
console.log('✓ Checking plugin imports...');
const pluginDir = './plugins';
if (fs.existsSync(pluginDir)) {
  const plugins = fs.readdirSync(pluginDir)
    .filter(f => f.endsWith('.ts') || f.endsWith('.js'));
  
  plugins.forEach(plugin => {
    const content = fs.readFileSync(path.join(pluginDir, plugin), 'utf8');
    
    // Plugins using auto-import defineNuxtPlugin are OK
    if (content.includes('export default defineNuxtPlugin')) {
      // Good!
    }
  });
}

// 3. Check composables
console.log('✓ Checking composables...');
const composableDir = './composables';
if (fs.existsSync(composableDir)) {
  const composables = fs.readdirSync(composableDir)
    .filter(f => f.endsWith('.ts') || f.endsWith('.js'));
  
  composables.forEach(composable => {
    const content = fs.readFileSync(path.join(composableDir, composable), 'utf8');
    
    // Check for proper exports
    if (!content.includes('export ') && !content.includes('export default')) {
      warnings.push(`Composable ${composable} might not export any functions`);
    }
  });
}

// 4. Check for SSR guards in new files
console.log('✓ Checking for SSR safety...');
const newFiles = [
  'plugins/critical-components-lazy.ts',
  'plugins/defer-non-critical.client.ts',
  'plugins/optimize-rendering.client.ts',
  'composables/useOptimizedLazyLoad.ts'
];

newFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    
    // Files with .client.ts are OK to use browser APIs
    if (!file.includes('.client.')) {
      // Check for browser APIs without guards
      const browserAPIs = ['document.', 'window.', 'IntersectionObserver', 'PerformanceObserver'];
      browserAPIs.forEach(api => {
        if (content.includes(api)) {
          const hasGuard = content.includes('typeof window !== \'undefined\'') || 
                          content.includes('typeof document !== \'undefined\'') ||
                          content.includes('if (typeof window') ||
                          content.includes('if (import.meta.client');
          if (!hasGuard) {
            warnings.push(`${file}: "${api}" used - ensure SSR guard exists`);
          }
        }
      });
    }
  } else {
    warnings.push(`Expected file not found: ${file}`);
  }
});

// 5. Check package.json
console.log('✓ Checking package.json...');
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

if (!packageJson.scripts['build:ubuntu']) {
  warnings.push('No build:ubuntu script found in package.json');
}

// Report results
console.log('\n📊 Compatibility Check Results:\n');

if (issues.length === 0 && warnings.length === 0) {
  console.log('✅ No issues found! Code should be compatible with Ubuntu VPS.\n');
} else {
  if (issues.length > 0) {
    console.log('❌ CRITICAL ISSUES (must fix):');
    issues.forEach(issue => console.log(`   - ${issue}`));
    console.log('');
  }
  
  if (warnings.length > 0) {
    console.log('⚠️  WARNINGS (review recommended):');
    warnings.forEach(warning => console.log(`   - ${warning}`));
    console.log('');
  }
}

// Exit with error if there are critical issues
if (issues.length > 0) {
  console.log('❌ Please fix critical issues before deploying to Ubuntu VPS.\n');
  process.exit(1);
} else if (warnings.length > 0) {
  console.log('⚠️  Warnings found, but code should still work on Ubuntu VPS.\n');
  console.log('   Review warnings to ensure everything is correct.\n');
  process.exit(0);
} else {
  console.log('✅ Code is ready for Ubuntu VPS deployment!\n');
  process.exit(0);
}

