const cheerio = require('/home/ubuntu/tutovia/node_modules/cheerio');

async function checkPaper1() {
  const url = 'https://www.icai.org/post/sm-intermediate-paper1';
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await res.text();
  const $ = cheerio.load(html);

  console.log('Title:', $('title').text());
  console.log('All links count:', $('a').length);
  $('a').each((i, el) => {
    const href = $(el).attr('href');
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    if (href && (href.includes('.pdf') || href.includes('post') || href.includes('resource'))) {
      console.log(`[${text}] -> ${href}`);
    }
  });
}

checkPaper1();
