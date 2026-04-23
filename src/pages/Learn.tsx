import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { SectionWrapper } from '../components/SectionWrapper';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { ChevronLeft, ChevronRight, Volume2, Square, PlayCircle, BookOpen, Bookmark } from 'lucide-react';
import { PageSkeleton } from '../components/SkeletonLoader';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getLanguageLocale, useLanguage } from '../context/LanguageContext';
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { seedDatabase } from '../lib/db-seed';
import { useAuth } from '../context/AuthContext';
import type { Step, Topic } from '../data/mockData';
import { dedupeCanonicalSteps, getCanonicalTopic } from '../lib/contentLocalization';

export const Learn = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const topicId = searchParams.get('topic'); // null means show all
  const initialStep = parseInt(searchParams.get('step') || '0');
  
  const [filteredSteps, setFilteredSteps] = useState<Step[]>([]);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [allTopics, setAllTopics] = useState<Record<string, Topic>>({});
  const [loading, setLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStep);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSyncingBookmark, setIsSyncingBookmark] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>(searchParams.has('step') ? 'detail' : 'list');

  const currentStep = filteredSteps[currentStepIndex];
  
  // Calculate topic-specific progress, even if viewing all chapters globally
  const localSteps = currentStep ? filteredSteps.filter(s => s.topicId === currentStep.topicId) : filteredSteps;
  const localIndex = currentStep ? localSteps.findIndex(s => s.id === currentStep.id) : currentStepIndex;
  
  const totalSteps = localSteps.length;

  // Calculate total pages across all chapters in the topic for granular progress
  let totalPagesInTopic = 0;
  let pagesCompletedBeforeCurrentChapter = 0;

  localSteps.forEach((step, idx) => {
    const pagesInStep = step.contentKeys?.length || step.content?.length || 1;
    totalPagesInTopic += pagesInStep;
    if (idx < localIndex) {
      pagesCompletedBeforeCurrentChapter += pagesInStep;
    }
  });

  const totalPagesCompleted = pagesCompletedBeforeCurrentChapter + (viewMode === 'detail' ? currentPageIndex + 1 : 0);
  const progressPercent = totalPagesInTopic > 0 ? Math.round((totalPagesCompleted / totalPagesInTopic) * 100) : 0;

  // Hook: Update User Progress in Firestore
  useEffect(() => {
    const saveProgress = async () => {
      if (user && currentStep && viewMode === 'detail' && totalSteps > 0) {
        const activeTopicId = currentStep.topicId;
        const activeTopic = topic || allTopics[activeTopicId];
        
        if (!activeTopic) return;

        const progressRef = doc(db, 'userProgress', `${user.uid}_${activeTopicId}`);
        await setDoc(progressRef, {
          uid: user.uid,
          topicId: activeTopicId,
          topicTitle: activeTopic.title,
          topicColor: activeTopic.color,
          lastStepIndex: localIndex, // MUST save local index for Home.tsx compatibility
          lastStepTitle: currentStep.titleKey || currentStep.title,
          progress: progressPercent,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
    };
    saveProgress();
  }, [currentStep, localIndex, totalSteps, topic, allTopics, viewMode, user, progressPercent]);

  // Helper for manual seeding
  const handleSeed = async () => {
    setLoading(true);
    await seedDatabase();
    window.location.reload();
  };

  // Check if current step is bookmarked
  useEffect(() => {
    const checkBookmark = async () => {
      if (user && currentStep) {
        const bookmarkId = `${topicId}_${currentStepIndex}`;
        const bookmarkRef = doc(db, `users/${user.uid}/bookmarks`, bookmarkId);
        const snap = await getDoc(bookmarkRef);
        setIsBookmarked(snap.exists());
      }
    };
    checkBookmark();
  }, [user, topicId, currentStepIndex, currentStep]);

  const toggleBookmark = async () => {
    if (!user || !currentStep || !topic) return;
    setIsSyncingBookmark(true);
    
    const bookmarkId = `${topicId}_${currentStepIndex}`;
    const bookmarkRef = doc(db, `users/${user.uid}/bookmarks`, bookmarkId);
    
    try {
      if (isBookmarked) {
        await deleteDoc(bookmarkRef);
        setIsBookmarked(false);
      } else {
        await setDoc(bookmarkRef, {
          topicId: topicId,
          stepIndex: currentStepIndex,
          title: currentStep.title,
          topicTitle: topic.title,
          savedAt: new Date().toISOString()
        });
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    } finally {
      setIsSyncingBookmark(false);
    }
  };

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (topicId) {
          const topicDoc = await getDoc(doc(db, 'topics', topicId));
          if (topicDoc.exists()) {
            setTopic(getCanonicalTopic(topicDoc.data() as Topic));
          }
        } else {
          // If no specific topic, we need all topics for grouping
          const topicsSnap = await getDocs(collection(db, 'topics'));
          const topicsMap: Record<string, Topic> = {};
          topicsSnap.docs.forEach(d => {
            const t = getCanonicalTopic(d.data() as Topic);
            topicsMap[t.id] = t;
          });
          setAllTopics(topicsMap);
        }

        // Fetch Steps - OPTIMIZED: Fetch only steps for current topic or ALL steps if no topic
        const q = topicId 
          ? query(collection(db, 'steps'), where('topicId', '==', topicId))
          : query(collection(db, 'steps'));
        const snap = await getDocs(q);
        const allSteps = snap.docs.map(doc => doc.data() as Step).sort((a, b) => a.stepNumber - b.stepNumber); // Basic sort for cross-topic
        const data = dedupeCanonicalSteps(allSteps);
        
        if (data.length > 0) {
          setFilteredSteps(data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [topicId]);

  // Sync state with URL
  useEffect(() => {
    if (viewMode === 'detail' && currentStep) {
      const currentTopicId = topicId || currentStep.topicId;
      const stepInUrl = searchParams.get('step');
      
      // If we are in "all topics" view (topicId is null) but transitioning to detail,
      // we need to use the LOCAL index for the URL if we are also setting the topicId.
      let targetIndex = currentStepIndex;
      if (!topicId) {
        const stepsInThisTopic = filteredSteps.filter(s => s.topicId === currentStep.topicId);
        const localIdx = stepsInThisTopic.findIndex(s => s.id === currentStep.id);
        if (localIdx !== -1) targetIndex = localIdx;
      }
      
      // Update URL if it doesn't match current state
      if (stepInUrl !== targetIndex.toString() || searchParams.get('topic') !== currentTopicId) {
        setSearchParams({ 
          topic: currentTopicId, 
          step: targetIndex.toString() 
        }, { replace: true });
        
        // Also update local state to match the mapped index if it changed
        if (targetIndex !== currentStepIndex) {
          setCurrentStepIndex(targetIndex);
        }
      }
    } else if (viewMode === 'list') {
      if (topicId) {
        if (searchParams.get('topic') !== topicId || searchParams.has('step')) {
          setSearchParams({ topic: topicId }, { replace: true });
        }
      } else {
        if (searchParams.has('topic') || searchParams.has('step')) {
          setSearchParams({}, { replace: true });
        }
      }
    }
  }, [viewMode, currentStepIndex, topicId, currentStep]);

  // Sync state FROM URL changes (e.g. browser back button or direct navigation)
  useEffect(() => {
    const stepInUrl = searchParams.get('step');
    if (stepInUrl !== null) {
      const stepIdx = parseInt(stepInUrl);
      if (!isNaN(stepIdx) && stepIdx !== currentStepIndex) {
        setCurrentStepIndex(stepIdx);
        if (viewMode !== 'detail') setViewMode('detail');
      }
    } else if (viewMode === 'detail' && !searchParams.has('step')) {
      setViewMode('list');
    }
  }, [searchParams]);

  // Audio Cleanup
  useEffect(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [currentStepIndex, topicId, viewMode]);

  const toggleAudio = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else if (currentStep) {
      const textToSpeak = `${t(currentStep.title)}. ${t(currentStep.description)}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      const voices = window.speechSynthesis.getVoices();
      const localePrefix = getLanguageLocale(language).split('-')[0];
      const preferredVoice = voices.find(v => v.lang.toLowerCase().startsWith(localePrefix.toLowerCase()));
      if (preferredVoice) utterance.voice = preferredVoice;
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  if (loading) {
    return <PageSkeleton />;
  }

  // --- LIST VIEW ---
  if (viewMode === 'list') {
    // If we have a specific topic, render simple list
    if (topicId) {
      return (
        <div className="bg-neo-bg min-h-full pb-10">
          <Header 
            title={topic?.title ? t(topic.title) : t('nav.learn')} 
            subtitle={t('learn.selectStep')}
            showLogo={true}
            titleSize="text-lg"
            onBack={() => navigate('/')} 
          />
          
          <SectionWrapper title={t('learn.chapterList')}>
            <div className="flex flex-col gap-4">
              {filteredSteps.map((step, index) => (
                <Card 
                  key={step.id} 
                  onClick={() => {
                    setCurrentStepIndex(index);
                    setCurrentPageIndex(0);
                    setViewMode('detail');
                  }}
                  className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 active:translate-x-1 active:translate-y-1 transition-all"
                >
                  <div className="w-12 h-12 flex-shrink-0 bg-neo-purple border-3 border-black rounded-xl shadow-neo-sm flex items-center justify-center font-black text-xl">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-black uppercase tracking-tight text-lg">{step.titleKey ? t(step.titleKey) : t(step.title)}</h3>
                    <p className="text-xs font-bold text-black/60 line-clamp-1">{step.descriptionKey ? t(step.descriptionKey) : t(step.description)}</p>
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
                setCurrentPageIndex(0);
                setViewMode('detail');
              }} className="bg-neo-green">
                {t('learn.startPath')}
              </Button>
            </div>
          )}
        </div>
      );
    }

    // If no specific topic, render grouped list of ALL 20 chapters
    // Group steps by topicId
    const groupedSteps: Record<string, Step[]> = {};
    filteredSteps.forEach(step => {
      if (!groupedSteps[step.topicId]) groupedSteps[step.topicId] = [];
      groupedSteps[step.topicId].push(step);
    });

    // Define preferred topic order to match home page
    const topicOrder = ['process', 'registration', 'voting-day', 'results'];

    return (
      <div className="bg-neo-bg min-h-full pb-10">
        <Header 
          title={t('nav.learn')} 
          subtitle={t('learn.selectStep')}
          showLogo={true}
          titleSize="text-lg"
          onBack={() => navigate('/')} 
        />
        
        {topicOrder.map(orderedTopicId => {
          const stepsInTopic = groupedSteps[orderedTopicId];
          const topicData = allTopics[orderedTopicId];
          if (!stepsInTopic || !topicData) return null;

          return (
            <SectionWrapper key={orderedTopicId} title={t(topicData.titleKey)} className="mb-6">
              <div className="flex flex-col gap-4">
                {stepsInTopic.map((step) => {
                  return (
                    <Card 
                      key={step.id} 
                      onClick={() => {
                        const localIndex = stepsInTopic.findIndex(s => s.id === step.id);
                        setCurrentPageIndex(0);
                        setCurrentStepIndex(localIndex);
                        setViewMode('detail');
                        navigate(`/learn?topic=${orderedTopicId}&step=${localIndex}`);
                      }}
                      className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 active:translate-x-1 active:translate-y-1 transition-all"
                    >
                      <div className={`w-12 h-12 flex-shrink-0 ${topicData.color} border-3 border-black rounded-xl shadow-neo-sm flex items-center justify-center font-black text-xl`}>
                        {step.stepNumber}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-black text-black uppercase tracking-tight text-lg leading-tight mb-1">{step.titleKey ? t(step.titleKey) : t(step.title)}</h3>
                        <p className="text-xs font-bold text-black/60 line-clamp-1">{step.descriptionKey ? t(step.descriptionKey) : t(step.description)}</p>
                      </div>
                      <PlayCircle className="text-black/20 group-hover:text-black transition-colors" />
                    </Card>
                  );
                })}
              </div>
            </SectionWrapper>
          );
        })}

        {filteredSteps.length === 0 && (
          <SectionWrapper title={t('learn.chapterList')}>
            <Card variant="outline" className="p-8 text-center bg-white">
              <p className="text-gray-500 font-bold mb-4">{t('learn.noContent')}</p>
              <Button onClick={handleSeed} className="bg-neo-green">{t('learn.seedDb')}</Button>
            </Card>
          </SectionWrapper>
        )}
      </div>
    );
  }

  // --- DETAIL VIEW ---
  if (!currentStep && !loading) {
    return (
      <div className="bg-neo-bg min-h-screen flex flex-col items-center justify-center p-6">
        <Card variant="outline" className="p-8 text-center bg-white max-w-sm">
          <p className="text-black font-black uppercase mb-4">{t('learn.noContent')}</p>
          <Button onClick={() => {
            setViewMode('list');
            setSearchParams(topicId ? { topic: topicId } : {});
          }} fullWidth>
            {t('nav.back')}
          </Button>
        </Card>
      </div>
    );
  }

  if (!currentStep) return null;

  return (
    <div className="bg-neo-bg min-h-full flex flex-col">
      <Header 
        title={topic?.titleKey ? t(topic.titleKey) : t('nav.learn')} 
        showLogo={true}
        titleSize="text-lg"
        onBack={() => setViewMode('list')} 
      />

      <div className="px-6 py-2">
        {/* We calculate chapterProgressPercent inline below or pass it from state, but since contentKeys is computed below, we should move the progress bar inside the IIFE or compute contentKeys higher up */}
      </div>

      <SectionWrapper className="flex-1 flex flex-col justify-center py-8">
        {(() => {
          const contentKeys = currentStep.contentKeys?.length ? currentStep.contentKeys : [currentStep.descriptionKey];
          const contents = currentStep.content?.length ? currentStep.content : [currentStep.description];
          
          const currentContentKey = contentKeys[currentPageIndex] || contentKeys[0];
          const currentContent = contents[currentPageIndex] || contents[0];
          const isLastPage = currentPageIndex === contentKeys.length - 1;
          const chapterProgressPercent = Math.round(((currentPageIndex + 1) / contentKeys.length) * 100);

          return (
            <>
              <div className="px-0 py-2 mb-4 -mt-4">
                <ProgressBar progress={chapterProgressPercent} height="h-2" />
              </div>
              <div className="text-center mb-6">
                <span className="inline-block px-3 py-1 rounded-full bg-neo-pink text-black border-2 border-black shadow-neo-sm text-[10px] font-black uppercase tracking-widest mb-4">
                  CARD {currentPageIndex + 1} / {contentKeys.length}
                </span>
                <h2 className="text-3xl font-black text-black uppercase tracking-tight leading-tight">
                  {currentStep.titleKey ? t(currentStep.titleKey) : t(currentStep.title)}
                </h2>
              </div>

              <Card variant="gradient" className="py-12 px-8 flex flex-col items-center text-center relative min-h-[300px] justify-center">
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={toggleBookmark}
                    disabled={isSyncingBookmark}
                    className={`w-10 h-10 border-2 border-black rounded-xl flex items-center justify-center shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all
                      ${isBookmarked ? 'bg-neo-yellow text-black' : 'bg-white text-black/30 hover:text-black'}`}
                  >
                    <Bookmark size={18} strokeWidth={3} fill={isBookmarked ? "currentColor" : "none"} />
                  </button>
                  <button 
                    onClick={toggleAudio}
                    className="w-10 h-10 bg-white border-2 border-black rounded-xl flex items-center justify-center text-black shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                  >
                    {isPlaying ? <Square size={16} fill="currentColor" /> : <Volume2 size={18} strokeWidth={3} />}
                  </button>
                </div>
                
                <div className="w-16 h-16 bg-white border-3 border-black rounded-2xl flex items-center justify-center text-black shadow-neo mb-6">
                  <span className="text-2xl font-black">{currentStepIndex + 1}</span>
                </div>
                <p className="text-xl text-black leading-relaxed font-bold">
                  {currentContentKey ? t(currentContentKey) : t(currentContent)}
                </p>
              </Card>

              <div className="mt-auto pt-8 flex gap-4">
                <Button 
                  variant="secondary" 
                  fullWidth 
                  onClick={() => {
                    if (currentPageIndex > 0) {
                      setCurrentPageIndex(currentPageIndex - 1);
                    } else {
                      setViewMode('list');
                    }
                  }}
                >
                  <ChevronLeft size={20} />
                  {currentPageIndex === 0 ? t('nav.back') : t('learn.prev')}
                </Button>
                <Button 
                  fullWidth 
                  onClick={() => {
                    if (!isLastPage) {
                      setCurrentPageIndex(currentPageIndex + 1);
                    } else {
                      setViewMode('list');
                    }
                  }}
                  className="bg-black text-white"
                >
                  {isLastPage ? t('learn.finish') : t('learn.next')}
                  <ChevronRight size={20} />
                </Button>
              </div>
            </>
          );
        })()}


        
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
