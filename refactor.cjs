const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.jsx')) results.push(file);
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // A naive but effective regex: look for className="...text-white..."
  // If the same className has bg-indigo, bg-emerald, bg-purple, bg-rose, bg-amber, bg-[#
  // change text-white to text-[#fff]
  
  const classRegex = /className=["']([^"']*)["']/g;
  let newContent = content.replace(classRegex, (match, classes) => {
    if (classes.includes('text-white')) {
      const hasColoredBg = /bg-(indigo|emerald|purple|rose|amber|blue|red|green|\[#)/.test(classes);
      const hasGradient = /from-(indigo|emerald|purple|rose|amber|blue|red|green)/.test(classes);
      
      if (hasColoredBg || hasGradient) {
        // Change text-white to text-static-white (we'll add this to tailwind)
        return `className="${classes.replace(/\btext-white\b/g, 'text-static-white')}"`;
      }
    }
    return match;
  });
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log(`Updated ${file}`);
  }
});
