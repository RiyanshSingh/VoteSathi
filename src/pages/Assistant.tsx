import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { ChatBubble } from '../components/ChatBubble';
import { Chip } from '../components/Chip';
import { Button } from '../components/Button';
import { Send, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { collection, doc, getDoc, setDoc, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

import { GoogleGenerativeAI } from "@google/generative-ai";

import { aiKnowledge } from '../data/aiKnowledge';

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

  // Initialize Google AI with the same API key
  const genAI = new GoogleGenerativeAI("AIzaSyDsZ2UXZ0xsMY2Ij6PlSDNNk0g78dPBDS4");
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: `You are Vote Sathi AI, an election expert. Response language: ${language}. Current language context: ${language}.`
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const fetchChips = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'config', 'assistant'));
        if (docSnap.exists()) {
          setChips(docSnap.data().suggestionChips);
        }
      } catch (error) {
        console.error("Error fetching chips:", error);
      }
    };
    fetchChips();

    if (user) {
      const q = query(
        collection(db, `users/${user.uid}/messages`),
        orderBy('createdAt', 'asc')
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMessages(msgs);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

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
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setInputValue('');
    await addDoc(collection(db, `users/${user.uid}/messages`), userMessage);

    setIsTyping(true);

    // 1. Check Local Knowledge Base First (Keyword Matching)
    const lowerText = text.toLowerCase();
    const matchedTopic = aiKnowledge.find(item => {
      const langKeywords = item.keywords[language] || item.keywords['English'];
      return langKeywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
    });

    if (matchedTopic) {
      // Found a match in local KB
      setTimeout(async () => {
        const localAnswer = matchedTopic.answers[language] || matchedTopic.answers['English'];
        await addDoc(collection(db, `users/${user.uid}/messages`), {
          sender: 'assistant',
          text: localAnswer,
          createdAt: serverTimestamp(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
        setIsTyping(false);
      }, 1000);
      return;
    }

    // 2. Fallback to AI API if no local match
    try {
      // Prepare history for multi-turn chat (simple version)
      const history = messages.slice(-10).map(m => ({
        role: (m.sender === 'user' ? 'user' : 'model') as "user" | "model",
        parts: [{ text: m.text }]
      }));

      const chat = model.startChat({ history });
      const result = await chat.sendMessageStream(text);
      
      let fullResponse = '';
      const botMsgRef = await addDoc(collection(db, `users/${user.uid}/messages`), {
        sender: 'assistant',
        text: '',
        createdAt: serverTimestamp(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullResponse += chunkText;
        // Update the document in Firestore with the partial response
        await setDoc(botMsgRef, { text: fullResponse }, { merge: true });
      }
    } catch (error: any) {
      console.error("AI Error:", error);
      const fallbackMsg = language === 'Hindi (हिंदी)' 
        ? "माफी चाहता हूँ, मैं अभी कनेक्ट नहीं कर पा रहा हूँ। कृपया दोबारा प्रयास करें!"
        : "I'm having trouble connecting right now. Please try again in a moment!";
        
      await addDoc(collection(db, `users/${user.uid}/messages`), {
        sender: 'assistant',
        text: fallbackMsg,
        createdAt: serverTimestamp(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    } finally {
      setIsTyping(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-neo-bg flex items-center justify-center">
        <Loader2 className="animate-spin text-black" size={48} strokeWidth={3} />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden relative">
      <Header title={t('assistant.title')} subtitle={t('assistant.subtitle')} />

      {/* Chat Area - Calculated height to fit perfectly between header and chips */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-6 py-4 flex flex-col pt-4 overflow-hidden"
        style={{ height: 'calc(100vh - 360px)' }}
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
      <div className="fixed bottom-[84px] left-1/2 -translate-x-1/2 w-full max-w-[1200px] min-[1200px]:max-w-[406px] pointer-events-none z-40 flex flex-col justify-end">
        <div className="bg-transparent pb-4">
          {/* Suggestions Bar */}
          <div className="px-6 py-3 overflow-x-auto no-scrollbar flex gap-3 pointer-events-auto">
            {chips.map((chip) => (
              <Chip key={chip} label={t(chip)} onClick={() => handleSendMessage(chip)} />
            ))}
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
