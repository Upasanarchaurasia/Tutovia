const cheerio = require('/home/ubuntu/tutovia/node_modules/cheerio');
const execSync = require('child_process').execSync;

function inspectUrl(url) {
  console.log(`\n========================================`);
  console.log(`FETCHING: ${url}`);
  const html = execSync(`curl -s -L "${url}"`, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
  const $ = cheerio.load(html);

  console.log('Title:', $('title').text());
  const links = [];
  $('a').each((i, el) => {
    const href = $(el).attr('href');
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    if (href && href.includes('resource.cdn.icai.org') && href.toLowerCase().includes('.pdf')) {
      links.push({ text, href });
      console.log(`  * [${text}] -> ${href}`);
    } else if (href && href.includes('post/bos-int-')) {
      console.log(`  Subpage: [${text}] -> ${href}`);
    }
  });
  console.log(`Total PDFs on ${url}: ${links.length}`);
  return links;
}

inspectUrl('https://www.icai.org/post/bos-int-p1-may2026-exam');
