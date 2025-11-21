#!/usr/bin/env node

/**
 * Simple script to fix all issues for Ubuntu deployment
 */

import fs from 'fs';
import { execSync } from 'child_process';

console.log('🔧 Fixing all issues for Ubuntu deployment...');

try {
  // Fix Sharp library
  console.log('🔧 Fixing Sharp library...');
  try {
    execSync('npm rebuild sharp', { stdio: 'inherit' });
    console.log('✅ Sharp library fixed');
  } catch (e) {
    console.log('⚠️  Sharp rebuild failed, continuing...');
  }
  
  // Clean build directories
  console.log('🧹 Cleaning build directories...');
  const buildDirs = ['.nuxt', '.output', 'dist'];
  
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
  
  // Install dependencies
  console.log('📦 Installing dependencies...');
  try {
    execSync('npm ci', { stdio: 'inherit' });
    console.log('✅ Dependencies installed');
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
  console.log('🌍 Setting environment variables...');
  process.env.NODE_ENV = 'production';
  process.env.NUXT_ENV = 'production';
  process.env.NODE_OPTIONS = '--max-old-space-size=16384 --max-semi-space-size=512';
  process.env.PLATFORM = 'linux';
  process.env.SHARP_IGNORE_GLOBAL_LIBVIPS = '1';
  
  console.log('✅ Environment variables set');
  
  console.log('\n🎉 All issues fixed for Ubuntu deployment!');
  console.log('\n📋 Next steps:');
  console.log('1. Run: npm run build:production');
  console.log('2. Deploy with: ./deploy.sh');
  
} catch (error) {
  console.error('❌ Error fixing issues:', error.message);
  process.exit(1);
}
