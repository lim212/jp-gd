#!/usr/bin/env node

/**
 * Cross-platform script to fix all common Linux build issues
 * This script addresses path separators, permissions, and platform-specific issues
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing all Linux build issues...');

try {
  // Fix file permissions
  console.log('📁 Fixing file permissions...');
  try {
    execSync('chmod +x scripts/*.js', { stdio: 'inherit' });
    execSync('chmod +x scripts/*.sh', { stdio: 'inherit' });
  } catch (e) {
    console.log('⚠️  Some permission fixes failed, continuing...');
  }
  
  // Clean build directories
  console.log('🧹 Cleaning build directories...');
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
  
  // Fix Sharp library
  console.log('🔧 Fixing Sharp library...');
  try {
    execSync('node scripts/fix-sharp-linux.js', { stdio: 'inherit' });
  } catch (e) {
    console.log('⚠️  Sharp fix failed, continuing...');
  }
  
  // Reinstall dependencies
  console.log('📦 Reinstalling dependencies...');
  try {
    execSync('npm ci', { stdio: 'inherit' });
  } catch (e) {
    console.log('⚠️  npm ci failed, trying npm install...');
    execSync('npm install', { stdio: 'inherit' });
  }
  
  // Fix Node.js memory issues
  console.log('🧠 Setting up Node.js memory optimization...');
  const nodeOptions = '--max-old-space-size=16384 --max-semi-space-size=512';
  process.env.NODE_OPTIONS = nodeOptions;
  
  console.log('✅ All Linux build issues fixed!');
  console.log('🚀 You can now run: npm run build:linux');
  
} catch (error) {
  console.error('❌ Error fixing Linux build issues:', error.message);
  process.exit(1);
}
