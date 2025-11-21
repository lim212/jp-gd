const fs = require('fs');
const content = fs.readFileSync('app/layouts/default-backup.vue', 'utf8');
const lines = content.split('\n').slice(0, 82);

let openTags = [];
let closeTags = [];

lines.forEach((line, idx) => {
  const lineNum = idx + 1;
  // Find opening tags (not self-closing)
  const openMatches = line.matchAll(/<([a-zA-Z][a-zA-Z0-9-]*)(?![\/>])[^>]*(?<!\/)>/g);
  for (const match of openMatches) {
    const tag = match[1].toLowerCase();
    // Skip self-closing components and HTML self-closing tags
    if (!tag.includes('loading') && !tag.includes('cache') && !tag.includes('dev') && 
        !tag.includes('logo') && !tag.includes('uicon') && !tag.includes('nuxt') &&
        tag !== 'svg' && tag !== 'path' && tag !== 'br' && tag !== 'img' && tag !== 'input') {
      openTags.push({tag, line: lineNum});
    }
  }
  // Find closing tags
  const closeMatches = line.matchAll(/<\/([a-zA-Z][a-zA-Z0-9-]*)>/g);
  for (const match of closeMatches) {
    const tag = match[1].toLowerCase();
    closeTags.push({tag, line: lineNum});
  }
});

console.log('Opening tags:', openTags.length);
console.log('Closing tags:', closeTags.length);
console.log('Difference:', openTags.length - closeTags.length);
console.log('\nOpening tags:');
openTags.forEach(t => console.log(`  ${t.tag} at line ${t.line}`));
console.log('\nClosing tags:');
closeTags.forEach(t => console.log(`  ${t.tag} at line ${t.line}`));


