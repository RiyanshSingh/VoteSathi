const fs = require('fs');
const content = fs.readFileSync('src/context/LanguageContext.tsx', 'utf8');
const match = content.match(/const translations: Record<Language, Record<string, string>> = (\{[\s\S]*?\});/);
if (match) {
  const obj = eval('(' + match[1] + ')');
  const checkKeys = [
    'Candidates file nomination papers. The Returning Officer (RO) scrutinizes them to ensure eligibility.',
    'Fill Form 6 on the NVSP portal or Voter Helpline App with your details and photo.',
    'Check your name in the voter list online to find your specific Polling Station and Part Number.'
  ];
  
  checkKeys.forEach(key => {
    console.log("English:", key);
    console.log("Bengali:", obj['Bengali (বাংলা)'][key]);
    console.log("Tamil:", obj['Tamil (தமிழ்)'][key]);
    console.log("Kannada:", obj['Kannada (ಕನ್ನಡ)'][key]);
    console.log("---");
  });
}
