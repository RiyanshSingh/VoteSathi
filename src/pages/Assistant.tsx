import { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { ChatBubble } from '../components/ChatBubble';
import { Chip } from '../components/Chip';
import { PageSkeleton } from '../components/SkeletonLoader';
import { Button } from '../components/Button';
import { Send } from 'lucide-react';
import { getLanguageLocale, useLanguage } from '../context/LanguageContext';
import { collection, doc, getDoc, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';


import { GoogleGenerativeAI } from "@google/generative-ai";

import { aiKnowledge } from '../data/aiKnowledge';
import { getCanonicalSuggestionChip } from '../lib/contentLocalization';
import { suggestionChips as fallbackChips, initialMessages } from '../data/mockData';

// AI model logic - Using client-side Gemini to support Spark plan (free)
const genAI = new GoogleGenerativeAI("AIzaSyA3JFwbsCZ8d-Wo4WB4LwPXuzmtxPuMDKo");

export const Assistant = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();
  const [messages, setMessages] = useState<any[]>([]);
  const [chips, setChips] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const hasSentInitialQuery = useRef(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isFirstLoad = useRef(true);

  const model = useMemo(() => genAI.getGenerativeModel({ 
    model: "gemini-flash-latest",
    systemInstruction: `You are Vote Sathi AI, a helpful and informative election consultant for Indian Elections.
    Your goal is to provide clear, accurate, and easy-to-understand answers.
    - Do not use conversational filler or introductory phrases.
    - Provide 3-4 well-explained bullet points with **bold** highlights.
    - Keep your answer under 150 words.
    - CRITICAL: You must ONLY answer questions related to the Indian Election Commission, voting process, political system, or election rules.
    - CRITICAL: If the user asks something completely unrelated to elections, say: "I can only answer questions related to the Indian election process."
    Always respond in: ${language}.`,
    generationConfig: {
      maxOutputTokens: 800,
      temperature: 0.1,
    }
  }), [language]);

  useEffect(() => {
    if (messages.length > 0) {
      if (isFirstLoad.current) {
        // Instant scroll on first load to show only the last messages
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
        isFirstLoad.current = false;
      } else {
        // Smooth scroll only for new messages or when typing
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages, isTyping]);

  useEffect(() => {
    const fetchChips = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'config', 'assistant'));
        if (docSnap.exists() && docSnap.data().suggestionChips?.length > 0) {
          setChips(docSnap.data().suggestionChips);
        } else {
          // Fallback to canonical chips from mockData
          setChips(fallbackChips);
        }
      } catch (error) {
        console.error("Error fetching chips:", error);
        // Always show chips even when offline or config is missing
        setChips(fallbackChips);
      }
    };
    fetchChips();

    if (user) {
      const q = query(
        collection(db, `users/${user.uid}/messages`),
        orderBy('createdAt', 'asc')
      );
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // If user has no message history, seed the welcome greeting
        if (msgs.length === 0) {
          const welcomeMsg = initialMessages[0];
          try {
            await addDoc(collection(db, `users/${user.uid}/messages`), {
              sender: 'assistant',
              text: welcomeMsg.text,
              createdAt: serverTimestamp(),
              timestamp: welcomeMsg.timestamp,
            });
          } catch (e) {
            console.error("Error seeding welcome message:", e);
            setLoading(false); // Ensure loader disappears even if seed fails
          }
        } else {
          setMessages(msgs);
          setLoading(false);
        }
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [user]);

  const getTimestamp = () =>
    new Date().toLocaleTimeString(getLanguageLocale(language), {
      hour: '2-digit',
      minute: '2-digit',
    });

  useEffect(() => {
    if (location.state?.query && !hasSentInitialQuery.current) {
      hasSentInitialQuery.current = true;
      const query = location.state.query;
      window.history.replaceState({}, document.title)
      setTimeout(() => {
        handleSendMessage(query);
      }, 500);
    }
  }, [location.state]);

  const handleSendMessage = async (text: string = inputValue) => {
    if (!text.trim() || !user) return;
    
    const userMessage = {
      sender: 'user',
      text: text,
      createdAt: serverTimestamp(),
      timestamp: getTimestamp(),
    };

    setInputValue('');
    await addDoc(collection(db, `users/${user.uid}/messages`), userMessage);

    setIsTyping(true);

    // 1. Check Local Knowledge Base First (Keyword Matching)
    const cleanText = text.trim().toLowerCase();
    const matchedTopic = aiKnowledge.find(item => {
      const langKeywords = item.keywords[language] || item.keywords['English'];
      return langKeywords.some(keyword => cleanText.includes(keyword.toLowerCase().trim()));
    });

    if (matchedTopic) {
      // Found a match in local KB
      setTimeout(async () => {
        const localAnswer = matchedTopic.answers[language] || matchedTopic.answers['English'];
        await addDoc(collection(db, `users/${user.uid}/messages`), {
          sender: 'assistant',
          text: localAnswer,
          createdAt: serverTimestamp(),
          timestamp: getTimestamp(),
        });
        setIsTyping(false);
      }, 1000);
      return;
    }

    // 2. Fallback to Client-side AI if no local match
    try {
      // Prepare history for multi-turn chat
      const history = messages
        .filter(m => m.text && typeof m.text === 'string' && m.text.trim().length > 0)
        .slice(-6)
        .map(m => ({
          role: (m.sender === 'user' ? 'user' : 'model') as "user" | "model",
          parts: [{ text: m.text }]
        }));

      const chat = model.startChat({ history });
      const result = await chat.sendMessage(text);
      const responseText = result.response.text();
      
      await addDoc(collection(db, `users/${user.uid}/messages`), {
        sender: 'assistant',
        text: responseText,
        createdAt: serverTimestamp(),
        timestamp: getTimestamp(),
      });
    } catch (error: any) {
      console.error("AI Error:", error);
      const fallbackMsg = t('assistant.connectionError');
        
      await addDoc(collection(db, `users/${user.uid}/messages`), {
        sender: 'assistant',
        text: fallbackMsg,
        createdAt: serverTimestamp(),
        timestamp: getTimestamp(),
      });
    } finally {
      setIsTyping(false);
    }
  };

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="h-full flex flex-col overflow-x-hidden relative">
      <Header title={t('assistant.title')} subtitle={t('assistant.subtitle')} />

      {/* Chat Area - Calculated height to fit perfectly between header and chips */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-6 py-4 flex flex-col pt-4 overflow-x-hidden"
      >
        {messages.map((msg) => (
          <ChatBubble 
            key={msg.id} 
            message={msg.text} 
            sender={msg.sender} 
            timestamp={msg.timestamp} 
          />
        ))}
        {isTyping && (
          <div className="flex gap-2 p-4 bg-neo-bg/50 rounded-2xl border-2 border-black/5 w-fit animate-pulse mb-4">
            <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}
        {/* Large spacer so messages always land above the floating chips */}
        <div ref={messagesEndRef} className="h-[200px] shrink-0" />
      </div>

      {/* Fixed Bottom Section (Stays above navbar - Fully Transparent) */}
      <div className="fixed bottom-[84px] inset-x-0 mx-auto w-full max-w-[1200px] min-[1200px]:max-w-[406px] pointer-events-none z-40 flex flex-col justify-end">
        <div className="bg-transparent pb-4">
          {/* Suggestions Bar */}
          <div className="px-6 py-3 overflow-x-auto no-scrollbar flex gap-3 pointer-events-auto">
            {chips.map((chip) => {
              const chipKey = getCanonicalSuggestionChip(chip);
              const localizedChip = t(chipKey);
              return (
                <Chip
                  key={chip}
                  label={localizedChip}
                  onClick={() => handleSendMessage(localizedChip)}
                />
              );
            })}
          </div>

          {/* Input Bar */}
          <div className="px-6 pb-2 pt-2 flex gap-3 items-center pointer-events-auto">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t('assistant.placeholder')} 
              className="flex-1 h-14 px-5 rounded-2xl bg-white border-3 border-black text-black font-black placeholder:text-gray-400 placeholder:font-black focus:outline-none focus:shadow-neo transition-all shadow-neo-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button 
              className="w-14 h-14 !p-0 rounded-2xl shrink-0 flex items-center justify-center bg-neo-yellow" 
              onClick={() => handleSendMessage()}
            >
              <Send size={24} strokeWidth={2.5} className="translate-x-[-1px] translate-y-[1px]" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
