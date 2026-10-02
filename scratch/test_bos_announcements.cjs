const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
  try {
    const resp = await axios.get('https://www.icai.org/category/board-of-studies-announcements', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 10000
    });
    console.log('BoS Announcements Status:', resp.status);
    const $ = cheerio.load(resp.data);
    const announcements = [];
    $('a').each((i, el) => {
      const text = $(el).text().trim().replace(/\s+/g, ' ');
      const href = $(el).attr('href');
      if (text.length > 10 && href && !href.includes('/category/')) {
        announcements.push({ text: text.slice(0, 100), href });
      }
    });
    console.log('Found:', announcements.length);
    announcements.slice(0, 10).forEach(a => console.log(' ->', a.text, '|', a.href));
  } catch (e) {
    console.error('Error:', e.message);
  }
})();
