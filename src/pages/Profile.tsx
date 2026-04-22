import { Header } from '../components/Header';
import { SectionWrapper } from '../components/SectionWrapper';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { PageSkeleton } from '../components/SkeletonLoader';
import { Settings, Bookmark, Star, ChevronRight, Bell } from 'lucide-react';
import { LANGUAGE_OPTIONS, useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { seedDatabase } from '../lib/db-seed';

import { useNavigate } from 'react-router-dom';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export const Profile = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [realStats, setRealStats] = useState({
    topicsCompleted: 0,
    stepsLearned: 0,
    overallProgress: 0
  });
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      try {
        // 1. Fetch Progress Stats - Optimized: query only current user's docs
        const progressQ = query(collection(db, 'userProgress'), where('uid', '==', user.uid));
        const progressSnap = await getDocs(progressQ);
        const userProgress = progressSnap.docs.map(doc => doc.data());

        const completed = userProgress.filter(p => p.progress === 100).length;
        const steps = userProgress.reduce((sum, p) => sum + (p.lastStepIndex + 1), 0);
        const avgProgress = userProgress.length > 0 
          ? Math.round(userProgress.reduce((sum, p) => sum + p.progress, 0) / 4)
          : 0;

        setRealStats({
          topicsCompleted: completed,
          stepsLearned: steps,
          overallProgress: avgProgress
        });

        // 2. Fetch Saved Items (Bookmarks)
        const bookmarksSnap = await getDocs(collection(db, `users/${user.uid}/bookmarks`));
        setSavedItems(bookmarksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const stats = [
    { label: t('profile.stats.topics'), value: realStats.topicsCompleted.toString(), sub: t('profile.stats.completed') },
    { label: t('profile.stats.steps'), value: realStats.stepsLearned.toString(), sub: t('profile.stats.learned') },
    { label: t('profile.stats.progress'), value: `${realStats.overallProgress}%`, sub: t('profile.stats.global') },
  ];

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="bg-neo-bg min-h-full pb-10">
      <Header title={t('profile.title')} subtitle={t('profile.subtitle')} />

      {/* User Card */}
      <SectionWrapper>
        <Card variant="gradient" className="flex items-center gap-6 py-8">
          <div className="w-24 h-24 rounded-2xl bg-white border-3 border-black flex items-center justify-center shadow-neo overflow-hidden p-1">
            <img 
              src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid || 'Riyansh'}`} 
              alt={t('common.avatarAlt')} 
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-black text-black uppercase tracking-tight">
              {user?.displayName || user?.email?.split('@')[0] || 'Riyansh'}
            </h2>
            <p className="text-black font-bold text-sm bg-white/40 px-2 py-0.5 rounded-lg w-fit mt-1 border-2 border-black/30">{t('profile.beginner')}</p>
            <div className="flex items-center gap-1.5 mt-4">
              <Star size={16} className="text-black fill-neo-yellow" />
              <span className="text-xs font-black text-black uppercase tracking-widest">{t('profile.earlyLearner')}</span>
            </div>
          </div>
        </Card>
      </SectionWrapper>

      {/* Stats Section */}
      <SectionWrapper className="py-2">
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white border-3 border-black rounded-2xl p-4 text-center shadow-neo-sm">
              <p className="text-2xl font-black text-black leading-none">{stat.value}</p>
              <p className="text-[10px] font-black text-black uppercase tracking-widest mt-2">{stat.label}</p>
              <p className="text-[9px] font-bold text-gray-500 mt-0.5 uppercase">{stat.sub}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Saved Section */}
      <SectionWrapper title={t('profile.savedItems')} actionLabel={savedItems.length > 0 ? t('common.viewAll') : ''}>
        <div className="flex flex-col gap-4">
          {savedItems.map((item) => (
            <div 
              key={item.id} 
              onClick={() => navigate(`/learn?topic=${item.topicId}&step=${item.stepIndex}`)}
              className="flex items-center justify-between p-4 bg-white border-3 border-black rounded-2xl shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-neo-purple border-2 border-black flex items-center justify-center text-black shadow-neo-sm">
                  <Bookmark size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-base font-black text-black uppercase tracking-tight leading-none">{t(item.title)}</h4>
                  <p className="text-xs font-bold text-gray-500 mt-2">
                    {new Date(item.savedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-neo-yellow border-2 border-black flex items-center justify-center shadow-neo-sm">
                <ChevronRight size={18} strokeWidth={3} />
              </div>
            </div>
          ))}
          
          {savedItems.length === 0 && (
            <div className="p-8 text-center bg-gray-50/50 rounded-2xl border-2 border-dashed border-black/10">
              <p className="text-sm font-bold text-black/40 uppercase tracking-widest">{t('profile.noSavedItems')}</p>
            </div>
          )}
        </div>
      </SectionWrapper>

      {/* Language Selection */}
      <SectionWrapper title={t('profile.lang')}>
        <div className="flex flex-wrap gap-3 mt-2">
          {LANGUAGE_OPTIONS.map((lang) => (
            <button 
              key={lang}
              onClick={() => setLanguage(lang as any)}
              className={`px-4 py-2 rounded-xl border-3 border-black font-black uppercase text-xs tracking-tighter transition-all shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none
                ${language === lang ? 'bg-neo-yellow text-black' : 'bg-white text-black hover:bg-gray-50'}`}
            >
              {lang}
            </button>
          ))}
        </div>
      </SectionWrapper>

      {/* Settings */}
      <SectionWrapper title={t('profile.settings')}>
        <div className="flex flex-col gap-3">
          {[
            { icon: Bell, label: t('profile.settings.notifications'), value: t('profile.settings.daily') },
            { icon: Settings, label: t('profile.settings.preferences'), value: '' }
          ].map((item) => (
            <div 
              key={item.label} 
              onClick={() => navigate('/settings')}
              className="flex items-center justify-between p-4 bg-white border-3 border-black hover:bg-gray-50 rounded-2xl shadow-neo-sm transition-all cursor-pointer group active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <div className="flex items-center gap-4">
                <item.icon size={22} strokeWidth={2.5} className="text-black group-hover:scale-110 transition-transform" />
                <span className="text-sm font-black text-black uppercase tracking-tight">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.value && <span className="text-xs text-gray-500 font-bold uppercase">{item.value}</span>}
                <ChevronRight size={18} strokeWidth={3} className="text-black/30" />
              </div>
            </div>
          ))}
          
          {/* Sync Data Option */}
          <div 
            onClick={async () => {
              const ok = confirm(t('common.syncConfirm'));
              if (ok) {
                await seedDatabase();
                alert(t('common.syncSuccess'));
                window.location.reload();
              }
            }}
            className="flex items-center justify-between p-4 bg-neo-blue/20 border-3 border-black hover:bg-neo-blue/40 rounded-2xl shadow-neo-sm transition-all cursor-pointer group active:translate-x-0.5 active:translate-y-0.5 active:shadow-none mt-2"
          >
            <div className="flex items-center gap-4">
              <Star size={22} strokeWidth={2.5} className="text-black group-hover:rotate-45 transition-transform" />
              <span className="text-sm font-black text-black uppercase tracking-tight">{t('profile.settings.sync')}</span>
            </div>
            <span className="text-[10px] font-black text-black/40 uppercase">{t('profile.settings.update')}</span>
          </div>
        </div>
        
        <Button 
          variant="primary" 
          fullWidth 
          className="mt-8 bg-neo-pink text-black shadow-neo active:bg-pink-600"
          onClick={handleSignOut}
        >
          <span className="uppercase font-black tracking-tight">{t('profile.signout')}</span>
        </Button>
      </SectionWrapper>
    </div>
  );
};
