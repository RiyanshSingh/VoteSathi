export const PageSkeleton = () => {
  return (
    <div className="min-h-dvh bg-neo-bg flex flex-col p-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4 mb-8 pt-4">
        <div className="w-12 h-12 rounded-2xl bg-black/10 border-3 border-black/10 flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-6 w-1/3 bg-black/10 rounded-lg" />
          <div className="h-4 w-1/4 bg-black/10 rounded-lg" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="space-y-6 flex-1">
        <div className="h-32 w-full rounded-3xl bg-black/10 border-3 border-black/10" />
        
        <div className="space-y-4">
          <div className="h-6 w-1/4 bg-black/10 rounded-lg mb-2" />
          <div className="h-20 w-full rounded-3xl bg-black/10 border-3 border-black/10" />
          <div className="h-20 w-full rounded-3xl bg-black/10 border-3 border-black/10" />
          <div className="h-20 w-full rounded-3xl bg-black/10 border-3 border-black/10" />
        </div>
      </div>
    </div>
  );
};
