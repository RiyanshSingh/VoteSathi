const fs = require('fs');
const content = fs.readFileSync('src/context/LanguageContext.tsx', 'utf8');
const match = content.match(/const translations: Record<Language, Record<string, string>> = (\{[\s\S]*?\});/);
if (match) {
  const obj = eval('(' + match[1] + ')');
  Object.keys(obj).forEach(lang => {
    console.log(`${lang}: ${Array.from(lang).map(c => c.charCodeAt(0).toString(16)).join(' ')}`);
  });
}
