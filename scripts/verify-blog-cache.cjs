#!/usr/bin/env node
/*
  scripts/verify-blog-cache.cjs
  - Scans data/blog cache for duplicates and basic integrity
  - Safe to run even if cache is missing or empty
*/

const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');

async function tryReadJson(file) {
  try {
    const txt = await fsp.readFile(file, 'utf-8');
    return JSON.parse(txt);
  } catch {
    return null;
  }
}

async function main() {
  const root = process.cwd();
  const blogDir = path.join(root, 'data', 'blog');
  const indexPath = path.join(blogDir, 'index.json');

  const exists = fs.existsSync(blogDir);
  if (!exists) {
    console.log('OK: data/blog directory does not exist yet. No cache found.');
    return;
  }

  const index = await tryReadJson(indexPath);
  if (!Array.isArray(index) || index.length === 0) {
    console.log('INFO: data/blog/index.json missing or empty.');
  } else {
    console.log(`Index items: ${index.length}`);
  }

  // Collect per-post slugs from files
  let files = [];
  try {
    files = await fsp.readdir(blogDir);
  } catch {}

  const postFiles = files.filter(f => f.toLowerCase().endsWith('.json') && f.toLowerCase() !== 'index.json');
  const slugs = [];
  const titles = [];
  for (const file of postFiles) {
    const slug = path.basename(file, '.json');
    slugs.push(slug);
    const content = await tryReadJson(path.join(blogDir, file));
    if (content && typeof content.title === 'string') {
      titles.push(content.title.trim().toLowerCase());
    }
  }

  function findDuplicates(arr) {
    const seen = new Set();
    const dups = new Set();
    for (const v of arr) {
      if (seen.has(v)) dups.add(v); else seen.add(v);
    }
    return Array.from(dups.values());
  }

  const slugDups = findDuplicates(slugs);
  const titleDups = findDuplicates(titles);

  if (slugDups.length === 0) {
    console.log('OK: No duplicate slugs in data/blog/*.json');
  } else {
    console.log('WARN: Duplicate slugs detected:', slugDups);
  }

  if (titleDups.length === 0) {
    console.log('OK: No duplicate titles (case-insensitive) in data/blog/*.json');
  } else {
    console.log('WARN: Duplicate titles detected (case-insensitive):', titleDups);
  }

  // Cross-check index vs files by slug
  const indexSlugs = Array.isArray(index) ? index.map(it => String(it.slug || '')) : [];
  const missingInIndex = slugs.filter(s => s && !indexSlugs.includes(s));
  const missingFileForIndex = indexSlugs.filter(s => s && !slugs.includes(s));

  if (missingInIndex.length) {
    console.log('INFO: Posts present as files but missing in index.json:', missingInIndex);
  } else {
    console.log('OK: All post files indexed.');
  }

  if (missingFileForIndex.length) {
    console.log('INFO: Index entries without corresponding post files:', missingFileForIndex);
  } else {
    console.log('OK: All index entries have matching post files.');
  }
}

main().catch(err => {
  console.error('verify-blog-cache failed:', err && err.message ? err.message : err);
  process.exitCode = 1;
});
