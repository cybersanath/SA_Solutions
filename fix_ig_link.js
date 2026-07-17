const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const badString = '<a href="https://www.instagram.com/sasolutions.offical?igsh=eDFwb3F3eWZzdHQy" ></a>';
const goodString = `<a href="https://www.instagram.com/sasolutions.offical?igsh=eDFwb3F3eWZzdHQy" style="width: 36px; height: 36px; border: 1px solid rgba(245,240,225,0.1); border-radius: 6px; display: flex; align-items: center; justify-content: center; color: rgba(245,240,225,0.4); text-decoration: none; font-size: 1.1rem; transition: all 0.3s;" onmouseover="this.style.borderColor='var(--gold)'; this.style.color='var(--gold)'" onmouseout="this.style.borderColor='rgba(245,240,225,0.1)'; this.style.color='rgba(245,240,225,0.4)'"><span class="ln-icon">ig</span></a>`;

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes(badString)) {
    content = content.replace(badString, goodString);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed ' + file);
  }
});
