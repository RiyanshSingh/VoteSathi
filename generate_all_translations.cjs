const fs = require('fs');

// 1. Load mockData
const mockDataFile = fs.readFileSync('src/data/mockData.ts', 'utf8');

const extractStrings = (regex, content) => {
  const matches = content.matchAll(regex);
  const results = [];
  for (const match of matches) {
    results.push(match[1]);
  }
  return results;
};

// Extract topics and steps titles/descriptions
const topicsTitles = extractStrings(/title:\s*['"](.*?)['"]/g, mockDataFile);
const topicsDescs = extractStrings(/description:\s*['"](.*?)['"]/g, mockDataFile);
const stepsTitles = extractStrings(/title:\s*['"](.*?)['"]/g, mockDataFile);
const stepsDescs = extractStrings(/description:\s*['"](.*?)['"]/g, mockDataFile);

const allStrings = new Set([...topicsTitles, ...topicsDescs, ...stepsTitles, ...stepsDescs]);

// 2. Load LanguageContext
const langContextFile = fs.readFileSync('src/context/LanguageContext.tsx', 'utf8');
const translationsMatch = langContextFile.match(/const translations: Record<Language, Record<string, string>> = (\{[\s\S]*?\});/);
const translations = eval('(' + translationsMatch[1] + ')');

// 3. For each string, if it's missing or English in other languages, we need to translate it.
// I'll use my knowledge to provide a comprehensive update.

const updateTranslations = (lang, data) => {
  for (const [key, val] of Object.entries(data)) {
    translations[lang][key] = val;
  }
};

const hindiData = {
  "Election Process": "चुनाव प्रक्रिया",
  "Voter Registration": "मतदाता पंजीकरण",
  "Voting Day": "मतदान का दिन",
  "Results & Counting": "परिणाम और मतगणना",
  "Learn the end-to-end flow of Indian elections.": "भारतीय चुनावों के शुरू से अंत तक के प्रवाह को जानें।",
  "Step-by-step guide to get your Voter ID.": "अपना वोटर आईडी प्राप्त करने के लिए चरण-दर-चरण मार्गदर्शिका।",
  "Know what happens at the polling booth.": "जानें कि मतदान केंद्र पर क्या होता है।",
  "Understand how votes are counted.": "समझें कि वोटों की गिनती कैसे की जाती है।",
  "Election Announcement": "चुनाव की घोषणा",
  "Nomination Phase": "नामांकन चरण",
  "Campaigning": "चुनाव प्रचार",
  "Polling Day": "मतदान का दिन",
  "EVM Sealing": "ईवीएम सीलिंग",
  "Counting & Declaration": "गिनती और घोषणा",
  "Check Eligibility": "पात्रता जांचें",
  "Online Form 6": "ऑनलाइन फॉर्म 6",
  "Document Upload": "दस्तावेज़ अपलोड",
  "Field Verification": "क्षेत्र सत्यापन",
  "EPIC Generation": "EPIC जनरेशन",
  "Card Delivery": "कार्ड वितरण",
  "Find Your Booth": "अपना बूथ खोजें",
  "Entry & Queue": "प्रवेश और कतार",
  "First Polling Officer": "प्रथम मतदान अधिकारी",
  "Inking & Slip": "स्याही और पर्ची",
  "Casting the Vote": "वोट डालना",
  "VVPAT Verification": "वीवीपैट सत्यापन",
  "Strongroom Security": "स्ट्रॉन्गरूम सुरक्षा",
  "Counting Center Setup": "मतगणना केंद्र सेटअप",
  "Round-wise Counting": "राउंड-वार गिनती",
  "VVPAT Slip Audit": "वीवीपैट पर्ची ऑडिट",
  "Final Tabulation": "अंतिम सारणीकरण",
  "Certificate of Election": "चुनाव का प्रमाण पत्र"
};

// I'll add the long descriptions too
const hindiDescs = {
  "The ECI announces the schedule, implementing the Model Code of Conduct (MCC) immediately to ensure fair play.": "ECI ने निष्पक्ष खेल सुनिश्चित करने के लिए तत्काल आदर्श आचार संहिता (MCC) लागू करते हुए कार्यक्रम की घोषणा की।",
  "Candidates file nomination papers. The Returning Officer (RO) scrutinizes them to ensure eligibility.": "उम्मीदवार नामांकन पत्र दाखिल करते हैं। रिटर्निंग ऑफिसर (RO) पात्रता सुनिश्चित करने के लिए उनकी जांच करता है।",
  "Political parties and candidates campaign for votes, ending 48 hours before the polling concludes.": "राजनीतिक दल और उम्मीदवार वोटों के लिए प्रचार करते हैं, जो मतदान समाप्त होने से 48 घंटे पहले समाप्त हो जाता है।",
  "Voters visit polling stations to cast their votes using EVMs. Strict security is maintained.": "वोटर ईवीएम का उपयोग करके अपना वोट डालने के लिए मतदान केंद्रों पर जाते हैं। कड़ी सुरक्षा बनाए रखी जाती है।",
  "After polling, EVMs are sealed in front of polling agents and transported to secure strongrooms.": "मतदान के बाद, ईवीएम को मतदान एजेंटों के सामने सील कर दिया जाता है और सुरक्षित स्ट्रॉन्गरूम में ले जाया जाता है।",
  "Votes are counted on the designated day. Results are declared, and winners receive election certificates.": "वोटों की गिनती निर्धारित दिन पर की जाती है। परिणाम घोषित किए जाते हैं, और विजेताओं को चुनाव प्रमाण पत्र प्राप्त होते हैं।",
  "You must be an Indian citizen, 18+ years old, and a resident of the polling area where you want to register.": "आपको भारतीय नागरिक होना चाहिए, 18+ वर्ष का होना चाहिए, और उस मतदान क्षेत्र का निवासी होना चाहिए जहां आप पंजीकरण करना चाहते हैं।",
  "Fill Form 6 on the NVSP portal or Voter Helpline App with your details and photo.": "अपने विवरण और फोटो के साथ NVSP पोर्टल या वोटर हेल्पलाइन ऐप पर फॉर्म 6 भरें।",
  "Upload proof of identity (like Aadhaar/Passport) and proof of address (like electricity bill).": "पहचान का प्रमाण (जैसे आधार/पासपोर्ट) और पते का प्रमाण (जैसे बिजली का बिल) अपलोड करें।",
  "A Booth Level Officer (BLO) visits your home to verify the details provided in Form 6.": "बूथ स्तर का अधिकारी (BLO) फॉर्म 6 में दिए गए विवरणों को सत्यापित करने के लिए आपके घर आता है।",
  "Once verified, your unique EPIC number is generated and added to the electoral roll.": "सत्यापित होने के बाद, आपका विशिष्ट EPIC नंबर जेनरेट किया जाता है और चुनावी रोल में जोड़ा जाता है।",
  "Your physical Voter ID card is printed and delivered to your registered address via speed post.": "आपका भौतिक वोटर आईडी कार्ड प्रिंट किया जाता है और स्पीड पोस्ट के माध्यम से आपके पंजीकृत पते पर वितरित किया जाता है।",
  "Check your name in the voter list online to find your specific Polling Station and Part Number.": "अपना विशिष्ट मतदान केंद्र और भाग संख्या खोजने के लिए ऑनलाइन मतदाता सूची में अपना नाम जांचें।",
  "Reach the booth with your EPIC or any of the 12 alternative valid photo ID proofs.": "अपने EPIC या 12 वैकल्पिक वैध फोटो पहचान प्रमाणों में से किसी के साथ बूथ पर पहुंचें।",
  "The officer checks your name in the electoral roll and verifies your identity document.": "अधिकारी चुनावी रोल में आपका नाम जांचता है और आपके पहचान दस्तावेज़ को सत्यापित करता है।",
  "The second officer marks your finger with indelible ink, records your signature, and gives you a signed slip.": "दूसरा अधिकारी आपकी उंगली को अमिट स्याही से चिन्हित करता है, आपके हस्ताक्षर रिकॉर्ड करता है, और आपको एक हस्ताक्षरित पर्ची देता है।",
  "Go to the voting compartment, press the blue button next to your candidate on the EVM.": "वोटिंग कंपार्टमेंट में जाएं, ईवीएम पर अपने उम्मीदवार के बगल वाला नीला बटन दबाएं।",
  "Check the VVPAT glass. A slip showing your candidate will be visible for 7 seconds before dropping.": "VVPAT ग्लास की जांच करें। आपके उम्मीदवार को दिखाने वाली एक पर्ची गिरने से पहले 7 सेकंड के लिए दिखाई देगी।",
  "EVMs are kept in double-locked strongrooms with 24/7 CCTV and multi-tier armed security until counting day.": "मतगणना के दिन तक ईवीएम को 24/7 सीसीटीवी और बहु-स्तरीय सशस्त्र सुरक्षा के साथ डबल-लॉक स्ट्रॉन्गरूम में रखा जाता है।",
  "Counting happens at designated centers under strict supervision of the Returning Officer (RO).": "रिटर्निंग ऑफिसर (RO) की कड़ी निगरानी में निर्धारित केंद्रों पर मतगणना होती है।",
  "EVMs are opened round-by-round. Results for each machine are recorded in Form 17C.": "ईवीएम को राउंड-दर-राउंड खोला जाता है। प्रत्येक मशीन के परिणाम फॉर्म 17C में दर्ज किए जाते हैं।",
  "Mandatory physical counting of VVPAT slips from 5 randomly selected polling stations per constituency.": "प्रति निर्वाचन क्षेत्र में 5 यादृच्छिक रूप से चयनित मतदान केंद्रों से वीवीपैट पर्चियों की अनिवार्य भौतिक गिनती।",
  "The RO compiles round-wise results. Any discrepancies are resolved before the final announcement.": "RO राउंड-वार परिणामों को संकलित करता है। अंतिम घोषणा से पहले किसी भी विसंगति को दूर किया जाता है।",
  "The winning candidate is issued a \"Certificate of Election\" (Form 21C/21D) by the RO.": "विजेता उम्मीदवार को RO द्वारा \"चुनाव का प्रमाण पत्र\" (फॉर्म 21C/21D) जारी किया जाता है।"
};

updateTranslations('Hindi (हिंदी)', {...hindiData, ...hindiDescs});

// I'll also update Hinglish to be better
const hinglishData = {
  "Election Process": "Election Process",
  "Voter Registration": "Voter Registration",
  "Voting Day": "Voting Day",
  "Results & Counting": "Results & Counting",
  "Learn the end-to-end flow of Indian elections.": "Indian elections ka end-to-end flow sikhein.",
  "Step-by-step guide to get your Voter ID.": "Voter ID paane ke liye step-by-step guide.",
  "Know what happens at the polling booth.": "Jaaniye polling booth par kya hota hai.",
  "Understand how votes are counted.": "Samjhein ki votes kaise count hote hain.",
  "Election Announcement": "Election Announcement",
  "Nomination Phase": "Nomination Phase",
  "Campaigning": "Campaigning",
  "Polling Day": "Polling Day",
  "EVM Sealing": "EVM Sealing",
  "Counting & Declaration": "Counting & Declaration",
  "Check Eligibility": "Eligibility Check",
  "Online Form 6": "Online Form 6",
  "Document Upload": "Document Upload",
  "Field Verification": "Field Verification",
  "EPIC Generation": "EPIC Generation",
  "Card Delivery": "Card Delivery"
};

updateTranslations('Hinglish', hinglishData);

// Update LanguageContext
const newContent = langContextFile.replace(
  translationsMatch[0], 
  `const translations: Record<Language, Record<string, string>> = ${JSON.stringify(translations, null, 2)};`
);
fs.writeFileSync('src/context/LanguageContext.tsx', newContent);
console.log('LanguageContext.tsx updated successfully!');
