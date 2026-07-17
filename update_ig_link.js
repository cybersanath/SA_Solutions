const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find the anchor tag that contains the ig icon
  // It looks like: <a href="#" ...><span class="ln-icon">ig</span></a>
  // We can use a regex to replace href="#" with the actual link for the ig icon
  
  const regex = /<a\s+href="[^"]*"\s+([^>]*?)>(<span\s+class="ln-icon">ig<\/span>)<\/a>/g;
  
  if (regex.test(content)) {
    content = content.replace(regex, '<a href="https://www.instagram.com/sasolutions.offical?igsh=eDFwb3F3eWZzdHQy" ></a>');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated ' + file);
  }
});
