const cheerio = require('/home/ubuntu/tutovia/node_modules/cheerio');
const execSync = require('child_process').execSync;
const fs = require('fs');

function fetchHtml(url) {
  try {
    return execSync(`curl -s -L --max-time 15 "${url}"`, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
  } catch (e) {
    return '';
  }
}

// 1. First load CA Intermediate results
let allMaterials = JSON.parse(fs.readFileSync('/home/ubuntu/verified_all_chapters.json', 'utf8'));
console.log(`Loaded ${allMaterials.length} CA Intermediate materials.`);

// 2. Fetch CA Final papers
try {
  const finalHtml = fetchHtml('https://www.icai.org/post/final-nset');
  const $f = cheerio.load(finalHtml);
  const finalPapers = [];
  $f('a').each((i, el) => {
    const href = $f(el).attr('href');
    const text = $f(el).text().replace(/\s+/g, ' ').trim();
    if (href && (href.includes('sm-final') || href.includes('paper')) && text.length > 5) {
      finalPapers.push({ text, href });
    }
  });

  console.log(`Found ${finalPapers.length} Final papers`);
  for (const fp of finalPapers) {
    let purl = fp.href;
    if (!purl.startsWith('http')) purl = 'https://www.icai.org' + purl;
    const pHtml = fetchHtml(purl);
    const $p = cheerio.load(pHtml);

    // Check if there is an active exam subpage
    let targetUrl = purl;
    $p('a').each((i, el) => {
      const h = $p(el).attr('href');
      if (h && (h.includes('may2026') || h.includes('nov2025') || h.includes('exam')) && !h.includes('hindi')) {
        targetUrl = h.startsWith('http') ? h : 'https://www.icai.org' + h;
      }
    });

    const subHtml = targetUrl === purl ? pHtml : fetchHtml(targetUrl);
    const $sub = cheerio.load(subHtml);

    let count = 0;
    $sub('a').each((idx, aEl) => {
      const pdfUrl = $sub(aEl).attr('href');
      const title = $sub(aEl).text().replace(/\s+/g, ' ').trim();
      if (pdfUrl && pdfUrl.includes('resource.cdn.icai.org') && pdfUrl.toLowerCase().includes('.pdf')) {
        if (!title.toLowerCase().includes('initial') && !title.toLowerCase().includes('feedback')) {
          const asMatch = title.match(/\b(Ind\s*AS\s*\d{2,3}|SA\s*\d{3}|AS\s*\d{1,2})\b/i);
          allMaterials.push({
            course: 'CA Final',
            group: fp.text.toLowerCase().includes('group ii') || fp.text.includes('4') || fp.text.includes('5') || fp.text.includes('6') ? 'Group 2' : 'Group 1',
            subject: fp.text,
            chapter_title: title,
            pdf_url: pdfUrl,
            portal_source_url: targetUrl,
            is_standard: !!asMatch,
            standard_code: asMatch ? asMatch[1].toUpperCase().replace(/\s+/g, ' ') : null
          });
          count++;
        }
      }
    });
    console.log(`  CA Final [${fp.text}] added ${count} chapters`);
  }
} catch (err) {
  console.warn('Error fetching CA Final:', err.message);
}

console.log(`\n======================================================`);
console.log(`TOTAL ALL LEVELS MATERIALS: ${allMaterials.length}`);
console.log(`======================================================`);

fs.writeFileSync('/home/ubuntu/complete_icai_materials.json', JSON.stringify(allMaterials, null, 2));
