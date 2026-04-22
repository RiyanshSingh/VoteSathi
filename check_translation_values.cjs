const fs = require('fs');
const content = fs.readFileSync('src/context/LanguageContext.tsx', 'utf8');
const match = content.match(/const translations: Record<Language, Record<string, string>> = (\{[\s\S]*?\});/);
if (match) {
  const obj = eval('(' + match[1] + ')');
  const checkKeys = ['learn.chapterList', 'learn.selectStep', 'learn.step', 'learn.next', 'learn.prev', 'learn.finish', 'learn.startPath'];
  
  Object.keys(obj).forEach(lang => {
    if (lang === 'English') return;
    
    let isEnglish = true;
    checkKeys.forEach(key => {
      if (obj[lang][key] !== obj['English'][key]) {
        isEnglish = false;
      }
    });
    
    if (isEnglish) {
      console.log(`Warning: ${lang} seems to have English translations for Learn page keys.`);
    }
  });
}
