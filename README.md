# Vote Sathi 🇮🇳
**Empowering Indian Citizens through Election Education & AI**

Vote Sathi is a premium, mobile-first web application designed to bridge the gap between Indian citizens and the electoral process. By combining modern design aesthetics with cutting-edge AI, it provides a seamless experience for voter registration, education, and real-time assistance.

---

## 🚀 Live Demo
- **Cloud Run URL:** [https://votesathi-910017619357.asia-south1.run.app](https://votesathi-910017619357.asia-south1.run.app)
- **Firebase Hosting:** [https://votesathi.web.app](https://votesathi.web.app)

---

## 🎯 Chosen Vertical
**Civic Engagement & Election Education**
The project focuses on making complex election procedures accessible to every citizen, regardless of their tech-savviness or language barriers.

---

## 🛠️ Tech Stack & Google Services
This project leverages the power of Google Cloud and Firebase to ensure high performance, security, and scalability:

- **Google Gemini AI (Pro 1.5):** Powers the "AI Assistant" to provide accurate, hallucination-free answers about Indian election laws, procedures, and dates.
- **Firebase Authentication:** Secure user onboarding using Google Sign-In.
- **Cloud Firestore:** Real-time database for managing user profiles and tracking educational progress.
- **Google Cloud Run:** Containerized deployment for the application frontend, ensuring high availability and global scalability.
- **Firebase Hosting:** Global CDN for fast static asset delivery.
- **React + Vite:** Modern frontend framework for a lightning-fast user experience.

---

## 💡 Approach and Logic
### 1. User-Centric Design (Neo-Brutalist)
We adopted a high-contrast **Neo-Brutalist** design system. Why? Because it stands out, is highly accessible due to bold outlines and clear typography, and provides a "premium" feel that builds trust with users.

### 2. Multi-Language Localization
Recognizing India's diversity, the app supports **English, Hindi, and Bengali**. The logic uses a custom `LanguageContext` to manage translations across the entire application state dynamically.

### 3. Progressive Learning Modules
Instead of overwhelming users with data, we broke down election procedures into small, manageable modules. Users can track their progress through a custom-built progress tracking system synced with Firestore.

### 4. AI-Driven Assistance
Instead of a static FAQ, the Gemini-powered assistant acts as a real-time helper. We implemented strict system instructions to ensure the AI remains focused solely on Indian election topics, preventing off-topic hallucinations.

---

## 🛡️ Security & Quality
- **Responsible AI:** Strict system prompts are used with Gemini to ensure ethical and accurate information sharing.
- **Clean Architecture:** Modular component structure for easy maintenance and scalability.
- **Efficiency:** Optimized bundle sizes and lazy-loading components to ensure the app runs smoothly even on slow networks.
- **Accessibility:** High-contrast colors and semantic HTML to ensure usability for everyone.

---

## 📋 Assumptions Made
- Users have access to basic internet connectivity.
- External ECI service links provided are stable and officially maintained.
- Users are accessing the application primarily via mobile devices for the best experience.

---

## 🏗️ How to Run Locally
1. Clone the repo: `git clone https://github.com/RiyanshSingh/VoteSathi.git`
2. Install dependencies: `npm install`
3. Add your Firebase & Gemini API keys in `.env`
4. Start development server: `npm run dev`

---

Created with ❤️ for the **Google Cloud & Hack2Skill Hackathon**.
