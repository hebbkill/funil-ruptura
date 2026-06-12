const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const htmlPath = path.resolve(__dirname, 'caderno.html');
    const pdfPath = path.resolve(__dirname, 'Caderno_da_Ruptura_Completo.pdf');

    console.log('Iniciando Playwright...');
    const browser = await chromium.launch();
    const page = await browser.newPage();

    console.log('Carregando HTML...');
    await page.goto(`file:///${htmlPath.replace(/\\/g, '/')}`, {
        waitUntil: 'networkidle',
        timeout: 60000
    });

    // Aguarda as fontes e ícones carregarem
    await page.waitForTimeout(3000);

    console.log('Gerando PDF...');
    await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        preferCSSPageSize: false
    });

    await browser.close();
    console.log(`PDF gerado com sucesso: ${pdfPath}`);
})();
