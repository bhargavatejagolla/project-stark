import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const USER_ID = '5ab9ee3e-4bfc-4e51-8935-cbb926668752';

export async function POST(req: NextRequest) {
  try {
    const { action } = await req.json(); // 'pause' or 'resume'

    if (action === 'pause') {
      // 1. Mark all active goals as 'paused'
      await supabase
        .from('goals')
        .update({ status: 'paused' })
        .eq('user_id', USER_ID)
        .eq('status', 'active');

      // 2. Store the pause timestamp
      await supabase
        .from('profiles')
        .update({ emergency_paused_at: new Date().toISOString() })
        .eq('id', USER_ID);

      return NextResponse.json({ success: true, message: 'Paused. Streaks frozen.' });
    }

    if (action === 'resume') {
      // 1. Get the paused timestamp
      const { data: profile } = await supabase
        .from('profiles')
        .select('emergency_paused_at')
        .eq('id', USER_ID)
        .single();

      if (!profile?.emergency_paused_at) {
        return NextResponse.json({ success: true, message: 'Already active.' });
      }

      const pausedDate = new Date(profile.emergency_paused_at);
      const resumeDate = new Date();
      const diffDays = Math.ceil((resumeDate.getTime() - pausedDate.getTime()) / (1000 * 60 * 60 * 24));

      // 2. Extend ALL paused goals deadlines
      const { data: goals } = await supabase
        .from('goals')
        .select('id, deadline')
        .eq('user_id', USER_ID)
        .eq('status', 'paused');

      for (const goal of goals || []) {
        const newDeadline = new Date(goal.deadline);
        newDeadline.setDate(newDeadline.getDate() + diffDays);
        
        await supabase
          .from('goals')
          .update({ 
            status: 'active', 
            deadline: newDeadline.toISOString().split('T')[0] 
          })
          .eq('id', goal.id);
        
        // 3. Shift all related tasks' due dates manually (since rpc date_add isn't default)
        const { data: tasks } = await supabase
          .from('tasks')
          .select('id, due_date')
          .eq('goal_id', goal.id);
          
        for (const task of tasks || []) {
          const newDue = new Date(task.due_date);
          newDue.setDate(newDue.getDate() + diffDays);
          await supabase
            .from('tasks')
            .update({ due_date: newDue.toISOString().split('T')[0] })
            .eq('id', task.id);
        }
      }

      // Clear the paused timestamp
      await supabase
        .from('profiles')
        .update({ emergency_paused_at: null })
        .eq('id', USER_ID);

      return NextResponse.json({ success: true, message: `Resumed. Deadlines shifted by ${diffDays} days.` });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
