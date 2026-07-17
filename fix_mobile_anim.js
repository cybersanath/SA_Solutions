const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove opacity: 1 !important; so GSAP can animate opacity
  content = content.replace(/opacity:\s*1\s*!important;/g, 'opacity: 1;');
  
  // Change transform: none !important; to transform: none; so GSAP can override it
  content = content.replace(/transform:\s*none\s*!important;/g, 'transform: none;');
  
  // Update the else block in index.html for mobile animation
  if (file === 'index.html') {
    const oldJs = `} else {
  // On mobile, keep the steps fully visible and let them scroll naturally
  document.querySelectorAll('.hub-step').forEach(s => {
    s.style.opacity = '1';
  });
}`;
    const newJs = `} else {
  // On mobile, fade and slide up each step as it scrolls into view
  gsap.utils.toArray('.hub-step').forEach((step, i) => {
    gsap.fromTo(step, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: step, start: 'top 85%' } }
    );
  });
}`;
    content = content.replace(oldJs, newJs);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated ' + file);
});
