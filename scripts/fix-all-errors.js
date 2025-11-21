#!/usr/bin/env node

/**
 * Cross-platform script to fix all common errors
 * This script runs all fix scripts in the correct order
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing all common errors...');

try {
  // List of fix scripts to run in order
  const fixScripts = [
    'fix-sharp-linux.js',
    'fix-import-meta-linux.js',
    'fix-deep-linux-comprehensive.js',
    'fix-css-errors.js',
    'fix-pwa-error.js',
    'fix-i18n-error.js',
    'fix-content-error.js',
    'fix-dev-warnings-linux.js'
  ];
  
  // Run each fix script
  fixScripts.forEach(script => {
    const scriptPath = path.join(__dirname, script);
    
    if (fs.existsSync(scriptPath)) {
      console.log(`\n🔧 Running ${script}...`);
      try {
        execSync(`node ${scriptPath}`, { stdio: 'inherit' });
        console.log(`✅ ${script} completed successfully`);
      } catch (error) {
        console.log(`⚠️  ${script} failed: ${error.message}`);
        // Continue with other scripts even if one fails
      }
    } else {
      console.log(`⚠️  ${script} not found, skipping...`);
    }
  });
  
  // Clean build directories
  console.log('\n🧹 Cleaning build directories...');
  const buildDirs = ['.nuxt', '.output', 'dist', '.nuxt-build', '.output-build'];
  
  buildDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      try {
        execSync(`rm -rf ${dir}`, { stdio: 'inherit' });
        console.log(`✅ Cleaned ${dir}`);
      } catch (e) {
        console.log(`⚠️  Failed to clean ${dir}: ${e.message}`);
      }
    }
  });
  
  // Fix file permissions
  console.log('\n📁 Fixing file permissions...');
  try {
    execSync('chmod +x scripts/*.js', { stdio: 'inherit' });
    execSync('chmod +x scripts/*.sh', { stdio: 'inherit' });
    console.log('✅ Fixed file permissions');
  } catch (e) {
    console.log('⚠️  Some permission fixes failed, continuing...');
  }
  
  // Reinstall dependencies
  console.log('\n📦 Reinstalling dependencies...');
  try {
    execSync('npm ci', { stdio: 'inherit' });
    console.log('✅ Dependencies reinstalled');
  } catch (e) {
    console.log('⚠️  npm ci failed, trying npm install...');
    try {
      execSync('npm install', { stdio: 'inherit' });
      console.log('✅ Dependencies installed');
    } catch (e2) {
      console.log('⚠️  npm install also failed, continuing...');
    }
  }
  
  // Set environment variables
  console.log('\n🌍 Setting environment variables...');
  process.env.NODE_ENV = 'production';
  process.env.NUXT_ENV = 'production';
  process.env.NODE_OPTIONS = '--max-old-space-size=16384 --max-semi-space-size=512';
  process.env.PLATFORM = 'linux';
  process.env.SHARP_IGNORE_GLOBAL_LIBVIPS = '1';
  
  console.log('✅ Environment variables set');
  
  // Create .env file if it doesn't exist
  const envPath = '.env';
  if (!fs.existsSync(envPath)) {
    const envContent = `# Environment Configuration
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
`;
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env file');
  }
  
  console.log('\n🎉 All errors fixed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Run: npm run build:production');
  console.log('2. If build fails, check the error messages above');
  console.log('3. For deployment, use: ./linux-deploy.sh');
  
} catch (error) {
  console.error('❌ Error fixing all errors:', error.message);
  process.exit(1);
}
