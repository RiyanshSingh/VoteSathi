import type { ReactNode } from 'react';

interface SectionWrapperProps {
  title?: string;
  actionLabel?: string;
  onActionClick?: () => void;
  children: ReactNode;
  className?: string;
}

export const SectionWrapper = ({ 
  title, 
  actionLabel, 
  onActionClick, 
  children,
  className = ''
}: SectionWrapperProps) => {
  return (
    <section className={`px-6 py-4 ${className}`}>
      {(title || actionLabel) && (
        <div className="flex items-center justify-between mt-6 mb-4">
          {title && <h2 className="text-xl font-black text-black uppercase tracking-tight">{title}</h2>}
          {actionLabel && (
            <button 
              onClick={onActionClick}
              className="text-xs font-black text-black uppercase tracking-widest border-b-2 border-black pb-0.5 hover:text-neo-pink transition-colors"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
      {children}
    </section>
  );
};
