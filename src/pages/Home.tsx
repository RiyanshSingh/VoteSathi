import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { SectionWrapper } from '../components/SectionWrapper';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { Button } from '../components/Button';
import * as Icons from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { seedDatabase } from '../lib/db-seed';
import type { Topic } from '../data/mockData';

export const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [topicsList, setTopicsList] = useState<Topic[]>([]);
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [newsList, setNewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Topics
        const topicsSnap = await getDocs(collection(db, 'topics'));
        const topicsData = topicsSnap.docs.map(doc => doc.data() as Topic);
        
        // Fetch User Progress if logged in
        if (user) {
          try {
            // Fetch all progress for the user and sort in memory to avoid index issues
            const progressSnap = await getDocs(collection(db, 'userProgress'));
            const allProgress = progressSnap.docs.map(doc => doc.data());
            const filteredProgress = allProgress
              .filter(p => p.uid === user.uid)
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .slice(0, 4);
            setUserProgress(filteredProgress);
          } catch (pError) {
            console.error("Error fetching progress:", pError);
          }
        }

        // Fetch Steps to check if we need to re-seed
        const stepsSnap = await getDocs(collection(db, 'steps'));
        
        if (topicsData.length === 0 || stepsSnap.docs.length < 10) {
          console.log("Database empty or incomplete, seeding...");
          await seedDatabase();
          const updatedTopicsSnap = await getDocs(collection(db, 'topics'));
          setTopicsList(updatedTopicsSnap.docs.map(doc => doc.data() as Topic));
        } else {
          setTopicsList(topicsData);
        }

        // Fetch News
        const newsSnap = await getDocs(collection(db, 'newsUpdates'));
        setNewsList(newsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Combine userProgress with default topics to ensure 4 items
  const continueItems = [...userProgress];
  if (continueItems.length < 4) {
    const existingIds = new Set(continueItems.map(i => i.topicId));
    const defaults = topicsList
      .filter(t => !existingIds.has(t.id))
      .slice(0, 4 - continueItems.length)
      .map(t => ({
        topicId: t.id,
        topicTitle: t.title,
        topicColor: t.color,
        progress: 0,
        lastStepTitle: 'Start Learning'
      }));
    continueItems.push(...defaults);
  }

  if (loading) {
    return (
      <div className="h-screen bg-neo-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-neo-bg min-h-full pb-10">
      <Header 
        title={t('home.title')} 
        subtitle={t('home.subtitle')} 
      />

      {/* Main Topics Grid */}
      <SectionWrapper title={t('home.topics')}>
        <div className="grid grid-cols-2 gap-4">
          {topicsList.map((topic) => {
            const IconComponent = (Icons[topic.icon as keyof typeof Icons] || Icons.HelpCircle) as React.ElementType;
            return (
              <Card 
                key={topic.id} 
                variant="custom" 
                className={`flex flex-col gap-3 h-full cursor-pointer ${topic.color}`}
                onClick={() => navigate(`/learn?topic=${topic.id}`)}
              >
                <div className={`w-10 h-10 rounded-xl bg-white border-2 border-black flex items-center justify-center text-black shadow-neo-sm`}>
                  <IconComponent size={20} />
                </div>
                <div>
                  <h3 className="font-black text-black text-sm leading-tight uppercase tracking-tight">{t(topic.title)}</h3>
                  <p className="text-xs font-bold text-black/70 mt-1 line-clamp-2">{t(topic.description)}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </SectionWrapper>

      {/* Continue Learning - Horizontal Scroll */}
      <SectionWrapper title={t('home.continue')} actionLabel={t('common.viewAll')}>
        <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar -mx-6 px-6 pt-2">
          {continueItems.map((item) => (
            <Card 
              key={item.topicId} 
              className="min-w-[240px] flex flex-col gap-4 cursor-pointer active:translate-y-1 transition-all" 
              variant="gradient"
              onClick={() => navigate(`/learn?topic=${item.topicId}${item.lastStepIndex !== undefined ? `&step=${item.lastStepIndex}` : ''}`)}
            >
              <div className="flex flex-col gap-1">
                <span className={`text-[12px] font-black text-black uppercase tracking-widest bg-white border-2 border-black px-2 py-0.5 rounded-full w-fit shadow-neo-sm mb-1`}>
                  {item.progress > 0 ? t('common.resume') : t('common.new')}
                </span>
                <h3 className="font-black text-black text-xl tracking-tight uppercase mt-2">{t(item.topicTitle)}</h3>
                <p className="text-sm font-bold text-black/70 line-clamp-1">{t(item.lastStepTitle)}</p>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex justify-between text-xs font-black text-black uppercase tracking-wider">
                  <span>{t('common.progress')}</span>
                  <span>{item.progress}%</span>
                </div>
                <ProgressBar progress={item.progress} />
              </div>
              <Button className="mt-2 text-sm uppercase">
                {item.progress > 0 ? t('common.continue') : t('common.start')}
              </Button>
            </Card>
          ))}
        </div>
      </SectionWrapper>

      {/* Latest News & Updates */}
      <SectionWrapper title={t('home.news')} actionLabel={t('common.viewAll')}>
        <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar -mx-6 px-6 pt-2">
          {newsList.map((news) => (
            <Card key={news.id} className="min-w-[260px] flex flex-col gap-2" variant={news.isUrgent ? 'custom' : 'outline'} customColor={news.isUrgent ? 'bg-neo-pink' : ''}>
              <div className="flex justify-between items-start gap-2">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full w-fit shadow-neo-sm border-2 border-black ${news.isUrgent ? 'bg-white text-black' : 'bg-neo-yellow text-black'}`}>
                  {news.date}
                </span>
                {news.isUrgent && <Icons.AlertCircle size={16} strokeWidth={3} className="text-black" />}
              </div>
              <h3 className="font-black text-black text-lg tracking-tight leading-tight mt-1">{t(news.title)}</h3>
              <p className="text-xs font-bold text-black/70 line-clamp-2">{t(news.description)}</p>
            </Card>
          ))}
        </div>
      </SectionWrapper>

      {/* Helpful Tools */}
      <SectionWrapper title={t('home.tools')}>
        <div className="flex flex-col gap-3">
          {[
            { key: 'tool.booth', default: 'Find Polling Booth' }, 
            { key: 'tool.docs', default: 'Required Documents' }, 
            { key: 'tool.faq', default: 'FAQs' }
          ].map((tool) => (
            <div 
              key={tool.key} 
              onClick={() => navigate('/assistant', { state: { query: t(tool.key) } })}
              className="flex items-center justify-between p-4 bg-neo-yellow border-3 border-black shadow-neo rounded-2xl hover:bg-yellow-400 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border-2 border-black flex items-center justify-center text-black shadow-neo-sm">
                  <Icons.Search size={20} strokeWidth={2.5} />
                </div>
                <span className="text-base font-black text-black uppercase tracking-tight">{t(tool.key)}</span>
              </div>
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white border-2 border-black shadow-neo-sm">
                <Icons.ArrowRight size={18} strokeWidth={3} className="text-black" />
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>
    </div>
  );
};
