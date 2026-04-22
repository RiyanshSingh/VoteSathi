import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'white' | 'gradient' | 'flat' | 'custom' | 'outline';
  customColor?: string;
}

export const Card = ({ 
  children, 
  className = '', 
  onClick, 
  variant = 'white',
  customColor = ''
}: CardProps) => {
  const variants = {
    white: 'bg-white shadow-neo border-3 border-black',
    gradient: 'bg-neo-purple shadow-neo border-3 border-black text-black',
    flat: 'bg-white border-3 border-black',
    custom: `shadow-neo border-3 border-black ${customColor}`,
    outline: 'bg-white shadow-neo border-3 border-black'
  };

  return (
    <div 
      onClick={onClick}
      className={`rounded-3xl p-6 ${variants[variant]} ${onClick ? 'cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
