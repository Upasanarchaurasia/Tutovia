const cheerio = require('/home/ubuntu/tutovia/node_modules/cheerio');
const execSync = require('child_process').execSync;

const papers = [
  'sm-intermediate-paper1',
  'sm-intermediate-paper2',
  'sm-intermediate-paper3-seca',
  'sm-intermediate-paper3-secb',
  'sm-intermediate-paper4',
  'sm-intermediate-paper5',
  'sm-intermediate-paper6a',
  'sm-intermediate-paper6b'
];

for (const p of papers) {
  const url = `https://www.icai.org/post/${p}`;
  const html = execSync(`curl -s -L "${url}"`, { encoding: 'utf-8' });
  const $ = cheerio.load(html);
  console.log(`\n========================================`);
  console.log(`PAPER: ${p}`);
  $('table a, .content a').each((i, el) => {
    const href = $(el).attr('href');
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    if (href && (href.includes('post') || href.includes('.pdf'))) {
      console.log(`  [${text}] -> ${href}`);
    }
  });
}
