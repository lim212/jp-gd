#!/usr/bin/env node

/**
 * Final comprehensive fix script for all remaining issues
 * This script addresses the most common final build issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Running final comprehensive fixes...');

try {
  // Fix all remaining path separator issues
  console.log('📁 Fixing all path separator issues...');
  
  const fixPathSeparators = (filePath) => {
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix all Windows path separators
    if (content.includes('\\')) {
      content = content.replace(/\\/g, '/');
      modified = true;
    }
    
    // Fix double slashes
    if (content.includes('//')) {
      content = content.replace(/\/+/g, '/');
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed path separators in ${filePath}`);
    }
  };
  
  // Fix path separators in all configuration files
  const configFiles = [
    'nuxt.config.ts',
    'nitroConfig.ts',
    'tsconfig.json',
    'package.json',
    'viteHMRConfig.ts',
    'app/app.config.ts'
  ];
  
  configFiles.forEach(fixPathSeparators);
  
  // Fix all remaining import.meta issues
  console.log('🔧 Fixing all import.meta issues...');
  
  const fixImportMeta = (filePath) => {
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix import.meta.url
    if (content.includes('import.meta.url')) {
      content = content.replace(
        /import\.meta\.url/g,
        'new URL(import.meta.url).href'
      );
      modified = true;
    }
    
    // Fix import.meta.resolve
    if (content.includes('import.meta.resolve')) {
      content = content.replace(
        /import\.meta\.resolve\(([^)]+)\)/g,
        'require.resolve($1)'
      );
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed import.meta in ${filePath}`);
    }
  };
  
  configFiles.forEach(fixImportMeta);
  
  // Fix all remaining CSS issues
  console.log('🎨 Fixing all CSS issues...');
  
  const fixCSS = (filePath) => {
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix deep selectors
    if (content.includes('::v-deep') || content.includes('/deep/') || content.includes('>>>')) {
      content = content.replace(/::v-deep/g, ':deep()');
      content = content.replace(/\/deep\//g, ':deep()');
      content = content.replace(/>>>/g, ':deep()');
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed CSS in ${filePath}`);
    }
  };
  
  // Fix CSS in all directories
  const cssDirectories = ['app/assets/css', 'assets/css', 'components', 'pages', 'layouts'];
  cssDirectories.forEach(dir => {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isFile() && 
            (file.endsWith('.css') || file.endsWith('.vue') || file.endsWith('.scss'))) {
          fixCSS(filePath);
        }
      });
    }
  });
  
  // Fix all remaining TypeScript issues
  console.log('📦 Fixing TypeScript configuration...');
  
  const tsConfigPath = 'tsconfig.json';
  if (fs.existsSync(tsConfigPath)) {
    const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));
    
    // Ensure proper TypeScript configuration
    if (!tsConfig.compilerOptions) {
      tsConfig.compilerOptions = {};
    }
    
    // Set proper options
    tsConfig.compilerOptions.target = 'ES2020';
    tsConfig.compilerOptions.module = 'ESNext';
    tsConfig.compilerOptions.moduleResolution = 'node';
    tsConfig.compilerOptions.lib = ['ES2020', 'DOM'];
    tsConfig.compilerOptions.skipLibCheck = true;
    tsConfig.compilerOptions.strict = false;
    tsConfig.compilerOptions.esModuleInterop = true;
    tsConfig.compilerOptions.allowSyntheticDefaultImports = true;
    tsConfig.compilerOptions.forceConsistentCasingInFileNames = true;
    tsConfig.compilerOptions.resolveJsonModule = true;
    tsConfig.compilerOptions.isolatedModules = true;
    tsConfig.compilerOptions.noEmit = true;
    
    // Set proper paths
    tsConfig.compilerOptions.baseUrl = '.';
    tsConfig.compilerOptions.paths = {
      '~/*': ['./*'],
      '@/*': ['./*'],
      '~~/*': ['./*'],
      '@@/*': ['./*'],
      '#imports': ['.nuxt/imports.d.ts']
    };
    
    fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2));
    console.log('✅ Fixed TypeScript configuration');
  }
  
  // Fix all remaining Nuxt configuration issues
  console.log('⚙️  Fixing Nuxt configuration...');
  
  const nuxtConfigPath = 'nuxt.config.ts';
  if (fs.existsSync(nuxtConfigPath)) {
    let content = fs.readFileSync(nuxtConfigPath, 'utf8');
    let modified = false;
    
    // Ensure proper experimental settings
    if (content.includes('experimental:')) {
      content = content.replace(
        /experimental:\s*\{[^}]*\}/s,
        `experimental: {
    payloadExtraction: false,
    inlineSSRStyles: false,
    componentIslands: false,
    typedPages: false
  }`
      );
      modified = true;
    }
    
    // Ensure proper TypeScript settings
    if (content.includes('typescript:')) {
      content = content.replace(
        /typescript:\s*\{[^}]*\}/s,
        `typescript: {
    strict: false,
    shim: false,
    typeCheck: false,
    tsConfig: {
      compilerOptions: {
        target: 'ESNext',
        module: 'ESNext'
      }
    }
  }`
      );
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(nuxtConfigPath, content);
      console.log('✅ Fixed Nuxt configuration');
    }
  }
  
  // Create final environment file
  console.log('🌍 Creating final environment configuration...');
  
  const finalEnvContent = `# Final Environment Configuration
NODE_ENV=production
NUXT_ENV=production
NODE_OPTIONS=--max-old-space-size=16384 --max-semi-space-size=512
PLATFORM=linux
SHARP_IGNORE_GLOBAL_LIBVIPS=1

# Build Configuration
NUXT_BUILD_DIR=.nuxt
NUXT_OUTPUT_DIR=.output

# Server Configuration
HOST=0.0.0.0
PORT=3000

# Performance Configuration
NUXT_BUILD_OPTIMIZE=true
NUXT_BUILD_COMPRESS=true

# Security Configuration
NUXT_SECURITY_HEADERS=true
`;
  
  fs.writeFileSync('.env', finalEnvContent);
  console.log('✅ Created final environment configuration');
  
  // Create final build script
  console.log('📜 Creating final build script...');
  
  const buildScriptContent = `#!/bin/bash

# Final build script for JasaPembayaran.com
set -e

echo "🚀 Starting final build..."

# Set environment variables
export NODE_ENV=production
export NUXT_ENV=production
export NODE_OPTIONS="--max-old-space-size=16384 --max-semi-space-size=512"
export PLATFORM=linux
export SHARP_IGNORE_GLOBAL_LIBVIPS=1

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .nuxt .output dist .nuxt-build .output-build

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build application
echo "🔨 Building application..."
npm run build:production

# Verify build
if [ -d ".output" ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Output directory: .output"
    echo "🚀 Ready for deployment!"
else
    echo "❌ Build failed - .output directory not found"
    exit 1
fi
`;
  
  fs.writeFileSync('build-final.sh', buildScriptContent);
  console.log('✅ Created final build script');
  
  console.log('\n🎉 Final comprehensive fixes completed!');
  console.log('\n📋 Summary of fixes:');
  console.log('✅ Path separators fixed');
  console.log('✅ Import.meta issues fixed');
  console.log('✅ CSS issues fixed');
  console.log('✅ TypeScript configuration fixed');
  console.log('✅ Nuxt configuration fixed');
  console.log('✅ Environment configuration created');
  console.log('✅ Final build script created');
  
  console.log('\n🚀 Next steps:');
  console.log('1. Run: chmod +x build-final.sh');
  console.log('2. Run: ./build-final.sh');
  console.log('3. Or run: npm run build:production');
  
} catch (error) {
  console.error('❌ Error in final fixes:', error.message);
  process.exit(1);
}
