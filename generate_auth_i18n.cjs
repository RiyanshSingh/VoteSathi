const fs = require('fs');

const dataKeys = {
  'welcome.tagline': ['Your trusted companion for the Indian election process.', 'भारतीय चुनाव प्रक्रिया के लिए आपका विश्वसनीय साथी।', 'Indian election process ke liye aapka trusted companion.', 'भारतीय নির্বাচনী প্রক্রিয়ার জন্য আপনার বিশ্বস্ত সঙ্গী।', 'భారతీయ ఎన్నికల ప్రక్రియ కోసం మీ విశ్వసనీయ సహచరుడు.', 'भारतीय निवडणूक प्रक्रियेसाठी तुमचा विश्वासू सोबती.', 'இந்திய தேர்தல் செயல்முறைக்கு உங்கள் நம்பகமான துணை.', 'ભારતીય ચૂંટણી પ્રક્રિયા માટે તમારા વિશ્વસનીય સાથી.', 'ಭಾರತೀಯ ಚುನಾವಣಾ ಪ್ರಕ್ರಿಯೆಗಾಗಿ ನಿಮ್ಮ ವಿಶ್ವಾಸಾರ್ಹ ಒಡನಾಡಿ.'],
  'welcome.live': ['Live Updates Enabled', 'लाइव अपडेट सक्षम', 'Live Updates Enabled', 'লাইভ আপডেট সক্রিয়', 'లైవ్ అప్‌డేట్‌లు ప్రారంభించబడ్డాయి', 'थेट अद्यतने सक्षम', 'நேரடி அறிவிப்புகள் செயல்படுத்தப்பட்டுள்ளன', 'લાઇવ અપડેટ્સ સક્ષમ', 'ಲೈವ್ ಅಪ್‌ಡೇಟ್‌ಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ'],
  'welcome.getStarted': ['Get Started', 'शुरू करें', 'Shuru karein', 'শুরু করুন', 'ప్రారంభించండి', 'सुरू करा', 'தொடங்குங்கள்', 'શરૂ કરો', 'ಪ್ರಾರಂಭಿಸಿ'],
  'login.welcomeBack': ['Welcome Back', 'वापसी पर स्वागत है', 'Welcome Back', 'স্বাগতম', 'మళ్ళీ స్వాగతం', 'पुन्हा स्वागत आहे', 'மீண்டும் வருக', 'સ્વાગત છે', 'ಮತ್ತೆ ಸ್ವಾಗತ'],
  'login.createAccount': ['Create Account', 'खाता बनाएं', 'Account banayein', 'অ্যাকাউন্ট তৈরি করুন', 'ఖాతాను సృష్టించండి', 'खाते तयार करा', 'கணக்கை உருவாக்கு', 'ખાતું બનાવો', 'ಖಾತೆಯನ್ನು ರಚಿಸಿ'],
  'login.loginSubtitle': ['Log in to continue your journey.', 'अपनी यात्रा जारी रखने के लिए लॉग इन करें।', 'Apni journey continue karne ke liye log in karein.', 'আপনার যাত্রা চালিয়ে যেতে লগ ইন করুন।', 'మీ ప్రయాణాన్ని కొనసాగించడానికి లాగిన్ చేయండి.', 'तुमचा प्रवास सुरू ठेवण्यासाठी लॉग इन करा.', 'உங்கள் பயணத்தைத் தொடர உள்நுழைக.', 'તમારી ముસાફરી ચાલુ રાખવા માટે લોગ ઇન કરો.', 'ನಿಮ್ಮ ಪ್ರಯಾಣವನ್ನು ಮುಂದುవರಿಸಲು ಲಾಗಿನ್ ಮಾಡಿ.'],
  'login.signupSubtitle': ['Sign up to get started.', 'शुरू करने के लिए साइन अप करें।', 'Shuru karne ke liye sign up karein.', 'শুরু করতে সাইன் আপ করুন।', 'ప్రారంభించడానికి సైన్ అప్ చేయండి.', 'सुरू करण्यासाठी साइन अप करा.', 'தொடங்குவதற்கு பதிவு செய்யவும்.', 'ಶરૂ કરવા માટે સાઇન અપ કરો.', 'ಪ್ರಾರಂಭಿಸಲು ಸೈನ್ ಅಪ್ ಮಾಡಿ.'],
  'login.email': ['Email', 'ईमेल', 'Email', 'ইমেল', 'ఇమెయిల్', 'ईमेल', 'மின்னஞ்சல்', 'ઇમેઇલ', 'ಇಮೇಲ್'],
  'login.password': ['Password', 'पासवर्ड', 'Password', 'পাসওয়ার্ড', 'పాస్వర్డ్', 'パスワード', 'கடவுச்சொல்', 'પાસવર્ડ', 'ಪಾಸ್‌ವರ್ಡ್'],
  'login.loginBtn': ['Log In', 'लॉग इन करें', 'Log In', 'লগ ইন করুন', 'లాగిన్', 'लॉग इन करा', 'உள்நுழைக', 'લોગ ઇન', 'ಲಾಗಿನ್'],
  'login.signupBtn': ['Sign Up', 'साइन अप करें', 'Sign Up', 'সাইন আপ করুন', 'సైన్ అప్', 'साइन अप करा', 'பதிவு செய்க', 'સાઇન અપ', 'ಸೈನ್ అప్'],
  'login.or': ['OR', 'या', 'OR', 'অথবা', 'లేదా', 'किंवा', 'அல்லது', 'અથવા', 'ಅಥವಾ'],
  'login.google': ['Continue with Google', 'गूगल के साथ जारी रखें', 'Google ke saath continue karein', 'গুগলের সাথে চালিয়ে যান', 'గూగుల్‌తో కొనసాగించండి', 'गुगलसह सुरू ठेवा', 'கூகிள் மூலம் தொடரவும்', 'Google સાથે ચાલુ રાખો', 'Google ನೊಂದಿಗೆ ಮುಂದುವರಿಯಿರಿ'],
  'login.noAccount': ["Don't have an account? ", 'क्या आपका कोई खाता नहीं है? ', 'Account nahi hai? ', 'অ্যাকাউন্ট নেই? ', 'ఖాతా లేదా? ', 'खाते नाही का? ', 'கணக்கு இல்லையா? ', 'ખાતું નથી? ', 'ಖಾತೆ ಇಲ್ಲವೇ? '],
  'login.haveAccount': ['Already have an account? ', 'पहले से ही एक खाता है? ', 'Pehle se account hai? ', 'ইতিমধ্যেই একটি অ্যাকাউন্ট আছে? ', 'ఇప్పటికే ఖాతా ఉందా? ', 'आधीच खाते आहे का? ', 'ஏற்கனவே கணக்கு உள்ளதா? ', 'પહેલેથી જ ખાતું છે? ', 'ಈಗಾಗಲೇ ಖಾತೆಯನ್ನು ಹೊಂದಿದ್ದೀರಾ? ']
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
  console.log('LanguageContext.tsx updated with auth translations!');
}
