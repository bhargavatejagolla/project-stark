import { calculateStreak, calculateMissionDay, calculateEnergy, calculateSystemState, getConsistencyGrid, getDailyDirective } from '@/app/actions/engines';
import { getTodayTasks } from '@/app/actions/tasks';
import { JarvisCommand } from '@/components/dashboard/JarvisCommand';
import { EmergencyToggle } from '@/components/dashboard/EmergencyToggle';
import { SystemStatusHUD } from '@/components/modules/SystemStatusHUD';
import { EmbeddedTerminal } from '@/components/dashboard/EmbeddedTerminal';
import { TaskList } from '@/components/dashboard/TaskList';
import { Play, AlertTriangle, Zap, CheckCircle2, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default async function Home() {
  const streak = await calculateStreak();
  const missionDay = await calculateMissionDay();
  const energy = await calculateEnergy();
  const systemState = await calculateSystemState();
  const consistencyGrid = await getConsistencyGrid();
  const directive = await getDailyDirective();
  const tasks = await getTodayTasks();
  
  return (
    <main className="min-h-screen w-full relative overflow-hidden text-white flex flex-col p-8 lg:p-12 animate-in fade-in duration-700">
      
      {/* Dynamic Header */}
      <header className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-end border-b border-white/10 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="h-px w-8 bg-indigo-500 shadow-[0_0_10px_#6366f1]"></span>
            <p className="text-[10px] font-black tracking-[0.3em] text-indigo-400 uppercase drop-shadow-md">Mission Control</p>
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter drop-shadow-lg text-white">DAY {missionDay}</h1>
        </div>
        
        <div className="flex gap-12 text-right">
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] mb-1">Target</p>
            <p className="text-xl font-bold tracking-tight text-gray-300">FAANG AI Engineer</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] mb-1">Probability</p>
            <p className="text-4xl font-black text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">82%</p>
          </div>
        </div>
      </header>

      {/* VOICE OF JARVIS HUD */}
      <div className={`glass-panel mb-12 p-6 md:p-8 relative overflow-hidden group border-${systemState.color}-500/30 w-full max-w-7xl`}>
        <div className={`absolute right-0 top-0 w-64 h-64 bg-${systemState.color}-500/10 blur-3xl rounded-full opacity-50`}></div>
        
        <div className="flex flex-col md:flex-row items-start gap-8 relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              {systemState.status === 'CRITICAL' && <AlertTriangle className="h-8 w-8 text-red-500 shrink-0 animate-pulse drop-shadow-[0_0_15px_#ef4444]" />}
              {systemState.status === 'OPTIMAL' && <CheckCircle2 className="h-8 w-8 text-emerald-400 shrink-0 drop-shadow-[0_0_15px_#10b981]" />}
              {systemState.status === 'WARNING' && <Zap className="h-8 w-8 text-orange-400 shrink-0 drop-shadow-[0_0_15px_#f97316]" />}
              {systemState.status === 'NOMINAL' && <Play className="h-8 w-8 text-indigo-400 shrink-0" />}
              <p className={`text-xs font-black uppercase tracking-[0.25em] text-${systemState.color}-400 drop-shadow-sm`}>SYS.{systemState.status}</p>
            </div>
            <p className={`text-xl md:text-2xl font-bold tracking-wide text-${systemState.color}-100/90 leading-relaxed`}>{systemState.message}</p>
          </div>

          <div className={`md:w-1/3 bg-black/40 p-5 rounded-2xl border border-${systemState.color}-500/20`}>
            <p className={`text-[10px] font-black tracking-[0.2em] uppercase text-${systemState.color}-300 mb-3 flex items-center gap-2`}>
              <Zap className="h-3 w-3" /> Action Plan
            </p>
            <ul className="space-y-3">
              {systemState.battlePlan?.map((step: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300 font-medium">
                  <span className={`text-${systemState.color}-500 mt-0.5`}><ChevronRight className="h-4 w-4" /></span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Grid Layout for Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-7xl mt-4">
        
        {/* Left Column (Mission & Timeline) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Dynamic Mission Card */}
          <div className="relative group transition-transform duration-700 hover:-translate-y-1 w-full">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition duration-700"></div>
            
            <div className="glass-panel p-10 overflow-hidden relative">
              <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-indigo-900/20 to-transparent pointer-events-none"></div>
              
              <p className="text-glow-primary text-indigo-400 font-black uppercase tracking-[0.2em] text-[10px] mb-4">Primary Objective (Weakest Pillar Override)</p>
              <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter max-w-[90%] leading-tight text-white drop-shadow-lg">
                {directive.name}
              </h2>
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mt-12">
                <div className="w-full max-w-md">
                  <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">
                    <span>Neural Link Progress</span>
                    <span className="text-glow-success text-emerald-400">{directive.readiness}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 shadow-[0_0_15px_#10b981] transition-all duration-1000"
                      style={{ width: `${directive.readiness > 0 ? Math.max(1, directive.readiness) : 0}%` }}
                    ></div>
                  </div>
                </div>
                
                <Link href={directive.isFallback ? "/career" : `/focus?skillId=${directive.id}`} className="flex-shrink-0">
                  <button className="bg-white text-black font-black uppercase tracking-[0.2em] text-xs px-10 py-5 rounded-full hover:bg-indigo-500 hover:text-white hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-500 flex items-center gap-3 transform hover:scale-105 active:scale-95">
                    <Play className="h-4 w-4 fill-current" />
                    Engage
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <EmbeddedTerminal />

          {/* Deep Work Consistency Grid */}
          <div className="pt-8">
            <h3 className="text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase mb-6">30-Day Global Matrix</h3>
            <div className="flex gap-2 w-full max-w-full overflow-x-auto pb-4 hide-scrollbar">
              {consistencyGrid.map((day: any, i: number) => {
                let bgClass = "bg-white/5 border-white/5";
                if (day.intensity === 1) bgClass = "bg-emerald-500/20 border-emerald-500/20";
                if (day.intensity === 2) bgClass = "bg-emerald-500/40 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]";
                if (day.intensity === 3) bgClass = "bg-emerald-500/70 border-emerald-500/70 shadow-[0_0_15px_rgba(16,185,129,0.5)]";
                if (day.intensity === 4) bgClass = "bg-emerald-400 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.8)]";

                return (
                  <div 
                    key={i} 
                    className={`h-12 w-12 shrink-0 rounded-lg border ${bgClass} transition-all duration-300 hover:scale-110 flex items-center justify-center group/tooltip relative cursor-crosshair`}
                  >
                    <div className="opacity-0 group-hover/tooltip:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[9px] font-mono py-1 px-3 rounded pointer-events-none whitespace-nowrap z-50 border border-white/10 transition-opacity">
                      {day.minutes > 0 ? `${day.minutes} min` : 'No Activity'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
        </div>

        {/* Right Column (Modules) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
           <SystemStatusHUD streak={streak} energy={energy} />
           <TaskList initialTasks={tasks} />
        </div>
      </div>

      <JarvisCommand />
      <EmergencyToggle />
    </main>
  );
}
