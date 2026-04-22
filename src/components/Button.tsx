import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false, 
  className = '', 
  ...props 
}: ButtonProps) => {
  const baseStyles = 'px-6 py-3 rounded-2xl font-bold transition-all active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 border-2 border-black';
  const variants = {
    primary: 'bg-neo-green text-black shadow-neo hover:opacity-90',
    secondary: 'bg-neo-purple text-black shadow-neo hover:opacity-90',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
