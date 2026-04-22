import { Vote } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const Header = ({ title, subtitle, showBack, onBack }: HeaderProps) => {
  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] min-[1200px]:max-w-[406px] pt-6 pb-4 px-6 bg-neo-bg z-50">
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 flex items-center justify-start">
          {showBack ? (
            <button 
              onClick={onBack}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border-3 border-black shadow-neo-sm text-black active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              ←
            </button>
          ) : (
            <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-neo-green border-3 border-black shadow-neo-sm text-black">
              <Vote size={24} strokeWidth={3} />
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-black text-black leading-tight tracking-tight uppercase">{title}</h1>
          {subtitle && <p className="text-gray-500 font-bold mt-1 text-[11px] tracking-widest uppercase">{subtitle}</p>}
        </div>

        <div className="w-12 h-12 flex items-center justify-end">
          <button className="w-12 h-12 flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-neo-yellow border-3 border-black shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all">
            <div className="w-6 h-0.5 bg-black rounded-full" />
            <div className="w-4 h-0.5 bg-black rounded-full ml-auto mr-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
