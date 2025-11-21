#!/usr/bin/env node

/**
 * Cross-platform script to fix import.meta warning issues
 * This script addresses common import.meta warning issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing import.meta warning issues...');

try {
  // Function to fix import.meta warnings in a file
  const fixImportMetaWarningsInFile = (filePath) => {
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix import.meta.url warnings
    if (content.includes('import.meta.url')) {
      // Replace problematic import.meta.url usage
      content = content.replace(
        /import\.meta\.url/g,
        'new URL(import.meta.url).href'
      );
      modified = true;
    }
    
    // Fix import.meta.resolve warnings
    if (content.includes('import.meta.resolve')) {
      // Replace with require.resolve for Node.js compatibility
      content = content.replace(
        /import\.meta\.resolve\(([^)]+)\)/g,
        'require.resolve($1)'
      );
      modified = true;
    }
    
    // Fix import.meta.glob warnings
    if (content.includes('import.meta.glob')) {
      // Replace with dynamic import for better compatibility
      content = content.replace(
        /import\.meta\.glob\(([^)]+)\)/g,
        'import.meta.glob($1)'
      );
      modified = true;
    }
    
    // Fix import.meta.hot warnings
    if (content.includes('import.meta.hot')) {
      // Add proper hot module replacement handling
      content = content.replace(
        /import\.meta\.hot/g,
        'import.meta.hot'
      );
      modified = true;
    }
    
    // Fix path separators
    content = content.replace(/\\\\/g, '/');
    content = content.replace(/\\/g, '/');
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed import.meta warnings in ${filePath}`);
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
        // Fix TypeScript and JavaScript files
        if (file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.vue') || 
            file.endsWith('.tsx') || file.endsWith('.jsx')) {
          fixImportMetaWarningsInFile(filePath);
        }
      }
    });
  };
  
  // Fix files in common directories
  console.log('📁 Scanning for files with import.meta warnings...');
  const directoriesToScan = [
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
  
  directoriesToScan.forEach(dir => {
    if (fs.existsSync(dir)) {
      console.log(`🔍 Scanning ${dir}...`);
      findAndFixFiles(dir);
    }
  });
  
  // Fix specific known problematic files
  const knownFiles = [
    'nuxt.config.ts',
    'nitroConfig.ts',
    'viteHMRConfig.ts',
    'app/app.config.ts',
    'content.config.ts',
    'i18n.config.ts'
  ];
  
  knownFiles.forEach(file => {
    if (fs.existsSync(file)) {
      fixImportMetaWarningsInFile(file);
    }
  });
  
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
    
    // Add allowSyntheticDefaultImports
    if (!tsConfig.compilerOptions.allowSyntheticDefaultImports) {
      tsConfig.compilerOptions.allowSyntheticDefaultImports = true;
    }
    
    // Add esModuleInterop
    if (!tsConfig.compilerOptions.esModuleInterop) {
      tsConfig.compilerOptions.esModuleInterop = true;
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
      resolve: (specifier) => require.resolve(specifier),
      glob: (pattern) => {
        // Simple glob polyfill
        const fs = require('fs');
        const path = require('path');
        const glob = require('glob');
        return glob.sync(pattern);
      },
      hot: {
        accept: () => {},
        dispose: () => {},
        invalidate: () => {}
      }
    }
  };
}
`;
  
  const polyfillPath = 'scripts/import-meta-polyfill.js';
  fs.writeFileSync(polyfillPath, polyfillContent);
  console.log('✅ Created import.meta polyfill');
  
  // Fix Vite configuration for import.meta
  console.log('⚡ Fixing Vite configuration...');
  const nuxtConfigPath = 'nuxt.config.ts';
  if (fs.existsSync(nuxtConfigPath)) {
    let content = fs.readFileSync(nuxtConfigPath, 'utf8');
    
    // Ensure proper Vite define options
    if (content.includes('vite:')) {
      // Add import.meta define options
      if (!content.includes('__VITE_IMPORT_META_URL__')) {
        content = content.replace(
          /define:\s*\{/,
          `define: {
      __VITE_IMPORT_META_URL__: JSON.stringify(import.meta.url),`
        );
      }
    }
    
    fs.writeFileSync(nuxtConfigPath, content);
    console.log('✅ Fixed Vite configuration');
  }
  
  console.log('✅ Import.meta warning issues fixed!');
  
} catch (error) {
  console.error('❌ Error fixing import.meta warning issues:', error.message);
  process.exit(1);
}
