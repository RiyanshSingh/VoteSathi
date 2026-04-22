const fs = require('fs');
const existingContent = fs.readFileSync('src/context/LanguageContext.tsx', 'utf8');
const translationsMatch = existingContent.match(/const translations: Record<Language, Record<string, string>> = (\{[\s\S]*?\});/);
if (translationsMatch) {
  const obj = eval('(' + translationsMatch[1] + ')');
  Object.keys(obj).forEach(lang => {
    console.log(`${lang}: ${Object.keys(obj[lang]).length} keys`);
  });
}
