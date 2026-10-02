async function fetchPost(id) {
  try {
    const url = `https://www.icai.org/post.html?post_id=${id}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    console.log(`Status ${id}:`, res.status, res.headers.get('location'));
    const text = await res.text();
    return { id, status: res.status, len: text.length };
  } catch (e) {
    console.log(`Error ${id}:`, e.message);
    return { id, error: e.message };
  }
}

async function run() {
  await fetchPost(12433);
}

run();
