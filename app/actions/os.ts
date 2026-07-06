'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

const USER_ID = '5ab9ee3e-4bfc-4e51-8935-cbb926668752';

export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', USER_ID)
    .order('created_at', { ascending: false });
  
  if (error && error.code !== '42P01' && error.code !== '42501') {
    console.error('[OS Engine] Projects Error:', error.message || error.code);
  }
  
  return data || [];
}

export async function getCareerSkills() {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .eq('user_id', USER_ID);
    
  if (error && error.code !== '42P01' && error.code !== '42501') {
    console.error('[OS Engine] Skills Error:', error.message || error.code);
  }
  
  return data || [];
}

export async function getLearningCourses() {
  const { data, error } = await supabase
    .from('learning_courses')
    .select('*')
    .eq('user_id', USER_ID)
    .order('created_at', { ascending: false });
    
  if (error && error.code !== '42P01' && error.code !== '42501') {
    console.error('[OS Engine] Learning Error:', error.message || error.code);
  }
  
  return data || [];
}

export async function executeJarvisCommand(prompt: string) {
  try {
    const text = prompt.trim();
    
    if (text.startsWith('/task ')) {
      const title = text.replace('/task ', '').trim();
      const today = new Date().toISOString().split('T')[0];
      const { error } = await supabase.from('tasks').insert({
        user_id: USER_ID,
        title: title,
        status: 'pending',
        due_date: today
      });
      if (error) throw error;
      revalidatePath('/');
      return { success: true, message: `Mission scheduled: ${title}` };
    }
    
    if (text.startsWith('/study ')) {
      const parts = text.replace('/study ', '').trim().split(' ');
      const duration = parseInt(parts[0]);
      
      if (isNaN(duration)) {
        return { success: false, message: 'Invalid duration. Use /study [minutes]' };
      }

      const { error } = await supabase.from('study_sessions').insert({
        user_id: USER_ID,
        duration_minutes: duration,
        ended_at: new Date().toISOString()
      });
      
      if (error) throw error;
      
      revalidatePath('/');
      revalidatePath('/analytics');
      revalidatePath('/career');
      return { success: true, message: `Logged ${duration} minutes of deep work.` };
    }

    if (text.startsWith('/project ')) {
      const title = text.replace('/project ', '').trim();
      const { error } = await supabase.from('projects').insert({
        user_id: USER_ID,
        title: title,
        status: 'active'
      });
      if (error) throw error;
      revalidatePath('/projects');
      return { success: true, message: `Project initialized: ${title}` };
    }

    if (text.startsWith('/course ')) {
      const title = text.replace('/course ', '').trim();
      const { error } = await supabase.from('learning_courses').insert({
        user_id: USER_ID,
        title: title,
        platform: 'Jarvis Directed',
        status: 'active',
        progress_percentage: 0
      });
      if (error) throw error;
      revalidatePath('/learning');
      return { success: true, message: `Learning path engaged: ${title}` };
    }

    return { success: false, message: 'Unknown command. Use /task, /study, /project, or /course.' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Execution failed' };
  }
}
