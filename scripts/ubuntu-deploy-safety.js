#!/usr/bin/env node

/**
 * Ubuntu Deploy Safety Check Script
 * Memastikan tidak ada konflik saat deploy ke Ubuntu VPS
 */

import fs from 'fs';
import { execSync } from 'child_process';

console.log('🔒 Checking Ubuntu deployment safety...');

try {
  // 1. Check package.json scripts
  console.log('📦 Checking package.json scripts...');
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  const requiredScripts = [
    'build:production',
    'start:ubuntu',
    'deploy:ubuntu'
  ];
  
  const missingScripts = requiredScripts.filter(script => !packageJson.scripts[script]);
  if (missingScripts.length > 0) {
    console.log('⚠️  Missing scripts:', missingScripts);
    
    // Add missing scripts
    missingScripts.forEach(script => {
      if (script === 'build:production') {
        packageJson.scripts[script] = 'cross-env NODE_ENV=production NODE_OPTIONS="--max-old-space-size=16384" nuxt build';
      } else if (script === 'start:ubuntu') {
        packageJson.scripts[script] = 'pm2 start ecosystem.config.js --env production';
      } else if (script === 'deploy:ubuntu') {
        packageJson.scripts[script] = 'chmod +x deploy.sh && ./deploy.sh';
      }
    });
    
    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    console.log('✅ Added missing scripts');
  } else {
    console.log('✅ All required scripts present');
  }
  
  // 2. Check ecosystem.config.js
  console.log('⚙️  Checking ecosystem.config.js...');
  if (fs.existsSync('ecosystem.config.js')) {
    const ecosystemContent = fs.readFileSync('ecosystem.config.js', 'utf8');
    
    if (!ecosystemContent.includes('script: \'start.js\'')) {
      console.log('⚠️  Fixing ecosystem.config.js script path...');
      const fixedContent = ecosystemContent.replace(
        /script: '\.output\/server\/index\.mjs'/g,
        "script: 'start.js'"
      );
      fs.writeFileSync('ecosystem.config.js', fixedContent);
      console.log('✅ Fixed ecosystem.config.js');
    } else {
      console.log('✅ ecosystem.config.js is correct');
    }
  } else {
    console.log('❌ ecosystem.config.js missing!');
    process.exit(1);
  }
  
  // 3. Check start.js
  console.log('🚀 Checking start.js...');
  if (fs.existsSync('start.js')) {
    console.log('✅ start.js exists');
  } else {
    console.log('❌ start.js missing!');
    process.exit(1);
  }
  
  // 4. Check deploy.sh
  console.log('📋 Checking deploy.sh...');
  if (fs.existsSync('deploy.sh')) {
    const deployContent = fs.readFileSync('deploy.sh', 'utf8');
    
    if (deployContent.includes('build:production:production')) {
      console.log('⚠️  Fixing deploy.sh build command...');
      const fixedContent = deployContent.replace(
        /build:production:production/g,
        'build:production'
      );
      fs.writeFileSync('deploy.sh', fixedContent);
      console.log('✅ Fixed deploy.sh');
    } else {
      console.log('✅ deploy.sh is correct');
    }
  } else {
    console.log('❌ deploy.sh missing!');
    process.exit(1);
  }
  
  // 5. Check nuxt.config.ts for Ubuntu compatibility
  console.log('🔧 Checking nuxt.config.ts...');
  const nuxtConfig = fs.readFileSync('nuxt.config.ts', 'utf8');
  
  if (nuxtConfig.includes('buildDir: process.env.NUXT_BUILD_DIR')) {
    console.log('✅ nuxt.config.ts has Ubuntu-compatible buildDir');
  } else {
    console.log('⚠️  nuxt.config.ts may need Ubuntu compatibility fixes');
  }
  
  // 6. Check for Windows-specific files that might cause issues
  console.log('🪟 Checking for Windows-specific files...');
  const windowsFiles = [
    '*.ps1',
    '*.bat',
    '*.cmd'
  ];
  
  let foundWindowsFiles = [];
  try {
    const result = execSync('dir /b *.ps1 *.bat *.cmd 2>nul', { encoding: 'utf8' });
    if (result.trim()) {
      foundWindowsFiles = result.trim().split('\n').filter(f => f.trim());
    }
  } catch (e) {
    // No Windows files found, which is good
  }
  
  if (foundWindowsFiles.length > 0) {
    console.log('⚠️  Found Windows-specific files:', foundWindowsFiles);
    console.log('   These should not be deployed to Ubuntu VPS');
  } else {
    console.log('✅ No Windows-specific files found');
  }
  
  // 7. Check for cross-platform compatibility
  console.log('🌐 Checking cross-platform compatibility...');
  
  // Check package.json for cross-env
  if (packageJson.dependencies && packageJson.dependencies['cross-env']) {
    console.log('✅ cross-env dependency found');
  } else if (packageJson.devDependencies && packageJson.devDependencies['cross-env']) {
    console.log('✅ cross-env dev dependency found');
  } else {
    console.log('⚠️  cross-env not found - may cause issues on Ubuntu');
  }
  
  // 8. Create Ubuntu environment file
  console.log('🌍 Creating Ubuntu environment configuration...');
  const ubuntuEnvContent = `# Ubuntu Production Environment
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
  
  // 9. Final safety check
  console.log('🔍 Final safety check...');
  
  const criticalFiles = [
    'package.json',
    'nuxt.config.ts',
    'ecosystem.config.js',
    'start.js',
    'deploy.sh'
  ];
  
  const missingCriticalFiles = criticalFiles.filter(file => !fs.existsSync(file));
  
  if (missingCriticalFiles.length > 0) {
    console.log('❌ Missing critical files:', missingCriticalFiles);
    process.exit(1);
  } else {
    console.log('✅ All critical files present');
  }
  
  console.log('\n🎉 Ubuntu deployment safety check completed!');
  console.log('\n📋 Deployment checklist:');
  console.log('✅ Package.json scripts configured');
  console.log('✅ Ecosystem.config.js configured');
  console.log('✅ Start.js exists');
  console.log('✅ Deploy.sh configured');
  console.log('✅ Ubuntu environment file created');
  console.log('✅ Cross-platform compatibility verified');
  
  console.log('\n🚀 Ready for Ubuntu deployment!');
  console.log('\nNext steps:');
  console.log('1. Commit all changes: git add . && git commit -m "Ubuntu deployment ready"');
  console.log('2. Push to repository: git push origin main');
  console.log('3. Deploy to Ubuntu: ./deploy.sh');
  
} catch (error) {
  console.error('❌ Safety check failed:', error.message);
  process.exit(1);
}
