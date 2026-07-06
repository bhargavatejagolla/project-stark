'use client';

export function JarvisAvatar({ state = 'idle' }: { state?: 'idle' | 'thinking' | 'speaking' }) {
  return (
    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2 backdrop-blur-md shadow-lg transition-all duration-300 hover:bg-white/10 cursor-default">
      <div className="relative flex h-3 w-3 items-center justify-center">
        {state !== 'idle' && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${state === 'idle' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-indigo-500 shadow-[0_0_12px_#6366f1]'}`}></span>
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
        JARVIS
      </span>
    </div>
  );
}
