const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
  try {
    const url = 'https://www.icai.org/category/student-examination';
    const resp = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 10000
    });
    console.log('Status:', resp.status, 'Length:', resp.data.length);
    const $ = cheerio.load(resp.data);
    const items = [];
    $('ul li a, div a').each((i, el) => {
      const text = $(el).text().trim().replace(/\s+/g, ' ');
      const href = $(el).attr('href');
      if (text.length > 15 && href) {
        items.push({ text: text.slice(0, 100), href });
      }
    });
    console.log('Total items:', items.length);
    console.log('First 10 items:');
    items.slice(0, 10).forEach(it => console.log(' - ', it.text, '->', it.href));
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
