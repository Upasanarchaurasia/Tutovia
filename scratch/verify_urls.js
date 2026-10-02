const fs = require('fs');
const execSync = require('child_process').execSync;

const materials = JSON.parse(fs.readFileSync('/home/ubuntu/complete_icai_materials.json', 'utf8'));
console.log(`Verifying ${materials.length} PDF URLs...`);

let ok = 0;
let fail = 0;

// Test first 20 CA Intermediate items
const testSet = materials.filter(m => m.course === 'CA Intermediate').slice(0, 25);

for (const item of testSet) {
  try {
    const res = execSync(`curl -s -I --max-time 6 "${item.pdf_url}" | head -n 1`, { encoding: 'utf-8' }).trim();
    if (res.includes('200')) {
      ok++;
      console.log(`[PASS 200] ${item.chapter_title.slice(0, 45)}...`);
    } else {
      fail++;
      console.log(`[FAIL ${res}] ${item.chapter_title} -> ${item.pdf_url}`);
    }
  } catch (e) {
    fail++;
    console.log(`[ERR] ${item.chapter_title}`);
  }
}

console.log(`Verification: ${ok} Passed, ${fail} Failed out of ${testSet.length}`);
