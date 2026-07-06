import { getCourseAnalytics } from '@/app/actions/analytics';
import { Activity, Flame, Clock } from 'lucide-react';

export default async function AnalyticsPage() {
  const analytics = await getCourseAnalytics();

  return (
    <main className="min-h-screen w-full relative overflow-hidden text-white flex flex-col p-8 lg:p-12 animate-in fade-in duration-700">
      <header className="border-b border-white/10 pb-6 mb-12">
        <div className="flex items-center gap-3 mb-2">
          <span className="h-px w-8 bg-indigo-500 shadow-[0_0_10px_#6366f1]"></span>
          <p className="text-[10px] font-black tracking-[0.3em] text-indigo-400 uppercase drop-shadow-md">The Analytics Brain</p>
        </div>
        <h1 className="text-5xl font-black uppercase tracking-tighter">Course Telemetry</h1>
      </header>

      {analytics.length === 0 ? (
        <div className="glass-panel p-12 text-center max-w-7xl w-full">
          <Activity className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 font-medium tracking-wide">No courses found. Add a pillar in The 1Cr Engine to begin tracking.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-12 max-w-7xl w-full">
          {analytics.map((course) => {
            // Colors can be dynamic, but let's stick to emerald for positive matrix
            return (
              <div key={course.id} className="glass-panel p-8 relative overflow-hidden group border-white/10 hover:border-emerald-500/30 transition-colors">
                <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-emerald-900/10 to-transparent pointer-events-none"></div>
                
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8 relative z-10">
                  <div>
                    <h2 className="text-3xl font-black tracking-tighter text-white mb-2 uppercase">{course.name}</h2>
                    <div className="flex items-center gap-4 text-sm font-medium text-gray-400">
                      <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-emerald-400" /> {course.logged_hours.toFixed(1)} / {course.target_hours}h</span>
                      <span className="flex items-center gap-1.5"><Flame className="h-4 w-4 text-orange-400" /> {Math.min(100, Math.round((course.logged_hours / course.target_hours) * 100))}% Mastery</span>
                    </div>
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase mb-4">90-Day Focus Matrix</h3>
                  
                  {/* GitHub-style matrix. We can wrap it nicely */}
                  <div className="flex flex-wrap gap-2 w-full">
                    {course.grid.map((day: any, i: number) => {
                      let bgClass = "bg-white/5 border-white/5";
                      if (day.intensity === 1) bgClass = "bg-emerald-500/20 border-emerald-500/20";
                      if (day.intensity === 2) bgClass = "bg-emerald-500/40 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]";
                      if (day.intensity === 3) bgClass = "bg-emerald-500/70 border-emerald-500/70 shadow-[0_0_15px_rgba(16,185,129,0.5)]";
                      if (day.intensity === 4) bgClass = "bg-emerald-400 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.8)]";

                      return (
                        <div 
                          key={i} 
                          className={`h-6 w-6 sm:h-8 sm:w-8 shrink-0 rounded border ${bgClass} transition-all duration-300 hover:scale-110 flex items-center justify-center group/tooltip relative cursor-crosshair`}
                        >
                          <div className="opacity-0 group-hover/tooltip:opacity-100 absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[9px] font-mono py-1 px-3 rounded pointer-events-none whitespace-nowrap z-50 border border-white/10 transition-opacity">
                            {day.date}: {day.minutes > 0 ? `${day.minutes} min` : 'No Activity'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
