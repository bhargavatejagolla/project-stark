'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Play, Square, X, Loader2, BrainCircuit, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logStudySession } from '@/app/actions/tasks';
import { getSkillName } from '@/app/actions/engines';
import { toast } from 'sonner';

function FocusBrainContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const skillId = searchParams.get('skillId') || undefined;

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [accumulatedSeconds, setAccumulatedSeconds] = useState(0);
  const [skillName, setSkillName] = useState<string | null>(null);

  useEffect(() => {
    if (skillId) {
      getSkillName(skillId).then(name => setSkillName(name));
    }
  }, [skillId]);
  
  // Phase 2: Socratic Gateway
  const [isReflecting, setIsReflecting] = useState(false);
  const [reflection, setReflection] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && startTime) {
      interval = setInterval(() => {
        setElapsedSeconds(accumulatedSeconds + Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      
      const handleVisibilityChange = () => {
        if (!document.hidden && isActive) {
          setElapsedSeconds(accumulatedSeconds + Math.floor((Date.now() - startTime) / 1000));
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);
      
      return () => {
        clearInterval(interval);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      };
    }
  }, [isActive, startTime, accumulatedSeconds]);

  const handlePause = () => {
    if (startTime) {
      const currentDelta = Math.floor((Date.now() - startTime) / 1000);
      const newAccumulated = accumulatedSeconds + currentDelta;
      setAccumulatedSeconds(newAccumulated);
      setElapsedSeconds(newAccumulated);
      setStartTime(null);
      setIsActive(false);
    }
  };

  const handleResume = () => {
    setStartTime(Date.now());
    setIsActive(true);
  };

  const handleEndSession = () => {
    setIsActive(false);
    if (elapsedSeconds < 60) {
      toast.error('Session too short to log.');
      router.push('/');
      return;
    }
    setIsReflecting(true);
  };

  const submitReflection = async () => {
    if (reflection.trim().length < 10) {
      toast.error('Reflection must be at least 10 characters. Be specific.');
      return;
    }
    setIsSubmitting(true);
    try {
      const minutes = Math.floor(elapsedSeconds / 60);
      
      // 1. Log the time and dynamically link it to the skill if provided
      await logStudySession(minutes, skillId);
      
      // 2. Trigger the Socratic AI Coach
      const res = await fetch('/api/groq/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reflection, durationMinutes: minutes }),
      });
      
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      toast.success('1Cr Coach Feedback', {
        description: `${data.analysis}\n\nTask Scheduled: ${data.next_task}`,
        duration: 10000,
        icon: '👁️',
      });
      
      // Hard redirect to guarantee immediate navigation and full reload of Mission Control
      window.location.href = '/';
    } catch (err) {
      toast.error('Failed to log session.');
      setIsSubmitting(false);
    }
  };

  const hours = Math.floor(elapsedSeconds / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds % 60;

  if (isReflecting) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center relative animate-in fade-in zoom-in-95 duration-500 bg-black">
        <div className="absolute inset-0 bg-indigo-900/10 blur-[100px] pointer-events-none"></div>
        <div className="max-w-2xl w-full p-8 z-10 text-center">
          <BrainCircuit className="h-16 w-16 text-indigo-400 mx-auto mb-6 animate-pulse" />
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Socratic Gateway</h2>
          <p className="text-gray-400 mb-8 font-medium">You logged <span className="text-emerald-400 font-bold">{Math.floor(elapsedSeconds / 60)} minutes</span>. To lock in this session, write 1 sentence describing your specific knowledge gap or what you mastered.</p>
          
          <textarea 
            autoFocus
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="e.g., I struggled with topological sort indegree tracking..."
            className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-6 text-lg text-white focus:outline-none focus:border-indigo-500 transition-colors mb-6 resize-none"
          />
          
          <Button 
            onClick={submitReflection}
            disabled={isSubmitting}
            className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-black tracking-widest text-lg"
          >
            {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : 'SUBMIT TO 1CR COACH'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center relative animate-in fade-in duration-1000">
      
      {!isActive && elapsedSeconds === 0 && (
        <button 
          onClick={() => router.push('/')}
          className="absolute top-8 right-8 text-gray-600 hover:text-white transition-colors"
        >
          <X className="h-8 w-8" />
        </button>
      )}

      <div className="text-center space-y-12">
        <div className="space-y-4">
          <h2 className="text-lg font-bold tracking-[0.2em] text-gray-500 uppercase">
            {skillName ? `Targeting: ${skillName}` : 'Live Focus Engine'}
          </h2>
          <p className="text-3xl font-light text-white">
            {isActive ? 'Deep Work Engaged' : (elapsedSeconds > 0 ? 'Session Paused' : 'Awaiting Engagement')}
          </p>
        </div>

        <div className="text-[10rem] md:text-[14rem] font-black text-white tabular-nums tracking-tighter leading-none drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          {hours > 0 ? `${String(hours).padStart(2, '0')}:` : ''}{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          {!isActive && elapsedSeconds === 0 ? (
            <Button 
              onClick={() => {
                setStartTime(Date.now());
                setIsActive(true);
              }} 
              size="lg"
              className="h-20 px-12 rounded-full bg-white text-black hover:bg-emerald-400 hover:text-black font-black tracking-widest text-xl transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)]"
            >
              <Play className="h-6 w-6 mr-3 fill-current" /> ENGAGE
            </Button>
          ) : (
            <>
              {isActive ? (
                <Button 
                  onClick={handlePause} 
                  size="lg"
                  className="h-20 px-12 rounded-full bg-amber-500 text-white hover:bg-amber-400 font-black tracking-widest text-xl transition-all shadow-[0_0_40px_rgba(245,158,11,0.3)]"
                >
                  <Pause className="h-6 w-6 mr-3 fill-current" /> PAUSE
                </Button>
              ) : (
                <Button 
                  onClick={handleResume} 
                  size="lg"
                  className="h-20 px-12 rounded-full bg-emerald-500 text-white hover:bg-emerald-400 font-black tracking-widest text-xl transition-all shadow-[0_0_40px_rgba(16,185,129,0.3)]"
                >
                  <Play className="h-6 w-6 mr-3 fill-current" /> RESUME
                </Button>
              )}
              <Button 
                onClick={handleEndSession} 
                size="lg"
                className="h-20 px-12 rounded-full bg-red-500 text-white hover:bg-red-400 font-black tracking-widest text-xl transition-all shadow-[0_0_40px_rgba(239,68,68,0.3)]"
              >
                <Square className="h-6 w-6 mr-3 fill-current" /> END SESSION
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FocusBrain() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
      </div>
    }>
      <FocusBrainContent />
    </Suspense>
  );
}
