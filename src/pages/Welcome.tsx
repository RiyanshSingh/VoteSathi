import { useNavigate } from 'react-router-dom';
import { Vote, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { useLanguage } from '../context/LanguageContext';

export const Welcome = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-dvh bg-neo-bg flex flex-col items-center justify-between p-10 pb-20 relative overflow-y-auto">
      {/* Static Logo Section */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <div className="relative mb-10">
          <div className="w-36 h-36 bg-neo-yellow border-4 border-black rounded-[36px] shadow-neo flex items-center justify-center">
            <Vote size={72} strokeWidth={2.5} className="text-black" />
          </div>
        </div>
        
        {/* Text Section */}
          <h1 className="text-5xl font-black text-black uppercase tracking-tighter leading-none mb-4">
            Vote <span className="text-neo-pink">Sathi</span>
          </h1>
          
          <p className="text-xl font-bold text-black leading-tight max-w-[260px] mx-auto">
            {t('welcome.tagline')}
          </p>
        </div>

      {/* CTA Section */}
      <div className="w-full space-y-6 mb-12">

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
