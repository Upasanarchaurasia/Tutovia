const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
  try {
    console.log('Testing ICAI examination page request...');
    const url = 'https://www.icai.org/category/examination';
    const resp = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      timeout: 10000
    });
    console.log('Status:', resp.status, 'Content length:', resp.data?.length);
    const $ = cheerio.load(resp.data);
    const links = [];
    $('a').each((i, el) => {
      const text = $(el).text().trim().replace(/\s+/g, ' ');
      const href = $(el).attr('href');
      if (text && href && (text.toLowerCase().includes('intermediate') || text.toLowerCase().includes('exam') || text.toLowerCase().includes('january') || text.toLowerCase().includes('may'))) {
        links.push({ text: text.slice(0, 100), href });
      }
    });
    console.log('Found matching announcements count:', links.length);
    console.log('Sample announcements:', links.slice(0, 8));
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
})();
