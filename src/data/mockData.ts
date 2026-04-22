export interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  progress: number;
}

export interface Step {
  id: string;
  topicId: string;
  stepNumber: number;
  title: string;
  description: string;
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
    icon: 'Briefcase',
    color: 'bg-neo-green',
    progress: 0,
  },
  {
    id: 'registration',
    title: 'Voter Registration',
    description: 'Step-by-step guide to get your Voter ID.',
    icon: 'UserPlus',
    color: 'bg-neo-blue',
    progress: 0,
  },
  {
    id: 'voting-day',
    title: 'Voting Day',
    description: 'Everything you need to know at the booth.',
    icon: 'Calendar',
    color: 'bg-neo-yellow',
    progress: 0,
  },
  {
    id: 'results',
    title: 'Results & Counting',
    description: 'How your vote turns into a result.',
    icon: 'BarChart3',
    color: 'bg-neo-purple',
    progress: 0,
  },
];

export const steps: Step[] = [
  // --- Election Process ---
  {
    id: 'proc1',
    topicId: 'process',
    stepNumber: 1,
    title: 'Election Announcement',
    description: 'The ECI announces the schedule, implementing the Model Code of Conduct (MCC) immediately to ensure fair play.',
  },
  {
    id: 'proc2',
    topicId: 'process',
    stepNumber: 2,
    title: 'Nomination Phase',
    description: 'Candidates file nominations and security deposits. Officials then scrutinize papers to ensure eligibility.',
  },
  {
    id: 'proc3',
    topicId: 'process',
    stepNumber: 3,
    title: 'Campaigning',
    description: 'Parties release manifestos and hold rallies. Campaigning must stop 48 hours before the polling ends.',
  },
  {
    id: 'proc4',
    topicId: 'process',
    stepNumber: 4,
    title: 'Polling Day',
    description: 'Voters across the constituency visit designated booths to cast their secret ballots using EVMs.',
  },
  {
    id: 'proc5',
    topicId: 'process',
    stepNumber: 5,
    title: 'EVM Sealing',
    description: 'After polling, EVMs and VVPATs are sealed in the presence of polling agents and moved to strongrooms.',
  },
  {
    id: 'proc6',
    topicId: 'process',
    stepNumber: 6,
    title: 'Counting & Declaration',
    description: 'Votes are counted on a scheduled day. The candidate with the highest votes is declared the winner.',
  },

  // --- Voter Registration ---
  {
    id: 'reg1',
    topicId: 'registration',
    stepNumber: 1,
    title: 'Check Eligibility',
    description: 'You must be an Indian citizen, 18+ years old, and a resident of the polling area where you want to register.',
  },
  {
    id: 'reg2',
    topicId: 'registration',
    stepNumber: 2,
    title: 'Online Form 6',
    description: 'Visit the Voter Service Portal (voters.eci.gov.in) and fill Form 6 for new registration.',
  },
  {
    id: 'reg3',
    topicId: 'registration',
    stepNumber: 3,
    title: 'Document Upload',
    description: 'Upload a recent passport photo, age proof (Aadhaar/10th Cert), and address proof (Utility bill/Passport).',
  },
  {
    id: 'reg4',
    topicId: 'registration',
    stepNumber: 4,
    title: 'Field Verification',
    description: 'A Booth Level Officer (BLO) may visit your home to verify the details provided in your application.',
  },
  {
    id: 'reg5',
    topicId: 'registration',
    stepNumber: 5,
    title: 'EPIC Generation',
    description: 'Once approved, your Electoral Photo Identity Card (EPIC) is generated and a unique Voter ID number is assigned.',
  },
  {
    id: 'reg6',
    topicId: 'registration',
    stepNumber: 6,
    title: 'Card Delivery',
    description: 'Your physical Voter ID card is sent to your registered address via Speed Post free of cost.',
  },

  // --- Voting Day ---
  {
    id: 'vote1',
    topicId: 'voting-day',
    stepNumber: 1,
    title: 'Find Your Booth',
    description: 'Check your name in the voter list online to find your specific Polling Station and Part Number.',
  },
  {
    id: 'vote2',
    topicId: 'voting-day',
    stepNumber: 2,
    title: 'Entry & Queue',
    description: 'Reach the booth with your EPIC or any of the 12 alternative valid photo ID proofs.',
  },
  {
    id: 'vote3',
    topicId: 'voting-day',
    stepNumber: 3,
    title: 'First Polling Officer',
    description: 'The officer checks your name in the electoral roll and verifies your identity document.',
  },
  {
    id: 'vote4',
    topicId: 'voting-day',
    stepNumber: 4,
    title: 'Inking & Slip',
    description: 'The second officer marks your finger with indelible ink, records your signature, and gives you a signed slip.',
  },
  {
    id: 'vote5',
    topicId: 'voting-day',
    stepNumber: 5,
    title: 'Casting the Vote',
    description: 'Go to the voting compartment, press the blue button next to your candidate on the EVM.',
  },
  {
    id: 'vote6',
    topicId: 'voting-day',
    stepNumber: 6,
    title: 'VVPAT Verification',
    description: 'Check the VVPAT glass. A slip showing your candidate will be visible for 7 seconds before dropping.',
  },

  // --- Results & Counting ---
  {
    id: 'res1',
    topicId: 'results',
    stepNumber: 1,
    title: 'Strongroom Security',
    description: 'EVMs are kept in double-locked strongrooms with 24/7 CCTV and multi-tier armed security until counting day.',
  },
  {
    id: 'res2',
    topicId: 'results',
    stepNumber: 2,
    title: 'Counting Center Setup',
    description: 'Counting happens at designated centers under strict supervision of the Returning Officer (RO).',
  },
  {
    id: 'res3',
    topicId: 'results',
    stepNumber: 3,
    title: 'Round-wise Counting',
    description: 'EVMs are opened round-by-round. Results for each machine are recorded in Form 17C.',
  },
  {
    id: 'res4',
    topicId: 'results',
    stepNumber: 4,
    title: 'VVPAT Slip Audit',
    description: 'Mandatory physical counting of VVPAT slips from 5 randomly selected polling stations per constituency.',
  },
  {
    id: 'res5',
    topicId: 'results',
    stepNumber: 5,
    title: 'Final Tabulation',
    description: 'The RO compiles round-wise results. Any discrepancies are resolved before the final announcement.',
  },
  {
    id: 'res6',
    topicId: 'results',
    stepNumber: 6,
    title: 'Certificate of Election',
    description: 'The winning candidate is issued a "Certificate of Election" (Form 21C/21D) by the RO.',
  },
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
