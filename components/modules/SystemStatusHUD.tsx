'use client';
import { motion } from 'framer-motion';
import { Activity, Zap, Brain, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SystemStatusHUD({ streak = 0, energy = 100 }: { streak?: number, energy?: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="glass-panel glass-panel-hover p-6 flex flex-col gap-6 relative overflow-hidden group"
    >
      <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full group-hover:bg-indigo-400/20 transition-all duration-1000"></div>
      
      <div className="flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_#6366f1]"></div>
          <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-indigo-400 drop-shadow-md">System Status</h2>
        </div>
        <span className="text-[9px] font-mono text-gray-500">SYS.ONLINE</span>
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col gap-2 hover:bg-white/10 transition-colors">
          <div className="flex items-center justify-between">
            <Zap className="h-4 w-4 text-emerald-400 drop-shadow-[0_0_5px_#10b981]" />
            <span className="text-emerald-400 text-xs font-mono font-bold">{energy}%</span>
          </div>
          <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Energy Reserve</p>
        </div>

        <div className={`bg-white/5 border ${streak > 2 ? 'border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.2)]' : 'border-white/5'} rounded-xl p-4 flex flex-col gap-2 hover:bg-white/10 transition-all`}>
          <div className="flex items-center justify-between">
            {streak > 2 ? (
              <Flame className="h-4 w-4 text-orange-400 drop-shadow-[0_0_8px_#f97316] animate-pulse" />
            ) : (
              <Brain className="h-4 w-4 text-purple-400 drop-shadow-[0_0_5px_#a855f7]" />
            )}
            <span className={`${streak > 2 ? 'text-orange-400' : 'text-purple-400'} text-xs font-mono font-bold`}>{streak}d</span>
          </div>
          <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">{streak > 2 ? 'Blazing Streak' : 'Neural Streak'}</p>
        </div>

        <div className="col-span-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 hover:bg-indigo-500/20 transition-all group/insight cursor-default">
          <div className="flex items-start gap-3">
            <Activity className="h-4 w-4 text-indigo-400 mt-0.5" />
            <div>
              <p className="text-indigo-200 text-sm font-medium leading-relaxed group-hover/insight:text-white transition-colors">
                "Neural retention is optimal. Proceeding with ML module will yield maximum ROI."
              </p>
              <p className="text-[9px] uppercase tracking-widest text-indigo-400/50 mt-2 font-bold">— Jarvis Insight</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
