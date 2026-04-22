interface ProgressBarProps {
  progress: number;
  height?: string;
  className?: string;
}

export const ProgressBar = ({ progress, height = 'h-2', className = '' }: ProgressBarProps) => {
  return (
    <div className={`w-full bg-white border-3 border-black shadow-neo-sm rounded-full overflow-hidden ${height} ${className}`}>
      <div 
        className="h-full bg-neo-green border-r-3 border-black transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
