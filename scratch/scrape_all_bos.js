const cheerio = require('/home/ubuntu/tutovia/node_modules/cheerio');
const execSync = require('child_process').execSync;
const fs = require('fs');

const paperIndexPages = [
  { course: 'CA Intermediate', group: 'Group 1', subject: 'Advanced Accounting', url: 'https://www.icai.org/post/sm-intermediate-paper1' },
  { course: 'CA Intermediate', group: 'Group 1', subject: 'Corporate and Other Laws', url: 'https://www.icai.org/post/sm-intermediate-paper2' },
  { course: 'CA Intermediate', group: 'Group 1', subject: 'Taxation - Income Tax', url: 'https://www.icai.org/post/sm-intermediate-paper3-seca' },
  { course: 'CA Intermediate', group: 'Group 1', subject: 'Taxation - GST', url: 'https://www.icai.org/post/sm-intermediate-paper3-secb' },
  { course: 'CA Intermediate', group: 'Group 2', subject: 'Cost and Management Accounting', url: 'https://www.icai.org/post/sm-intermediate-paper4' },
  { course: 'CA Intermediate', group: 'Group 2', subject: 'Auditing and Ethics', url: 'https://www.icai.org/post/sm-intermediate-paper5' },
  { course: 'CA Intermediate', group: 'Group 2', subject: 'Financial Management', url: 'https://www.icai.org/post/sm-intermediate-paper6a' },
  { course: 'CA Intermediate', group: 'Group 2', subject: 'Strategic Management', url: 'https://www.icai.org/post/sm-intermediate-paper6b' },
];

function fetchHtml(url) {
  try {
    return execSync(`curl -s -L --max-time 15 "${url}"`, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
  } catch (e) {
    return '';
  }
}

const allResults = [];

for (const paper of paperIndexPages) {
  console.log(`\n======================================================`);
  console.log(`SUBJECT: ${paper.subject} (${paper.url})`);
  const html = fetchHtml(paper.url);
  const $ = cheerio.load(html);

  // Find active exam subpages (e.g. may2026, jan2026, sep2025, or direct chapter links)
  const examSubpages = [];
  $('a').each((i, el) => {
    const href = $(el).attr('href');
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    if (href && (href.includes('post/bos-int-') || href.includes('exam')) && !href.includes('hindi')) {
      examSubpages.push({ text, href });
    }
  });

  console.log(`Found ${examSubpages.length} subpages`);
  
  // Pick the most recent active exam subpage (or use paper.url if none)
  const pagesToScrape = examSubpages.length > 0 ? [examSubpages[0].href] : [paper.url];

  for (let targetUrl of pagesToScrape) {
    if (!targetUrl.startsWith('http')) targetUrl = 'https://www.icai.org' + targetUrl;
    console.log(`Scraping target: ${targetUrl}`);
    const subHtml = fetchHtml(targetUrl);
    const sub$ = cheerio.load(subHtml);

    let moduleName = 'Study Material';
    sub$('tr, div, li, p, strong, h3, h4').each((idx, el) => {
      const line = sub$(el).clone().children().remove().end().text().replace(/\s+/g, ' ').trim();
      if (/Module\s*\d/i.test(line) || /Part\s*[I|1|2|II]/i.test(line)) {
        moduleName = line;
      }
    });

    sub$('a').each((idx, aEl) => {
      const href = sub$(aEl).attr('href');
      const text = sub$(aEl).text().replace(/\s+/g, ' ').trim();
      if (href && href.includes('resource.cdn.icai.org') && href.toLowerCase().includes('.pdf')) {
        if (!text.toLowerCase().includes('initial') && !text.toLowerCase().includes('feedback')) {
          allResults.push({
            course: paper.course,
            group: paper.group,
            subject: paper.subject,
            module: moduleName,
            title: text,
            url: href,
            source: targetUrl
          });
          console.log(`  + [${text}] -> ${href}`);
        }
      }
    });
  }
}

console.log(`\n======================================================`);
console.log(`TOTAL CHAPTER/UNIT PDFs DISCOVERED: ${allResults.length}`);
console.log(`======================================================`);
fs.writeFileSync('/home/ubuntu/all_bos_pdfs.json', JSON.stringify(allResults, null, 2));
