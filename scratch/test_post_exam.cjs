const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
  try {
    const resp = await axios.get('https://www.icai.org/post/exam', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 10000
    });
    console.log('Status:', resp.status);
    const $ = cheerio.load(resp.data);
    const links = [];
    $('a').each((i, el) => {
      const text = $(el).text().trim().replace(/\s+/g, ' ');
      const href = $(el).attr('href');
      if (text.length > 5 && href) {
        links.push({ text: text.slice(0, 100), href });
      }
    });
    console.log('Total links:', links.length);
    links.slice(0, 15).forEach(l => console.log(' * ', l.text, '->', l.href));
  } catch (e) {
    console.error('Error:', e.message);
  }
})();
