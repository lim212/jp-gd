#!/usr/bin/env node

/**
 * Cross-platform script to fix triple colon issues
 * This script addresses CSS triple colon syntax issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing triple colon issues...');

try {
  // Function to fix triple colon in a file
  const fixTripleColonInFile = (filePath) => {
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix triple colon syntax (>>>)
    if (content.includes('>>>')) {
      content = content.replace(/>>>/g, ':deep()');
      modified = true;
    }
    
    // Fix double colon with v-deep
    if (content.includes('::v-deep')) {
      content = content.replace(/::v-deep/g, ':deep()');
      modified = true;
    }
    
    // Fix /deep/ syntax
    if (content.includes('/deep/')) {
      content = content.replace(/\/deep\//g, ':deep()');
      modified = true;
    }
    
    // Fix path separators
    content = content.replace(/\\\\/g, '/');
    content = content.replace(/\\/g, '/');
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed triple colon in ${filePath}`);
    }
  };
  
  // Function to recursively find and fix files
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
        // Fix CSS, Vue, and TypeScript files
        if (file.endsWith('.css') || file.endsWith('.vue') || file.endsWith('.scss') || file.endsWith('.sass') || file.endsWith('.ts') || file.endsWith('.js')) {
          fixTripleColonInFile(filePath);
        }
      }
    });
  };
  
  // Fix files in common directories
  console.log('📁 Scanning for files with triple colon issues...');
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
    'assets/css/critical.css',
    'nuxt.config.ts',
    'nitroConfig.ts'
  ];
  
  knownFiles.forEach(file => {
    if (fs.existsSync(file)) {
      fixTripleColonInFile(file);
    }
  });
  
  console.log('✅ Triple colon issues fixed!');
  
} catch (error) {
  console.error('❌ Error fixing triple colon issues:', error.message);
  process.exit(1);
}
