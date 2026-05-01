import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { SectionWrapper } from '../components/SectionWrapper';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { Button } from '../components/Button';
import { PageSkeleton } from '../components/SkeletonLoader';
import {
  HelpCircle, AlertCircle, UserPlus, Search, Download,
  Edit3, MapPin, AlertTriangle, ExternalLink,
  BookOpen, Vote, BarChart2, CheckSquare
} from 'lucide-react';

// Icon map for dynamic topic icons from Firestore
const ICON_MAP: Record<string, React.ElementType> = {
  BookOpen, Vote, BarChart2, CheckSquare,
  HelpCircle, AlertCircle, UserPlus, Search,
  Download, Edit3, MapPin, AlertTriangle, ExternalLink,
};
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs, query, where, getCountFromServer } from 'firebase/firestore';
import { db } from '../firebase';
import { seedDatabase } from '../lib/db-seed';
import type { Topic } from '../data/mockData';
import { getCanonicalNews, getCanonicalProgressStepTitle, getCanonicalTopic } from '../lib/contentLocalization';

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
        const topicsData = topicsSnap.docs.map(doc => getCanonicalTopic(doc.data() as Topic));
        
        // Fetch User Progress if logged in - OPTIMIZED: Fetch only for current user
        if (user) {
          try {
            const q = query(
              collection(db, 'userProgress'), 
              where('uid', '==', user.uid)
            );
            const progressSnap = await getDocs(q);
            const progressData = progressSnap.docs.map(doc => doc.data());
            // Sort in memory to avoid composite index requirement
            progressData.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
            setUserProgress(progressData.slice(0, 4));
          } catch (pError) {
            console.error("Error fetching progress:", pError);
          }
        }

        // Structural Integrity Check - OPTIMIZED: Use getCountFromServer
        const stepsCount = await getCountFromServer(collection(db, 'steps'));
        const newsSnap = await getDocs(collection(db, 'newsUpdates'));
        
        const isDataIncomplete = topicsData.length !== 4 || stepsCount.data().count !== 20 || newsSnap.docs.length !== 3;

        if (isDataIncomplete) {
          console.log("Database state inconsistent, performing clean seed...");
          await seedDatabase();
          const updatedTopicsSnap = await getDocs(collection(db, 'topics'));
          setTopicsList(updatedTopicsSnap.docs.map(doc => getCanonicalTopic(doc.data() as Topic)));
        } else {
          setTopicsList(topicsData);
        }

        const finalNewsSnap = isDataIncomplete ? await getDocs(collection(db, 'newsUpdates')) : newsSnap;
        setNewsList(finalNewsSnap.docs.map(doc => getCanonicalNews({ id: doc.id, ...doc.data() } as any)));
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
        lastStepTitle: 'common.startLearning'
      }));
    continueItems.push(...defaults);
  }

  const normalizedContinueItems = continueItems.map((item) => ({
    ...item,
    lastStepTitle: getCanonicalProgressStepTitle(item.topicId, item.lastStepIndex, item.lastStepTitle),
  }));

  if (loading) {
    return <PageSkeleton />;
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
            const IconComponent = (ICON_MAP[topic.icon] || HelpCircle) as React.ElementType;
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
                  <h3 className="font-black text-black text-sm leading-tight uppercase tracking-tight">{t(topic.titleKey)}</h3>
                  <p className="text-xs font-bold text-black/70 mt-1 line-clamp-2">{t(topic.descriptionKey)}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </SectionWrapper>

      {/* Continue Learning - Horizontal Scroll */}
      <SectionWrapper title={t('home.continue')} actionLabel={t('common.viewAll')}>
        <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar -mx-6 px-6 pt-2">
          {normalizedContinueItems.map((item) => (
            <Card 
              key={item.topicId} 
              className="min-w-[240px] flex flex-col gap-4 cursor-pointer active:translate-y-1 transition-all" 
              variant="gradient"
              onClick={() => navigate(`/learn?topic=${item.topicId}&step=${item.lastStepIndex !== undefined ? item.lastStepIndex : 0}`)}
            >
              <div className="flex flex-col gap-1">
                <span className={`text-[12px] font-black text-black uppercase tracking-widest bg-white border-2 border-black px-2 py-0.5 rounded-full w-fit shadow-neo-sm mb-1`}>
                  {item.progress > 0 ? t('common.resume') : t('common.new')}
                </span>
                <h3 className="font-black text-black text-xl tracking-tight uppercase mt-2">{t(item.lastStepTitle)}</h3>
                <p className="text-sm font-bold text-black/70 line-clamp-1">{t(item.topicTitleKey || item.topicTitle)}</p>
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
                  {t(news.date)}
                </span>
                {news.isUrgent && <AlertCircle size={16} strokeWidth={3} className="text-black" />}
              </div>
              <h3 className="font-black text-black text-lg tracking-tight leading-tight mt-1">{t(news.title)}</h3>
              <p className="text-xs font-bold text-black/70 line-clamp-2">{t(news.description)}</p>
            </Card>
          ))}
        </div>
      </SectionWrapper>

      {/* Services */}
      <SectionWrapper title={t('home.services')}>
        <div className="flex flex-col gap-3">
          {[
            { 
              key: 'service.voter_reg', 
              descKey: 'service.voter_reg_desc', 
              url: 'https://voters.eci.gov.in/',
              icon: UserPlus,
              color: 'bg-neo-blue'
            }, 
            { 
              key: 'service.check_list', 
              descKey: 'service.check_list_desc', 
              url: 'https://electoralsearch.eci.gov.in/',
              icon: Search,
              color: 'bg-neo-yellow'
            }, 
            { 
              key: 'service.download_epic', 
              descKey: 'service.download_epic_desc', 
              url: 'https://voters.eci.gov.in/',
              icon: Download,
              color: 'bg-neo-green'
            },
            { 
              key: 'service.update_details', 
              descKey: 'service.update_details_desc', 
              url: 'https://voters.eci.gov.in/',
              icon: Edit3,
              color: 'bg-neo-purple'
            },
            { 
              key: 'service.find_booth', 
              descKey: 'service.find_booth_desc', 
              url: 'https://electoralsearch.eci.gov.in/',
              icon: MapPin,
              color: 'bg-neo-pink'
            },
            { 
              key: 'service.file_complaint', 
              descKey: 'service.file_complaint_desc', 
              url: 'https://c-vigil.eci.gov.in/',
              icon: AlertTriangle,
              color: 'bg-red-400'
            }
          ].map((service) => (
            <a 
              key={service.key} 
              href={service.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-between p-4 ${service.color} border-3 border-black shadow-neo rounded-2xl hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer group`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white border-2 border-black flex items-center justify-center text-black shadow-neo-sm shrink-0">
                  <service.icon size={24} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-black text-black uppercase tracking-tight leading-tight">{t(service.key)}</span>
                  <span className="text-xs font-bold text-black/70 leading-tight mt-0.5">{t(service.descKey)}</span>
                </div>
              </div>
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white border-2 border-black shadow-neo-sm shrink-0 group-hover:scale-110 transition-transform">
                <ExternalLink size={16} strokeWidth={3} className="text-black" />
              </div>
            </a>
          ))}
        </div>
      </SectionWrapper>
    </div>
  );
};
