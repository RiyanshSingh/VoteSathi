const fs = require('fs');
const content = fs.readFileSync('src/context/LanguageContext.tsx', 'utf8');
const match = content.match(/const translations: Record<Language, Record<string, string>> = (\{[\s\S]*?\});/);
if (match) {
  const obj = eval('(' + match[1] + ')');
  const checkKeys = ['learn.noContent', 'learn.seedDb', 'learn.viewChapters'];
  Object.keys(obj).forEach(lang => {
    checkKeys.forEach(key => {
      if (!obj[lang][key]) {
        console.log(`Missing key ${key} in ${lang}`);
      }
    });
  });
}
