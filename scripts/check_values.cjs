const fs = require('fs');
const content = fs.readFileSync('src/context/LanguageContext.tsx', 'utf8');
const match = content.match(/const translations: Record<Language, Record<string, string>> = (\{[\s\S]*?\});/);
if (match) {
  const obj = eval('(' + match[1] + ')');
  for (const lang in obj) {
    for (const key in obj[lang]) {
      if (!obj[lang][key] || obj[lang][key] === 'undefined' || obj[lang][key] === 'null') {
        console.log(`Missing value for ${lang} - ${key}`);
      }
    }
  }
}
