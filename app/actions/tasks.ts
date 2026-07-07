'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

// Using actual user ID
const USER_ID = '5ab9ee3e-4bfc-4e51-8935-cbb926668752'; 

export async function getTodayTasks() {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('tasks')
    .select('*, goals(title)')
    .eq('user_id', USER_ID)
    // We remove .eq('status', 'pending') so we can see completed tasks too
    .lte('due_date', today)
    .order('order', { ascending: true })
    .limit(10);

  if (error) throw new Error(error.message);
  return data;
}

export async function addTask(title: string) {
  if (!title.trim()) return;
  const today = new Date().toISOString().split('T')[0];
  
  const { error } = await supabase.from('tasks').insert({
    user_id: USER_ID,
    title,
    status: 'pending',
    estimated_minutes: 30,
    due_date: today
  });

  if (!error) revalidatePath('/');
}

export async function updateTaskStatus(taskId: string, status: string) {
  const { error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', taskId);
  
  if (!error) revalidatePath('/');
}

export async function toggleTaskStatus(taskId: string, currentStatus: string) {
  const newStatus = currentStatus === 'pending' ? 'done' : 'pending';
  
  const { error } = await supabase
    .from('tasks')
    .update({ status: newStatus })
    .eq('id', taskId);

  if (!error) revalidatePath('/');
}

export async function logStudySession(durationMinutes: number, skillId?: string) {
  const { error: sessionError } = await supabase
    .from('study_sessions')
    .insert({
      user_id: USER_ID,
      duration_minutes: durationMinutes,
      ended_at: new Date().toISOString(),
      skill_id: skillId || null
    });

  if (sessionError) throw new Error(sessionError.message);

  if (skillId) {
    // Increment the skill hours
    const { data: skill } = await supabase
      .from('skills')
      .select('logged_hours')
      .eq('id', skillId)
      .single();
      
    if (skill) {
      await supabase
        .from('skills')
        .update({ logged_hours: (skill.logged_hours || 0) + (durationMinutes / 60) })
        .eq('id', skillId);
    }
  }

  revalidatePath('/');
  revalidatePath('/career');
  revalidatePath('/analytics');
}
