'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

const USER_ID = '5ab9ee3e-4bfc-4e51-8935-cbb926668752'; 

export async function createGoalAndTask(formData: FormData) {
  const title = formData.get('title') as string;
  const deadline = formData.get('deadline') as string; // YYYY-MM-DD
  const goalType = formData.get('goalType') as string; // 'ML', 'DSA', 'DevOps'

  // 1. Insert the Goal
  const { data: goal, error: goalError } = await supabase
    .from('goals')
    .insert({
      user_id: USER_ID,
      title: `${goalType}: ${title}`,
      deadline: deadline,
      status: 'active',
    })
    .select()
    .single();

  if (goalError) throw new Error(goalError.message);

  // 2. Insert the very first Task for that Goal (so you start today!)
  const { error: taskError } = await supabase.from('tasks').insert({
    goal_id: goal.id,
    user_id: USER_ID,
    title: `Start ${title}`,
    due_date: new Date().toISOString().split('T')[0], // Today
    estimated_minutes: 30,
    status: 'pending',
  });

  if (taskError) throw new Error(taskError.message);

  revalidatePath('/'); // Refresh the dashboard instantly
}
