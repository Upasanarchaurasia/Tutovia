const fs = require('fs');
const path = require('path');

function searchFiles(dir, pattern) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === 'dist' || file.endsWith('.zip') || file.endsWith('.ipa') || file.endsWith('.tar')) continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      searchFiles(fullPath, pattern);
    } else if (stat.isFile()) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (pattern.test(content)) {
          console.log('Match in ' + fullPath);
          const lines = content.split('\n');
          lines.forEach((l, idx) => {
            if (pattern.test(l)) {
              console.log('  L' + (idx+1) + ': ' + l.trim());
            }
          });
        }
      } catch (e) {}
    }
  }
}

searchFiles('c:\\UC - Work Dump Impt\\Tutovia', /ssh|oracle|[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}|tutovia\.com/gi);
