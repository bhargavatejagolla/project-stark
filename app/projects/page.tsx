import { getProjects } from '@/app/actions/os';
import { FolderKanban, CheckCircle2, Clock, Play } from 'lucide-react';

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="min-h-screen w-full relative overflow-hidden text-white flex flex-col p-8 lg:p-12 animate-in fade-in duration-700">
      <header className="border-b border-white/10 pb-6 mb-12">
        <div className="flex items-center gap-3 mb-2">
          <span className="h-px w-8 bg-indigo-500 shadow-[0_0_10px_#6366f1]"></span>
          <p className="text-[10px] font-black tracking-[0.3em] text-indigo-400 uppercase drop-shadow-md">Project Brain</p>
        </div>
        <h1 className="text-5xl font-black uppercase tracking-tighter">Your Creations</h1>
      </header>

      <div className="grid grid-cols-1 gap-6 max-w-4xl">
        {projects && projects.length > 0 ? projects.map((project: any) => (
          <div key={project.id} className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-6">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${project.status === 'active' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50' : project.status === 'finished' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}>
                  {project.status === 'active' ? <Play className="h-5 w-5 fill-current" /> : project.status === 'finished' ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="text-2xl font-bold tracking-tight mb-1 group-hover:text-indigo-400 transition-colors">{project.title}</h3>
                  <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold">
                    <span className={project.status === 'active' ? 'text-indigo-400' : project.status === 'finished' ? 'text-emerald-400' : 'text-gray-500'}>
                      ● {project.status}
                    </span>
                    <span className="text-gray-600">|</span>
                    <span className="text-gray-400">{project.progress_percentage}% Compiled</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Background progress fill */}
            <div 
              className="absolute left-0 bottom-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 opacity-80" 
              style={{ width: `${project.progress_percentage}%` }}
            ></div>
          </div>
        )) : (
          <div className="glass-panel p-16 text-center max-w-4xl relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full group-hover:bg-indigo-400/20 transition-all duration-1000"></div>
            <FolderKanban className="h-16 w-16 text-indigo-400 mx-auto mb-6 opacity-80 drop-shadow-[0_0_15px_#6366f1]" />
            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-widest text-glow-primary">Deployment Matrix Offline</h3>
            <p className="text-gray-400 text-sm font-medium tracking-wide mb-8">No active projects detected in your portfolio engine.</p>
            
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-full">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Action Required:</span>
              <kbd className="bg-gray-800 border border-gray-700 rounded px-2 text-indigo-400 font-mono shadow-sm">Ctrl + K</kbd>
              <span className="text-gray-500 text-xs">→</span>
              <span className="font-mono text-indigo-300 text-xs bg-indigo-500/10 px-2 py-1 rounded">{"/project [Name]"}</span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
