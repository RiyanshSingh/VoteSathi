const fs = require('fs');
const content = fs.readFileSync('src/context/LanguageContext.tsx', 'utf8');
const match = content.match(/const translations: Record<Language, Record<string, string>> = (\{[\s\S]*?\});/);
if (match) {
  const obj = eval('(' + match[1] + ')');
  const key = 'Candidates file nomination papers. The Returning Officer (RO) scrutinizes them to ensure eligibility.';
  console.log('English Value:', obj['English'][key]);
  console.log('Hindi Value:', obj['Hindi (हिंदी)'][key]);
  console.log('Bengali Value:', obj['Bengali (বাংলা)'][key]);
}
