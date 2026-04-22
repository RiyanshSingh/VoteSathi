import { useNavigate } from 'react-router-dom';
import { Vote, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../components/Button';
import { useLanguage } from '../context/LanguageContext';

export const Welcome = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="h-screen bg-neo-bg flex flex-col items-center justify-between p-10 relative">
      {/* Static Logo Section */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <div className="relative mb-10">
          <div className="w-36 h-36 bg-neo-yellow border-4 border-black rounded-[36px] shadow-neo flex items-center justify-center">
            <Vote size={72} strokeWidth={2.5} className="text-black" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white border-2 border-black rounded-xl shadow-neo-sm flex items-center justify-center">
            <ShieldCheck size={24} className="text-neo-green" />
          </div>
        </div>
        
        {/* Text Section */}
        <div className="text-center">
          <h1 className="text-7xl font-black text-black uppercase tracking-tighter leading-[0.8] mb-6">
            Vote<br/>
            <span className="text-neo-pink">Sathi</span>
          </h1>
          <div className="h-2 w-20 bg-black mx-auto rounded-full mb-8" />
          
          <p className="text-xl font-bold text-black leading-tight max-w-[260px] mx-auto">
            {t('welcome.tagline')}
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full space-y-6">
        <div className="bg-white border-3 border-black p-4 rounded-2xl shadow-neo-sm flex items-center justify-center gap-3">
            <div className="w-2 h-2 bg-neo-green rounded-full animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-widest text-black/60">{t('welcome.live')}</p>
        </div>

        <Button 
          className="w-full flex items-center justify-between px-8 bg-neo-green text-2xl py-6 rounded-2xl border-4"
          onClick={() => navigate('/login')}
        >
          <span className="uppercase tracking-tighter font-black">{t('welcome.getStarted')}</span>
          <ArrowRight className="text-black" size={28} strokeWidth={3} />
        </Button>
      </div>
    </div>
  );
};


