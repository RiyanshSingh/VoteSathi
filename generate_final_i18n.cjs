const fs = require('fs');

const dataKeys = {
  // General UI
  'home.title': ['Vote Sathi', 'वोट साथी', 'Vote Sathi', 'ভোট সাথী', 'ఓటర్ సాథి', 'मतदान साथी', 'வாக்கு சாதி', 'મતદાન સાથી', 'ಮತದಾನ ಸಾಥಿ'],
  'home.subtitle': ['Learn step by step', 'चरण दर चरण सीखें', 'Step by step sikhein', 'ধাপে ধাপে শিখুন', 'దశలవారీగా నేర్చుకోండి', 'टप्प्याटप्प्याने शिका', 'படிப்படியாகக் கற்றுக்கொள்ளுங்கள்', 'પગલું દ્વારા પગલું શીખો', 'ಹಂತ ಹಂತವಾಗಿ ಕಲಿಯಿರಿ'],
  'home.topics': ['Main Topics', 'मुख्य विषय', 'Main Topics', 'প্রধান বিষয়', 'ముఖ్య విషయాలు', 'मुख्य विषय', 'முக்கிய தலைப்புகள்', 'મુખ્ય વિષયો', 'ಮುಖ್ಯ ವಿಷಯಗಳು'],
  'home.continue': ['Continue Learning', 'सीखना जारी रखें', 'Seekhna continue karein', 'শেখা চালিয়ে যান', 'నేర్చుకోవడం కొనసాగించండి', 'शिकणे सुरू ठेवा', 'கற்றலைத் தொடரவும்', 'શીખવાનું ચાલુ રાખો', 'ಕಲಿಕೆಯನ್ನು ಮುಂದುವರಿಸಿ'],
  'home.news': ['Latest News', 'ताज़ा समाचार', 'Latest News', 'সর্বশেষ সংবাদ', 'తాజా వార్తలు', 'ताज्या बातम्या', 'சமீபத்திய செய்திகள்', 'નવીનતમ સમાચાર', 'ಇತ್ತೀಚಿನ ಸುದ್ದಿ'],
  'home.tools': ['Helpful Tools', 'सहायक उपकरण', 'Helpful Tools', 'সহায়ক সরঞ্জাম', 'సహాయకరమైన సాధనాలు', 'उपयुक्त साधने', 'பயனுள்ள கருவிகள்', 'મદદરૂપ સાધનો', 'ಸಹಾಯಕ ಸಾಧನಗಳು'],
  
  // Learn Page UI
  'learn.chapterList': ['Chapter List', 'अध्याय सूची', 'Chapter List', 'অধ্যায় তালিকা', 'అధ్యాయాల జాబಿತా', 'धडा सूची', 'அத்தியாயப் பட்டியல்', 'પ્રકરણ યાદી', 'ಅಧ್ಯಾಯದ ಪಟ್ಟಿ'],
  'learn.selectStep': ['Select a step', 'एक चरण चुनें', 'Ek step select karein', 'একটি ধাপ নির্বাচন করুন', 'ఒక దశను ఎంచుకోండి', 'एक पायरी निवडा', 'ஒரு படி நிலையைத் தேர்ந்தெடுக்கவும்', 'એક પગલું પસંદ કરો', 'ಒಂದು ಹಂತವನ್ನು ಆಯ್ಕೆಮಾಡಿ'],
  'learn.step': ['Step', 'चरण', 'Step', 'ধাপ', 'దశ', 'पायरी', 'படி', 'પગલું', 'ಹಂತ'],
  'learn.next': ['Next', 'अगला', 'Aage', 'পরবর্তী', 'తదుపరి', 'पुढील', 'அடுத்தது', 'પછીનું', 'ಮುಂದಿನ'],
  'learn.prev': ['Previous', 'पिछला', 'Piche', 'পূর্ববর্তী', 'మునుపಟಿ', 'मागील', 'முந்தைய', 'પહેલાનું', 'ಹಿಂದಿನ'],
  'learn.finish': ['Finish', 'समाप्त', 'Finish', 'শেষ করুন', 'ముగించు', 'समाप्त', 'முடிக்கவும்', 'સમાપ્ત', 'ಮುಕ್ತಾಯ'],
  'learn.startPath': ['Start Learning Path', 'सीखने का मार्ग शुरू करें', 'Learning path shuru karein', 'শেখার পথ শুরু করুন', 'నేర్చుకునే మార్గాన్ని ప్రారంభించండి', 'शिकण्याचा मार्ग सुरू करा', 'கற்றல் பாதையைத் தொடங்கு', 'શીખવાનો માર્ગ શરૂ કરો', 'ಕಲಿಕೆಯ ಮಾರ್ಗವನ್ನು ಪ್ರಾರಂಭಿಸಿ'],
  
  // Topics & Descriptions
  'Election Process': ['Election Process', 'चुनाव प्रक्रिया', 'Election Process', 'নির্বাচন প্রক্রিয়া', 'ఎన్నిಕల ప్రక్రియ', 'निवडणूक प्रक्रिया', 'தேர்தல் செயல்முறை', 'ચૂંટણી પ્રક્રિયા', 'ಚುನಾವಣಾ ಪ್ರಕ್ರಿಯೆ'],
  'Voter Registration': ['Voter Registration', 'मतदाता पंजीकरण', 'Voter Registration', 'ভোটার নিবন্ধন', 'ఓటరు నమోదు', 'मतदार नोंदणी', 'வாக்காளர் பதிவு', 'મતદાર નોંધણી', 'ಮತದಾರರ ನೋಂದಣಿ'],
  'Voting Day': ['Voting Day', 'मतदान का दिन', 'Voting Day', 'ভোটের দিন', 'పోలింగ్ రోజు', 'मतदानाचा दिवस', 'வாக்குப்பதிவு நாள்', 'મતદાનનો દિવસ', 'ಮತದಾನದ ದಿನ'],
  'Results & Counting': ['Results & Counting', 'परिणाम और मतगणना', 'Results & Counting', 'ফলাফল ও গণনা', 'ఫలితాలు మరియు లెక్ಕಿంపు', 'निकाल आणि मोजणी', 'முடிவுகள் மற்றும் எண்ணிக்கை', 'પરિણામો અને ગણતરી', 'ಫಲಿತಾಂಶಗಳು ಮತ್ತು ಎಣಿಕೆ'],
  
  'Learn the end-to-end flow of Indian elections.': ['Learn the end-to-end flow of Indian elections.', 'भारतीय चुनावों के शुरू से अंत तक के प्रवाह को जानें।', 'Indian elections ka end-to-end flow sikhein.', 'ভারতীয় নির্বাচনের শুরু থেকে শেষ পর্যন্ত প্রবাহ জানুন।', 'భారతీయ ఎన్నికల ప్రారంభం నుండి ముగింపు వరకు తెలుసుకోండి.', 'भारतीय निवडणुकांचा सुरुवातीपासून शेवटपर्यंतचा प्रवाह जाणून घ्या.', 'இந்திய தேர்தல்களின் ஆரம்பம் முதல் முடிவு வரையிலான ஓட்டத்தை அறிந்து கொள்ளுங்கள்.', 'ભારતીય ચૂંટણીઓનો શરૂઆતથી અંત સુધીનો પ્રવાહ જાણો.', 'ಭಾರತೀಯ ಚುನಾವಣೆಗಳ ಆರಂಭದಿಂದ ಅಂತ್ಯದವರೆಗಿನ ಹರಿವನ್ನು ತಿಳಿಯಿರಿ.'],
  'Step-by-step guide to get your Voter ID.': ['Step-by-step guide to get your Voter ID.', 'अपना वोटर आईडी प्राप्त करने के लिए चरण-दर-चरण मार्गदर्शिका।', 'Voter ID paane ke liye step-by-step guide.', 'আপনার ভোটার আইডি পাওয়ার জন্য ধাপে ধাপে নির্দেশিকা।', 'మీ ఓటరు ఐడిని పొందడానికి దశల వారీ గైడ్.', 'तुमचे मतदार ओळखपत्र मिळवण्यासाठी टप्प्याटप्प्याने मार्गदर्शक.', 'உங்கள் வாக்காளர் அடையாள அட்டையைப் பெறுவதற்கான படிப்படியான வழிகாட்டி.', 'તમારું મતદાર ઓળખપત્ર મેળવવા માટે સ્ટેપ-બાય-સ્ટેપ ગાઇડ.', 'ನಿಮ್ಮ ಮತದಾರರ ಗುರುತಿನ ಚೀಟಿ ಪಡೆಯಲು ಹಂತ ಹಂತದ ಮಾರ್ಗದರ್ಶಿ.'],
  'Know what happens at the polling booth.': ['Know what happens at the polling booth.', 'जानें कि मतदान केंद्र पर क्या होता है।', 'Jaaniye polling booth par kya hota hai.', 'ভোটকেন্দ্রে কী ঘটে তা জানুন।', 'పోలింగ్ బూత్ వద్ద ఏమి జరుగుతుందో తెలుసుకోండి.', 'मतदान केंद्रावर काय होते ते जाणून घ्या.', 'வாக்குச் சாவடியில் என்ன நடக்கிறது என்பதைத் தெரிந்து கொள்ளுங்கள்.', 'પોલિંગ બૂથ પર શું થાય છે તે જાણો.', 'ಪೋಲಿಂಗ್ ಬೂತ್‌ನಲ್ಲಿ ಏನಾಗುತ್ತದೆ ಎಂದು ತಿಳಿಯಿರಿ.'],
  'Understand how votes are counted.': ['Understand how votes are counted.', 'समझें कि वोटों की गिनती कैसे की जाती है।', 'Samjhein ki votes kaise count hote hain.', 'ভোট কীভাবে গণনা করা হয় তা বুঝুন।', 'ఓట్లు ఎలా లెಕ್ಕించబడతాయೋ అర్థం చేసుకోండి.', 'मतांची मोजणी कशी केली जाते ते समजून घ्या.', 'வாக்குகள் எப்படி எண்ணப்படுகின்றன என்பதைப் புரிந்து கொள்ளுங்கள்.', 'મતોની ગણતરી કેવી રીતે થાય છે તે સમજો.', 'ಮತಗಳನ್ನು ಹೇಗೆ ಎಣಿಸಲಾಗುತ್ತದೆ ಎಂಬುದನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.'],
  
  // Step Titles (Common ones)
  'Election Announcement': ['Election Announcement', 'चुनाव की घोषणा', 'Election Announcement', 'নির্বাচন ঘোষণা', 'ఎన్నిಕల ప్రకటన', 'निवडणूक घोषणा', 'தேர்தல் அறிவிப்பு', 'ચૂંટણી જાહેરાತ', 'ಚುನಾವಣಾ ಪ್ರಕಟಣೆ'],
  'Check Eligibility': ['Check Eligibility', 'पात्रता जांचें', 'Eligibility Check', 'যোগ্যতা পরীক্ষা করুন', 'అర్హతను తనిಖೀ చేయಿ', 'पात्रता तपासा', 'தகுதியைச் சரிபார்க்கவும்', 'પાત્રતા તપાસો', 'ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ']
};

const existingContent = fs.readFileSync('src/context/LanguageContext.tsx', 'utf8');
const translationsMatch = existingContent.match(/const translations: Record<Language, Record<string, string>> = (\{[\s\S]*?\});/);

if (translationsMatch) {
  const existingTranslationsObj = eval('(' + translationsMatch[1] + ')');
  const languages = Object.keys(existingTranslationsObj);

  Object.entries(dataKeys).forEach(([key, values]) => {
    languages.forEach((lang, index) => {
      if (existingTranslationsObj[lang]) {
        existingTranslationsObj[lang][key] = values[index];
      }
    });
  });

  const newContent = existingContent.replace(
    translationsMatch[0], 
    `const translations: Record<Language, Record<string, string>> = ${JSON.stringify(existingTranslationsObj, null, 2)};`
  );

  fs.writeFileSync('src/context/LanguageContext.tsx', newContent);
  console.log('LanguageContext.tsx updated with FINAL translations!');
}
