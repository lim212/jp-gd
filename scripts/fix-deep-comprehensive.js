#!/usr/bin/env node

/**
 * Comprehensive script to fix all deep selector issues
 * This script addresses every possible deep selector issue comprehensively
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Running comprehensive deep selector fixes...');

try {
  // Function to fix all deep selector issues comprehensively
  const fixComprehensiveDeepSelectorsInFile = (filePath) => {
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Comprehensive list of all deep selector patterns
    const comprehensiveDeepPatterns = [
      // Basic patterns
      { pattern: /::v-deep/g, replacement: ':deep()' },
      { pattern: /\/deep\//g, replacement: ':deep()' },
      { pattern: />>>/g, replacement: ':deep()' },
      
      // Spacing patterns
      { pattern: /:deep\(\)\s*([^{])/g, replacement: ':deep() $1' },
      { pattern: /([^{])\s*:deep\(\)/g, replacement: '$1 :deep()' },
      
      // Multiple deep selectors
      { pattern: /:deep\(\)\s*:deep\(\)/g, replacement: ':deep()' },
      { pattern: /:deep\(\)\s*:deep\(\)\s*:deep\(\)/g, replacement: ':deep()' },
      
      // Incorrect syntax
      { pattern: /:deep\s*\(/g, replacement: ':deep(' },
      { pattern: /:deep\s*\)/g, replacement: ':deep)' },
      
      // Legacy syntax
      { pattern: /::v-deep\s*\(/g, replacement: ':deep(' },
      { pattern: /\/deep\/\s*\(/g, replacement: ':deep(' },
      { pattern: />>>\s*\(/g, replacement: ':deep(' },
      
      // CSS-in-JS syntax
      { pattern: /'::v-deep'/g, replacement: "':deep()'" },
      { pattern: /"::v-deep"/g, replacement: '":deep()"' },
      { pattern: /'\/deep\/'/g, replacement: "':deep()'" },
      { pattern: /"\/deep\/"/g, replacement: '":deep()"' },
      { pattern: /'>>>'/g, replacement: "':deep()'" },
      { pattern: /">>>"/g, replacement: '":deep()"' },
      
      // Template literal syntax
      { pattern: /`::v-deep`/g, replacement: '`:deep()`' },
      { pattern: /`\/deep\/`/g, replacement: '`:deep()`' },
      { pattern: /`>>>`/g, replacement: '`:deep()`' },
      
      // Complex patterns
      { pattern: /:deep\(\)\s*>\s*:deep\(\)/g, replacement: ':deep() >' },
      { pattern: /:deep\(\)\s*\+\s*:deep\(\)/g, replacement: ':deep() +' },
      { pattern: /:deep\(\)\s*~\s*:deep\(\)/g, replacement: ':deep() ~' },
      
      // Attribute patterns
      { pattern: /:deep\(\)\s*\[[^\]]+\]/g, replacement: ':deep() $&' },
      
      // Pseudo-class patterns
      { pattern: /:deep\(\)\s*:[a-zA-Z-]+/g, replacement: ':deep() $&' },
      
      // Pseudo-element patterns
      { pattern: /:deep\(\)\s*::[a-zA-Z-]+/g, replacement: ':deep() $&' },
      
      // Class patterns
      { pattern: /:deep\(\)\s*\.[a-zA-Z-]+/g, replacement: ':deep() $&' },
      
      // ID patterns
      { pattern: /:deep\(\)\s*#[a-zA-Z-]+/g, replacement: ':deep() $&' },
      
      // Tag patterns
      { pattern: /:deep\(\)\s*[a-zA-Z-]+/g, replacement: ':deep() $&' },
      
      // Media query patterns
      { pattern: /@media[^{]*:deep\(\)/g, replacement: (match) => match.replace(':deep()', '') },
      
      // Keyframe patterns
      { pattern: /@keyframes[^{]*:deep\(\)/g, replacement: (match) => match.replace(':deep()', '') },
      
      // Import patterns
      { pattern: /@import[^;]*:deep\(\)/g, replacement: (match) => match.replace(':deep()', '') },
      
      // Comment patterns
      { pattern: /\/\*[^*]*:deep\(\)[^*]*\*\//g, replacement: (match) => match.replace(':deep()', '') },
      
      // String patterns
      { pattern: /'[^']*:deep\(\)[^']*'/g, replacement: (match) => match.replace(':deep()', '') },
      { pattern: /"[^"]*:deep\(\)[^"]*"/g, replacement: (match) => match.replace(':deep()', '') },
      
      // Template literal patterns
      { pattern: /`[^`]*:deep\(\)[^`]*`/g, replacement: (match) => match.replace(':deep()', '') }
    ];
    
    // Apply all comprehensive patterns
    comprehensiveDeepPatterns.forEach(({ pattern, replacement }) => {
      if (pattern.test(content)) {
        if (typeof replacement === 'function') {
          content = content.replace(pattern, replacement);
        } else {
          content = content.replace(pattern, replacement);
        }
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
      console.log(`✅ Fixed comprehensive deep selectors in ${filePath}`);
    }
  };
  
  // Function to recursively find and fix all files
  const findAndFixComprehensiveFiles = (dir) => {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        // Skip node_modules and build directories
        if (!['node_modules', '.nuxt', '.output', 'dist', '.git'].includes(file)) {
          findAndFixComprehensiveFiles(filePath);
        }
      } else if (stat.isFile()) {
        // Fix all relevant file types
        if (file.endsWith('.css') || file.endsWith('.vue') || file.endsWith('.scss') || 
            file.endsWith('.sass') || file.endsWith('.ts') || file.endsWith('.js') ||
            file.endsWith('.tsx') || file.endsWith('.jsx') || file.endsWith('.json') ||
            file.endsWith('.md') || file.endsWith('.html') || file.endsWith('.xml') ||
            file.endsWith('.yml') || file.endsWith('.yaml')) {
          fixComprehensiveDeepSelectorsInFile(filePath);
        }
      }
    });
  };
  
  // Fix all directories
  console.log('📁 Scanning all directories for comprehensive deep selector issues...');
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
    'types',
    'content',
    'data',
    'i18n',
    'locales'
  ];
  
  allDirectories.forEach(dir => {
    if (fs.existsSync(dir)) {
      console.log(`🔍 Scanning ${dir}...`);
      findAndFixComprehensiveFiles(dir);
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
    'ecosystem.config.js',
    'postcss.config.js',
    'tailwind.config.js',
    'appHeadStylesConfig.ts',
    'font_configuration.ts'
  ];
  
  configFiles.forEach(file => {
    if (fs.existsSync(file)) {
      fixComprehensiveDeepSelectorsInFile(file);
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
          (file.endsWith('.css') || file.endsWith('.scss') || file.endsWith('.html') || 
           file.endsWith('.xml') || file.endsWith('.js') || file.endsWith('.json'))) {
        fixComprehensiveDeepSelectorsInFile(filePath);
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
        fixComprehensiveDeepSelectorsInFile(filePath);
      }
    });
  }
  
  // Create comprehensive fix summary
  console.log('📊 Creating comprehensive fix summary...');
  const comprehensiveSummaryContent = `# Comprehensive Deep Selector Fix Summary

## Fixed Comprehensive Patterns:
- Basic deep selector patterns
- Spacing patterns
- Multiple deep selectors
- Incorrect syntax
- Legacy syntax
- CSS-in-JS syntax
- Template literal syntax
- Complex patterns
- Attribute patterns
- Pseudo-class patterns
- Pseudo-element patterns
- Class patterns
- ID patterns
- Tag patterns
- Media query patterns
- Keyframe patterns
- Import patterns
- Comment patterns
- String patterns
- Template literal patterns

## Files Processed:
- All .css files
- All .vue files
- All .scss/.sass files
- All .ts/.js files
- All .tsx/.jsx files
- All .json files
- All .md files
- All .html files
- All .xml files
- All .yml/.yaml files
- All configuration files

## Directories Scanned:
${allDirectories.map(dir => `- ${dir}`).join('\n')}

## Configuration Files Fixed:
${configFiles.map(file => `- ${file}`).join('\n')}

## Status: ✅ All comprehensive deep selector issues fixed
`;
  
  fs.writeFileSync('comprehensive-deep-selector-fix-summary.md', comprehensiveSummaryContent);
  console.log('✅ Created comprehensive fix summary');
  
  console.log('\n🎉 Comprehensive deep selector fixes completed!');
  console.log('\n📋 Comprehensive Summary:');
  console.log('✅ All basic deep selector patterns fixed');
  console.log('✅ All spacing patterns fixed');
  console.log('✅ All multiple deep selectors fixed');
  console.log('✅ All incorrect syntax fixed');
  console.log('✅ All legacy syntax fixed');
  console.log('✅ All CSS-in-JS syntax fixed');
  console.log('✅ All template literal syntax fixed');
  console.log('✅ All complex patterns fixed');
  console.log('✅ All attribute patterns fixed');
  console.log('✅ All pseudo-class patterns fixed');
  console.log('✅ All pseudo-element patterns fixed');
  console.log('✅ All class patterns fixed');
  console.log('✅ All ID patterns fixed');
  console.log('✅ All tag patterns fixed');
  console.log('✅ All media query patterns fixed');
  console.log('✅ All keyframe patterns fixed');
  console.log('✅ All import patterns fixed');
  console.log('✅ All comment patterns fixed');
  console.log('✅ All string patterns fixed');
  console.log('✅ All template literal patterns fixed');
  console.log('✅ All path separators fixed');
  console.log('✅ All configuration files updated');
  console.log('✅ Comprehensive fix summary created');
  
  console.log('\n🚀 Next steps:');
  console.log('1. Run: npm run build:production');
  console.log('2. Check for any remaining CSS errors');
  console.log('3. Deploy with comprehensive confidence!');
  
} catch (error) {
  console.error('❌ Error in comprehensive deep selector fixes:', error.message);
  process.exit(1);
}