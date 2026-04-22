const fs = require('fs');

const rawInput = `
📘 CHAPTER 1: Election Basics
🟩 Card 1: What is an election?
An election is a process where citizens choose their representatives by voting. The candidate with the most votes wins a seat in government.

🟩 Card 2: Why elections matter
Elections give ordinary citizens real power — the ability to replace leaders who don't serve them well. Without elections, there is no accountability in government.

🟩 Card 3: Who can vote?
Any Indian citizen aged 18 or above can vote, provided their name is on the voter list. There are no income, education, or gender restrictions.

---

📘 CHAPTER 2: Voter Registration
🟩 Card 1: Why register early?
Registration must happen before election day — you cannot register on the spot. Check your name on the voter list weeks in advance to avoid missing out.

🟩 Card 2: How to register
Register online via the Voter Helpline app or voterportal.eci.gov.in, or fill out Form 6 offline at your local electoral office.

🟩 Card 3: Required documents
You need identity proof and address proof. Aadhaar card, passport, or utility bills are commonly accepted. Documents confirm your age, identity, and residence.

---

📘 CHAPTER 3: Election Timeline
🟩 Card 1: Election announcement
The Election Commission announces election dates along with the schedule for nominations, campaigning, voting, and result counting.

🟩 Card 2: Nomination phase
Candidates submit forms to officially enter the race. Documents are verified and only eligible candidates appear on the final ballot.

🟩 Card 3: Campaign period
Candidates present their ideas through rallies, speeches, ads, and social media. Voters use this time to compare candidates before deciding.

🟩 Card 4: Voting day
Voters visit their assigned polling booth, verify their identity, and cast their vote using an Electronic Voting Machine (EVM).

🟩 Card 5: Counting and results
All votes are counted after polls close. The candidate with the highest votes wins. Official results are announced by the Election Commission.

---

📘 CHAPTER 4: Voting Day Process
🟩 Card 1: Before you go
Find your polling booth on voterportal.eci.gov.in using your voter ID number. Keep your ID ready and visit in the morning to avoid long queues.

🟩 Card 2: At the polling booth
Officials verify your identity and find your name in the voter list. Once confirmed, you are given a slip and allowed to proceed to the EVM.

🟩 Card 3: Casting your vote
Press the button next to your chosen candidate on the EVM. A beep confirms your vote is recorded. The whole process takes less than a minute.

🟩 Card 4: After voting
An indelible ink mark is applied to your left index finger. This mark prevents anyone from voting more than once during that election.

---

📘 CHAPTER 5: After the Election
🟩 Card 1: Government formation
The party winning a majority of seats forms the government. If no party wins alone, parties may join in a coalition to reach the majority mark.

🟩 Card 2: Role of elected leaders
Elected representatives make laws, approve budgets, and raise citizens' issues in Parliament or the Assembly. Voters can hold them accountable in the next election.

---

📘 CHAPTER 6: Types of Elections
🟩 Card 1: Lok Sabha elections
Held every 5 years to elect 543 Members of Parliament. The party winning a majority forms the central government and its leader becomes Prime Minister.

🟩 Card 2: State Assembly elections
Each state elects its own Legislative Assembly (MLAs) separately. The majority party forms the state government, and its leader becomes Chief Minister.

🟩 Card 3: Local elections
Citizens elect local representatives for municipalities, panchayats, and corporations — the people who directly manage roads, water, sanitation, and local welfare.

---

📘 CHAPTER 7: EVM & Voting Technology
🟩 Card 1: What is an EVM?
An Electronic Voting Machine records votes digitally. It is faster and more accurate than paper ballots, and cannot be tampered with once sealed.

🟩 Card 2: How EVM works
Press the button next to your chosen candidate. The machine records one vote and emits a beep. Only one vote per voter is allowed per session.

🟩 Card 3: VVPAT system
VVPAT (Voter Verifiable Paper Audit Trail) prints a slip showing your chosen candidate for a few seconds. It lets you confirm your vote before the slip drops into a sealed box.

---

📘 CHAPTER 8: Important Terms
🟩 Card 1: Constituency
A constituency is a defined geographic area that elects one representative. India has 543 Lok Sabha constituencies, each sending one MP to Parliament.

🟩 Card 2: Candidate
A candidate is a person contesting an election. They may represent a political party or stand independently, and must meet eligibility criteria to file a nomination.

🟩 Card 3: Majority
A party needs 272 out of 543 seats for a Lok Sabha majority. Without majority, no single party can form a stable government alone.

---

📘 CHAPTER 9: Voter Rights & Responsibilities
🟩 Card 1: Your right to vote
Voting is a constitutional right for every eligible citizen. No one — including employers or family members — can legally stop you or tell you who to vote for.

🟩 Card 2: Vote with awareness
Research candidates before voting — check their past record, promises, and background. An informed vote has more impact than a vote based on rumour or pressure.

🟩 Card 3: Secret ballot
Your vote is completely private. No official, party worker, or family member has the right to know who you voted for. This protects your freedom to vote honestly.

---

📘 CHAPTER 10: Special Cases
🟩 Card 1: NOTA option
If you disapprove of all candidates, press NOTA (None of the Above) on the EVM. It registers your dissatisfaction officially, though it does not eliminate any candidate.

🟩 Card 2: Voting without voter ID
If you don't have a voter ID card, you can vote using 12 other approved IDs including Aadhaar, passport, or PAN card — as long as your name is on the voter list.

🟩 Card 3: Accessible voting
Senior citizens (80+), persons with disabilities, and certain essential workers may use postal ballots or get priority access at booths — apply before election day.

---

📘 CHAPTER 11: Real-Life Scenarios
🟩 Card 1: First-time voter
Check your name on the voter list before election day at voterportal.eci.gov.in. Carry a valid ID, follow booth instructions, and vote with confidence.

🟩 Card 2: Name not on voter list
If your name is missing at the booth, you cannot vote that day. Always verify your details online at least a week before election day.

🟩 Card 3: Forgot voter ID
If you forget your voter ID, use Aadhaar, PAN card, passport, or 9 other approved identity documents. Your name must still be present in the voter list.

🟩 Card 4: Long queue at booth
Queues are common at peak hours. Arrive early in the morning or after 2 PM to find shorter lines. You cannot be turned away if you arrive before closing time.

🟩 Card 5: Wrong polling booth
You can only vote at your assigned booth — going to a different one means you cannot vote. Always check your booth address on the voter portal beforehand.

---

📘 CHAPTER 12: Do's & Don'ts
🟩 Card 1: Do — carry valid ID
Carry an approved photo ID to the polling booth. Without identity verification, officials cannot allow you to vote even if your name is on the list.

🟩 Card 2: Do — follow instructions
Follow the directions of polling officials without arguing. They are there to ensure a fair process for everyone. Cooperate and the experience will be smooth.

🟩 Card 3: Do — vote freely
Choose your candidate based on your own judgment. If anyone pressures or bribes you to vote a certain way, you can report it to the Election Commission.

🟩 Card 4: Don't — bring a phone inside
Mobile phones are not allowed inside the voting compartment. This prevents vote photography, which could be used to prove how you voted and compromise secrecy.

🟩 Card 5: Don't — reveal your vote
Keep your vote private — even after casting it. This protects you from potential pressure or retaliation and upholds the integrity of the secret ballot system.

🟩 Card 6: Don't — try to vote twice
The ink mark system and voter list checks make double voting impossible. Attempting it is a criminal offence under the Representation of the People Act.

---

📘 CHAPTER 13: Model Code of Conduct
🟩 Card 1: What is the MCC?
The Model Code of Conduct is a set of rules issued by the Election Commission. It comes into effect the moment election dates are announced and ends when results are declared.

🟩 Card 2: Who must follow it?
All political parties, candidates, and the ruling government must follow the MCC. It ensures no party misuses government power or resources to gain an unfair advantage.

🟩 Card 3: What is banned?
During MCC, parties cannot announce new schemes, use government vehicles for campaigns, or bribe voters. Inflammatory speeches targeting religion or caste are strictly prohibited.

🟩 Card 4: Why it matters
Without the MCC, ruling parties could spend public money on announcements just before elections to influence voters. The code creates a level playing field for all candidates.

---

📘 CHAPTER 14: Check & Correct Your Voter Details
🟩 Card 1: Check your name
Visit voterportal.eci.gov.in or use the Voter Helpline app to search your name. You will need your voter ID number or basic details like name and date of birth.

🟩 Card 2: Correct a mistake
If your name is misspelled or date of birth is wrong, fill Form 8 online or at your local electoral office. Corrections must be submitted well before election dates are announced.

🟩 Card 3: Update your address
Moved to a new area? Submit Form 8A to shift your voter registration to your new address. This ensures you vote at the correct polling booth near your home.

🟩 Card 4: Download your e-EPIC
e-EPIC is a digital voter ID card in PDF format. Download it free from voterportal.eci.gov.in and save it on your phone — it is valid proof of identity at polling booths.

---

📘 CHAPTER 15: Political Parties & Symbols
🟩 Card 1: What is a political party?
A political party is a group of people with shared beliefs who contest elections together. Parties build a common agenda and field candidates across multiple constituencies.

🟩 Card 2: National vs state parties
A party is recognized as national if it wins a certain vote share across four or more states. State parties are recognized within one state. Recognition affects funding and ballot symbols.

🟩 Card 3: What are ballot symbols?
Every party and independent candidate is assigned a unique symbol on the EVM. Symbols help voters — especially those unfamiliar with names — identify their chosen candidate easily.

🟩 Card 4: Independent candidates
A candidate not belonging to any party is called an independent. They are assigned a symbol by the Election Commission from a reserved list of free symbols.

---

📘 CHAPTER 16: Who Runs Elections? (ECI)
🟩 Card 1: What is the ECI?
The Election Commission of India is a constitutional body that oversees all elections in the country. It was established in 1950 and operates independently of the government.

🟩 Card 2: Who leads the ECI?
The ECI is led by the Chief Election Commissioner and two Election Commissioners. They are appointed by the President and cannot be removed easily, ensuring their independence.

🟩 Card 3: What does ECI do?
ECI announces election dates, enforces the Model Code of Conduct, manages voter registration, deploys security forces, and certifies final election results across India.

🟩 Card 4: How ECI stays independent
The Chief Election Commissioner can only be removed through a process similar to removing a Supreme Court judge. This protects the ECI from political pressure or interference.

---

📘 CHAPTER 17: Election Complaints & Grievances
🟩 Card 1: Voter Helpline 1950
Call 1950 (toll-free) to report problems with voter registration, missing names, or election-related issues. The helpline is active before and during elections across all states.

🟩 Card 2: cVIGIL app
Use the cVIGIL app to report election rule violations like bribery, illegal banners, or use of government vehicles. Upload a photo or video — the team must respond within 100 minutes.

🟩 Card 3: Report bribery
If someone offers you cash, gifts, or alcohol to vote for a candidate, report it immediately via cVIGIL or call 1950. Accepting a bribe is also an offence under election law.

🟩 Card 4: Booth-level complaints
If you face problems at the polling booth — harassment, impersonation, or being turned away wrongly — contact the Presiding Officer at the booth or call 1950 immediately.

---

📘 CHAPTER 18: By-elections & Re-elections
🟩 Card 1: What is a by-election?
A by-election is held when a seat becomes vacant mid-term due to a member's death, resignation, or disqualification. Only that specific constituency votes — not the entire state or country.

🟩 Card 2: When is a re-election held?
A re-election is ordered by the Election Commission when voting is disrupted by violence, rigging, or technical failure. The affected booth or constituency revotes on a new date.

🟩 Card 3: Does it change the government?
A by-election result can shift the balance of power if the ruling party has a thin majority. Winning or losing a single seat can sometimes decide who controls the government.

---

📘 CHAPTER 19: Youth & First-Time Voters
🟩 Card 1: Register at 18
You become eligible to vote the day you turn 18. Register on voterportal.eci.gov.in using your Aadhaar and a recent photo. Registration takes a few minutes and is completely free.

🟩 Card 2: Four registration windows
The ECI now allows voter registration four times a year — on January 1, April 1, July 1, and October 1 as qualifying dates. You no longer have to wait for January alone.

🟩 Card 3: Why youth votes matter
India has over 18 crore voters aged 18–29. When young people vote in large numbers, candidates must address issues like jobs, education, and climate — not just older demographics.

🟩 Card 4: Spread the word
Help friends and family register before deadlines. Share the Voter Helpline number 1950 and the voter portal link. One conversation can bring several new voters into the process.

---

📘 CHAPTER 20: Common Myths About Voting
🟩 Card 1: Myth: My vote doesn't matter
Several Indian elections have been decided by margins of under 500 votes. In a close race, every single vote counts. Staying home is effectively a vote for whoever wins.

🟩 Card 2: Myth: Voting is rigged anyway
EVMs are sealed, tamper-proof, and not connected to any network. VVPAT paper slips allow physical verification. Multiple parties deploy agents at every counting table.

🟩 Card 3: Myth: NOTA removes the candidate
NOTA only records your dissatisfaction — it does not disqualify anyone. Even if NOTA gets the most votes, the candidate with the next highest votes still wins the seat.

🟩 Card 4: Myth: I need voter ID to register
You do not need a voter ID to register — you need Aadhaar or another ID proof to apply. The voter ID card is issued to you after your registration is approved.

🟩 Card 5: Myth: Voting takes too long
The actual voting process at the booth takes under 5 minutes once you reach the EVM. Queues at popular booths can be avoided by going early or checking off-peak hours.
`;

function parse() {
  const lines = rawInput.split('\n');
  const chapters = [];
  let currentChapter = null;
  let currentCard = null;

  for (let line of lines) {
    line = line.trim();
    if (!line || line === '---') continue;

    if (line.startsWith('📘 CHAPTER')) {
      const title = line.split(': ')[1];
      currentChapter = { title, cards: [] };
      chapters.push(currentChapter);
    } else if (line.startsWith('🟩 Card')) {
      const cardTitle = line.split(': ')[1];
      currentCard = { title: cardTitle, content: [] };
      currentChapter.cards.push(currentCard);
    } else {
      if (currentCard) {
        currentCard.content.push(line);
      }
    }
  }

  // Topic mapping
  const topicMap = {
    'process': [1, 3, 5, 6, 8, 13, 15, 16, 18],
    'registration': [2, 14, 19],
    'voting-day': [4, 7, 10, 11, 12],
    'results': [9, 17, 20]
  };

  const steps = [];
  let idCounter = 1;
  const translations = {};

  for (const topicId of Object.keys(topicMap)) {
    const chapterNums = topicMap[topicId];
    let stepNumber = 1;

    for (const num of chapterNums) {
      const chapter = chapters[num - 1];
      if (!chapter) continue;
      
      const stepId = `step_${idCounter++}`;
      const stepTitleKey = `step.${stepId}.title`;
      
      // Use first card as description
      const descKey = `step.${stepId}.desc`;
      
      const content = chapter.cards.map(c => c.content.join(' '));
      const contentKeys = chapter.cards.map((_, i) => `step.${stepId}.page${i+1}`);

      steps.push({
        id: stepId,
        topicId: topicId,
        stepNumber: stepNumber++,
        title: chapter.title,
        description: content[0],
        titleKey: stepTitleKey,
        descriptionKey: descKey,
        content: content,
        contentKeys: contentKeys
      });

      translations[stepTitleKey] = chapter.title;
      translations[descKey] = content[0];
      content.forEach((txt, i) => {
        translations[contentKeys[i]] = txt;
      });
    }
  }

  fs.writeFileSync('parsed_steps.json', JSON.stringify({steps, translations}, null, 2));
}
parse();
