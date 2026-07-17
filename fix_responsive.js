const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const responsiveCSS = `
  /* Universal Mobile Responsiveness Enhancements */
  @media (max-width: 900px) {
    html, body { overflow-x: hidden !important; width: 100%; max-width: 100vw; }
    
    /* Navbar fixes */
    .nav-links { display: none !important; }
    #navbar { padding: 16px 20px !important; flex-wrap: wrap !important; }
    
    /* Ensure the mobile menu button is visible, clickable, and positioned correctly */
    .mobile-menu-btn { 
      display: block !important; 
      position: relative !important; 
      right: 0 !important; 
      margin-left: auto !important; 
      background: none !important; 
      border: none !important; 
      color: var(--gold) !important; 
      font-size: 32px !important; 
      cursor: pointer !important; 
      z-index: 1001 !important; 
    }
    
    .nav-cta { display: none !important; } /* Hide CTA on mobile to save space */
    
    /* Typography scaling */
    #hero h1 { font-size: clamp(2rem, 8vw, 3rem) !important; }
    h2 { font-size: clamp(1.8rem, 6vw, 2.5rem) !important; }
    .m-number { font-size: 3.5rem !important; }
    
    /* Layout fixes to prevent horizontal overflow */
    .service-grid, .mission-grid, .footer-grid, .contact-layout, .process-grid, .milestone-grid, .leadership-cards-container { 
        grid-template-columns: 1fr !important; 
        flex-direction: column !important; 
        gap: 20px !important;
    }
    .contact-form-right { width: 100% !important; padding: 30px 20px !important; }
    section { padding: 60px 20px !important; }
    .wrap, .wrap-narrow { padding: 0 15px !important; max-width: 100% !important; box-sizing: border-box !important; }
    
    /* Service card overflow fix */
    .service-card { width: 100% !important; box-sizing: border-box !important; }
    
    /* Reveal card tweaks */
    .reveal-card { 
      width: 100% !important; 
      padding: 30px 20px !important; 
      margin-left: 0 !important; 
      margin-top: 20px !important; 
      border-left: 1px solid var(--border-color) !important; 
      border-top: none !important; 
    }
    
    /* Modals */
    .modal-container { width: 95% !important; padding: 30px 20px !important; }
    
    /* Hub / Process elements */
    .hub { max-width: 100% !important; height: auto !important; }
    .hub-ring { display: none !important; }
    .hub-step { position: relative !important; top: auto !important; left: auto !important; right: auto !important; bottom: auto !important; transform: none !important; margin-bottom: 20px !important; width: 100% !important; opacity: 1 !important; }
    
    /* Fab / Misc fixes */
    .whatsapp-fab { right: 20px !important; bottom: 20px !important; }
    .chat-widget { right: 20px !important; bottom: 90px !important; max-width: calc(100vw - 40px) !important; }
  }
  
  @media (max-width: 480px) {
    .milestone-grid { grid-template-columns: 1fr !important; }
    .milestone-card { border-right: none !important; border-bottom: 1px solid var(--border-color) !important; padding: 40px 20px !important; }
  }
`;

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('Universal Mobile Responsiveness Enhancements')) {
    // Some files might have </style> formatted differently or with spaces
    // The safest way is to do a string replace on </style>
    if (content.includes('</style>')) {
      content = content.replace('</style>', responsiveCSS + '\n</style>');
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Successfully updated ' + file);
    } else {
      console.log('WARNING: Could not find </style> in ' + file);
    }
  } else {
    console.log('Skipped ' + file + ' (already injected)');
  }
});
