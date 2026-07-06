'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

import { executeJarvisCommand } from '@/app/actions/os';

export function JarvisCommand() {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
        setPrompt('');
        setError('');
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setOpen]);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');

    try {
      // 1. Check for manual commands first
      if (prompt.startsWith('/task') || prompt.startsWith('/study') || prompt.startsWith('/project') || prompt.startsWith('/course')) {
        const res = await executeJarvisCommand(prompt);
        if (!res.success) throw new Error(res.message);
        
        if (prompt.startsWith('/study')) {
          toast.success('NEURAL UPLOAD COMPLETE', {
            description: res.message,
            style: {
              background: 'rgba(16, 185, 129, 0.1)',
              borderColor: 'rgba(16, 185, 129, 0.5)',
              color: '#10b981',
              boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)'
            },
            icon: '🧠',
            duration: 5000,
          });
        } else {
          toast.success(res.message);
        }
        
        setOpen(false);
        router.refresh();
        return;
      }

      // 1.5 Check for Socratic Reflection
      if (prompt.startsWith('/reflect ')) {
        const reflectionText = prompt.replace('/reflect ', '').trim();
        const res = await fetch('/api/groq/reflect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reflection: reflectionText }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || 'Reflection failed.');
        
        toast.success('1Cr Coach Feedback', {
          description: `${data.analysis}\n\nTask Scheduled for Tomorrow: ${data.next_task}`,
          duration: 10000,
          icon: '👁️',
        });
        
        setOpen(false);
        router.refresh();
        return;
      }

      // 1.8 Interrogation Protocol
      if (prompt.trim() === '/grill-me') {
        const res = await fetch('/api/groq/grill', { method: 'POST' });
        const data = await res.json();
        if (!data.success) throw new Error('Interrogation failed.');
        
        toast.error('L5 INTERROGATION PROTOCOL', {
          description: data.question,
          duration: 30000,
          style: {
            background: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'rgba(239, 68, 68, 0.5)',
            color: '#ef4444',
            boxShadow: '0 0 30px rgba(239, 68, 68, 0.3)'
          },
          icon: '🔥',
        });
        
        setOpen(false);
        return;
      }

      // 2. Otherwise, use Groq AI to plan the day
      const res = await fetch('/api/groq/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();

      if (!data.success) throw new Error(data.error || 'AI failed to process the request.');

      // 3. Save AI plan to DB
      const saveRes = await fetch('/api/save-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data.plan),
      });
      
      const saveData = await saveRes.json();
      if (!saveData.success) throw new Error(saveData.error || 'Failed to save the AI plan.');

      toast.success(`Jarvis activated: ${data.plan.goal_title} scheduled.`);
      setOpen(false);
      router.refresh(); 
    } catch (err: any) {
      setError(err.message || 'System fault encountered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl bg-[#09090b]/90 backdrop-blur-3xl border border-indigo-500/20 shadow-[0_0_50px_rgba(99,102,241,0.15)] text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl font-black uppercase tracking-widest text-indigo-100">
            <Sparkles className="h-6 w-6 text-indigo-400" /> Jarvis Link
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-6">
          <Input
            autoFocus
            placeholder="Type a goal or a command (/task, /study, /project, /course, /reflect)"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="py-8 text-xl bg-white/5 border-white/10 text-white placeholder-gray-500 focus-visible:ring-indigo-500/50 shadow-inner"
          />
          {error && <p className="text-red-400 text-sm font-mono flex items-center gap-2">⚠️ {error}</p>}
          <Button 
            onClick={handleSubmit} 
            disabled={loading} 
            className="w-full bg-indigo-600/80 hover:bg-indigo-500 text-white border border-indigo-400/50 h-14 text-lg font-bold tracking-widest shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all duration-300"
          >
            {loading ? (
              <>
                <Loader2 className="mr-3 h-5 w-5 animate-spin" /> ENGAGING NEURAL NET...
              </>
            ) : (
              'EXECUTE DIRECTIVE'
            )}
          </Button>
          <div className="flex flex-col gap-2 mt-4">
            <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">Supported Protocols</p>
            <div className="flex flex-wrap justify-center gap-3 text-[10px] font-mono text-indigo-400">
              <span className="bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">NL Planner (AI)</span>
              <span className="bg-orange-500/10 text-orange-400 px-2 py-1 rounded border border-orange-500/20">/reflect [thoughts]</span>
              <span className="bg-red-500/10 text-red-400 px-2 py-1 rounded border border-red-500/20">/grill-me</span>
              <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">/task [name]</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
