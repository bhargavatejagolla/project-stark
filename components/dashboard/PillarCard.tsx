'use client';

import { Server, Users, Code2, Play, Brain, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { deleteCustomPillar } from '@/app/actions/engines';
import { toast } from 'sonner';
import { useState } from 'react';

export function PillarCard({ pillar }: { pillar: any }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const getIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('dsa') || t.includes('algorithm')) return <Code2 className="h-10 w-10 text-indigo-400 opacity-80" />;
    if (t.includes('system') || t.includes('design')) return <Server className="h-10 w-10 text-emerald-400 opacity-80" />;
    if (t.includes('behavior')) return <Users className="h-10 w-10 text-orange-400 opacity-80" />;
    return <Brain className="h-10 w-10 text-purple-400 opacity-80" />;
  };

  const getColor = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('dsa') || t.includes('algorithm')) return 'indigo';
    if (t.includes('system') || t.includes('design')) return 'emerald';
    if (t.includes('behavior')) return 'orange';
    return 'purple';
  };

  const color = getColor(pillar.type);

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
    <div className={`glass-panel p-8 group relative overflow-hidden border-${color}-500/20 hover:border-${color}-500/40 transition-colors flex flex-col`}>
      <div className={`absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-${color}-900/20 to-transparent pointer-events-none`}></div>
      <div className={`absolute -right-10 -top-10 w-40 h-40 bg-${color}-500/10 blur-3xl rounded-full`}></div>
      
      <button 
        onClick={handleDelete}
        className="absolute top-4 right-4 z-20 text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 bg-black/40 p-2 rounded-full"
      >
        <Trash2 className="h-4 w-4" />
      </button>
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        {getIcon(pillar.type)}
        <div className="text-right">
          <p className="text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase mb-1">Target Hours</p>
          <p className="font-mono font-bold text-gray-300">{pillar.hours.toFixed(1)} / {pillar.target}h</p>
        </div>
      </div>

      <div className="relative z-10 mb-8 pr-6">
        <h3 className="text-2xl font-black tracking-tight mb-2 leading-tight text-white group-hover:text-glow-primary transition-colors">{pillar.name}</h3>
        <p className="text-sm font-medium text-gray-400 h-10">{pillar.description}</p>
      </div>

      <div className="w-full relative z-10 mb-8">
        <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">
          <span>Readiness</span>
          <span className={`text-${color}-400`}>{pillar.readiness}%</span>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-${color}-500 shadow-[0_0_10px_rgba(var(--${color}-500),0.8)] transition-all duration-1000`}
            style={{ width: `${pillar.readiness}%` }}
          ></div>
        </div>
      </div>

      <div className="mt-auto relative z-10">
        <Link href={`/focus?skillId=${pillar.id}`}>
          <button className={`w-full bg-${color}-500/10 hover:bg-${color}-500/20 border border-${color}-500/30 text-${color}-300 font-black uppercase tracking-[0.2em] text-xs py-4 rounded-xl transition-all flex items-center justify-center gap-2 group-hover:shadow-[0_0_15px_rgba(var(--${color}-500),0.2)]`}>
            <Play className="h-3 w-3 fill-current" /> Initialize Training
          </button>
        </Link>
      </div>
    </div>
  );
}
