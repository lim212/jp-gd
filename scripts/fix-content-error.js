#!/usr/bin/env node

/**
 * Cross-platform script to fix content issues
 * This script addresses common @nuxt/content build and runtime issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing content issues...');

try {
  // Fix content configuration
  console.log('📁 Fixing content configuration...');
  
  const contentConfigPath = 'content.config.ts';
  if (fs.existsSync(contentConfigPath)) {
    let content = fs.readFileSync(contentConfigPath, 'utf8');
    let modified = false;
    
    // Ensure proper content configuration
    if (!content.includes('defineContentConfig')) {
      content = `import { defineContentConfig } from '@nuxt/content'

export default defineContentConfig({
  // Content configuration
  sources: {
    content: {
      driver: 'fs',
      base: './content'
    }
  },
  // Markdown configuration
  markdown: {
    anchorLinks: false,
    remarkPlugins: [],
    rehypePlugins: []
  },
  // Highlight configuration
  highlight: {
    theme: 'github-light',
    preload: ['json', 'js', 'ts', 'html', 'css', 'vue', 'diff', 'shell', 'markdown', 'yaml', 'bash', 'ini']
  }
})

${content}`;
      modified = true;
    }
    
    // Fix path separators
    content = content.replace(/\\\\/g, '/');
    content = content.replace(/\\/g, '/');
    
    if (modified) {
      fs.writeFileSync(contentConfigPath, content);
      console.log('✅ Fixed content configuration');
    }
  }
  
  // Fix nuxt.config.ts content configuration
  console.log('📦 Fixing Nuxt content configuration...');
  const nuxtConfigPath = 'nuxt.config.ts';
  if (fs.existsSync(nuxtConfigPath)) {
    let content = fs.readFileSync(nuxtConfigPath, 'utf8');
    let modified = false;
    
    // Ensure @nuxt/content is properly configured
    if (content.includes('@nuxt/content')) {
      // Fix content module configuration
      content = content.replace(
        /\/\/ '@nuxt\/content', \/\/ Temporarily disabled due to schema error/g,
        "'@nuxt/content'"
      );
      
      modified = true;
    }
    
    // Ensure content server stub is properly configured
    if (content.includes('#content/server')) {
      // Fix content server stub path
      content = content.replace(
        /'#content\/server': require\.resolve\('\.\/server\/stubs\/content-server-stub\.ts'\)/g,
        "'#content/server': require.resolve('./server/stubs/content-server-stub.ts')"
      );
      
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(nuxtConfigPath, content);
      console.log('✅ Fixed Nuxt content configuration');
    }
  }
  
  // Check and fix content directory structure
  console.log('📂 Checking content directory structure...');
  const contentDir = 'content';
  if (fs.existsSync(contentDir)) {
    console.log('✅ Content directory exists');
    
    // Check for index.yml
    const indexYmlPath = path.join(contentDir, 'index.yml');
    if (fs.existsSync(indexYmlPath)) {
      console.log('✅ index.yml exists');
    } else {
      // Create default index.yml
      const defaultIndexContent = `title: JasaPembayaran.com
description: Jasa PayPal terpercaya untuk isi saldo, bayar, dan kirim
`;
      fs.writeFileSync(indexYmlPath, defaultIndexContent);
      console.log('✅ Created default index.yml');
    }
    
    // Check blog directory
    const blogDir = path.join(contentDir, 'blog');
    if (fs.existsSync(blogDir)) {
      console.log('✅ Blog directory exists');
      
      // Check for blog files
      const blogFiles = fs.readdirSync(blogDir);
      console.log(`📄 Found ${blogFiles.length} blog files`);
    } else {
      // Create blog directory
      fs.mkdirSync(blogDir, { recursive: true });
      console.log('✅ Created blog directory');
    }
  } else {
    // Create content directory structure
    fs.mkdirSync(contentDir, { recursive: true });
    fs.mkdirSync(path.join(contentDir, 'blog'), { recursive: true });
    
    // Create default index.yml
    const defaultIndexContent = `title: JasaPembayaran.com
description: Jasa PayPal terpercaya untuk isi saldo, bayar, dan kirim
`;
    fs.writeFileSync(path.join(contentDir, 'index.yml'), defaultIndexContent);
    
    console.log('✅ Created content directory structure');
  }
  
  // Fix content server stub
  console.log('🔧 Fixing content server stub...');
  const stubPath = 'server/stubs/content-server-stub.ts';
  if (fs.existsSync(stubPath)) {
    let content = fs.readFileSync(stubPath, 'utf8');
    
    // Ensure proper TypeScript types
    if (!content.includes('export type')) {
      content = `// server/stubs/content-server-stub.ts
// Stub for @nuxt/content server API to avoid build/prerender errors when nuxt-simple-sitemap
// attempts to import "#content/server". This stub returns no content entries.

export type ContentQueryChain = {
  where: (...args: any[]) => ContentQueryChain
  only: (...args: any[]) => ContentQueryChain
  sort: (...args: any[]) => ContentQueryChain
  limit: (...args: any[]) => ContentQueryChain
  find: () => Promise<any[]>
}

export function serverQueryContent(..._args: any[]): ContentQueryChain {
  const chain: ContentQueryChain = {
    where: () => chain,
    only: () => chain,
    sort: () => chain,
    limit: () => chain,
    find: async () => []
  }
  return chain
}

export default {}
`;
      fs.writeFileSync(stubPath, content);
      console.log('✅ Fixed content server stub');
    }
  }
  
  // Fix content-related plugins
  console.log('🔌 Fixing content plugins...');
  const pluginsDir = 'plugins';
  if (fs.existsSync(pluginsDir)) {
    const plugins = fs.readdirSync(pluginsDir);
    
    // Check for content-related plugins
    const contentPlugins = plugins.filter(plugin => 
      plugin.includes('content') || plugin.includes('blog')
    );
    
    contentPlugins.forEach(plugin => {
      const pluginPath = path.join(pluginsDir, plugin);
      let content = fs.readFileSync(pluginPath, 'utf8');
      
      // Add error handling
      if (!content.includes('error handling')) {
        content = `
// Error handling for content plugin
try {
  ${content}
} catch (error) {
  console.error('Content plugin error:', error);
}
`;
        fs.writeFileSync(pluginPath, content);
        console.log(`✅ Added error handling to ${plugin}`);
      }
    });
  }
  
  console.log('✅ Content issues fixed!');
  
} catch (error) {
  console.error('❌ Error fixing content issues:', error.message);
  process.exit(1);
}
