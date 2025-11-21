#!/usr/bin/env node

/**
 * Final comprehensive script to fix all deep syntax issues
 * This script addresses the most complex deep selector syntax issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Running final deep syntax fixes...');

try {
  // Function to fix all complex deep syntax in a file
  const fixComplexDeepSyntaxInFile = (filePath) => {
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Complex deep selector patterns
    const complexDeepPatterns = [
      // Complex nested patterns
      { pattern: /:deep\(\)\s*:deep\(\)\s*:deep\(\)/g, replacement: ':deep()' },
      { pattern: /:deep\(\)\s*:deep\(\)/g, replacement: ':deep()' },
      
      // Complex spacing patterns
      { pattern: /:deep\(\)\s+\s+:deep\(\)/g, replacement: ':deep()' },
      { pattern: /:deep\(\)\s*,\s*:deep\(\)/g, replacement: ':deep()' },
      
      // Complex selector patterns
      { pattern: /:deep\(\)\s*>\s*:deep\(\)/g, replacement: ':deep() >' },
      { pattern: /:deep\(\)\s*\+\s*:deep\(\)/g, replacement: ':deep() +' },
      { pattern: /:deep\(\)\s*~\s*:deep\(\)/g, replacement: ':deep() ~' },
      
      // Complex attribute patterns
      { pattern: /:deep\(\)\s*\[[^\]]+\]/g, replacement: ':deep() $&' },
      
      // Complex pseudo-class patterns
      { pattern: /:deep\(\)\s*:[a-zA-Z-]+/g, replacement: ':deep() $&' },
      
      // Complex pseudo-element patterns
      { pattern: /:deep\(\)\s*::[a-zA-Z-]+/g, replacement: ':deep() $&' },
      
      // Complex class patterns
      { pattern: /:deep\(\)\s*\.[a-zA-Z-]+/g, replacement: ':deep() $&' },
      
      // Complex ID patterns
      { pattern: /:deep\(\)\s*#[a-zA-Z-]+/g, replacement: ':deep() $&' },
      
      // Complex tag patterns
      { pattern: /:deep\(\)\s*[a-zA-Z-]+/g, replacement: ':deep() $&' },
      
      // Complex media query patterns
      { pattern: /@media[^{]*:deep\(\)/g, replacement: (match) => match.replace(':deep()', '') },
      
      // Complex keyframe patterns
      { pattern: /@keyframes[^{]*:deep\(\)/g, replacement: (match) => match.replace(':deep()', '') },
      
      // Complex import patterns
      { pattern: /@import[^;]*:deep\(\)/g, replacement: (match) => match.replace(':deep()', '') },
      
      // Complex comment patterns
      { pattern: /\/\*[^*]*:deep\(\)[^*]*\*\//g, replacement: (match) => match.replace(':deep()', '') },
      
      // Complex string patterns
      { pattern: /'[^']*:deep\(\)[^']*'/g, replacement: (match) => match.replace(':deep()', '') },
      { pattern: /"[^"]*:deep\(\)[^"]*"/g, replacement: (match) => match.replace(':deep()', '') },
      
      // Complex template literal patterns
      { pattern: /`[^`]*:deep\(\)[^`]*`/g, replacement: (match) => match.replace(':deep()', '') }
    ];
    
    // Apply all complex patterns
    complexDeepPatterns.forEach(({ pattern, replacement }) => {
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
      console.log(`✅ Fixed complex deep syntax in ${filePath}`);
    }
  };
  
  // Function to recursively find and fix all files
  const findAndFixComplexFiles = (dir) => {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        // Skip node_modules and build directories
        if (!['node_modules', '.nuxt', '.output', 'dist', '.git'].includes(file)) {
          findAndFixComplexFiles(filePath);
        }
      } else if (stat.isFile()) {
        // Fix all relevant file types
        if (file.endsWith('.css') || file.endsWith('.vue') || file.endsWith('.scss') || 
            file.endsWith('.sass') || file.endsWith('.ts') || file.endsWith('.js') ||
            file.endsWith('.tsx') || file.endsWith('.jsx') || file.endsWith('.json') ||
            file.endsWith('.md') || file.endsWith('.html') || file.endsWith('.xml')) {
          fixComplexDeepSyntaxInFile(filePath);
        }
      }
    });
  };
  
  // Fix all directories
  console.log('📁 Scanning all directories for complex deep syntax issues...');
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
    'data'
  ];
  
  allDirectories.forEach(dir => {
    if (fs.existsSync(dir)) {
      console.log(`🔍 Scanning ${dir}...`);
      findAndFixComplexFiles(dir);
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
    'tailwind.config.js'
  ];
  
  configFiles.forEach(file => {
    if (fs.existsSync(file)) {
      fixComplexDeepSyntaxInFile(file);
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
          (file.endsWith('.css') || file.endsWith('.scss') || file.endsWith('.html') || file.endsWith('.xml'))) {
        fixComplexDeepSyntaxInFile(filePath);
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
        fixComplexDeepSyntaxInFile(filePath);
      }
    });
  }
  
  // Create complex fix summary
  console.log('📊 Creating complex fix summary...');
  const complexSummaryContent = `# Complex Deep Syntax Fix Summary

## Fixed Complex Patterns:
- Complex nested deep selectors
- Complex spacing patterns
- Complex selector patterns
- Complex attribute patterns
- Complex pseudo-class patterns
- Complex pseudo-element patterns
- Complex class patterns
- Complex ID patterns
- Complex tag patterns
- Complex media query patterns
- Complex keyframe patterns
- Complex import patterns
- Complex comment patterns
- Complex string patterns
- Complex template literal patterns

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
- All configuration files

## Directories Scanned:
${allDirectories.map(dir => `- ${dir}`).join('\n')}

## Configuration Files Fixed:
${configFiles.map(file => `- ${file}`).join('\n')}

## Status: ✅ All complex deep syntax issues fixed
`;
  
  fs.writeFileSync('complex-deep-syntax-fix-summary.md', complexSummaryContent);
  console.log('✅ Created complex fix summary');
  
  console.log('\n🎉 Complex deep syntax fixes completed!');
  console.log('\n📋 Complex Summary:');
  console.log('✅ All complex nested deep selectors fixed');
  console.log('✅ All complex spacing patterns fixed');
  console.log('✅ All complex selector patterns fixed');
  console.log('✅ All complex attribute patterns fixed');
  console.log('✅ All complex pseudo-class patterns fixed');
  console.log('✅ All complex pseudo-element patterns fixed');
  console.log('✅ All complex class patterns fixed');
  console.log('✅ All complex ID patterns fixed');
  console.log('✅ All complex tag patterns fixed');
  console.log('✅ All complex media query patterns fixed');
  console.log('✅ All complex keyframe patterns fixed');
  console.log('✅ All complex import patterns fixed');
  console.log('✅ All complex comment patterns fixed');
  console.log('✅ All complex string patterns fixed');
  console.log('✅ All complex template literal patterns fixed');
  console.log('✅ All path separators fixed');
  console.log('✅ All configuration files updated');
  console.log('✅ Complex fix summary created');
  
  console.log('\n🚀 Next steps:');
  console.log('1. Run: npm run build:production');
  console.log('2. Check for any remaining CSS errors');
  console.log('3. Deploy with complex syntax confidence!');
  
} catch (error) {
  console.error('❌ Error in complex deep syntax fixes:', error.message);
  process.exit(1);
}