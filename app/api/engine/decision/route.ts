import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const USER_ID = '5ab9ee3e-4bfc-4e51-8935-cbb926668752';

export async function POST() {
  try {
    const today = new Date().toISOString().split('T')[0];

    // 1. Get today's health metrics
    const { data: health } = await supabase
      .from('daily_logs')
      .select('sleep_hours, energy_level')
      .eq('user_id', USER_ID)
      .eq('log_date', today)
      .single();

    const sleep = health?.sleep_hours || 8;
    const energy = health?.energy_level || 8;

    // 2. Fetch pending tasks for today
    const { data: tasks } = await supabase
      .from('tasks')
      .select('id, title, estimated_minutes')
      .eq('user_id', USER_ID)
      .eq('status', 'pending')
      .lte('due_date', today);

    if (!tasks || tasks.length === 0) {
      return NextResponse.json({ success: true, message: 'No tasks to optimize.' });
    }

    let shifted = 0;

    // 3. The Decision Engine Logic (Burnout Prevention)
    // If sleep is critical (<6h) or energy is very low (<=5), protect the user.
    if (sleep < 6 || energy <= 5) {
      // Sort tasks by estimated time descending
      const sortedTasks = [...tasks].sort((a, b) => (b.estimated_minutes || 30) - (a.estimated_minutes || 30));
      
      // Shift the longest task to tomorrow
      if (sortedTasks.length > 1) {
        const taskToShift = sortedTasks[0];
        
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        await supabase
          .from('tasks')
          .update({ due_date: tomorrow.toISOString().split('T')[0] })
          .eq('id', taskToShift.id);
          
        shifted++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: shifted > 0 ? `Burnout Protocol: Shifted ${shifted} heavy task(s) to tomorrow.` : 'Schedule optimized.'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
