const cheerio = require('/home/ubuntu/tutovia/node_modules/cheerio');

async function checkPost(postId) {
  try {
    const url = `https://www.icai.org/post/${postId}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 6000 });
    if (!res.ok) return null;
    const html = await res.text();
    const $ = cheerio.load(html);

    const bodyText = $('body').text().slice(0, 3000);
    // Only proceed if it looks like Intermediate Study Material
    if (!bodyText.includes('Study Material') && !bodyText.includes('Paper')) return null;

    const pdfs = [];
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (href && href.includes('.pdf') && href.includes('resource.cdn.icai.org')) {
        const text = $(el).text().replace(/\s+/g, ' ').trim();
        if (text && !text.toLowerCase().includes('initial') && !text.toLowerCase().includes('feedback')) {
          pdfs.push({ text, href });
        }
      }
    });

    if (pdfs.length >= 4) {
      console.log(`\n========================================`);
      console.log(`POST ${postId}: (${pdfs.length} PDFs)`);
      console.log(`========================================`);
      pdfs.forEach(p => console.log(`  * [${p.text}] -> ${p.href}`));
      return { id: postId, pdfs };
    }
  } catch (e) {
  }
  return null;
}

async function run() {
  const targetIds = [];
  // Check range 17800 to 18060
  for (let i = 17810; i <= 18060; i++) targetIds.push(i);
  // Check range 14350 to 14450
  for (let i = 14360; i <= 14420; i++) targetIds.push(i);
  // Check range 12420 to 12450
  for (let i = 12420; i <= 12450; i++) targetIds.push(i);

  console.log(`Scanning ${targetIds.length} candidate post IDs...`);
  const found = [];
  for (const pid of targetIds) {
    const res = await checkPost(pid);
    if (res) found.push(res);
  }
  console.log(`\nDONE. Found ${found.length} study material posts.`);
}

run();
