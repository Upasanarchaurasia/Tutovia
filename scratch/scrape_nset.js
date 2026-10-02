const cheerio = require('/home/ubuntu/tutovia/node_modules/cheerio');
const fs = require('fs');

async function scrapeIntermediateNSET() {
  const url = 'https://www.icai.org/post/intermediate-nset';
  console.log('Fetching', url);
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
  const html = await res.text();
  const $ = cheerio.load(html);

  const subjectPages = [];
  $('a').each((i, el) => {
    const href = $(el).attr('href');
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    if (href && (href.includes('post') || href.includes('icai.org'))) {
      if (text.toLowerCase().includes('paper') || text.toLowerCase().includes('accounting') || text.toLowerCase().includes('law') || text.toLowerCase().includes('tax') || text.toLowerCase().includes('cost') || text.toLowerCase().includes('audit') || text.toLowerCase().includes('financial')) {
        subjectPages.push({ text, href });
      }
    }
  });

  console.log(`Found ${subjectPages.length} subject links:`);
  subjectPages.forEach(s => console.log(`  * [${s.text}] -> ${s.href}`));

  const allStudyMaterials = [];

  for (const page of subjectPages) {
    let pageUrl = page.href;
    if (!pageUrl.startsWith('http')) {
      pageUrl = 'https://www.icai.org' + (pageUrl.startsWith('/') ? '' : '/') + pageUrl;
    }
    console.log(`\n--- Fetching Subject: ${page.text} (${pageUrl}) ---`);
    try {
      const pRes = await fetch(pageUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
      const pHtml = await pRes.text();
      const p$ = cheerio.load(pHtml);

      let currentModule = 'Module 1';
      p$('tr, p, div, li, h3, h4').each((idx, elem) => {
        const t = p$(elem).clone().children().remove().end().text().trim();
        if (t.toLowerCase().includes('module') || t.toLowerCase().includes('part')) {
          currentModule = t;
        }
      });

      p$('a').each((idx, aElem) => {
        const href = p$(aElem).attr('href');
        const linkText = p$(aElem).text().replace(/\s+/g, ' ').trim();
        if (href && href.includes('resource.cdn.icai.org') && href.toLowerCase().includes('.pdf')) {
          if (!linkText.toLowerCase().includes('initial') && !linkText.toLowerCase().includes('feedback')) {
            allStudyMaterials.push({
              subjectText: page.text,
              title: linkText,
              pdfUrl: href,
              sourceUrl: pageUrl
            });
            console.log(`    PDF: [${linkText}] -> ${href}`);
          }
        }
      });
    } catch (e) {
      console.error(`Error fetching ${pageUrl}:`, e.message);
    }
  }

  console.log(`\n========================================`);
  console.log(`TOTAL REAL PDFs FOUND: ${allStudyMaterials.length}`);
  console.log(`========================================`);
  fs.writeFileSync('/home/ubuntu/nset_study_materials.json', JSON.stringify(allStudyMaterials, null, 2));
}

scrapeIntermediateNSET();
