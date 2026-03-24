const fs = require('fs');
const path = require('path');

const dirs = ['src/components/sections', 'src/components/layout'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

  files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace hex codes with tailwind classes where applicable
    content = content.replace(/bg-\[\#000000\]/g, 'bg-bg');
    content = content.replace(/bg-\[\#0d0d0d\]/g, 'bg-card');
    content = content.replace(/bg-\[\#1f1f1f\]/g, 'bg-muted');
    content = content.replace(/bg-\[\#333333\]/g, 'bg-muted');
    
    content = content.replace(/text-\[\#ffffff\]/g, 'text-fg');
    content = content.replace(/text-\[\#888888\]/g, 'text-muted-fg');
    
    content = content.replace(/border-\[\#1f1f1f\]/g, 'border-border');
    content = content.replace(/border-\[\#333333\]/g, 'border-border');
    
    // Also replace any raw hex codes in inline styles or strings
    content = content.replace(/#000000/g, 'var(--bg)');
    content = content.replace(/#ffffff/g, 'var(--fg)');
    content = content.replace(/#1f1f1f/g, 'var(--border)');
    content = content.replace(/#333333/g, 'var(--border)');
    content = content.replace(/#0d0d0d/g, 'var(--card)');
    content = content.replace(/#888888/g, 'var(--muted-fg)');
    
    // Replace tailwind classes
    content = content.replace(/\bbg-black\b/g, 'bg-bg');
    content = content.replace(/\btext-white\b/g, 'text-fg');
    content = content.replace(/\bbg-white\b/g, 'bg-fg');
    content = content.replace(/\btext-black\b/g, 'text-bg');
    content = content.replace(/\bborder-white\b/g, 'border-fg');
    content = content.replace(/\bborder-black\b/g, 'border-bg');
    content = content.replace(/\bring-black\b/g, 'ring-bg');
    content = content.replace(/\bring-white\b/g, 'ring-fg');

    fs.writeFileSync(filePath, content);
  });
});
console.log('Done');
