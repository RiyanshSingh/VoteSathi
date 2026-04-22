const fs = require('fs');
const existingContent = fs.readFileSync('src/context/LanguageContext.tsx', 'utf8');
const translationsMatch = existingContent.match(/const translations: Record<Language, Record<string, string>> = (\{[\s\S]*?\});/);
if (translationsMatch) {
  try {
    const obj = eval('(' + translationsMatch[1] + ')');
    console.log('Keys:', Object.keys(obj));
  } catch (e) {
    console.error('Eval error:', e.message);
  }
} else {
  console.log('No match');
}
