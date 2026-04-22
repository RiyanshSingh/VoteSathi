import { Outlet, NavLink } from 'react-router-dom';
import { Home, BookOpen, MessageCircle, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const MainLayout = () => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col h-full bg-neo-bg text-black">
      <main className="flex-1 overflow-y-auto pt-24 pb-24">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute min-[1024px]:absolute max-[1023px]:fixed bottom-0 left-0 right-0 w-full bg-neo-purple border-t-2 border-black px-6 py-3 flex justify-between items-center z-20 shadow-[0_-2px_0_0_rgba(0,0,0,1)]">
        <NavLink 
          to="/" 
          className={({ isActive }) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-black' : 'text-black/60'}`}
        >
          {({ isActive }) => (
            <>
              <div className={`p-2 rounded-xl border-3 ${isActive ? 'bg-neo-yellow border-black shadow-neo-sm' : 'border-transparent text-black'}`}>
                <Home size={24} strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-tighter">{t('nav.home')}</span>
            </>
          )}
        </NavLink>
        
        <NavLink 
          to="/learn" 
          className={({ isActive }) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-black' : 'text-black/60'}`}
        >
          {({ isActive }) => (
            <>
              <div className={`p-2 rounded-xl border-3 ${isActive ? 'bg-neo-yellow border-black shadow-neo-sm' : 'border-transparent text-black'}`}>
                <BookOpen size={24} strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-tighter">{t('nav.learn')}</span>
            </>
          )}
        </NavLink>

        <NavLink 
          to="/assistant" 
          className={({ isActive }) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-black' : 'text-black/60'}`}
        >
          {({ isActive }) => (
            <>
              <div className={`p-2 rounded-xl border-3 ${isActive ? 'bg-neo-yellow border-black shadow-neo-sm' : 'border-transparent text-black'}`}>
                <MessageCircle size={24} strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-tighter">{t('nav.assistant')}</span>
            </>
          )}
        </NavLink>

        <NavLink 
          to="/profile" 
          className={({ isActive }) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-black' : 'text-black/60'}`}
        >
          {({ isActive }) => (
            <>
              <div className={`p-2 rounded-xl border-3 ${isActive ? 'bg-neo-yellow border-black shadow-neo-sm' : 'border-transparent text-black'}`}>
                <User size={24} strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-tighter">{t('nav.profile')}</span>
            </>
          )}
        </NavLink>
      </nav>
    </div>
  );
};
