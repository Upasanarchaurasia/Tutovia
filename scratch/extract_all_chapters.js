const cheerio = require('/home/ubuntu/tutovia/node_modules/cheerio');
const execSync = require('child_process').execSync;
const fs = require('fs');

const targets = [
  {
    course: 'CA Intermediate',
    group: 'Group 1',
    subject: 'Advanced Accounting',
    url: 'https://www.icai.org/post/bos-int-p1-may2026-exam'
  },
  {
    course: 'CA Intermediate',
    group: 'Group 1',
    subject: 'Corporate and Other Laws',
    url: 'https://www.icai.org/post/sm-inter-p2-may2026'
  },
  {
    course: 'CA Intermediate',
    group: 'Group 1',
    subject: 'Taxation - Income Tax',
    url: 'https://www.icai.org/post/bos-int-course-p3-taxation'
  },
  {
    course: 'CA Intermediate',
    group: 'Group 1',
    subject: 'Taxation - GST',
    url: 'https://www.icai.org/post/sm-intermediate-paper3-secb-may26'
  },
  {
    course: 'CA Intermediate',
    group: 'Group 2',
    subject: 'Cost and Management Accounting',
    url: 'https://www.icai.org/post/sm-inter-p4-may2026'
  },
  {
    course: 'CA Intermediate',
    group: 'Group 2',
    subject: 'Auditing and Ethics',
    url: 'https://www.icai.org/post/sm-inter-p5-may2026'
  },
  {
    course: 'CA Intermediate',
    group: 'Group 2',
    subject: 'Financial Management',
    url: 'https://www.icai.org/post/sm-inter-p6a-may2026'
  },
  {
    course: 'CA Intermediate',
    group: 'Group 2',
    subject: 'Strategic Management',
    url: 'https://www.icai.org/post/sm-inter-p6b-may2026'
  }
];

function extractFromTarget(target) {
  console.log(`\n======================================================`);
  console.log(`[${target.group}] ${target.subject}: ${target.url}`);
  const html = execSync(`curl -s -L --max-time 15 "${target.url}"`, { encoding: 'utf-8' });
  const $ = cheerio.load(html);

  const chapters = [];
  $('a').each((i, el) => {
    const href = $(el).attr('href');
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    if (href && href.includes('resource.cdn.icai.org') && href.toLowerCase().includes('.pdf')) {
      if (!text.toLowerCase().includes('initial') && !text.toLowerCase().includes('feedback')) {
        // Extract standard code if any (e.g. AS 7, AS 1, SA 200, etc.)
        const asMatch = text.match(/\b(AS\s*\d{1,2}|Ind\s*AS\s*\d{2,3}|SA\s*\d{3})\b/i);
        const standardCode = asMatch ? asMatch[1].toUpperCase().replace(/\s+/g, ' ') : null;

        chapters.push({
          course: target.course,
          group: target.group,
          subject: target.subject,
          chapter_title: text,
          pdf_url: href,
          portal_source_url: target.url,
          is_standard: !!standardCode,
          standard_code: standardCode
        });
        console.log(`  * ${text} -> ${href} (Standard: ${standardCode || 'None'})`);
      }
    }
  });

  console.log(`Found ${chapters.length} chapters/units for ${target.subject}`);
  return chapters;
}

const allData = [];
for (const t of targets) {
  const res = extractFromTarget(t);
  allData.push(...res);
}

console.log(`\n======================================================`);
console.log(`GRAND TOTAL CHAPTERS EXTRACTED: ${allData.length}`);
console.log(`======================================================`);

fs.writeFileSync('/home/ubuntu/verified_all_chapters.json', JSON.stringify(allData, null, 2));
