const fs = require('fs');
const path = require('path');

const gaScript = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-FWX33ZTRGF"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-FWX33ZTRGF');
</script>
`;

const dir = 'c:\\Users\\hebbe\\Desktop\\Hebber\\IA\\Finil Magnético';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Se já tiver, não adiciona de novo
  if (!content.includes('G-FWX33ZTRGF')) {
    content = content.replace('</head>', `${gaScript}</head>`);
    fs.writeFileSync(filePath, content);
    console.log(`Added GA to ${file}`);
  } else {
    console.log(`GA already in ${file}`);
  }
});
