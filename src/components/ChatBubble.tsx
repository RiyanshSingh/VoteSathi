interface ChatBubbleProps {
  message: string;
  sender: 'user' | 'assistant';
  timestamp?: string;
}

export const ChatBubble = ({ message, sender, timestamp }: ChatBubbleProps) => {
  const isAssistant = sender === 'assistant';
  
  return (
    <div className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'} mb-4`}>
      <div className={`max-w-[80%] px-5 py-3 rounded-2xl border-3 border-black shadow-neo-sm text-sm font-bold leading-relaxed text-black
        ${isAssistant 
          ? 'bg-neo-blue rounded-bl-sm' 
          : 'bg-neo-yellow rounded-br-sm'
        }`}
      >
        {message}
      </div>
      {timestamp && (
        <span className="text-[10px] text-gray-500 font-bold mt-1 px-1 tracking-wide uppercase">
          {timestamp}
        </span>
      )}
    </div>
  );
};
