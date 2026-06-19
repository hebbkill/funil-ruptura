const fs = require('fs');
const https = require('https');

async function main() {
  try {
    // 1. Parse SRT
    const srtContent = fs.readFileSync('C:/Users/hebbe/Downloads/chamada-sombria.srt', 'utf-8');
    const lines = srtContent.split(/\r?\n/);
    const subtitles = [];
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('-->')) {
        const timeParts = lines[i].split(' --> ')[0].split(':');
        const seconds = parseInt(timeParts[0]) * 3600 + parseInt(timeParts[1]) * 60 + parseFloat(timeParts[2].replace(',', '.'));
        const text = lines[i+1];
        if (text && text.trim() !== '') {
          subtitles.push({ start: seconds, text: text.trim() });
        }
      }
    }

    const jsCode = `  const subtitles = [\n${subtitles.map(s => `    { start: ${s.start}, text: "${s.text.replace(/"/g, '\\"')}" }`).join(',\n')}\n  ];`;
    
    // Update chamada.html
    let html = fs.readFileSync('chamada.html', 'utf-8');
    html = html.replace(/const subtitles = \[[^]*?\];/, jsCode);
    html = html.replace(/const timeOffset = [-0-9.]+;/, 'const timeOffset = 0;'); // reset offset since the SRT is accurate
    fs.writeFileSync('chamada.html', html);
    console.log('Subtitles updated.');

    // 2. Fetch Google Form
    const url = 'https://docs.google.com/forms/d/e/1FAIpQLScZqjZYHuumDGgwTY6piIiEHuI_QbjxicnHtdWCt9xHpHUD4A/viewform';
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        fs.writeFileSync('form_debug.txt', data);
        console.log('Form HTML saved to form_debug.txt');
      });
    }).on('error', (e) => {
      console.error(e);
    });

  } catch(e) {
    console.error(e);
  }
}

main();
