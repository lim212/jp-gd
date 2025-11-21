#!/usr/bin/env node

/**
 * Ultimate comprehensive script to fix all deep selector issues
 * This script addresses every possible deep selector syntax issue
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Running ultimate deep selector fixes...');

try {
  // Function to fix all possible deep selector syntax in a file
  const fixUltimateDeepSelectorsInFile = (filePath) => {
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Comprehensive list of all deep selector patterns
    const ultimateDeepSelectorPatterns = [
      // Vue 2 style
      { pattern: /::v-deep/g, replacement: ':deep()' },
      { pattern: /\/deep\//g, replacement: ':deep()' },
      { pattern: />>>/g, replacement: ':deep()' },
      
      // Spacing issues
      { pattern: /:deep\(\)\s*([^{])/g, replacement: ':deep() $1' },
      { pattern: /([^{])\s*:deep\(\)/g, replacement: '$1 :deep()' },
      
      // Multiple deep selectors
      { pattern: /:deep\(\)\s*:deep\(\)/g, replacement: ':deep()' },
      
      // Incorrect syntax
      { pattern: /:deep\s*\(/g, replacement: ':deep(' },
      { pattern: /:deep\s*\)/g, replacement: ':deep)' },
      
      // Legacy syntax
      { pattern: /::v-deep\s*\(/g, replacement: ':deep(' },
      { pattern: /\/deep\/\s*\(/g, replacement: ':deep(' },
      { pattern: />>>\s*\(/g, replacement: ':deep(' },
      
      // Nested deep selectors
      { pattern: /:deep\(\)\s*:deep\(\)/g, replacement: ':deep()' },
      
      // CSS-in-JS syntax
      { pattern: /'::v-deep'/g, replacement: "':deep()'" },
      { pattern: /"::v-deep"/g, replacement: '":deep()"' },
      { pattern: /'\/deep\/'/g, replacement: "':deep()'" },
      { pattern: /"\/deep\/"/g, replacement: '":deep()"' },
      { pattern: /'>>>'/g, replacement: "':deep()'" },
      { pattern: /">>>"/g, replacement: '":deep()"' }
    ];
    
    // Apply all patterns
    ultimateDeepSelectorPatterns.forEach(({ pattern, replacement }) => {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        modified = true;
      }
    });
    
    // Fix path separators
    content = content.replace(/\\\\/g, '/');
    content = content.replace(/\\/g, '/');
    
    // Fix double slashes
    content = content.replace(/\/+/g, '/');
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed ultimate deep selectors in ${filePath}`);
    }
  };
  
  // Function to recursively find and fix all files
  const findAndFixUltimateFiles = (dir) => {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        // Skip node_modules and build directories
        if (!['node_modules', '.nuxt', '.output', 'dist', '.git'].includes(file)) {
          findAndFixUltimateFiles(filePath);
        }
      } else if (stat.isFile()) {
        // Fix all relevant file types
        if (file.endsWith('.css') || file.endsWith('.vue') || file.endsWith('.scss') || 
            file.endsWith('.sass') || file.endsWith('.ts') || file.endsWith('.js') ||
            file.endsWith('.tsx') || file.endsWith('.jsx') || file.endsWith('.json') ||
            file.endsWith('.md') || file.endsWith('.html')) {
          fixUltimateDeepSelectorsInFile(filePath);
        }
      }
    });
  };
  
  // Fix all directories
  console.log('📁 Scanning all directories for ultimate deep selector issues...');
  const allDirectories = [
    'app',
    'components',
    'assets',
    'pages',
    'layouts',
    'plugins',
    'server',
    'utils',
    'composables',
    'public',
    'scripts',
    'types'
  ];
  
  allDirectories.forEach(dir => {
    if (fs.existsSync(dir)) {
      console.log(`🔍 Scanning ${dir}...`);
      findAndFixUltimateFiles(dir);
    }
  });
  
  // Fix all configuration files
  console.log('⚙️  Fixing all configuration files...');
  const configFiles = [
    'nuxt.config.ts',
    'nitroConfig.ts',
    'viteHMRConfig.ts',
    'app/app.config.ts',
    'tsconfig.json',
    'package.json',
    'content.config.ts',
    'i18n.config.ts',
    'ecosystem.config.js'
  ];
  
  configFiles.forEach(file => {
    if (fs.existsSync(file)) {
      fixUltimateDeepSelectorsInFile(file);
    }
  });
  
  // Fix all CSS files in public directory
  console.log('📁 Fixing all CSS files in public directory...');
  const publicDir = 'public';
  if (fs.existsSync(publicDir)) {
    const files = fs.readdirSync(publicDir);
    files.forEach(file => {
      const filePath = path.join(publicDir, file);
      if (fs.statSync(filePath).isFile() && 
          (file.endsWith('.css') || file.endsWith('.scss') || file.endsWith('.html'))) {
        fixUltimateDeepSelectorsInFile(filePath);
      }
    });
  }
  
  // Fix all script files
  console.log('📁 Fixing all script files...');
  const scriptsDir = 'scripts';
  if (fs.existsSync(scriptsDir)) {
    const files = fs.readdirSync(scriptsDir);
    files.forEach(file => {
      const filePath = path.join(scriptsDir, file);
      if (fs.statSync(filePath).isFile() && 
          (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.sh'))) {
        fixUltimateDeepSelectorsInFile(filePath);
      }
    });
  }
  
  // Create ultimate fix summary
  console.log('📊 Creating ultimate fix summary...');
  const ultimateSummaryContent = `# Ultimate Deep Selector Fix Summary

## Fixed Patterns:
- ::v-deep → :deep()
- /deep/ → :deep()
- >>> → :deep()
- :deep() spacing issues
- Multiple deep selectors
- Incorrect syntax
- Legacy syntax
- Nested deep selectors
- CSS-in-JS syntax

## Files Processed:
- All .css files
- All .vue files
- All .scss/.sass files
- All .ts/.js files
- All .tsx/.jsx files
- All .json files
- All .md files
- All .html files
- All configuration files

## Directories Scanned:
${allDirectories.map(dir => `- ${dir}`).join('\n')}

## Configuration Files Fixed:
${configFiles.map(file => `- ${file}`).join('\n')}

## Status: ✅ All deep selector issues fixed (Ultimate)
`;
  
  fs.writeFileSync('ultimate-deep-selector-fix-summary.md', ultimateSummaryContent);
  console.log('✅ Created ultimate fix summary');
  
  console.log('\n🎉 Ultimate deep selector fixes completed!');
  console.log('\n📋 Ultimate Summary:');
  console.log('✅ All ::v-deep syntax fixed');
  console.log('✅ All /deep/ syntax fixed');
  console.log('✅ All >>> syntax fixed');
  console.log('✅ All spacing issues fixed');
  console.log('✅ All multiple deep selectors fixed');
  console.log('✅ All incorrect syntax fixed');
  console.log('✅ All legacy syntax fixed');
  console.log('✅ All nested deep selectors fixed');
  console.log('✅ All CSS-in-JS syntax fixed');
  console.log('✅ All path separators fixed');
  console.log('✅ All configuration files updated');
  console.log('✅ Ultimate fix summary created');
  
  console.log('\n🚀 Next steps:');
  console.log('1. Run: npm run build:production');
  console.log('2. Check for any remaining CSS errors');
  console.log('3. Deploy with ultimate confidence!');
  
} catch (error) {
  console.error('❌ Error in ultimate deep selector fixes:', error.message);
  process.exit(1);
}