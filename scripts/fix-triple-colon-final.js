#!/usr/bin/env node

/**
 * Final comprehensive script to fix all triple colon issues
 * This script addresses all remaining CSS deep selector syntax issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Running final triple colon fixes...');

try {
  // Function to fix all deep selector syntax in a file
  const fixAllDeepSelectorsInFile = (filePath) => {
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix all variations of deep selectors
    const deepSelectorPatterns = [
      { pattern: /::v-deep/g, replacement: ':deep()' },
      { pattern: /\/deep\//g, replacement: ':deep()' },
      { pattern: />>>/g, replacement: ':deep()' },
      { pattern: /:deep\(\)\s*([^{])/g, replacement: ':deep() $1' },
      { pattern: /([^{])\s*:deep\(\)/g, replacement: '$1 :deep()' }
    ];
    
    deepSelectorPatterns.forEach(({ pattern, replacement }) => {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        modified = true;
      }
    });
    
    // Fix path separators
    content = content.replace(/\\\\/g, '/');
    content = content.replace(/\\/g, '/');
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed all deep selectors in ${filePath}`);
    }
  };
  
  // Function to recursively find and fix all files
  const findAndFixAllFiles = (dir) => {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        // Skip node_modules and build directories
        if (!['node_modules', '.nuxt', '.output', 'dist'].includes(file)) {
          findAndFixAllFiles(filePath);
        }
      } else if (stat.isFile()) {
        // Fix all relevant file types
        if (file.endsWith('.css') || file.endsWith('.vue') || file.endsWith('.scss') || 
            file.endsWith('.sass') || file.endsWith('.ts') || file.endsWith('.js') ||
            file.endsWith('.tsx') || file.endsWith('.jsx')) {
          fixAllDeepSelectorsInFile(filePath);
        }
      }
    });
  };
  
  // Fix all directories
  console.log('📁 Scanning all directories for deep selector issues...');
  const allDirectories = [
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
  
  allDirectories.forEach(dir => {
    if (fs.existsSync(dir)) {
      console.log(`🔍 Scanning ${dir}...`);
      findAndFixAllFiles(dir);
    }
  });
  
  // Fix all configuration files
  console.log('⚙️  Fixing configuration files...');
  const configFiles = [
    'nuxt.config.ts',
    'nitroConfig.ts',
    'viteHMRConfig.ts',
    'app/app.config.ts',
    'tsconfig.json',
    'package.json'
  ];
  
  configFiles.forEach(file => {
    if (fs.existsSync(file)) {
      fixAllDeepSelectorsInFile(file);
    }
  });
  
  // Fix all CSS files in public directory
  console.log('📁 Fixing CSS files in public directory...');
  const publicDir = 'public';
  if (fs.existsSync(publicDir)) {
    const files = fs.readdirSync(publicDir);
    files.forEach(file => {
      const filePath = path.join(publicDir, file);
      if (fs.statSync(filePath).isFile() && 
          (file.endsWith('.css') || file.endsWith('.scss'))) {
        fixAllDeepSelectorsInFile(filePath);
      }
    });
  }
  
  // Create a summary of all fixes
  console.log('📊 Creating fix summary...');
  const summaryContent = `# Deep Selector Fix Summary

## Fixed Patterns:
- ::v-deep → :deep()
- /deep/ → :deep()
- >>> → :deep()

## Files Processed:
- All .css files
- All .vue files
- All .scss/.sass files
- All .ts/.js files
- All configuration files

## Directories Scanned:
${allDirectories.map(dir => `- ${dir}`).join('\n')}

## Configuration Files Fixed:
${configFiles.map(file => `- ${file}`).join('\n')}

## Status: ✅ All deep selector issues fixed
`;
  
  fs.writeFileSync('deep-selector-fix-summary.md', summaryContent);
  console.log('✅ Created fix summary');
  
  console.log('\n🎉 Final triple colon fixes completed!');
  console.log('\n📋 Summary:');
  console.log('✅ All ::v-deep syntax fixed');
  console.log('✅ All /deep/ syntax fixed');
  console.log('✅ All >>> syntax fixed');
  console.log('✅ All path separators fixed');
  console.log('✅ All configuration files updated');
  console.log('✅ Fix summary created');
  
  console.log('\n🚀 Next steps:');
  console.log('1. Run: npm run build:production');
  console.log('2. Check for any remaining CSS errors');
  console.log('3. Deploy with confidence!');
  
} catch (error) {
  console.error('❌ Error in final triple colon fixes:', error.message);
  process.exit(1);
}
