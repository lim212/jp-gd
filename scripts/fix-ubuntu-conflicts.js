#!/usr/bin/env node

/**
 * Script to fix Ubuntu deployment conflicts and ensure smooth deployment
 */

import fs from 'fs';
import path from 'path';

console.log('🔧 Fixing Ubuntu deployment conflicts...');

try {
  // Fix package.json scripts for Ubuntu compatibility
  console.log('📦 Fixing package.json scripts...');
  const packageJsonPath = 'package.json';
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Ensure Ubuntu-compatible scripts
    if (!packageJson.scripts['deploy:ubuntu']) {
      packageJson.scripts['deploy:ubuntu'] = 'chmod +x deploy.sh && ./deploy.sh';
    }
    
    if (!packageJson.scripts['start:ubuntu']) {
      packageJson.scripts['start:ubuntu'] = 'pm2 start ecosystem.config.js --env production';
    }
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Fixed package.json scripts for Ubuntu');
  }
  
  // Fix ecosystem.config.js for Ubuntu
  console.log('⚙️  Fixing ecosystem.config.js...');
  const ecosystemPath = 'ecosystem.config.js';
  if (fs.existsSync(ecosystemPath)) {
    let content = fs.readFileSync(ecosystemPath, 'utf8');
    
    // Ensure proper Ubuntu configuration
    content = content.replace(
      /script: '\.output\/server\/index\.mjs'/g,
      "script: 'start.js'"
    );
    
    fs.writeFileSync(ecosystemPath, content);
    console.log('✅ Fixed ecosystem.config.js for Ubuntu');
  }
  
  // Fix deploy.sh for Ubuntu
  console.log('🚀 Fixing deploy.sh...');
  const deployPath = 'deploy.sh';
  if (fs.existsSync(deployPath)) {
    let content = fs.readFileSync(deployPath, 'utf8');
    
    // Ensure proper build command
    content = content.replace(
      /npm run build/g,
      'npm run build:production'
    );
    
    // Ensure proper PM2 reload
    content = content.replace(
      /npm run build && exit/g,
      'npm run build:production && pm2 reload jasapembayaran && exit'
    );
    
    fs.writeFileSync(deployPath, content);
    console.log('✅ Fixed deploy.sh for Ubuntu');
  }
  
  // Create Ubuntu-specific environment file
  console.log('🌍 Creating Ubuntu environment configuration...');
  const ubuntuEnvContent = `# Ubuntu Environment Configuration
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

# PM2 Configuration
PM2_INSTANCES=max
PM2_EXEC_MODE=cluster
`;
  
  fs.writeFileSync('.env.ubuntu', ubuntuEnvContent);
  console.log('✅ Created Ubuntu environment configuration');
  
  // Fix file permissions
  console.log('📁 Fixing file permissions...');
  const filesToFix = [
    'deploy.sh',
    'linux-deploy.sh',
    'start.js',
    'ecosystem.config.js'
  ];
  
  filesToFix.forEach(file => {
    if (fs.existsSync(file)) {
      try {
        fs.chmodSync(file, 0o755);
        console.log(`✅ Fixed permissions for ${file}`);
      } catch (e) {
        console.log(`⚠️  Could not fix permissions for ${file}: ${e.message}`);
      }
    }
  });
  
  console.log('✅ Ubuntu deployment conflicts fixed!');
  
} catch (error) {
  console.error('❌ Error fixing Ubuntu conflicts:', error.message);
  process.exit(1);
}
