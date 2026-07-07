'use client';

import { useEffect, useRef } from 'react';

type DayData = {
  date: string;
  minutes: number;
  intensity: number;
  dayOfWeek: number;
};

export function ContributionHeatmap({ grid }: { grid: DayData[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the end (today) when the component mounts
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [grid]);

  // GitHub contribution graph logic: 
  // - Columns are weeks
  // - Rows are days of the week (Sunday=0 to Saturday=6)
  // Our data comes chronologically. We need to chunk it into columns.
  
  // 1. Pad the beginning so the first column starts on the correct day of week
  const firstDay = grid[0]?.dayOfWeek || 0;
  const padding = Array.from({ length: firstDay }).map((_, i) => null);
  
  const paddedGrid = [...padding, ...grid];
  
  // 2. Chunk into weeks
  const weeks = [];
  for (let i = 0; i < paddedGrid.length; i += 7) {
    weeks.push(paddedGrid.slice(i, i + 7));
  }

  return (
    <div className="pt-8">
      <h3 className="text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase mb-6 flex justify-between">
        <span>Global Matrix (365 Days)</span>
        <span className="text-emerald-500">{grid.reduce((sum, d) => sum + (d.minutes > 0 ? 1 : 0), 0)} Active Days</span>
      </h3>
      
      <div 
        ref={scrollRef}
        className="flex gap-2 w-full max-w-full overflow-x-auto pb-6 custom-scrollbar"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="flex gap-1.5 min-w-max pr-4">
          {weeks.map((week, wIndex) => (
            <div key={wIndex} className="flex flex-col gap-1.5">
              {/* Force 7 rows per column */}
              {Array.from({ length: 7 }).map((_, rIndex) => {
                const day = week[rIndex];

                if (!day) {
                  return <div key={rIndex} className="h-3 w-3 sm:h-4 sm:w-4 shrink-0 rounded-sm bg-transparent pointer-events-none" />;
                }

                let bgClass = "bg-white/5 border-white/5";
                if (day.intensity === 1) bgClass = "bg-emerald-500/20 border-emerald-500/20";
                if (day.intensity === 2) bgClass = "bg-emerald-500/40 border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]";
                if (day.intensity === 3) bgClass = "bg-emerald-500/70 border-emerald-500/70 shadow-[0_0_12px_rgba(16,185,129,0.4)]";
                if (day.intensity === 4) bgClass = "bg-emerald-400 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.6)]";

                return (
                  <div 
                    key={rIndex} 
                    className={`h-3 w-3 sm:h-4 sm:w-4 shrink-0 rounded-sm border ${bgClass} transition-all duration-300 hover:scale-125 hover:z-10 flex items-center justify-center group/tooltip relative cursor-crosshair`}
                  >
                    <div className="opacity-0 group-hover/tooltip:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black/90 text-white text-[10px] font-mono py-1.5 px-3 rounded pointer-events-none whitespace-nowrap z-50 border border-white/10 transition-opacity drop-shadow-xl shadow-black">
                      <span className="font-bold text-emerald-400">{day.minutes > 0 ? `${day.minutes} min` : 'No Activity'}</span>
                      <span className="text-gray-500 block text-[8px] mt-0.5">{new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-2 mt-2 justify-end text-[10px] text-gray-500 uppercase font-black tracking-widest">
        <span>Less</span>
        <div className="h-3 w-3 rounded-sm bg-white/5"></div>
        <div className="h-3 w-3 rounded-sm bg-emerald-500/20"></div>
        <div className="h-3 w-3 rounded-sm bg-emerald-500/40"></div>
        <div className="h-3 w-3 rounded-sm bg-emerald-500/70"></div>
        <div className="h-3 w-3 rounded-sm bg-emerald-400"></div>
        <span>More</span>
      </div>
    </div>
  );
}
