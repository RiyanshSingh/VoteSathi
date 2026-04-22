import { Header } from '../components/Header';
import { SectionWrapper } from '../components/SectionWrapper';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Settings, Bookmark, Star, ChevronRight, Bell } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { seedDatabase } from '../lib/db-seed';

import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  const stats = [
    { label: t('profile.stats.topics'), value: '4', sub: t('profile.stats.completed') },
    { label: t('profile.stats.steps'), value: '28', sub: t('profile.stats.learned') },
    { label: t('profile.stats.progress'), value: '65%', sub: t('profile.stats.global') },
  ];

  return (
    <div className="bg-neo-bg min-h-full pb-10">
      <Header title={t('profile.title')} subtitle={t('profile.subtitle')} />

      {/* User Card */}
      <SectionWrapper>
        <Card variant="gradient" className="flex items-center gap-6 py-8">
          <div className="w-24 h-24 rounded-2xl bg-white border-3 border-black flex items-center justify-center shadow-neo overflow-hidden p-1">
            <img 
              src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid || 'Riyansh'}`} 
              alt="Avatar" 
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
      <SectionWrapper title={t('profile.savedItems')} actionLabel={t('common.viewAll')}>
        <div className="flex flex-col gap-4">
          {[
            { title: t('profile.saved.idReq'), date: t('profile.saved.days2') },
            { title: t('profile.saved.pollDay'), date: t('profile.saved.days5') }
          ].map((item) => (
            <div key={item.title} className="flex items-center justify-between p-4 bg-white border-3 border-black rounded-2xl shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-neo-purple border-2 border-black flex items-center justify-center text-black shadow-neo-sm">
                  <Bookmark size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-base font-black text-black uppercase tracking-tight leading-none">{item.title}</h4>
                  <p className="text-xs font-bold text-gray-500 mt-2">{item.date}</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-neo-yellow border-2 border-black flex items-center justify-center shadow-neo-sm">
                <ChevronRight size={18} strokeWidth={3} />
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Language Selection */}
      <SectionWrapper title={t('profile.lang')}>
        <div className="flex flex-wrap gap-3 mt-2">
          {['English', 'Hindi (हिंदी)', 'Hinglish', 'Bengali (বাংলা)', 'Telugu (తెలుగు)', 'Marathi (मराठी)', 'Tamil (தமிழ்)', 'Gujarati (ગુજરાતી)', 'Kannada (ಕನ್ನಡ)'].map((lang) => (
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
              const ok = confirm("Refresh all educational content from server?");
              if (ok) {
                await seedDatabase();
                alert("Data synced successfully!");
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
