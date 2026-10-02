const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
  const urls = [
    'https://www.icai.org/category/examination-announcements',
    'https://www.icai.org/category/important-announcements',
    'https://www.icai.org/category/exam-announcements'
  ];
  for (const u of urls) {
    try {
      const resp = await axios.get(u, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        timeout: 8000
      });
      console.log(u, '->', resp.status, 'len:', resp.data.length);
      const $ = cheerio.load(resp.data);
      const items = [];
      $('ul li a, td a, p a').each((i, el) => {
        const text = $(el).text().trim().replace(/\s+/g, ' ');
        const href = $(el).attr('href');
        if (text && (text.toLowerCase().includes('intermediate') || text.toLowerCase().includes('examination') || text.toLowerCase().includes('january') || text.toLowerCase().includes('may') || text.toLowerCase().includes('september'))) {
          items.push({ text: text.slice(0, 90), href });
        }
      });
      console.log('Matches for', u, ':', items.slice(0, 5));
    } catch (e) {
      console.log(u, '-> Error:', e.message);
    }
  }
})();
