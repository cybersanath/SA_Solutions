const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace the Facebook icon text with Instagram icon text
  // Looking for <span class="ln-icon">fb</span>
  if (content.includes('<span class="ln-icon">fb</span>')) {
    content = content.replace(/<span class="ln-icon">fb<\/span>/g, '<span class="ln-icon">ig</span>');
    
    // Also, if there's any aria-label or title for Facebook, we could change it, but it seems there isn't.
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated ' + file);
  }
});
