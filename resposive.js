const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const responsiveCSS = `
  /* Universal Mobile Responsiveness Enhancements */
  @media (max-width: 900px) {
    /* General spacing */
    section { padding: 80px 20px !important; }
    .container { padding: 40px 20px 80px !important; }
    
    /* Typography scaling for extreme cases */
    .m-number { font-size: 3.5rem !important; }
    h1 { font-size: clamp(2rem, 8vw, 3rem) !important; }
    h2 { font-size: clamp(1.8rem, 6vw, 2.5rem) !important; }
    
    /* Layout fixes */
    .footer-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
    .contact-layout { flex-direction: column !important; gap: 40px !important; }
    .contact-form-right { width: 100% !important; padding: 30px 20px !important; }
    .process-grid { grid-template-columns: 1fr !important; }
    .milestone-grid { grid-template-columns: 1fr 1fr !important; }
    .mission-grid { grid-template-columns: 1fr !important; }
    .service-grid { grid-template-columns: 1fr !important; }
    
    /* Modals & Overlays */
    .modal-container { width: 95% !important; padding: 30px 20px !important; }
    
    /* Misc elements */
    .hub { max-width: 100% !important; height: auto !important; }
    .hub-ring { display: none !important; }
    .hub-step { position: relative !important; top: auto !important; left: auto !important; right: auto !important; bottom: auto !important; transform: none !important; margin-bottom: 20px !important; width: 100% !important; opacity: 1 !important; }
    
    .page-header { flex-direction: column !important; align-items: flex-start !important; }
    
    .leadership-cards-container { flex-direction: column !important; height: auto !important; }
    .reveal-card { display: flex !important; width: 100% !important; transform: none !important; opacity: 1 !important; padding: 30px !important; margin-left: 0 !important; margin-top: 20px !important; border-left: 1px solid var(--border-color) !important; border-top: none !important; border-radius: 16px !important; }
  }
  
  @media (max-width: 480px) {
    .milestone-grid { grid-template-columns: 1fr !important; }
    .milestone-card { border-right: none !important; border-bottom: 1px solid var(--border-color) !important; padding: 40px 20px !important; }
  }
`;

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Only inject if not already injected
  if (!content.includes('Universal Mobile Responsiveness Enhancements')) {
    content = content.replace('</style>', responsiveCSS + '\n</style>');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated ' + file);
  } else {
    console.log('Skipped ' + file + ' (already injected)');
  }
});