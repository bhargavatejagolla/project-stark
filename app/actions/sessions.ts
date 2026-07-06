'use server';

import { supabase } from '@/lib/supabase';

const USER_ID = '5ab9ee3e-4bfc-4e51-8935-cbb926668752';

export async function saveStudySession(durationMinutes: number, taskId?: string) {
  const { error } = await supabase
    .from('study_sessions')
    .insert({
      user_id: USER_ID,
      duration_minutes: durationMinutes,
      task_id: taskId || null,
      ended_at: new Date().toISOString()
    });
  
  if (error) throw new Error(error.message);
}
