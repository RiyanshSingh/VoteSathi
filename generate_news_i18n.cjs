const fs = require('fs');

const languages = [
  'English', 'Hindi (हिंदी)', 'Hinglish', 'Bengali (বাংলা)', 
  'Telugu (తెలుగు)', 'Marathi (मराठी)', 'Tamil (தமிழ்)', 
  'Gujarati (ગુજરાતી)', 'Kannada (ಕನ್ನಡ)'
];

const dataKeys = {
  'Voter ID and Aadhaar Linking': ['Voter ID and Aadhaar Linking', 'वोटर आईडी और आधार लिंकिंग', 'Voter ID and Aadhaar Linking', 'ভোটার আইডি এবং আধার লিঙ্কিং', 'ఓటరు ID మరియు ఆధార్ లింకింగ్', 'मतदार ओळखपत्र आणि आधार लिंक करणे', 'வாக்காளர் அடையாள அட்டை மற்றும் ஆதார் இணைப்பு', 'મતદાર ID અને આધાર લિંકિંગ', 'ಮತದಾರರ ID ಮತ್ತು ಆಧಾರ್ ಲಿಂಕ್ ಮಾಡುವುದು'],
  'Deadline to link your Aadhaar with Voter ID has been extended.': ['Deadline to link your Aadhaar with Voter ID has been extended.', 'वोटर आईडी के साथ अपना आधार लिंक करने की समय सीमा बढ़ा दी गई है।', 'Voter ID ke saath Aadhaar link karne ki deadline extend ho gayi hai.', 'ভোটার আইডির সাথে আপনার আধার লিঙ্ক করার সময়সীমা বাড়ানো হয়েছে।', 'ఓటరు IDతో మీ ఆధార్‌ను లింక్ చేయడానికి గడువు పొడిగించబడింది.', 'मतदार ओळखपत्राशी तुमचा आधार लिंक करण्याची मुदत वाढवण्यात आली आहे.', 'வாக்காளர் அடையாள அட்டையுடன் உங்கள் ஆதாரை இணைப்பதற்கான காலக்கெடு நீட்டிக்கப்பட்டுள்ளது.', 'મતદાર ID સાથે તમારા આધારને લિંક કરવાની સમયમર્યાદા લંબાવવામાં આવી છે.', 'ಮತದಾರರ ID ಯೊಂದಿಗೆ ನಿಮ್ಮ ಆಧಾರ್ ಅನ್ನು ಲಿಂಕ್ ಮಾಡುವ ಗಡುವು ವಿಸ್ತರಿಸಲ್ಪಟ್ಟಿದೆ.'],
  'New Registration Camps': ['New Registration Camps', 'नए पंजीकरण शिविर', 'New Registration Camps', 'নতুন নিবন্ধন শিবির', 'కొత్త రిజిస్ట్రేషన్ క్యాంపులు', 'नवीन नोंदणी शिबिरे', 'புதிய பதிவு முகாம்கள்', 'નવા નોંધણી કેમ્પ', 'ಹೊಸ ನೋಂದಣಿ ಶಿಬಿರಗಳು'],
  'Special camps for new voters opening this weekend across all districts.': ['Special camps for new voters opening this weekend across all districts.', 'सभी जिलों में इस सप्ताहांत नए मतदाताओं के लिए विशेष शिविर खुल रहे हैं।', 'Sab districts mein is weekend naye voters ke liye special camps khul rahe hain.', 'সমস্ত জেলায় এই সপ্তাহান্তে নতুন ভোটারদের জন্য বিশেষ শিবির খোলা হচ্ছে।', 'అన్ని జిల్లాల్లో ఈ వారాంతంలో కొత్త ఓటర్ల కోసం ప్రత్యేక శిబిరాలు తెరుచుకుంటున్నాయి.', 'सर्व जिल्ह्यांमध्ये या आठवड्यात नवीन मतदारांसाठी विशेष शिबिरे उघडत आहेत.', 'அனைத்து மாவட்டங்களிலும் இந்த வார இறுதியில் புதிய வாக்காளர்களுக்கான சிறப்பு முகாம்கள் திறக்கப்படுகின்றன.', 'તમામ જિલ્લાઓમાં આ સપ્તાહના અંતે નવા મતદારો માટે ખાસ કેમ્પ ખોલવામાં આવી રહ્યા છે.', 'ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳಲ್ಲಿ ಈ ವಾರಾಂತ್ಯದಲ್ಲಿ ಹೊಸ ಮತದಾರರಿಗಾಗಿ ವಿಶೇಷ ಶಿಬಿರಗಳು ತೆರೆಯಲ್ಪಡುತ್ತಿವೆ.'],
  'Revised Polling Timings': ['Revised Polling Timings', 'संशोधित मतदान समय', 'Revised Polling Timings', 'সংশোধित ভোটগ্রহণের সময়', 'సవరించిన పోలింగ్ సమయాలు', 'सुधारित मतदानाची वेळ', 'மாற்றியமைக்கப்பட்ட வாக்குப்பதிவு நேரங்கள்', 'સુધારેલ મતદાન સમય', 'ಪರಿಷ್ಕೃತ ಮತದಾನದ ಸಮಯ'],
  'Polling hours extended by 1 hour to ensure maximum participation.': ['Polling hours extended by 1 hour to ensure maximum participation.', 'अधिकतम भागीदारी सुनिश्चित करने के लिए मतदान का समय 1 घंटा बढ़ा दिया गया है।', 'Maximum participation ensure karne ke liye polling hours 1 hour extend kar diye gaye hain.', 'সর্বাধিক অংশগ্রহণ নিশ্চিত করতে ভোটগ্রহণের সময় ১ ঘণ্টা বাড়ানো হয়েছে।', 'గరిష్ట భాగస్వామ్యాన్ని నిర్ధారించడానికి పోలింగ్ గంటలు 1 గంట పొడిగించబడ్డాయి.', 'जास्तीत जास्त सहभाग सुनिश्चित करण्यासाठी मतदानाची वेळ १ तासाने वाढवण्यात आली आहे.', 'அதிகப்படியான பங்கேற்பை உறுதி செய்ய வாக்குப்பதிவு நேரம் 1 மணிநேரம் நீட்டிக்கப்பட்டுள்ளது.', 'મહત્તમ ભાગીદારી સુનિશ્ચિત કરવા માટે મતદાનના કલાકો 1 કલાક લંબાવવામાં આવ્યા છે.', 'ಗರಿಷ್ಠ ಭಾಗವಹಿಸುವಿಕೆಯನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಲು ಮತದಾನದ ಸಮಯವನ್ನು 1 ಗಂಟೆ ವಿಸ್ತರಿಸಲಾಗಿದೆ.']
};

const existingContent = fs.readFileSync('src/context/LanguageContext.tsx', 'utf8');
const translationsMatch = existingContent.match(/const translations: Record<Language, Record<string, string>> = (\{[\s\S]*?\});/);

if (translationsMatch) {
  const existingTranslationsObj = eval('(' + translationsMatch[1] + ')');
  const languagesFound = Object.keys(existingTranslationsObj);

  Object.entries(dataKeys).forEach(([key, values]) => {
    languagesFound.forEach((lang, index) => {
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
  console.log('LanguageContext.tsx updated with news translations!');
}
