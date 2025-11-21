#!/usr/bin/env node

/**
 * Cross-platform script to fix import.meta issues on Linux
 * This script addresses common import.meta.url and import.meta.resolve issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing import.meta issues for Linux...');

try {
  // Fix import.meta issues in TypeScript files
  console.log('📁 Fixing import.meta issues in TypeScript files...');
  
  const fixImportMetaInFile = (filePath) => {
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix import.meta.url issues
    if (content.includes('import.meta.url')) {
      // Replace problematic import.meta.url usage
      content = content.replace(
        /import\.meta\.url/g,
        'new URL(import.meta.url).href'
      );
      modified = true;
    }
    
    // Fix import.meta.resolve issues
    if (content.includes('import.meta.resolve')) {
      // Replace with require.resolve for Node.js compatibility
      content = content.replace(
        /import\.meta\.resolve\(([^)]+)\)/g,
        'require.resolve($1)'
      );
      modified = true;
    }
    
    // Fix path separators
    content = content.replace(/\\\\/g, '/');
    content = content.replace(/\\/g, '/');
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed import.meta issues in ${filePath}`);
    }
  };
  
  // Fix common files that might have import.meta issues
  const filesToFix = [
    'nuxt.config.ts',
    'nitroConfig.ts',
    'viteHMRConfig.ts',
    'app/app.config.ts'
  ];
  
  filesToFix.forEach(fixImportMetaInFile);
  
  // Fix TypeScript configuration for better import.meta support
  console.log('📦 Fixing TypeScript configuration...');
  const tsConfigPath = 'tsconfig.json';
  if (fs.existsSync(tsConfigPath)) {
    const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));
    
    // Add module resolution settings
    if (!tsConfig.compilerOptions.moduleResolution) {
      tsConfig.compilerOptions.moduleResolution = 'node';
    }
    
    if (!tsConfig.compilerOptions.module) {
      tsConfig.compilerOptions.module = 'ESNext';
    }
    
    if (!tsConfig.compilerOptions.target) {
      tsConfig.compilerOptions.target = 'ES2020';
    }
    
    // Add lib for import.meta support
    if (!tsConfig.compilerOptions.lib) {
      tsConfig.compilerOptions.lib = ['ES2020', 'DOM'];
    }
    
    fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2));
    console.log('✅ Fixed TypeScript configuration');
  }
  
  // Create a polyfill for import.meta if needed
  console.log('🔧 Creating import.meta polyfill...');
  const polyfillContent = `
// import.meta polyfill for Node.js compatibility
if (typeof import.meta === 'undefined') {
  global.import = {
    meta: {
      url: __filename,
      resolve: (specifier) => require.resolve(specifier)
    }
  };
}
`;
  
  const polyfillPath = 'scripts/import-meta-polyfill.js';
  fs.writeFileSync(polyfillPath, polyfillContent);
  console.log('✅ Created import.meta polyfill');
  
  console.log('✅ Import.meta issues fixed for Linux!');
  
} catch (error) {
  console.error('❌ Error fixing import.meta issues:', error.message);
  process.exit(1);
}
