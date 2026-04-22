const fs = require('fs');

const languages = [
  'English', 'Hindi (हिंदी)', 'Hinglish', 'Bengali (বাংলা)', 
  'Telugu (తెలుగు)', 'Marathi (मराठी)', 'Tamil (தமிழ்)', 
  'Gujarati (ગુજરાતી)', 'Kannada (ಕನ್ನಡ)'
];

const baseKeys = {
  // Navigation
  'nav.home': ['Home', 'होम', 'Home', 'হোম', 'హోమ్', 'होम', 'முகப்பு', 'હોમ', 'ಹೋಮ್'],
  'nav.learn': ['Learn', 'सीखें', 'Seekhein', 'শিখুন', 'నేర్చుకోండి', 'शिका', 'கற்றல்', 'શીખો', 'ಕಲಿಯಿರಿ'],
  'nav.assistant': ['Assistant', 'सहायक', 'Assistant', 'সহকারী', 'అసిస్టెంట్', 'सहाय्यक', 'உதவியாளர்', 'સહાયક', 'ಸಹಾಯಕ'],
  'nav.profile': ['Profile', 'प्रोफ़ाइल', 'Profile', 'প্রোফাইল', 'ప్రొఫైల్', 'प्रोफाइल', 'சுயவிவரம்', 'પ્રોફાઇલ', 'ಪ್ರೊಫೈಲ್'],

  // Home
  'home.title': ['Vote Sathi', 'वोट साथी', 'Vote Sathi', 'ভোট সাথী', 'ఓటు సాథి', 'मतदान साथी', 'வாக்கு சாதி', 'મતદાન સાથી', 'ಮತದಾನ ಸಾಥಿ'],
  'home.subtitle': ['Learn step by step', 'कदम दर कदम सीखें', 'Step by step seekhein', 'ধাপে ধাপে শিখুন', 'దశలవారీగా నేర్చుకోండి', 'टप्प्याटप्प्याने शिका', 'படிப்படியாகக் கற்றுக்கொள்ளுங்கள்', 'પગલું દ્વારા પગલું શીખો', 'ಹಂತ ಹಂತವಾಗಿ ಕಲಿಯಿರಿ'],
  'home.topics': ['Main Topics', 'मुख्य विषय', 'Main Topics', 'প্রধান বিষয়', 'ప్రధాన అంశాలు', 'मुख्य विषय', 'முக்கிய தலைப்புகள்', 'મુખ્ય વિષયો', 'ಮುಖ್ಯ ವಿಷಯಗಳು'],
  'home.continue': ['Continue Learning', 'सीखना जारी रखें', 'Learning continue karein', 'শেখা চালিয়ে যান', 'నేర్చుకోవడం కొనసాగించండి', 'शिकणे सुरू ठेवा', 'கற்றலைத் தொடருங்கள்', 'શીખવાનું ચાલુ રાખો', 'ಕಲಿಕೆಯನ್ನು ಮುಂದುವರಿಸಿ'],
  'home.tools': ['Helpful Tools', 'सहायक उपकरण', 'Helpful Tools', 'সহায়ক সরঞ্জাম', 'సహాయక సాధనాలు', 'उपयुक्त साधने', 'உதவிகரமான கருவிகள்', 'મદદરૂપ સાધનો', 'ಸಹಾಯಕ ಸಾಧನಗಳು'],
  'home.news': ['Latest Updates', 'नवीनतम अपडेट', 'Latest Updates', 'সর্বশেষ আপডেট', 'తాజా నవీకరణలు', 'नवीनतम अद्यतने', 'சமீபத்திய அறிவிப்புகள்', 'નવીનતમ અપડેટ્સ', 'ಇತ್ತೀಚಿನ ನವೀಕರಣಗಳು'],

  // Common
  'common.viewAll': ['View All', 'सभी देखें', 'Sab dekhein', 'সব দেখুন', 'అన్నీ చూడండి', 'सर्व पहा', 'அனைத்தையும் காண்க', 'બધા જુઓ', 'ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ'],
  'common.resume': ['Resume', 'जारी रखें', 'Resume', 'পুনরায় শুরু করুন', 'తిరిగి ప్రారంభించు', 'पुन्हा सुरू करा', 'மீண்டும் தொடங்கு', 'ફરી શરૂ કરો', 'ಪುನರಾರಂಭಿಸು'],
  'common.new': ['New', 'नया', 'New', 'নতুন', 'కొత్త', 'नवीन', 'புதிய', 'નવું', 'ಹೊಸ'],
  'common.progress': ['Progress', 'प्रगति', 'Progress', 'অগ্রগতি', 'పురోగతి', 'प्रगती', 'முன்னேற்றம்', 'પ્રગતિ', 'ಪ್ರಗತಿ'],
  'common.continue': ['Continue', 'जारी रखें', 'Continue', 'চালিয়ে যান', 'కొనసాగించు', 'सुरू ठेवा', 'தொடரவும்', 'ચાલુ રાખો', 'ಮುಂದುವರಿಸಿ'],
  'common.start': ['Start', 'शुरू करें', 'Start', 'শুরু করুন', 'ప్రారంభించు', 'सुरू करा', 'தொடங்கு', 'શરૂ કરો', 'ಪ್ರಾರಂಭಿಸಿ'],

  // Profile
  'profile.title': ['My Profile', 'मेरी प्रोफ़ाइल', 'My Profile', 'আমার প্রোফাইল', 'నా ప్రొఫైల్', 'माझी प्रोफाइल', 'எனது சுயவிவரம்', 'મારી પ્રોફાઇલ', 'ನನ್ನ ಪ್ರೊಫೈಲ್'],
  'profile.subtitle': ['Your learning stats', 'आपके आंकड़े', 'Aapke stats', 'আপনার পরিসংখ্যান', 'మీ గణాంకాలు', 'तुमची आकडेवारी', 'உங்கள் புள்ளிவிவரங்கள்', 'તમારા આંકડા', 'ನಿಮ್ಮ ಅಂಕಿಅಂಶಗಳು'],
  'profile.lang': ['App Language', 'ऐप की भाषा', 'App ki Language', 'অ্যাপের ভাষা', 'యాప్ భాష', 'अ‍ॅपची भाषा', 'செயலி மொழி', 'એપ્લિકેશન ભાષા', 'ಅಪ್ಲಿಕೇಶನ್ ಭಾಷೆ'],
  'profile.settings': ['Settings', 'सेटिंग्स', 'Settings', 'সেটিংস', 'సెట్టింగ్లు', 'सेटिंग्ज', 'அமைப்புகள்', 'સેટિંગ્સ', 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು'],
  'profile.signout': ['Sign Out', 'साइन आउट', 'Sign Out', 'সাইন আউট', 'సైన్ అవుట్', 'साइन आउट', 'வெளியேறு', 'સાઇન આઉટ', 'ಸೈನ್ ಔಟ್'],
  'profile.beginner': ['Beginner Voter', 'शुरुआती मतदाता', 'Beginner Voter', 'নতুন ভোটার', 'ప్రారంభ ఓటరు', 'नवशिका मतदार', 'ஆரம்ப வாக்காளர்', 'નવા મતદાર', 'ಆರಂಭಿಕ ಮತದಾರ'],
  'profile.earlyLearner': ['Early Learner', 'प्रारंभिक शिक्षार्थी', 'Early Learner', 'প্রাথমিক শিক্ষার্থী', 'ప్రారంభ అభ్యాసకుడు', 'प्रारंभिक विद्यार्थी', 'ஆரம்பகால கற்பவர்', 'પ્રારંભિક શીખનાર', 'ಆರಂಭಿಕ ಕಲಿಯುವವರ'],
  'profile.stats.topics': ['Topics', 'विषय', 'Topics', 'বিষয়', 'అంశాలు', 'विषय', 'தலைப்புகள்', 'વિષયો', 'ವಿಷಯಗಳು'],
  'profile.stats.completed': ['Completed', 'पूरा हुआ', 'Completed', 'সম্পন্ন', 'పూర్తయింది', 'पूर्ण', 'முடிந்தது', 'પૂર્ણ', 'ಪೂರ್ಣಗೊಂಡಿದೆ'],
  'profile.stats.steps': ['Steps', 'कदम', 'Steps', 'ধাপ', 'దశలు', 'टप्पे', 'படிகள்', 'પગલાં', 'ಹಂತಗಳು'],
  'profile.stats.learned': ['Learned', 'सीखा', 'Learned', 'শেখা', 'నేర్చుకున్నది', 'शिकलो', 'கற்றுக்கொண்டது', 'શીખ્યા', 'ಕಲಿಯಲಾಗಿದೆ'],
  'profile.stats.progress': ['Progress', 'प्रगति', 'Progress', 'অগ্রগতি', 'పురోగతి', 'प्रगती', 'முன்னேற்றம்', 'પ્રગતિ', 'ಪ್ರಗತಿ'],
  'profile.stats.global': ['Global', 'वैश्विक', 'Global', 'গ্লোবাল', 'గ్లోబల్', 'जागतिक', 'உலகளாவிய', 'વૈશ્વિક', 'ಜಾಗತಿಕ'],
  'profile.savedItems': ['Saved Items', 'सहेजे गए आइटम', 'Saved Items', 'সংরক্ষিত আইটেম', 'సేవ్ చేసిన అంశాలు', 'जतन केलेले आयटम', 'சேமிக்கப்பட்டவை', 'સાચવેલી વસ્તુઓ', 'ಉಳಿಸಿದ ಐಟಂಗಳು'],
  'profile.saved.idReq': ['Voter ID Requirements', 'वोटर आईडी आवश्यकताएं', 'Voter ID Requirements', 'ভোটার আইডি প্রয়োজনীয়তা', 'ఓటరు ID అవసరాలు', 'मतदार ओळखपत्र आवश्यकता', 'வாக்காளர் அடையாள அட்டை தேவைகள்', 'મતદાર ID જરૂરિયાતો', 'ಮತದಾರರ ID ಅಗತ್ಯತೆಗಳು'],
  'profile.saved.days2': ['Saved 2 days ago', '2 दिन पहले सहेजा गया', 'Saved 2 days ago', '২ দিন আগে সংরক্ষিত', '2 రోజుల క్రితం సేవ్ చేయబడింది', '२ दिवसांपूर्वी जतन केले', '2 நாட்களுக்கு முன் சேமிக்கப்பட்டது', '2 દિવસ પહેલા સાચવેલ', '2 ದಿನಗಳ ಹಿಂದೆ ಉಳಿಸಲಾಗಿದೆ'],
  'profile.saved.pollDay': ['Polling Day Guide', 'मतदान दिवस गाइड', 'Polling Day Guide', 'ভোটের দিনের গাইড', 'పోలింగ్ డే గైడ్', 'मतदान दिवस मार्गदर्शक', 'வாக்குப்பதிவு நாள் வழிகாட்டி', 'મતદાન દિવસ માર્ગદર્શિકા', 'ಮತದಾನ ದಿನದ ಮಾರ್ಗದರ್ಶಿ'],
  'profile.saved.days5': ['Saved 5 days ago', '5 दिन पहले सहेजा गया', 'Saved 5 days ago', '৫ দিন আগে সংরক্ষিত', '5 రోజుల క్రితం సేవ్ చేయబడింది', '५ दिवसांपूर्वी जतन केले', '5 நாட்களுக்கு முன் சேமிக்கப்பட்டது', '5 દિવસ પહેલા સાચવેલ', '5 ದಿನಗಳ ಹಿಂದೆ ಉಳಿಸಲಾಗಿದೆ'],
  'profile.settings.notifications': ['Notifications', 'सूचनाएं', 'Notifications', 'বিজ্ঞপ্তি', 'నోటిఫికేషన్‌లు', 'अधिसूचना', 'அறிவிப்புகள்', 'સૂચનાઓ', 'ಅಧಿಸೂಚನೆಗಳು'],
  'profile.settings.daily': ['Daily', 'दैनिक', 'Daily', 'দৈনিক', 'రోజువారీ', 'दररोज', 'தினசரி', 'દૈનિક', 'ದೈನಂದಿನ'],
  'profile.settings.preferences': ['Preferences', 'प्राथमिकताएं', 'Preferences', 'পছন্দ', 'ప్రాధాన్యతలు', 'प्राधान्ये', 'விருப்பங்கள்', 'પસંદગીઓ', 'ಆದ್ಯತೆಗಳು'],
  'profile.settings.sync': ['Sync App Data', 'ऐप डेटा सिंक करें', 'Sync App Data', 'অ্যাপ ডেটা সিঙ্ক করুন', 'యాప్ డేటాను సింక్ చేయండి', 'अ‍ॅप डेटा सिंक करा', 'செயலி தரவை ஒத்திசை', 'એપ્લિકેશન ડેટા સિંક કરો', 'ಅಪ್ಲಿಕೇಶನ್ ಡೇಟಾ ಸಿಂಕ್ ಮಾಡಿ'],
  'profile.settings.update': ['Update Content', 'कंटेंट अपडेट करें', 'Update Content', 'কন্টেন্ট আপডেট করুন', 'కంటెంట్‌ను నవీకరించండి', 'सामग्री अद्यतन करा', 'உள்ளடக்கத்தைப் புதுப்பிக்கவும்', 'સામગ્રી અપડેટ કરો', 'ವಿಷಯವನ್ನು ನವೀಕರಿಸಿ'],

  // Assistant
  'assistant.title': ['Assistant', 'सहायक', 'Assistant', 'সহকারী', 'అసిస్టెంట్', 'सहाय्यक', 'உதவியாளர்', 'સહાયક', 'ಸಹಾಯಕ'],
  'assistant.subtitle': ['Chat with me', 'मुझसे बात करें', 'Mujhse baat karein', 'আমার সাথে চ্যাট করুন', 'నాతో చాట్ చేయండి', 'माझ्याशी चॅट करा', 'என்னுடன் அரட்டையடிக்கவும்', 'મારી સાથે ચેટ કરો', 'ನನ್ನೊಂದಿಗೆ ಚಾಟ್ ಮಾಡಿ'],
  'assistant.placeholder': ['Ask me anything...', 'कुछ भी पूछें...', 'Kuch bhi puchiye...', 'যেকোনো কিছু জিজ্ঞাসা করুন...', 'ఏదైనా అడగండి...', 'काहीही विचारा...', 'எது வேண்டுமானாலும் கேளுங்கள்...', 'કંઈપણ પૂછો...', 'ಏನನ್ನಾದರೂ ಕೇಳಿ...'],

  // Learn
  'learn.step': ['Step', 'कदम', 'Step', 'ধাপ', 'దశ', 'टप्पा', 'படி', 'પગલું', 'ಹಂತ'],
  'learn.prev': ['Previous', 'पिछला', 'Piche', 'আগের', 'మునుపటి', 'मागील', 'முந்தைய', 'પાછલું', 'ಹಿಂದಿನ'],
  'learn.next': ['Next', 'अगला', 'Aage', 'পরবর্তী', 'తదుపరి', 'पुढील', 'அடுத்தது', 'પછીનું', 'ಮುಂದಿನ'],
  'learn.selectStep': ['Select a step to start learning', 'सीखना शुरू करने के लिए एक कदम चुनें', 'Select a step to start learning', 'শেখা শুরু করতে একটি ধাপ নির্বাচন করুন', 'నేర్చుకోవడం ప్రారంభించడానికి ఒక దశను ఎంచుకోండి', 'शिकायला सुरुवात करण्यासाठी एक टप्पा निवडा', 'கற்றுக்கொள்ளத் தொடங்க ஒரு படியைத் தேர்ந்தெடுக்கவும்', 'શીખવાનું શરૂ કરવા માટે એક પગલું પસંદ કરો', 'ಕಲಿಯಲು ಪ್ರಾರಂಭಿಸಲು ಒಂದು ಹಂತವನ್ನು ಆಯ್ಕೆಮಾಡಿ'],
  'learn.chapterList': ['Chapter List', 'अध्याय सूची', 'Chapter List', 'অধ্যায়ের তালিকা', 'అధ్యాయాల జాబితా', 'अध्याय यादी', 'அத்தியாயப் பட்டியல்', 'પ્રકરણ સૂચિ', 'ಅಧ್ಯಾಯ ಪಟ್ಟಿ'],
  'learn.noContent': ['No content found for this topic.', 'इस विषय के लिए कोई सामग्री नहीं मिली।', 'No content found for this topic.', 'এই বিষয়ের জন্য কোন সামগ্রী পাওয়া যায়নি।', 'ఈ అంశం కోసం ఏ కంటెంట్ కనుగొనబడలేదు.', 'या विषयासाठी कोणतीही सामग्री आढळली नाही.', 'இந்தத் தலைப்புக்கு உள்ளடக்கம் எதுவும் கிடைக்கவில்லை.', 'આ વિષય માટે કોઈ સામગ્રી મળી નથી.', 'ಈ ವಿಷಯಕ್ಕಾಗಿ ಯಾವುದೇ ವಿಷಯ ಕಂಡುಬಂದಿಲ್ಲ.'],
  'learn.seedDb': ['Seed Database', 'डेटाबेस भरें', 'Seed Database', 'ডেটাবেস পূরণ করুন', 'డేటాబేస్ నింపండి', 'डेटाबेस भरा', 'தரவுத்தளத்தை நிரப்பு', 'ડેટાબેઝ ભરો', 'ಡೇಟಾಬೇಸ್ ಭರ್ತಿಮಾಡಿ'],
  'learn.startPath': ['Start Learning Path', 'सीखने का मार्ग शुरू करें', 'Start Learning Path', 'শেখার পথ শুরু করুন', 'నేర్చుకునే మార్గాన్ని ప్రారంభించండి', 'शिकण्याचा मार्ग सुरू करा', 'கற்றல் பாதையைத் தொடங்கு', 'શીખવાનો માર્ગ શરૂ કરો', 'ಕಲಿಕೆಯ ಮಾರ್ಗವನ್ನು ಪ್ರಾರಂಭಿಸಿ'],
  'learn.finish': ['Finish', 'समाप्त करें', 'Finish', 'শেষ করুন', 'ముగించు', 'पूर्ण करा', 'முடிக்கவும்', 'સમાપ્ત કરો', 'ಮುಕ್ತಾಯಗೊಳಿಸಿ'],
  'learn.viewChapters': ['View All Chapters', 'सभी अध्याय देखें', 'View All Chapters', 'সব অধ্যায় দেখুন', 'అన్ని అధ్యాయాలను చూడండి', 'सर्व अध्याय पहा', 'அனைத்து அத்தியாயங்களையும் காண்க', 'બધા પ્રકરણો જુઓ', 'ಎಲ್ಲಾ ಅಧ್ಯಾಯಗಳನ್ನು ವೀಕ್ಷಿಸಿ'],

  // Tools
  'tool.booth': ['Find Polling Booth', 'बूथ खोजें', 'Booth dhundhein', 'বুথ খুঁজুন', 'బూత్‌ను కనుగొనండి', 'बूथ शोधा', 'வாக்குச்சாவடியைக் கண்டுபிடி', 'બૂથ શોધો', 'ಬೂತ್ ಹುಡುಕಿ'],
  'tool.docs': ['Required Documents', 'आवश्यक दस्तावेज', 'Zaroori Documents', 'প্রয়োজনীয় কাগজপত্র', 'అవసరమైన పత్రాలు', 'आवश्यक कागदपत्रे', 'தேவையான ஆவணங்கள்', 'જરૂરી દસ્તાવેજો', 'ಅಗತ್ಯ ದಾಖಲೆಗಳು'],
  'tool.faq': ['FAQs', 'सामान्य प्रश्न', 'FAQs', 'সাধারণ প্রশ্ন', 'తరచుగా అడిగే ప్రశ్నలు', 'सामान्य प्रश्न', 'கேள்விகள்', 'વારંવાર પૂછાતા પ્રશ્નો', 'FAQ ಗಳು'],

  // Database Topics (Fallback keys if we use t(topic.title))
  'Election Process': ['Election Process', 'चुनाव प्रक्रिया', 'Election Process', 'নির্বাচন প্রক্রিয়া', 'ఎన్నికల ప్రక్రియ', 'निवडणूक प्रक्रिया', 'தேர்தல் செயல்முறை', 'ચૂંટણી પ્રક્રિયા', 'ಚುನಾವಣಾ ಪ್ರಕ್ರಿಯೆ'],
  'Voter Registration': ['Voter Registration', 'मतदाता पंजीकरण', 'Voter Registration', 'ভোটার নিবন্ধন', 'ఓటరు నమోదు', 'मतदार नोंदणी', 'வாக்காளர் பதிவு', 'મતદાર નોંધણી', 'ಮತದಾರರ ನೋಂದಣಿ'],
  'Voting Day': ['Voting Day', 'मतदान का दिन', 'Voting Day', 'ভোটের দিন', 'పోలింగ్ రోజు', 'मतदानाचा दिवस', 'வாக்குப்பதிவு நாள்', 'મતદાનનો દિવસ', 'ಮತದಾನದ ದಿನ'],
  'Results & Counting': ['Results & Counting', 'परिणाम और गिनती', 'Results & Counting', 'ফলাফল ও গণনা', 'ఫలితాలు మరియు లెక్కింపు', 'निकाल आणि मोजणी', 'முடிவுகள் மற்றும் எண்ணிக்கை', 'પરિણામો અને ગણતરી', 'ಫಲಿತಾಂಶಗಳು ಮತ್ತು ಎಣಿಕೆ'],

  // Database Assistant Chips
  'How to register?': ['How to register?', 'पंजीकरण कैसे करें?', 'How to register?', 'কিভাবে নিবন্ধন করবেন?', 'ఎలా నమోదు చేసుకోవాలి?', 'नोंदणी कशी करावी?', 'பதிவு செய்வது எப்படி?', 'કેવી રીતે નોંધણી કરવી?', 'ನೋಂದಾಯಿಸುವುದು ಹೇಗೆ?'],
  'Voting process': ['Voting process', 'मतदान प्रक्रिया', 'Voting process', 'ভোট প্রক্রিয়া', 'ఓటింగ్ ప్రక్రియ', 'मतदान प्रक्रिया', 'வாக்களிக்கும் முறை', 'મતદાન પ્રક્રિયા', 'ಮತದಾನ ಪ್ರಕ್ರಿಯೆ'],
  'Documents needed': ['Documents needed', 'आवश्यक दस्तावेज़', 'Documents needed', 'প্রয়োজনীয় কাগজপত্র', 'అవసరమైన పత్రాలు', 'आवश्यक कागदपत्रे', 'தேவையான ஆவணங்கள்', 'જરૂરી દસ્તાવેજો', 'ಅಗತ್ಯ ದಾಖಲೆಗಳು'],
  'Find my booth': ['Find my booth', 'मेरा बूथ खोजें', 'Find my booth', 'আমার বুথ খুঁজুন', 'నా బూత్‌ను కనుగొనండి', 'माझे बूथ शोधा', 'எனது சாவடியைக் கண்டுபிடி', 'મારું બૂથ શોધો', 'ನನ್ನ ಬೂತ್ ಅನ್ನು ಹುಡುಕಿ']
};

const translations = {};
languages.forEach(lang => {
  translations[lang] = {};
});

Object.entries(baseKeys).forEach(([key, values]) => {
  languages.forEach((lang, index) => {
    translations[lang][key] = values[index];
  });
});

let fileContent = `import { createContext, useContext, useState, type ReactNode } from 'react';

type Language = 'English' | 'Hindi (हिंदी)' | 'Hinglish' | 'Bengali (বাংলা)' | 'Telugu (తెలుగు)' | 'Marathi (मराठी)' | 'Tamil (தமிழ்)' | 'Gujarati (ગુજરાતી)' | 'Kannada (ಕನ್ನಡ)';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = ${JSON.stringify(translations, null, 2)};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('English');

  const t = (key: string) => {
    return translations[language][key] || translations['English'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
`;

fs.writeFileSync('src/context/LanguageContext.tsx', fileContent);
console.log('LanguageContext.tsx generated!');
