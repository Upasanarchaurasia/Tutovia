const cheerio = require('/home/ubuntu/tutovia/node_modules/cheerio');

async function checkPost(postId) {
  try {
    const url = `https://www.icai.org/post/${postId}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 5000 });
    if (!res.ok) return null;
    const html = await res.text();
    const $ = cheerio.load(html);

    const title = $('h2, .title, .page-title, h3, h1').text().replace(/\s+/g, ' ').trim();
    const pdfs = [];
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (href && href.includes('.pdf') && href.includes('resource.cdn.icai.org')) {
        const text = $(el).text().replace(/\s+/g, ' ').trim();
        if (text && !text.toLowerCase().includes('initial')) {
          pdfs.push({ text, href });
        }
      }
    });

    if (pdfs.length > 0) {
      return { id: postId, title: title.slice(0, 100), count: pdfs.length, sample: pdfs.slice(0, 5), all: pdfs };
    }
  } catch (e) {
    return null;
  }
  return null;
}

async function run() {
  const ranges = [
    // Range around 17838
    Array.from({ length: 30 }, (_, i) => 17825 + i),
    // Range around 12433
    Array.from({ length: 20 }, (_, i) => 12425 + i),
    // Common BOS post ranges
    Array.from({ length: 30 }, (_, i) => 17780 + i),
    Array.from({ length: 30 }, (_, i) => 17850 + i),
    Array.from({ length: 30 }, (_, i) => 18000 + i),
    Array.from({ length: 30 }, (_, i) => 19100 + i)
  ].flat();

  console.log(`Checking ${ranges.length} post IDs...`);
  for (const pid of ranges) {
    const r = await checkPost(pid);
    if (r) {
      console.log(`\n=== MATCH POST ${r.id}: ${r.title} (${r.count} PDFs) ===`);
      r.sample.forEach(s => console.log(`  - [${s.text}] -> ${s.href}`));
    }
  }
}

run();
