const https = require('https');
https.get('https://www.youtube.com/results?search_query=little+krishna+flute', res => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => {
    const matches = [...new Set([...data.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)].map(m => m[1]))].slice(0, 5);
    console.log('FLUTE:', matches);
  });
});
https.get('https://www.youtube.com/results?search_query=lofi+hip+hop+radio+beats+to+relax', res => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => {
    const matches = [...new Set([...data.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)].map(m => m[1]))].slice(0, 5);
    console.log('LOFI:', matches);
  });
});
