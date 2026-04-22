const fs = require('fs');
const content = fs.readFileSync('src/context/LanguageContext.tsx', 'utf8');
const match = content.match(/const translations: Record<Language, Record<string, string>> = (\{[\s\S]*?\});/);
if (match) {
  const obj = eval('(' + match[1] + ')');
  console.log("Bengali translation for 'Nomination Phase':", obj['Bengali (বাংলা)']['Nomination Phase']);
  console.log("Tamil translation for 'Nomination Phase':", obj['Tamil (தமிழ்)']['Nomination Phase']);
  console.log("Kannada translation for 'Nomination Phase':", obj['Kannada (ಕನ್ನಡ)']['Nomination Phase']);
}
