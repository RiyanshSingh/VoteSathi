const fs = require('fs');

const languages = [
  'English', 'Hindi (हिंदी)', 'Hinglish', 'Bengali (বাংলা)', 
  'Telugu (తెలుగు)', 'Marathi (मराठी)', 'Tamil (தமிழ்)', 
  'Gujarati (ગુજરાતી)', 'Kannada (ಕನ್ನಡ)'
];

const dataKeys = {
  'settings.title': ['Settings', 'सेटिंग्स', 'Settings', 'সেটিংস', 'సెట్టింగ్లు', 'सेटिंग्ज', 'அமைப்புகள்', 'સેટિંગ્સ', 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು'],
  'settings.subtitle': ['Customize your experience', 'अपना अनुभव कस्टमाइज़ करें', 'Apna experience customize karein', 'আপনার অভিজ্ঞতা কাস্টমাইজ করুন', 'మీ అనుభవాన్ని అనుకూలీకరించండి', 'तुमचा अनुभव सानुकूलित करा', 'உங்கள் அனுபவத்தைத் தனிப்பயனாக்குங்கள்', 'તમારો અનુભવ કસ્ટમાઇઝ કરો', 'ನಿಮ್ಮ ಅನುಭವವನ್ನು ಕಸ್ಟಮೈಸ್ ಮಾಡಿ'],
  'settings.notifications': ['Notifications', 'सूचनाएं', 'Notifications', 'বিজ্ঞপ্তি', 'నోటిఫికేషన్‌లు', 'अधिसूचना', 'அறிவிப்புகள்', 'સૂચનાઓ', 'ಅಧಿಸೂಚನೆಗಳು'],
  'settings.push': ['Push Notifications', 'पुश सूचनाएं', 'Push Notifications', 'পুশ বিজ্ঞপ্তি', 'పుష్ నోటిఫికేషన్లు', 'पुश नोटिफिकेशन्स', 'புஷ் அறிவிப்புகள்', 'પુશ સૂચનાઓ', 'ಪುಶ್ ಅಧಿಸೂಚನೆಗಳು'],
  'settings.pushDesc': ['Get instant alerts on your phone', 'अपने फोन पर तुरंत अलर्ट प्राप्त करें', 'Apne phone par instant alerts paayein', 'আপনার ফোনে তাত্ক্ষণিক সতর্কতা পান', 'మీ ఫోన్‌లో తక్షణ హెచ్చరికలను పొందండి', 'तुमच्या फोनवर त्वरित सूचना मिळवा', 'உங்கள் தொலைபேசியில் உடனடி விழிப்பூட்டல்களைப் பெறுங்கள்', 'તમારા ફોન પર તાત્કાલિક ચેતવણીઓ મેળવો', 'ನಿಮ್ಮ ಫೋನ್‌ನಲ್ಲಿ ತ್ವರಿತ ಎಚ್ಚರಿಕೆಗಳನ್ನು ಪಡೆಯಿರಿ'],
  'settings.news': ['Election News', 'चुनाव समाचार', 'Election News', 'নির্বাচনের খবর', 'ఎన్నికల వార్తలు', 'निवडणूक बातम्या', 'தேர்தல் செய்திகள்', 'ચૂંટણી સમાચાર', 'ಚುನಾವಣಾ ಸುದ್ದಿ'],
  'settings.newsDesc': ['Important updates from ECI', 'ECI से महत्वपूर्ण अपडेट', 'ECI se important updates', 'ECI থেকে গুরুত্বপূর্ণ আপডেট', 'ECI నుండి ముఖ్యమైన నవీకరణలు', 'ECI कडून महत्त्वाचे अपडेट्स', 'ECI இலிருந்து முக்கியமான அறிவிப்புகள்', 'ECI તરફથી મહત્વપૂર્ણ અપડેટ્સ', 'ECI ನಿಂದ ಪ್ರಮುಖ ನವೀಕರಣಗಳು'],
  'settings.reminders': ['Voting Reminders', 'मतदान अनुस्मारक', 'Voting Reminders', 'ভোটের অনুস্মারক', 'ఓటింగ్ రిమైండర్‌లు', 'मतदान स्मरणपत्रे', 'வாக்களிப்பு நினைவூட்டல்கள்', 'મતદાન રીમાઇન્ડર્સ', 'ಮತದಾನದ ಜ್ಞಾಪನೆಗಳು'],
  'settings.remindersDesc': ['Never miss your voting date', 'अपनी मतदान तिथि कभी न भूलें', 'Apni voting date kabhi na bhulein', 'আপনার ভোটের তারিখ কখনো ভুলবেন না', 'మీ ఓటింగ్ తేదీని ఎప్పటికీ కోల్పోకండి', 'तुमची मतदानाची तारीख कधीही विसरू नका', 'உங்கள் வாக்களிக்கும் தேதியை ஒருபோதும் தவறவிடாதீர்கள்', 'તમારી મતદાન તારીખ ક્યારેય ચૂકશો નહીં', 'ನಿಮ್ಮ ಮತದಾನದ ದಿನಾಂಕವನ್ನು ಎಂದಿಗೂ ಮರೆಯಬೇಡಿ'],
  'settings.privacy': ['Privacy & Interface', 'गोपनीयता और इंटरफ़ेस', 'Privacy & Interface', 'গোপনীয়তা এবং ইন্টারফেস', 'గోప్యత మరియు ఇంటర్‌ఫేస్', 'गोपनीयता आणि इंटरफेस', 'தனியுரிமை மற்றும் இடைமுகம்', 'ગોપનીયતા અને ઇન્ટરફેસ', 'ಗೌಪ್ಯತೆ ಮತ್ತು ಇಂಟರ್ಫೇಸ್'],
  'settings.haptic': ['Haptic Feedback', 'हैप्टिक फीडबैक', 'Haptic Feedback', 'হ্যাপটিক প্রতিক্রিয়া', 'హ్యాప్టిక్ ఫీడ్‌బ్యాక్', 'हॅप्टिक फीडबॅक', 'ஹாப்டிக் கருத்து', 'હેપ્ટિક પ્રતિસાદ', 'ಹ್ಯಾಪ್ಟಿಕ್ ಪ್ರತಿಕ್ರಿಯೆ'],
  'settings.hapticDesc': ['Vibrate on interactions', 'इंटरैक्शन पर कंपन', 'Interactions par vibrate karein', 'মিথস্ক্রিয়ায় কম্পন', 'పరస్పర చర్యలపై వైబ్రేట్ చేయండి', 'परस्परसंवादावर कंपन करा', 'தொடர்புகளில் அதிர்கிறது', 'આંતરક્રિયાઓ પર કંપન', 'ಸಂವಹನಗಳ ಮೇಲೆ ಕಂಪಿಸಿ'],
  'settings.contrast': ['High Contrast', 'उच्च कंट्रास्ट', 'High Contrast', 'উচ্চ বৈসাদৃশ্য', 'అధిక కాంట్రాస్ట్', 'उच्च कॉन्ट्रास्ट', 'அதிக மாறுபாடு', 'ઉચ્ચ કોન્ટ્રાસ્ટ', 'ಹೆಚ್ಚಿನ ಕಾಂಟ್ರಾಸ್ಟ್'],
  'settings.contrastDesc': ['Make UI easier to read', 'UI को पढ़ने में आसान बनाएं', 'UI padhne mein aasan banayein', 'ইউআই পড়তে সহজ করুন', 'UIని చదవడం సులభం చేయండి', 'UI वाचायला सोपे करा', 'UI ஐ படிக்க எளிதாக்குங்கள்', 'UI વાંચવા માટે સરળ બનાવો', 'UI ಓದಲು ಸುಲಭಗೊಳಿಸಿ'],
  'settings.dark': ['Dark Mode', 'डार्क मोड', 'Dark Mode', 'ডার্ক মোড', 'డార్క్ మోడ్', 'डार्क मोड', 'இருண்ட பயன்முறை', 'ડાર્ક મોડ', 'ಡಾರ್ಕ್ ಮೋಡ್'],
  'settings.darkDesc': ['Coming soon to Vote Sathi', 'जल्द ही वोट साथी में आ रहा है', 'Jald hi Vote Sathi mein aa raha hai', 'শীঘ্রই ভোট সাথীতে আসছে', 'త్వరలో ఓటు సాథికి వస్తుంది', 'लवकरच मतदान साथीमध्ये येत आहे', 'விரைவில் வாக்கு சாதிக்கு வருகிறது', 'ટૂંક સમયમાં મતદાન સાથી પર આવી રહ્યું છે', 'ಶೀಘ್ರದಲ್ಲೇ ಮತದಾನ ಸಾಥಿಗೆ ಬರಲಿದೆ'],
  'settings.save': ['Save All Changes', 'सभी बदलाव सहेजें', 'Sab changes save karein', 'সমস্ত পরিবর্তন সংরক্ষণ করুন', 'అన్ని మార్పులను సేవ్ చేయండి', 'सर्व बदल जतन करा', 'அனைத்து மாற்றங்களையும் சேமிக்கவும்', 'બધા ફેરફારો સાચવો', 'ಎಲ್ಲಾ ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ']
};

const existingContent = fs.readFileSync('src/context/LanguageContext.tsx', 'utf8');
const translationsMatch = existingContent.match(/const translations: Record<Language, Record<string, string>> = (\{[\s\S]*?\});/);

if (translationsMatch) {
  const existingTranslationsObj = eval('(' + translationsMatch[1] + ')');

  Object.entries(dataKeys).forEach(([key, values]) => {
    languages.forEach((lang, index) => {
      existingTranslationsObj[lang][key] = values[index];
    });
  });

  const newContent = existingContent.replace(
    translationsMatch[0], 
    `const translations: Record<Language, Record<string, string>> = ${JSON.stringify(existingTranslationsObj, null, 2)};`
  );

  fs.writeFileSync('src/context/LanguageContext.tsx', newContent);
  console.log('LanguageContext.tsx updated with settings translations!');
}
