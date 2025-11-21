#!/usr/bin/env node

/**
 * Cross-platform script to fix Sharp library issues on Linux
 * This script ensures Sharp binaries are properly installed for the current platform
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Sharp library for Linux...');

try {
  // Check if we're on Linux
  if (process.platform === 'linux') {
    console.log('📦 Rebuilding Sharp for Linux platform...');
    
    // Remove existing Sharp installation
    try {
      execSync('npm uninstall sharp', { stdio: 'inherit' });
    } catch (e) {
      console.log('⚠️  Sharp not found in node_modules, continuing...');
    }
    
    // Reinstall Sharp with proper platform binaries
    execSync('npm install sharp@latest', { stdio: 'inherit' });
    
    // Rebuild Sharp for current platform
    execSync('npm rebuild sharp', { stdio: 'inherit' });
    
    console.log('✅ Sharp library fixed for Linux!');
  } else {
    console.log('ℹ️  Not on Linux platform, skipping Sharp rebuild');
  }
  
  // Verify Sharp installation
  try {
    const sharp = require('sharp');
    console.log('✅ Sharp library is working correctly');
    console.log('📊 Sharp version:', sharp.versions);
  } catch (e) {
    console.error('❌ Sharp library verification failed:', e.message);
    process.exit(1);
  }
  
} catch (error) {
  console.error('❌ Error fixing Sharp library:', error.message);
  process.exit(1);
}
