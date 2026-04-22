const fs = require('fs');
const existingContent = fs.readFileSync('src/context/LanguageContext.tsx', 'utf8');
const translationsMatch = existingContent.match(/const translations: Record<Language, Record<string, string>> = (\{[\s\S]*?\});/);
if (translationsMatch) {
  const obj = eval('(' + translationsMatch[1] + ')');
  const languages = Object.keys(obj).filter(l => l !== 'English');
  languages.forEach(lang => {
    const missing = Object.entries(obj[lang]).filter(([key, val]) => key === val && key.length > 5);
    if (missing.length > 0) {
      console.log(`${lang} has ${missing.length} potentially untranslated keys:`);
      missing.slice(0, 5).forEach(([key, val]) => console.log(`  - ${key}`));
    }
  });
}
