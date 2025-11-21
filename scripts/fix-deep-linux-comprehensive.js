#!/usr/bin/env node

/**
 * Cross-platform script to fix deep selector issues on Linux
 * This script addresses CSS deep selector syntax issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing deep selector issues for Linux...');

try {
  // Function to fix deep selectors in a file
  const fixDeepSelectorsInFile = (filePath) => {
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix ::v-deep syntax (Vue 2 style)
    if (content.includes('::v-deep')) {
      content = content.replace(/::v-deep/g, ':deep()');
      modified = true;
    }
    
    // Fix /deep/ syntax (deprecated)
    if (content.includes('/deep/')) {
      content = content.replace(/\/deep\//g, ':deep()');
      modified = true;
    }
    
    // Fix >>> syntax (deprecated)
    if (content.includes('>>>')) {
      content = content.replace(/>>>/g, ':deep()');
      modified = true;
    }
    
    // Fix :deep() syntax issues
    if (content.includes(':deep()')) {
      // Ensure proper spacing around :deep()
      content = content.replace(/:deep\(\)\s*([^{])/g, ':deep() $1');
      content = content.replace(/([^{])\s*:deep\(\)/g, '$1 :deep()');
      modified = true;
    }
    
    // Fix path separators
    content = content.replace(/\\\\/g, '/');
    content = content.replace(/\\/g, '/');
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed deep selectors in ${filePath}`);
    }
  };
  
  // Function to recursively find and fix CSS/Vue files
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
        // Fix CSS and Vue files
        if (file.endsWith('.css') || file.endsWith('.vue') || file.endsWith('.scss') || file.endsWith('.sass')) {
          fixDeepSelectorsInFile(filePath);
        }
      }
    });
  };
  
  // Fix files in common directories
  console.log('📁 Scanning for CSS and Vue files...');
  const directoriesToScan = [
    'app',
    'components',
    'assets',
    'pages',
    'layouts',
    'plugins'
  ];
  
  directoriesToScan.forEach(dir => {
    if (fs.existsSync(dir)) {
      console.log(`🔍 Scanning ${dir}...`);
      findAndFixFiles(dir);
    }
  });
  
  // Fix specific known problematic files
  const knownFiles = [
    'app/assets/css/main.css',
    'app/assets/css/critical.css',
    'assets/css/blog-responsive-improvements.css',
    'assets/css/critical.css'
  ];
  
  knownFiles.forEach(file => {
    if (fs.existsSync(file)) {
      fixDeepSelectorsInFile(file);
    }
  });
  
  console.log('✅ Deep selector issues fixed for Linux!');
  
} catch (error) {
  console.error('❌ Error fixing deep selector issues:', error.message);
  process.exit(1);
}
