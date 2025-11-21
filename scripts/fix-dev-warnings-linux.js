#!/usr/bin/env node

/**
 * Cross-platform script to fix development warnings on Linux
 * This script addresses common development warnings and errors
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing development warnings for Linux...');

try {
  // Fix path separators in configuration files
  console.log('📁 Fixing path separators...');
  
  // Read and fix nuxt.config.ts
  const nuxtConfigPath = 'nuxt.config.ts';
  if (fs.existsSync(nuxtConfigPath)) {
    let content = fs.readFileSync(nuxtConfigPath, 'utf8');
    
    // Replace Windows path separators with cross-platform ones
    content = content.replace(/\\\\/g, '/');
    content = content.replace(/\\/g, '/');
    
    fs.writeFileSync(nuxtConfigPath, content);
    console.log('✅ Fixed path separators in nuxt.config.ts');
  }
  
  // Fix TypeScript configuration
  const tsConfigPath = 'tsconfig.json';
  if (fs.existsSync(tsConfigPath)) {
    let content = fs.readFileSync(tsConfigPath, 'utf8');
    
    // Ensure proper path separators
    content = content.replace(/\\\\/g, '/');
    content = content.replace(/\\/g, '/');
    
    fs.writeFileSync(tsConfigPath, content);
    console.log('✅ Fixed path separators in tsconfig.json');
  }
  
  // Create .env file for Linux if it doesn't exist
  const envPath = '.env';
  if (!fs.existsSync(envPath)) {
    const envContent = `# Linux Environment Configuration
NODE_ENV=production
NUXT_ENV=production
NODE_OPTIONS=--max-old-space-size=16384

# Build Configuration
NUXT_BUILD_DIR=.nuxt-build
NUXT_OUTPUT_DIR=.output-build

# Platform Configuration
PLATFORM=linux
OS=linux
`;
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env file for Linux');
  }
  
  // Fix package.json scripts for cross-platform compatibility
  console.log('📦 Fixing package.json scripts...');
  const packageJsonPath = 'package.json';
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Add cross-platform scripts if they don't exist
    if (!packageJson.scripts['build:linux']) {
      packageJson.scripts['build:linux'] = 'cross-env NODE_OPTIONS="--max-old-space-size=16384" nuxt build';
    }
    
    if (!packageJson.scripts['build:production']) {
      packageJson.scripts['build:production'] = 'cross-env NODE_ENV=production NODE_OPTIONS="--max-old-space-size=16384" nuxt build';
    }
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Fixed package.json scripts');
  }
  
  console.log('✅ Development warnings fixed for Linux!');
  
} catch (error) {
  console.error('❌ Error fixing development warnings:', error.message);
  process.exit(1);
}
