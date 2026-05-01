const fs = require('fs');
const mockDataContent = fs.readFileSync('src/data/mockData.ts', 'utf8');
const langContextContent = fs.readFileSync('src/context/LanguageContext.tsx', 'utf8');

const translationsMatch = langContextContent.match(/const translations: Record<Language, Record<string, string>> = (\{[\s\S]*?\});/);
const translations = eval('(' + translationsMatch[1] + ')');

const stringsToFind = new Set();
const titleMatches = mockDataContent.matchAll(/title:\s*[`'"](.*?)[`'"]/g);
for (const m of titleMatches) stringsToFind.add(m[1]);
const descMatches = mockDataContent.matchAll(/description:\s*[`'"](.*?)[`'"]/g);
for (const m of descMatches) stringsToFind.add(m[1]);

const languages = Object.keys(translations);
languages.forEach(lang => {
  const missing = Array.from(stringsToFind).filter(s => !translations[lang][s]);
  if (missing.length > 0) {
    console.log(`${lang} is missing ${missing.length} strings:`);
    console.log(missing);
  } else {
    console.log(`${lang} is fully synced`);
  }
});
