'use server';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

const USER_ID = '5ab9ee3e-4bfc-4e51-8935-cbb926668752';

export async function logMorningHealth(sleepHours: number, energyLevel: number) {
  const today = new Date().toISOString().split('T')[0];
  
  const { error } = await supabase
    .from('daily_logs')
    .upsert({
      user_id: USER_ID,
      log_date: today,
      sleep_hours: sleepHours,
      energy_level: energyLevel
    }, { onConflict: 'user_id, log_date' });

  if (error) throw new Error(error.message);
  revalidatePath('/');
}
