'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const USER_ID = '5ab9ee3e-4bfc-4e51-8935-cbb926668752';

export function FocusTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Log session to Supabase when timer finishes
  const logSession = async (duration: number) => {
    await supabase.from('study_sessions').insert({
      user_id: USER_ID,
      duration_minutes: duration,
      ended_at: new Date().toISOString(),
    });
  };

  const startTimer = () => {
    if (minutes === 0 && seconds === 0) {
      setMinutes(25);
      setSeconds(0);
    }
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const resetTimer = () => {
    stopTimer();
    setMinutes(25);
    setSeconds(0);
    setIsBreak(false);
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // TIMER COMPLETE!
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            
            if (!isBreak) {
              logSession(25); // Log the focus session
              toast.success('🔥 Focus Session Complete! Session logged.');
              // Automatically start break
              setMinutes(5);
              setSeconds(0);
              setIsBreak(true);
              setIsRunning(true);
            } else {
              setMinutes(25);
              setSeconds(0);
              setIsBreak(false);
            }
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, minutes, seconds, isBreak]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border shadow-inner">
      <h3 className="text-sm font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400">
        {isBreak ? '☕ Break Time' : '⚡ Focus Cannon'}
      </h3>
      <div className="text-6xl font-bold tabular-nums my-4 font-mono">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <div className="flex gap-3">
        {!isRunning ? (
          <button
            onClick={startTimer}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition text-sm font-medium"
          >
            Start
          </button>
        ) : (
          <button
            onClick={stopTimer}
            className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition text-sm font-medium"
          >
            Pause
          </button>
        )}
        <button
          onClick={resetTimer}
          className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-300 transition text-sm font-medium"
        >
          Reset
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-4 text-center">
        Sessions are automatically logged to your daily progress.
      </p>
    </div>
  );
}
