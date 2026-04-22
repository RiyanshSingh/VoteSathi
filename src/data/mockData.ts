export interface Topic {
  id: string;
  title: string;        // English fallback (source of truth for DB)
  description: string;  // English fallback
  titleKey: string;     // Stable i18n key, never changes
  descriptionKey: string;
  icon: string;
  color: string;
  progress: number;
}

export interface Step {
  id: string;
  topicId: string;
  stepNumber: number;
  title: string;        // English fallback
  description: string;  // English fallback
  titleKey: string;     // Stable i18n key
  descriptionKey: string;
  content?: string[];     // Multi-page English fallback
  contentKeys?: string[]; // Stable i18n keys for multi-page
}

export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const topics: Topic[] = [
  {
    id: 'process',
    title: 'Election Process',
    description: 'Learn the end-to-end flow of Indian elections.',
    titleKey: 'topic.process.title',
    descriptionKey: 'topic.process.desc',
    icon: 'Briefcase',
    color: 'bg-neo-green',
    progress: 0,
  },
  {
    id: 'registration',
    title: 'Voter Registration',
    description: 'Step-by-step guide to get your Voter ID.',
    titleKey: 'topic.registration.title',
    descriptionKey: 'topic.registration.desc',
    icon: 'UserPlus',
    color: 'bg-neo-blue',
    progress: 0,
  },
  {
    id: 'voting-day',
    title: 'Voting Day',
    description: 'Everything you need to know at the booth.',
    titleKey: 'topic.voting.title',
    descriptionKey: 'topic.voting.desc',
    icon: 'Calendar',
    color: 'bg-neo-yellow',
    progress: 0,
  },
  {
    id: 'results',
    title: 'Results & Counting',
    description: 'How your vote turns into a result.',
    titleKey: 'topic.results.title',
    descriptionKey: 'topic.results.desc',
    icon: 'BarChart3',
    color: 'bg-neo-purple',
    progress: 0,
  },
];

export const steps: Step[] = [
  {
    id: "step_1",
    topicId: "process",
    stepNumber: 1,
    title: "Election Basics",
    description: "An election is a process where citizens choose their representatives by voting. The candidate with the most votes wins a seat in government.",
    titleKey: "step.step_1.title",
    descriptionKey: "step.step_1.desc",
    content: [
      "An election is a process where citizens choose their representatives by voting. The candidate with the most votes wins a seat in government.",
      "Elections give ordinary citizens real power — the ability to replace leaders who don't serve them well. Without elections, there is no accountability in government.",
      "Any Indian citizen aged 18 or above can vote, provided their name is on the voter list. There are no income, education, or gender restrictions."
    ],
    contentKeys: [
      "step.step_1.page1",
      "step.step_1.page2",
      "step.step_1.page3"
    ]
  },
  {
    id: "step_2",
    topicId: "process",
    stepNumber: 2,
    title: "Election Timeline",
    description: "The Election Commission announces election dates along with the schedule for nominations, campaigning, voting, and result counting.",
    titleKey: "step.step_2.title",
    descriptionKey: "step.step_2.desc",
    content: [
      "The Election Commission announces election dates along with the schedule for nominations, campaigning, voting, and result counting.",
      "Candidates submit forms to officially enter the race. Documents are verified and only eligible candidates appear on the final ballot.",
      "Candidates present their ideas through rallies, speeches, ads, and social media. Voters use this time to compare candidates before deciding.",
      "Voters visit their assigned polling booth, verify their identity, and cast their vote using an Electronic Voting Machine (EVM).",
      "All votes are counted after polls close. The candidate with the highest votes wins. Official results are announced by the Election Commission."
    ],
    contentKeys: [
      "step.step_2.page1",
      "step.step_2.page2",
      "step.step_2.page3",
      "step.step_2.page4",
      "step.step_2.page5"
    ]
  },
  {
    id: "step_3",
    topicId: "process",
    stepNumber: 3,
    title: "After the Election",
    description: "The party winning a majority of seats forms the government. If no party wins alone, parties may join in a coalition to reach the majority mark.",
    titleKey: "step.step_3.title",
    descriptionKey: "step.step_3.desc",
    content: [
      "The party winning a majority of seats forms the government. If no party wins alone, parties may join in a coalition to reach the majority mark.",
      "Elected representatives make laws, approve budgets, and raise citizens' issues in Parliament or the Assembly. Voters can hold them accountable in the next election."
    ],
    contentKeys: [
      "step.step_3.page1",
      "step.step_3.page2"
    ]
  },
  {
    id: "step_4",
    topicId: "process",
    stepNumber: 4,
    title: "Types of Elections",
    description: "Held every 5 years to elect 543 Members of Parliament. The party winning a majority forms the central government and its leader becomes Prime Minister.",
    titleKey: "step.step_4.title",
    descriptionKey: "step.step_4.desc",
    content: [
      "Held every 5 years to elect 543 Members of Parliament. The party winning a majority forms the central government and its leader becomes Prime Minister.",
      "Each state elects its own Legislative Assembly (MLAs) separately. The majority party forms the state government, and its leader becomes Chief Minister.",
      "Citizens elect local representatives for municipalities, panchayats, and corporations — the people who directly manage roads, water, sanitation, and local welfare."
    ],
    contentKeys: [
      "step.step_4.page1",
      "step.step_4.page2",
      "step.step_4.page3"
    ]
  },
  {
    id: "step_5",
    topicId: "process",
    stepNumber: 5,
    title: "Important Terms",
    description: "A constituency is a defined geographic area that elects one representative. India has 543 Lok Sabha constituencies, each sending one MP to Parliament.",
    titleKey: "step.step_5.title",
    descriptionKey: "step.step_5.desc",
    content: [
      "A constituency is a defined geographic area that elects one representative. India has 543 Lok Sabha constituencies, each sending one MP to Parliament.",
      "A candidate is a person contesting an election. They may represent a political party or stand independently, and must meet eligibility criteria to file a nomination.",
      "A party needs 272 out of 543 seats for a Lok Sabha majority. Without majority, no single party can form a stable government alone."
    ],
    contentKeys: [
      "step.step_5.page1",
      "step.step_5.page2",
      "step.step_5.page3"
    ]
  },
  {
    id: "step_6",
    topicId: "process",
    stepNumber: 6,
    title: "Model Code of Conduct",
    description: "The Model Code of Conduct is a set of rules issued by the Election Commission. It comes into effect the moment election dates are announced and ends when results are declared.",
    titleKey: "step.step_6.title",
    descriptionKey: "step.step_6.desc",
    content: [
      "The Model Code of Conduct is a set of rules issued by the Election Commission. It comes into effect the moment election dates are announced and ends when results are declared.",
      "All political parties, candidates, and the ruling government must follow the MCC. It ensures no party misuses government power or resources to gain an unfair advantage.",
      "During MCC, parties cannot announce new schemes, use government vehicles for campaigns, or bribe voters. Inflammatory speeches targeting religion or caste are strictly prohibited.",
      "Without the MCC, ruling parties could spend public money on announcements just before elections to influence voters. The code creates a level playing field for all candidates."
    ],
    contentKeys: [
      "step.step_6.page1",
      "step.step_6.page2",
      "step.step_6.page3",
      "step.step_6.page4"
    ]
  },
  {
    id: "step_7",
    topicId: "process",
    stepNumber: 7,
    title: "Political Parties & Symbols",
    description: "A political party is a group of people with shared beliefs who contest elections together. Parties build a common agenda and field candidates across multiple constituencies.",
    titleKey: "step.step_7.title",
    descriptionKey: "step.step_7.desc",
    content: [
      "A political party is a group of people with shared beliefs who contest elections together. Parties build a common agenda and field candidates across multiple constituencies.",
      "A party is recognized as national if it wins a certain vote share across four or more states. State parties are recognized within one state. Recognition affects funding and ballot symbols.",
      "Every party and independent candidate is assigned a unique symbol on the EVM. Symbols help voters — especially those unfamiliar with names — identify their chosen candidate easily.",
      "A candidate not belonging to any party is called an independent. They are assigned a symbol by the Election Commission from a reserved list of free symbols."
    ],
    contentKeys: [
      "step.step_7.page1",
      "step.step_7.page2",
      "step.step_7.page3",
      "step.step_7.page4"
    ]
  },
  {
    id: "step_8",
    topicId: "process",
    stepNumber: 8,
    title: "Who Runs Elections? (ECI)",
    description: "The Election Commission of India is a constitutional body that oversees all elections in the country. It was established in 1950 and operates independently of the government.",
    titleKey: "step.step_8.title",
    descriptionKey: "step.step_8.desc",
    content: [
      "The Election Commission of India is a constitutional body that oversees all elections in the country. It was established in 1950 and operates independently of the government.",
      "The ECI is led by the Chief Election Commissioner and two Election Commissioners. They are appointed by the President and cannot be removed easily, ensuring their independence.",
      "ECI announces election dates, enforces the Model Code of Conduct, manages voter registration, deploys security forces, and certifies final election results across India.",
      "The Chief Election Commissioner can only be removed through a process similar to removing a Supreme Court judge. This protects the ECI from political pressure or interference."
    ],
    contentKeys: [
      "step.step_8.page1",
      "step.step_8.page2",
      "step.step_8.page3",
      "step.step_8.page4"
    ]
  },
  {
    id: "step_9",
    topicId: "process",
    stepNumber: 9,
    title: "By-elections & Re-elections",
    description: "A by-election is held when a seat becomes vacant mid-term due to a member's death, resignation, or disqualification. Only that specific constituency votes — not the entire state or country.",
    titleKey: "step.step_9.title",
    descriptionKey: "step.step_9.desc",
    content: [
      "A by-election is held when a seat becomes vacant mid-term due to a member's death, resignation, or disqualification. Only that specific constituency votes — not the entire state or country.",
      "A re-election is ordered by the Election Commission when voting is disrupted by violence, rigging, or technical failure. The affected booth or constituency revotes on a new date.",
      "A by-election result can shift the balance of power if the ruling party has a thin majority. Winning or losing a single seat can sometimes decide who controls the government."
    ],
    contentKeys: [
      "step.step_9.page1",
      "step.step_9.page2",
      "step.step_9.page3"
    ]
  },
  {
    id: "step_10",
    topicId: "registration",
    stepNumber: 1,
    title: "Voter Registration",
    description: "Registration must happen before election day — you cannot register on the spot. Check your name on the voter list weeks in advance to avoid missing out.",
    titleKey: "step.step_10.title",
    descriptionKey: "step.step_10.desc",
    content: [
      "Registration must happen before election day — you cannot register on the spot. Check your name on the voter list weeks in advance to avoid missing out.",
      "Register online via the Voter Helpline app or voterportal.eci.gov.in, or fill out Form 6 offline at your local electoral office.",
      "You need identity proof and address proof. Aadhaar card, passport, or utility bills are commonly accepted. Documents confirm your age, identity, and residence."
    ],
    contentKeys: [
      "step.step_10.page1",
      "step.step_10.page2",
      "step.step_10.page3"
    ]
  },
  {
    id: "step_11",
    topicId: "registration",
    stepNumber: 2,
    title: "Check & Correct Your Voter Details",
    description: "Visit voterportal.eci.gov.in or use the Voter Helpline app to search your name. You will need your voter ID number or basic details like name and date of birth.",
    titleKey: "step.step_11.title",
    descriptionKey: "step.step_11.desc",
    content: [
      "Visit voterportal.eci.gov.in or use the Voter Helpline app to search your name. You will need your voter ID number or basic details like name and date of birth.",
      "If your name is misspelled or date of birth is wrong, fill Form 8 online or at your local electoral office. Corrections must be submitted well before election dates are announced.",
      "Moved to a new area? Submit Form 8A to shift your voter registration to your new address. This ensures you vote at the correct polling booth near your home.",
      "e-EPIC is a digital voter ID card in PDF format. Download it free from voterportal.eci.gov.in and save it on your phone — it is valid proof of identity at polling booths."
    ],
    contentKeys: [
      "step.step_11.page1",
      "step.step_11.page2",
      "step.step_11.page3",
      "step.step_11.page4"
    ]
  },
  {
    id: "step_12",
    topicId: "registration",
    stepNumber: 3,
    title: "Youth & First-Time Voters",
    description: "You become eligible to vote the day you turn 18. Register on voterportal.eci.gov.in using your Aadhaar and a recent photo. Registration takes a few minutes and is completely free.",
    titleKey: "step.step_12.title",
    descriptionKey: "step.step_12.desc",
    content: [
      "You become eligible to vote the day you turn 18. Register on voterportal.eci.gov.in using your Aadhaar and a recent photo. Registration takes a few minutes and is completely free.",
      "The ECI now allows voter registration four times a year — on January 1, April 1, July 1, and October 1 as qualifying dates. You no longer have to wait for January alone.",
      "India has over 18 crore voters aged 18–29. When young people vote in large numbers, candidates must address issues like jobs, education, and climate — not just older demographics.",
      "Help friends and family register before deadlines. Share the Voter Helpline number 1950 and the voter portal link. One conversation can bring several new voters into the process."
    ],
    contentKeys: [
      "step.step_12.page1",
      "step.step_12.page2",
      "step.step_12.page3",
      "step.step_12.page4"
    ]
  },
  {
    id: "step_13",
    topicId: "voting-day",
    stepNumber: 1,
    title: "Voting Day Process",
    description: "Find your polling booth on voterportal.eci.gov.in using your voter ID number. Keep your ID ready and visit in the morning to avoid long queues.",
    titleKey: "step.step_13.title",
    descriptionKey: "step.step_13.desc",
    content: [
      "Find your polling booth on voterportal.eci.gov.in using your voter ID number. Keep your ID ready and visit in the morning to avoid long queues.",
      "Officials verify your identity and find your name in the voter list. Once confirmed, you are given a slip and allowed to proceed to the EVM.",
      "Press the button next to your chosen candidate on the EVM. A beep confirms your vote is recorded. The whole process takes less than a minute.",
      "An indelible ink mark is applied to your left index finger. This mark prevents anyone from voting more than once during that election."
    ],
    contentKeys: [
      "step.step_13.page1",
      "step.step_13.page2",
      "step.step_13.page3",
      "step.step_13.page4"
    ]
  },
  {
    id: "step_14",
    topicId: "voting-day",
    stepNumber: 2,
    title: "EVM & Voting Technology",
    description: "An Electronic Voting Machine records votes digitally. It is faster and more accurate than paper ballots, and cannot be tampered with once sealed.",
    titleKey: "step.step_14.title",
    descriptionKey: "step.step_14.desc",
    content: [
      "An Electronic Voting Machine records votes digitally. It is faster and more accurate than paper ballots, and cannot be tampered with once sealed.",
      "Press the button next to your chosen candidate. The machine records one vote and emits a beep. Only one vote per voter is allowed per session.",
      "VVPAT (Voter Verifiable Paper Audit Trail) prints a slip showing your chosen candidate for a few seconds. It lets you confirm your vote before the slip drops into a sealed box."
    ],
    contentKeys: [
      "step.step_14.page1",
      "step.step_14.page2",
      "step.step_14.page3"
    ]
  },
  {
    id: "step_15",
    topicId: "voting-day",
    stepNumber: 3,
    title: "Special Cases",
    description: "If you disapprove of all candidates, press NOTA (None of the Above) on the EVM. It registers your dissatisfaction officially, though it does not eliminate any candidate.",
    titleKey: "step.step_15.title",
    descriptionKey: "step.step_15.desc",
    content: [
      "If you disapprove of all candidates, press NOTA (None of the Above) on the EVM. It registers your dissatisfaction officially, though it does not eliminate any candidate.",
      "If you don't have a voter ID card, you can vote using 12 other approved IDs including Aadhaar, passport, or PAN card — as long as your name is on the voter list.",
      "Senior citizens (80+), persons with disabilities, and certain essential workers may use postal ballots or get priority access at booths — apply before election day."
    ],
    contentKeys: [
      "step.step_15.page1",
      "step.step_15.page2",
      "step.step_15.page3"
    ]
  },
  {
    id: "step_16",
    topicId: "voting-day",
    stepNumber: 4,
    title: "Real-Life Scenarios",
    description: "Check your name on the voter list before election day at voterportal.eci.gov.in. Carry a valid ID, follow booth instructions, and vote with confidence.",
    titleKey: "step.step_16.title",
    descriptionKey: "step.step_16.desc",
    content: [
      "Check your name on the voter list before election day at voterportal.eci.gov.in. Carry a valid ID, follow booth instructions, and vote with confidence.",
      "If your name is missing at the booth, you cannot vote that day. Always verify your details online at least a week before election day.",
      "If you forget your voter ID, use Aadhaar, PAN card, passport, or 9 other approved identity documents. Your name must still be present in the voter list.",
      "Queues are common at peak hours. Arrive early in the morning or after 2 PM to find shorter lines. You cannot be turned away if you arrive before closing time.",
      "You can only vote at your assigned booth — going to a different one means you cannot vote. Always check your booth address on the voter portal beforehand."
    ],
    contentKeys: [
      "step.step_16.page1",
      "step.step_16.page2",
      "step.step_16.page3",
      "step.step_16.page4",
      "step.step_16.page5"
    ]
  },
  {
    id: "step_17",
    topicId: "voting-day",
    stepNumber: 5,
    title: "Do's & Don'ts",
    description: "Carry an approved photo ID to the polling booth. Without identity verification, officials cannot allow you to vote even if your name is on the list.",
    titleKey: "step.step_17.title",
    descriptionKey: "step.step_17.desc",
    content: [
      "Carry an approved photo ID to the polling booth. Without identity verification, officials cannot allow you to vote even if your name is on the list.",
      "Follow the directions of polling officials without arguing. They are there to ensure a fair process for everyone. Cooperate and the experience will be smooth.",
      "Choose your candidate based on your own judgment. If anyone pressures or bribes you to vote a certain way, you can report it to the Election Commission.",
      "Mobile phones are not allowed inside the voting compartment. This prevents vote photography, which could be used to prove how you voted and compromise secrecy.",
      "Keep your vote private — even after casting it. This protects you from potential pressure or retaliation and upholds the integrity of the secret ballot system.",
      "The ink mark system and voter list checks make double voting impossible. Attempting it is a criminal offence under the Representation of the People Act."
    ],
    contentKeys: [
      "step.step_17.page1",
      "step.step_17.page2",
      "step.step_17.page3",
      "step.step_17.page4",
      "step.step_17.page5",
      "step.step_17.page6"
    ]
  },
  {
    id: "step_18",
    topicId: "results",
    stepNumber: 1,
    title: "Voter Rights & Responsibilities",
    description: "Voting is a constitutional right for every eligible citizen. No one — including employers or family members — can legally stop you or tell you who to vote for.",
    titleKey: "step.step_18.title",
    descriptionKey: "step.step_18.desc",
    content: [
      "Voting is a constitutional right for every eligible citizen. No one — including employers or family members — can legally stop you or tell you who to vote for.",
      "Research candidates before voting — check their past record, promises, and background. An informed vote has more impact than a vote based on rumour or pressure.",
      "Your vote is completely private. No official, party worker, or family member has the right to know who you voted for. This protects your freedom to vote honestly."
    ],
    contentKeys: [
      "step.step_18.page1",
      "step.step_18.page2",
      "step.step_18.page3"
    ]
  },
  {
    id: "step_19",
    topicId: "results",
    stepNumber: 2,
    title: "Election Complaints & Grievances",
    description: "Call 1950 (toll-free) to report problems with voter registration, missing names, or election-related issues. The helpline is active before and during elections across all states.",
    titleKey: "step.step_19.title",
    descriptionKey: "step.step_19.desc",
    content: [
      "Call 1950 (toll-free) to report problems with voter registration, missing names, or election-related issues. The helpline is active before and during elections across all states.",
      "Use the cVIGIL app to report election rule violations like bribery, illegal banners, or use of government vehicles. Upload a photo or video — the team must respond within 100 minutes.",
      "If someone offers you cash, gifts, or alcohol to vote for a candidate, report it immediately via cVIGIL or call 1950. Accepting a bribe is also an offence under election law.",
      "If you face problems at the polling booth — harassment, impersonation, or being turned away wrongly — contact the Presiding Officer at the booth or call 1950 immediately."
    ],
    contentKeys: [
      "step.step_19.page1",
      "step.step_19.page2",
      "step.step_19.page3",
      "step.step_19.page4"
    ]
  },
  {
    id: "step_20",
    topicId: "results",
    stepNumber: 3,
    title: "Common Myths About Voting",
    description: "Several Indian elections have been decided by margins of under 500 votes. In a close race, every single vote counts. Staying home is effectively a vote for whoever wins.",
    titleKey: "step.step_20.title",
    descriptionKey: "step.step_20.desc",
    content: [
      "Several Indian elections have been decided by margins of under 500 votes. In a close race, every single vote counts. Staying home is effectively a vote for whoever wins.",
      "EVMs are sealed, tamper-proof, and not connected to any network. VVPAT paper slips allow physical verification. Multiple parties deploy agents at every counting table.",
      "NOTA only records your dissatisfaction — it does not disqualify anyone. Even if NOTA gets the most votes, the candidate with the next highest votes still wins the seat.",
      "You do not need a voter ID to register — you need Aadhaar or another ID proof to apply. The voter ID card is issued to you after your registration is approved.",
      "The actual voting process at the booth takes under 5 minutes once you reach the EVM. Queues at popular booths can be avoided by going early or checking off-peak hours."
    ],
    contentKeys: [
      "step.step_20.page1",
      "step.step_20.page2",
      "step.step_20.page3",
      "step.step_20.page4",
      "step.step_20.page5"
    ]
  }
];

export const initialMessages: Message[] = [
  {
    id: '1',
    sender: 'assistant',
    text: 'Hello! I am your Election Assistant. How can I help you today?',
    timestamp: '10:00 AM',
  }
];

export const suggestionChips = [
  'How to register?',
  'Voting process',
  'Documents needed',
  'Find my booth'
];

export const newsUpdates = [
  {
    id: 'news1',
    title: 'Voter ID and Aadhaar Linking',
    description: 'Deadline to link your Aadhaar with Voter ID has been extended.',
    date: '2 Hrs Ago',
    isUrgent: true,
  },
  {
    id: 'news2',
    title: 'New Registration Camps',
    description: 'Special camps for new voters opening this weekend across all districts.',
    date: '5 Hrs Ago',
    isUrgent: false,
  },
  {
    id: 'news3',
    title: 'Revised Polling Timings',
    description: 'Polling hours extended by 1 hour to ensure maximum participation.',
    date: '1 Day Ago',
    isUrgent: false,
  }
];
