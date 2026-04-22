interface ChipProps {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

export const Chip = ({ label, onClick, active }: ChipProps) => {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border-3 border-black
        ${active 
          ? 'bg-neo-yellow text-black shadow-neo translate-x-[2px] translate-y-[2px]' 
          : 'bg-white text-black shadow-neo-sm hover:shadow-neo hover:-translate-y-[2px] hover:-translate-x-[2px]'
        }`}
    >
      {label}
    </button>
  );
};
