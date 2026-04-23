# 🗳️ VoteSathi - Empowering Every Voter

[![Google Cloud](https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)](https://cloud.google.com/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**VoteSathi** is a state-of-the-art educational platform designed to simplify the Indian election process. Built with a focus on accessibility, security, and performance, it leverages advanced AI and Google Cloud infrastructure to provide real-time assistance and localized learning content for citizens.

---

## 🚀 Key Features

- **Dual-Core AI Assistant**: Powered by **Groq (Llama 3)** for ultra-fast responses, with a seamless fallback to **Google Gemini Pro** via the Google Generative AI SDK.
- **Interactive Learning Path**: Modular chapters covering everything from Voter Registration to Polling Day procedures.
- **Multi-Lingual Support**: Full localization in **English, Hindi, Bengali**, and more, ensuring inclusivity across India.
- **Progressive Web App (PWA)**: Installable on mobile and desktop for an app-like experience with offline capabilities.
- **Smart Bookmarks & Progress Tracking**: Persistent data storage across devices using Firebase.

---

## ☁️ Powered by Google Cloud & Firebase

VoteSathi utilizes the full power of the Google Cloud ecosystem to deliver a production-grade experience:

- **Google Cloud Run**: Containerized deployment for scalable, high-performance hosting.
- **Firebase Authentication**: Secure user login with Email/Password and Google OAuth.
- **Cloud Firestore**: Real-time NoSQL database for user profiles, messages, and bookmarks.
- **Firebase Analytics**: Real-time user engagement tracking and event logging.
- **Firebase Performance Monitoring**: Deep insights into app speed and network latency.
- **Google Generative AI (Gemini)**: Secondary AI engine for complex election-related queries.
- **Cloud Functions**: (Internal) Automated content synchronization and housekeeping.

---

## 🛡️ Security & Performance (AI-Hardened)

To achieve maximum efficiency and security, the following were implemented:

- **Content Security Policy (CSP)**: Strict headers to prevent XSS and unauthorized API injections.
- **Lazy Loading & Code Splitting**: Routes are loaded on-demand using `React.lazy` to minimize initial bundle size.
- **Error Boundaries**: Global crash prevention layer for a seamless user experience.
- **A11y (Accessibility)**: Full ARIA label coverage and semantic HTML for screen-reader compatibility.
- **Firestore Security Rules**: Strict attribute-based access control (ABAC) to protect user data.

---

## 🧪 Testing & Quality

- **Unit Testing**: Powered by **Vitest** for reliable and fast testing of localization and utility logic.
- **CI/CD Ready**: Configured for automated builds and validation.
- **JSDoc Documentation**: Comprehensive code documentation for maintainability.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Neo-Brutalist CSS (Vanilla)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Testing**: Vitest

---

## 📖 How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/RiyanshSingh/VoteSathi.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env`:
   ```env
   VITE_GEMINI_API_KEY=your_key
   VITE_GROQ_API_KEY=your_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

© 2026 VoteSathi Team. Dedicated to a more informed and democratic India. 🇮🇳
