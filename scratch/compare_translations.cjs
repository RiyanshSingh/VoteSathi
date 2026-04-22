const fs = require('fs');

const content = fs.readFileSync('src/context/LanguageContext.tsx', 'utf8');
const translationsMatch = content.match(/const translations: Record<Language, Record<string, string>> = (\{[\s\S]*?\});/);

if (!translationsMatch) {
  console.error('Could not find translations object');
  process.exit(1);
}

// Extract the translations object manually to avoid eval issues if possible, 
// but since it's a large object, let's try a safer way or just parse it.
// For now, let's use a simpler approach: regex to find keys for each language.

function getKeysForLanguage(langName) {
  const langRegex = new RegExp(`"${langName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}": \\{([\\s\\S]*?)\\},`, 'g');
  const match = langRegex.exec(content);
  if (!match) return [];
  
  const keys = [];
  const keyRegex = /"([^"]+)":/g;
  let keyMatch;
  while ((keyMatch = keyRegex.exec(match[1])) !== null) {
    keys.push(keyMatch[1]);
  }
  return keys;
}

const englishKeys = getKeysForLanguage('English');
const hindiKeys = getKeysForLanguage('Hindi (हिंदी)');

console.log(`English Keys: ${englishKeys.length}`);
console.log(`Hindi Keys: ${hindiKeys.length}`);

const missingInHindi = englishKeys.filter(k => !hindiKeys.includes(k));

console.log('\nKeys missing in Hindi:');
console.log(JSON.stringify(missingInHindi, null, 2));

const extraInHindi = hindiKeys.filter(k => !englishKeys.includes(k));
console.log('\nKeys in Hindi but not in English (optional):');
console.log(JSON.stringify(extraInHindi, null, 2));
