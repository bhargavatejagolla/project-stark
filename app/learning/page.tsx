import { getLearningCourses } from '@/app/actions/os';
import { BookOpen, CheckCircle2 } from 'lucide-react';

export default async function LearningPage() {
  const courses = await getLearningCourses();

  return (
    <main className="min-h-screen w-full relative overflow-hidden text-white flex flex-col p-8 lg:p-12 animate-in fade-in duration-700">
      <header className="border-b border-white/10 pb-6 mb-12">
        <div className="flex items-center gap-3 mb-2">
          <span className="h-px w-8 bg-indigo-500 shadow-[0_0_10px_#6366f1]"></span>
          <p className="text-[10px] font-black tracking-[0.3em] text-indigo-400 uppercase drop-shadow-md">Learning Brain</p>
        </div>
        <h1 className="text-5xl font-black uppercase tracking-tighter">Knowledge Intake</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
        {courses && courses.length > 0 ? courses.map((course: any) => (
          <div key={course.id} className="group relative bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm cursor-default overflow-hidden">
            <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-indigo-900/10 to-transparent pointer-events-none"></div>
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/10 text-gray-300 px-4 py-1.5 rounded-full border border-white/5 shadow-sm">
                {course.platform}
              </span>
              {course.status === 'completed' && <CheckCircle2 className="h-6 w-6 text-emerald-500 drop-shadow-[0_0_5px_#10b981]" />}
            </div>
            
            <h3 className="text-3xl font-black tracking-tight mb-10 leading-tight group-hover:text-indigo-400 transition-colors relative z-10">{course.title}</h3>
            
            <div className="w-full relative z-10">
              <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">
                <span>Progress</span>
                <span className="text-emerald-400">{course.progress_percentage}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981] transition-all duration-1000" 
                  style={{ width: `${course.progress_percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        )) : (
          <div className="glass-panel p-16 text-center max-w-5xl col-span-full relative overflow-hidden group">
            <div className="absolute left-0 top-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full group-hover:bg-emerald-400/20 transition-all duration-1000"></div>
            <BookOpen className="h-16 w-16 text-emerald-400 mx-auto mb-6 opacity-80 drop-shadow-[0_0_15px_#10b981]" />
            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-widest text-glow-success">Skill Tree Inactive</h3>
            <p className="text-gray-400 text-sm font-medium tracking-wide mb-8">No learning paths detected in your knowledge matrix.</p>
            
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-full relative z-10">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Action Required:</span>
              <kbd className="bg-gray-800 border border-gray-700 rounded px-2 text-emerald-400 font-mono shadow-sm">Ctrl + K</kbd>
              <span className="text-gray-500 text-xs">→</span>
              <span className="font-mono text-emerald-300 text-xs bg-emerald-500/10 px-2 py-1 rounded">{"/course [Name]"}</span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
