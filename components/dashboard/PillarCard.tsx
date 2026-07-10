'use client';

import { Server, Users, Code2, Play, Brain, Trash2, Bot, Cpu, Network, Database, Workflow, TerminalSquare, Activity, Shield, Braces, Layers } from 'lucide-react';
import Link from 'next/link';
import { deleteCustomPillar } from '@/app/actions/engines';
import { toast } from 'sonner';
import { useState } from 'react';

export function PillarCard({ pillar }: { pillar: any }) {
  const [isDeleting, setIsDeleting] = useState(false);

  // Full CSS theme map to guarantee Tailwind v4 compilation
  const themeMap: Record<string, any> = {
    blue: {
      border: 'border-blue-500/20 hover:border-blue-500/40',
      gradient: 'from-blue-900/20',
      glow: 'bg-blue-500/10',
      text: 'text-blue-400',
      bar: 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]',
      btn: 'bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]'
    },
    indigo: {
      border: 'border-indigo-500/20 hover:border-indigo-500/40',
      gradient: 'from-indigo-900/20',
      glow: 'bg-indigo-500/10',
      text: 'text-indigo-400',
      bar: 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]',
      btn: 'bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]'
    },
    emerald: {
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      gradient: 'from-emerald-900/20',
      glow: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      bar: 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]',
      btn: 'bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]'
    },
    cyan: {
      border: 'border-cyan-500/20 hover:border-cyan-500/40',
      gradient: 'from-cyan-900/20',
      glow: 'bg-cyan-500/10',
      text: 'text-cyan-400',
      bar: 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]',
      btn: 'bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]'
    },
    orange: {
      border: 'border-orange-500/20 hover:border-orange-500/40',
      gradient: 'from-orange-900/20',
      glow: 'bg-orange-500/10',
      text: 'text-orange-400',
      bar: 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]',
      btn: 'bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-300 group-hover:shadow-[0_0_15px_rgba(249,115,22,0.2)]'
    },
    yellow: {
      border: 'border-yellow-500/20 hover:border-yellow-500/40',
      gradient: 'from-yellow-900/20',
      glow: 'bg-yellow-500/10',
      text: 'text-yellow-400',
      bar: 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]',
      btn: 'bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 group-hover:shadow-[0_0_15px_rgba(234,179,8,0.2)]'
    },
    purple: {
      border: 'border-purple-500/20 hover:border-purple-500/40',
      gradient: 'from-purple-900/20',
      glow: 'bg-purple-500/10',
      text: 'text-purple-400',
      bar: 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]',
      btn: 'bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]'
    }
  };

  const getColorName = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('machine learning') || t.includes('ml') || t.includes('ai') || t.includes('artificial intelligence') || t.includes('neural')) return 'blue';
    if (t.includes('dsa') || t.includes('algorithm') || t.includes('data structure') || t.includes('leetcode')) return 'indigo';
    if (t.includes('devops') || t.includes('cloud') || t.includes('infrastructure') || t.includes('aws')) return 'emerald';
    if (t.includes('system') || t.includes('design') || t.includes('architecture') || t.includes('backend')) return 'cyan';
    if (t.includes('behavior') || t.includes('leadership') || t.includes('culture') || t.includes('soft')) return 'orange';
    if (t.includes('database') || t.includes('sql') || t.includes('postgres')) return 'yellow';
    return 'purple';
  };

  const getAnimatedIcon = (type: string) => {
    const t = type.toLowerCase();
    
    if (t.includes('machine learning') || t.includes('ml') || t.includes('ai') || t.includes('artificial intelligence') || t.includes('neural')) {
      return (
        <div className="relative group/icon cursor-pointer">
          <div className="absolute inset-0 bg-blue-500/30 blur-2xl rounded-full animate-pulse"></div>
          <Network className="relative z-10 h-12 w-12 text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.8)] transition-transform duration-700 ease-in-out group-hover/icon:scale-125 group-hover/icon:rotate-[360deg]" />
        </div>
      );
    }
    
    if (t.includes('dsa') || t.includes('algorithm') || t.includes('data structure') || t.includes('leetcode')) {
      return (
        <div className="relative group/icon cursor-pointer">
          <div className="absolute inset-0 bg-indigo-500/30 blur-2xl rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <Braces className="relative z-10 h-12 w-12 text-indigo-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.8)] transition-transform duration-500 ease-bounce group-hover/icon:scale-125 group-hover/icon:-translate-y-3" />
        </div>
      );
    }
    
    if (t.includes('devops') || t.includes('cloud') || t.includes('infrastructure') || t.includes('aws')) {
      return (
        <div className="relative group/icon cursor-pointer">
          <div className="absolute inset-0 bg-emerald-500/30 blur-2xl rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <Server className="relative z-10 h-12 w-12 text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)] transition-transform duration-500 group-hover/icon:scale-110 group-hover/icon:-rotate-12 group-hover/icon:skew-x-6" />
        </div>
      );
    }

    if (t.includes('system') || t.includes('design') || t.includes('architecture') || t.includes('backend')) {
      return (
        <div className="relative group/icon cursor-pointer">
          <div className="absolute inset-0 bg-cyan-500/30 blur-2xl rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <Layers className="relative z-10 h-12 w-12 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] transition-all duration-700 group-hover/icon:scale-125 group-hover/icon:rotate-180" />
        </div>
      );
    }
    
    if (t.includes('behavior') || t.includes('leadership') || t.includes('culture') || t.includes('soft')) {
      return (
        <div className="relative group/icon cursor-pointer">
          <div className="absolute inset-0 bg-orange-500/30 blur-2xl rounded-full animate-pulse" style={{ animationDelay: '0.7s' }}></div>
          <Users className="relative z-10 h-12 w-12 text-orange-400 drop-shadow-[0_0_15px_rgba(249,115,22,0.8)] transition-transform duration-500 group-hover/icon:scale-125 group-hover/icon:rotate-12 group-hover/icon:translate-x-2" />
        </div>
      );
    }
    
    if (t.includes('database') || t.includes('sql') || t.includes('postgres')) {
      return (
        <div className="relative group/icon cursor-pointer">
          <div className="absolute inset-0 bg-yellow-500/30 blur-2xl rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          <Database className="relative z-10 h-12 w-12 text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.8)] transition-transform duration-500 group-hover/icon:scale-125 group-hover/icon:-translate-y-2" />
        </div>
      );
    }

    // Fallback
    return (
      <div className="relative group/icon cursor-pointer">
        <div className="absolute inset-0 bg-purple-500/30 blur-2xl rounded-full animate-pulse" style={{ animationDelay: '1.2s' }}></div>
        <Brain className="relative z-10 h-12 w-12 text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)] transition-all duration-700 group-hover/icon:scale-125 group-hover/icon:rotate-12" />
      </div>
    );
  };

  const colorKey = getColorName(pillar.name);
  const theme = themeMap[colorKey] || themeMap.purple;

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to permanently delete the ${pillar.name} pillar?`)) return;
    setIsDeleting(true);
    try {
      await deleteCustomPillar(pillar.id);
      toast.success(`${pillar.name} pillar deleted.`);
    } catch (err: any) {
      toast.error('Failed to delete pillar');
      setIsDeleting(false);
    }
  };

  if (isDeleting) return null;

  return (
    <div className={`glass-panel p-8 group relative overflow-hidden transition-colors duration-500 flex flex-col border ${theme.border}`}>
      <div className={`absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l ${theme.gradient} to-transparent pointer-events-none transition-opacity duration-500 opacity-50 group-hover:opacity-100`}></div>
      <div className={`absolute -right-10 -top-10 w-40 h-40 ${theme.glow} blur-3xl rounded-full transition-transform duration-1000 group-hover:scale-150`}></div>
      
      <button 
        onClick={handleDelete}
        className="absolute top-4 right-4 z-20 text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 bg-black/40 p-2 rounded-full"
      >
        <Trash2 className="h-4 w-4" />
      </button>
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        {getAnimatedIcon(pillar.name)}
        <div className="text-right">
          <p className="text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase mb-1 transition-colors group-hover:text-gray-400">Target Hours</p>
          <p className="font-mono font-bold text-gray-300 transition-colors group-hover:text-white">{pillar.hours.toFixed(1)} / {pillar.target}h</p>
        </div>
      </div>

      <div className="relative z-10 mb-8 pr-6 mt-4">
        <h3 className={`text-2xl font-black tracking-tight mb-2 leading-tight text-white transition-colors duration-300 group-hover:${theme.text} drop-shadow-md`}>{pillar.name}</h3>
        <p className="text-sm font-medium text-gray-400 h-10 transition-colors group-hover:text-gray-300">{pillar.description}</p>
      </div>

      <div className="w-full relative z-10 mb-8">
        <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">
          <span>Readiness</span>
          <span className={`${theme.text} font-black drop-shadow-md`}>{pillar.readiness}%</span>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden shadow-inner">
          <div 
            className={`h-full ${theme.bar} transition-all duration-1000 ease-out relative`}
            style={{ width: `${pillar.hours > 0 ? Math.max(1, pillar.readiness) : 0}%` }}
          >
            <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite] -skew-x-12 translate-x-[-100%]"></div>
          </div>
        </div>
      </div>

      <div className="mt-auto relative z-10">
        <Link href={`/focus?skillId=${pillar.id}`}>
          <button className={`w-full ${theme.btn} font-black uppercase tracking-[0.2em] text-xs py-4 rounded-xl transition-all duration-500 flex items-center justify-center gap-2 relative overflow-hidden`}>
            <div className="absolute inset-0 bg-white/5 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
            <Play className="h-3 w-3 fill-current relative z-10" /> 
            <span className="relative z-10">Initialize Training</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
