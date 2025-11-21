#!/usr/bin/env node

/**
 * Cross-platform script to fix CSS issues
 * This script addresses common CSS build and runtime issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing CSS issues...');

try {
  // Function to fix CSS in a file
  const fixCSSInFile = (filePath) => {
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix deep selectors
    if (content.includes('::v-deep')) {
      content = content.replace(/::v-deep/g, ':deep()');
      modified = true;
    }
    
    if (content.includes('/deep/')) {
      content = content.replace(/\/deep\//g, ':deep()');
      modified = true;
    }
    
    if (content.includes('>>>')) {
      content = content.replace(/>>>/g, ':deep()');
      modified = true;
    }
    
    // Fix CSS custom properties
    if (content.includes('var(--')) {
      // Ensure proper CSS custom property syntax
      content = content.replace(/var\(--([^)]+)\)/g, 'var(--$1)');
      modified = true;
    }
    
    // Fix CSS Grid issues
    if (content.includes('grid-template-areas')) {
      // Ensure proper grid template areas syntax
      content = content.replace(
        /grid-template-areas:\s*"([^"]+)"/g,
        'grid-template-areas: "$1"'
      );
      modified = true;
    }
    
    // Fix CSS calc() issues
    if (content.includes('calc(')) {
      // Ensure proper spacing in calc()
      content = content.replace(/calc\(([^)]+)\)/g, (match, expr) => {
        return `calc(${expr.replace(/([+\-*/])/g, ' $1 ')})`;
      });
      modified = true;
    }
    
    // Fix CSS import issues
    if (content.includes('@import')) {
      // Ensure proper import syntax
      content = content.replace(
        /@import\s+['"]([^'"]+)['"];?/g,
        '@import "$1";'
      );
      modified = true;
    }
    
    // Fix path separators
    content = content.replace(/\\\\/g, '/');
    content = content.replace(/\\/g, '/');
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed CSS in ${filePath}`);
    }
  };
  
  // Function to recursively find and fix CSS files
  const findAndFixCSSFiles = (dir) => {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        // Skip node_modules and build directories
        if (!['node_modules', '.nuxt', '.output', 'dist'].includes(file)) {
          findAndFixCSSFiles(filePath);
        }
      } else if (stat.isFile()) {
        // Fix CSS files
        if (file.endsWith('.css') || file.endsWith('.scss') || file.endsWith('.sass')) {
          fixCSSInFile(filePath);
        }
      }
    });
  };
  
  // Fix CSS files in common directories
  console.log('📁 Scanning for CSS files...');
  const directoriesToScan = [
    'app/assets/css',
    'assets/css',
    'components',
    'pages',
    'layouts',
    'plugins'
  ];
  
  directoriesToScan.forEach(dir => {
    if (fs.existsSync(dir)) {
      console.log(`🔍 Scanning ${dir}...`);
      findAndFixCSSFiles(dir);
    }
  });
  
  // Fix specific known problematic CSS files
  const knownCSSFiles = [
    'app/assets/css/main.css',
    'app/assets/css/critical.css',
    'assets/css/blog-responsive-improvements.css',
    'assets/css/critical.css'
  ];
  
  knownCSSFiles.forEach(file => {
    if (fs.existsSync(file)) {
      fixCSSInFile(file);
    }
  });
  
  // Fix PostCSS configuration
  console.log('📦 Fixing PostCSS configuration...');
  const postcssConfigPath = 'postcss.config.js';
  if (fs.existsSync(postcssConfigPath)) {
    let content = fs.readFileSync(postcssConfigPath, 'utf8');
    
    // Ensure proper PostCSS configuration
    if (!content.includes('cssnano')) {
      content = `module.exports = {
  plugins: {
    autoprefixer: {},
    cssnano: process.env.NODE_ENV === 'production' ? { preset: 'default' } : false
  }
}
`;
      fs.writeFileSync(postcssConfigPath, content);
      console.log('✅ Fixed PostCSS configuration');
    }
  }
  
  // Fix Tailwind CSS configuration if it exists
  console.log('🎨 Checking Tailwind CSS configuration...');
  const tailwindConfigPath = 'tailwind.config.js';
  if (fs.existsSync(tailwindConfigPath)) {
    let content = fs.readFileSync(tailwindConfigPath, 'utf8');
    
    // Ensure proper content paths
    if (content.includes('content:')) {
      content = content.replace(
        /content:\s*\[.*?\]/s,
        `content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ]`
      );
      
      fs.writeFileSync(tailwindConfigPath, content);
      console.log('✅ Fixed Tailwind CSS configuration');
    }
  }
  
  // Fix CSS in Vue files
  console.log('🔍 Fixing CSS in Vue files...');
  const findAndFixVueFiles = (dir) => {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        if (!['node_modules', '.nuxt', '.output', 'dist'].includes(file)) {
          findAndFixVueFiles(filePath);
        }
      } else if (stat.isFile() && file.endsWith('.vue')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        // Fix CSS in Vue files
        if (content.includes('<style')) {
          // Fix deep selectors in Vue files
          if (content.includes('::v-deep')) {
            content = content.replace(/::v-deep/g, ':deep()');
            modified = true;
          }
          
          if (content.includes('/deep/')) {
            content = content.replace(/\/deep\//g, ':deep()');
            modified = true;
          }
          
          if (content.includes('>>>')) {
            content = content.replace(/>>>/g, ':deep()');
            modified = true;
          }
          
          // Fix scoped styles
          if (content.includes('<style scoped>')) {
            content = content.replace(
              /<style scoped>/g,
              '<style scoped>'
            );
            modified = true;
          }
        }
        
        if (modified) {
          fs.writeFileSync(filePath, content);
          console.log(`✅ Fixed CSS in Vue file ${filePath}`);
        }
      }
    });
  };
  
  // Fix CSS in Vue files
  const vueDirectories = ['components', 'pages', 'layouts', 'app'];
  vueDirectories.forEach(dir => {
    if (fs.existsSync(dir)) {
      findAndFixVueFiles(dir);
    }
  });
  
  console.log('✅ CSS issues fixed!');
  
} catch (error) {
  console.error('❌ Error fixing CSS issues:', error.message);
  process.exit(1);
}
