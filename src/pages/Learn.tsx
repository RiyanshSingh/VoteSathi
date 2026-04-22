import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { SectionWrapper } from '../components/SectionWrapper';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { ChevronLeft, ChevronRight, Volume2, Square, Loader2, PlayCircle, BookOpen } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { seedDatabase } from '../lib/db-seed';
import { useAuth } from '../context/AuthContext';
import type { Step, Topic } from '../data/mockData';

export const Learn = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const topicId = searchParams.get('topic') || 'process';
  const initialStep = parseInt(searchParams.get('step') || '0');
  
  const [filteredSteps, setFilteredSteps] = useState<Step[]>([]);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStep);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>(searchParams.has('step') ? 'detail' : 'list');

  // Hook: Update User Progress in Firestore
  useEffect(() => {
    const saveProgress = async () => {
      if (user && topic && viewMode === 'detail' && totalSteps > 0) {
        const progress = Math.round(((currentStepIndex + 1) / totalSteps) * 100);
        const progressRef = doc(db, 'userProgress', `${user.uid}_${topicId}`);
        await setDoc(progressRef, {
          uid: user.uid,
          topicId: topicId,
          topicTitle: topic.title,
          topicColor: topic.color,
          lastStepIndex: currentStepIndex,
          lastStepTitle: currentStep.title,
          progress: progress,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
    };
    saveProgress();
  }, [currentStepIndex, topic, viewMode, user]);

  // Helper for manual seeding
  const handleSeed = async () => {
    setLoading(true);
    await seedDatabase();
    window.location.reload();
  };

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Topic info
        const topicDoc = await getDoc(doc(db, 'topics', topicId));
        if (topicDoc.exists()) {
          setTopic(topicDoc.data() as Topic);
        }

        // Fetch Steps
        const snap = await getDocs(collection(db, 'steps'));
        const allSteps = snap.docs.map(doc => doc.data() as Step);
        const data = allSteps
          .filter(s => s.topicId === topicId)
          .sort((a, b) => a.stepNumber - b.stepNumber);
        
        setFilteredSteps(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [topicId]);

  // Sync state with URL
  useEffect(() => {
    if (viewMode === 'detail') {
      setSearchParams({ topic: topicId, step: currentStepIndex.toString() });
    } else {
      setSearchParams({ topic: topicId });
    }
  }, [viewMode, currentStepIndex]);

  // Audio Cleanup
  useEffect(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [currentStepIndex, topicId, viewMode]);

  const currentStep = filteredSteps[currentStepIndex];
  const totalSteps = filteredSteps.length;
  const progressPercent = totalSteps > 0 ? ((currentStepIndex + 1) / totalSteps) * 100 : 0;

  const toggleAudio = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else if (currentStep) {
      const textToSpeak = `${currentStep.title}. ${currentStep.description}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.startsWith('en'));
      if (preferredVoice) utterance.voice = preferredVoice;
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-neo-bg flex items-center justify-center">
        <Loader2 className="animate-spin text-black" size={48} strokeWidth={3} />
      </div>
    );
  }

  // --- LIST VIEW ---
  if (viewMode === 'list') {
    return (
      <div className="bg-neo-bg min-h-full pb-10">
        <Header 
          title={topic?.title ? t(topic.title) : t('nav.learn')} 
          subtitle={t('learn.selectStep')}
          showBack 
          onBack={() => navigate('/')} 
        />
        
        <SectionWrapper title={t('learn.chapterList')}>
          <div className="flex flex-col gap-4">
            {filteredSteps.map((step, index) => (
              <Card 
                key={step.id} 
                onClick={() => {
                  setCurrentStepIndex(index);
                  setViewMode('detail');
                }}
                className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 active:translate-x-1 active:translate-y-1 transition-all"
              >
                <div className="w-12 h-12 flex-shrink-0 bg-neo-purple border-3 border-black rounded-xl shadow-neo-sm flex items-center justify-center font-black text-xl">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-black uppercase tracking-tight text-lg">{t(step.title)}</h3>
                  <p className="text-xs font-bold text-black/60 line-clamp-1">{t(step.description)}</p>
                </div>
                <PlayCircle className="text-black/20 group-hover:text-black transition-colors" />
              </Card>
            ))}
            
            {filteredSteps.length === 0 && (
              <Card variant="outline" className="p-8 text-center bg-white">
                <p className="text-gray-500 font-bold mb-4">{t('learn.noContent')}</p>
                <Button onClick={handleSeed} className="bg-neo-green">{t('learn.seedDb')}</Button>
              </Card>
            )}
          </div>
        </SectionWrapper>
        
        {filteredSteps.length > 0 && (
          <div className="px-6 mt-4">
            <Button fullWidth onClick={() => {
              setCurrentStepIndex(0);
              setViewMode('detail');
            }} className="bg-neo-green">
              {t('learn.startPath')}
            </Button>
          </div>
        )}
      </div>
    );
  }

  // --- DETAIL VIEW ---
  if (!currentStep) return null;

  return (
    <div className="bg-neo-bg min-h-full flex flex-col">
      <Header 
        title={topic?.title ? t(topic.title) : t('nav.learn')} 
        showBack 
        onBack={() => setViewMode('list')} 
      />

      <div className="px-6 py-2">
        <ProgressBar progress={progressPercent} height="h-2" />
      </div>

      <SectionWrapper className="flex-1 flex flex-col justify-center py-8">
        <div className="text-center mb-6">
          <span className="inline-block px-3 py-1 rounded-full bg-neo-pink text-black border-2 border-black shadow-neo-sm text-[10px] font-black uppercase tracking-widest mb-4">
            {t('learn.step')} {currentStepIndex + 1} / {totalSteps}
          </span>
          <h2 className="text-3xl font-black text-black uppercase tracking-tight leading-tight">
            {t(currentStep.title)}
          </h2>
        </div>

        <Card variant="gradient" className="py-12 px-8 flex flex-col items-center text-center relative min-h-[300px] justify-center">
          <button 
            onClick={toggleAudio}
            className="absolute top-4 right-4 w-10 h-10 bg-white border-2 border-black rounded-xl flex items-center justify-center text-black shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            {isPlaying ? <Square size={16} fill="currentColor" /> : <Volume2 size={18} strokeWidth={3} />}
          </button>
          
          <div className="w-16 h-16 bg-white border-3 border-black rounded-2xl flex items-center justify-center text-black shadow-neo mb-6">
            <span className="text-2xl font-black">{currentStepIndex + 1}</span>
          </div>
          <p className="text-xl text-black leading-relaxed font-bold">
            {t(currentStep.description)}
          </p>
        </Card>

        <div className="mt-auto pt-8 flex gap-4">
          <Button 
            variant="secondary" 
            fullWidth 
            onClick={() => {
              if (currentStepIndex > 0) setCurrentStepIndex(currentStepIndex - 1);
            }}
            disabled={currentStepIndex === 0}
            className={currentStepIndex === 0 ? 'opacity-30' : ''}
          >
            <ChevronLeft size={20} />
            {t('learn.prev')}
          </Button>
          <Button 
            fullWidth 
            onClick={() => {
              if (currentStepIndex < totalSteps - 1) {
                setCurrentStepIndex(currentStepIndex + 1);
              } else {
                setViewMode('list');
              }
            }}
            className="bg-black text-white"
          >
            {currentStepIndex === totalSteps - 1 ? t('learn.finish') : t('learn.next')}
            <ChevronRight size={20} />
          </Button>
        </div>
        
        <button 
          onClick={() => setViewMode('list')}
          className="mt-6 text-xs font-black uppercase tracking-widest text-black/40 hover:text-black flex items-center justify-center gap-2"
        >
          <BookOpen size={14} />
          {t('learn.viewChapters')}
        </button>
      </SectionWrapper>
    </div>
  );
};
