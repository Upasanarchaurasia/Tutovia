const cheerio = require('/home/ubuntu/tutovia/node_modules/cheerio');

async function checkPost(postId) {
  try {
    const url = `https://www.icai.org/post/${postId}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) return null;
    const html = await res.text();
    const $ = cheerio.load(html);

    const title = $('h2, .title, .page-title, h3, h1').first().text().replace(/\s+/g, ' ').trim();
    const pdfs = [];
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (href && href.includes('.pdf') && href.includes('resource.cdn.icai.org')) {
        const text = $(el).text().replace(/\s+/g, ' ').trim();
        pdfs.push({ text, href });
      }
    });

    if (pdfs.length > 0) {
      console.log(`\n========================================`);
      console.log(`POST ${postId}: ${title} (${pdfs.length} PDFs)`);
      console.log(`========================================`);
      pdfs.forEach(p => console.log(`  * [${p.text}] -> ${p.href}`));
    }
  } catch (e) {
  }
}

async function run() {
  for (let pid = 18020; pid <= 18050; pid++) {
    await checkPost(pid);
  }
}

run();
