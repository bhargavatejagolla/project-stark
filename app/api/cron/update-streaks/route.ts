import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const USER_ID = '5ab9ee3e-4bfc-4e51-8935-cbb926668752';

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Improvement: Check if ANY task was done that was due today, 
    // OR if they logged a study session today. This is bulletproof.
    
    // 1. Check completed tasks
    const { count: taskCount, error: taskError } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', USER_ID)
      .eq('status', 'done')
      .eq('due_date', today);

    // 2. Check study sessions (Pomodoro)
    const { count: sessionCount, error: sessionError } = await supabase
      .from('study_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', USER_ID)
      .gte('ended_at', `${today}T00:00:00.000Z`);

    const hasWorkedToday = (taskCount && taskCount > 0) || (sessionCount && sessionCount > 0);
    
    // In a real app, we would fetch the current streak and increment it, 
    // or reset to 0 if they missed yesterday.
    // For now, we just insert the log so the Heatmap can read it!
    
    // Log the daily productivity score for the Heatmap
    const score = (taskCount || 0) * 2 + (sessionCount || 0) * 3;
    const finalScore = Math.min(score, 10); // Max score 10

    if (finalScore > 0) {
      await supabase
        .from('daily_logs')
        .upsert({
          user_id: USER_ID,
          log_date: today,
          productivity_score: finalScore,
          reflection_text: 'Auto-logged by Streak Engine',
          mood: 5
        }, { onConflict: 'user_id, log_date' });
    }

    return NextResponse.json({ success: true, worked_today: hasWorkedToday, score: finalScore });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
