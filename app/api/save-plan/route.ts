import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const USER_ID = '5ab9ee3e-4bfc-4e51-8935-cbb926668752';

export async function POST(req: NextRequest) {
  try {
    const plan = await req.json();

    const today = new Date();
    const deadlineDate = new Date(today);
    deadlineDate.setDate(today.getDate() + plan.deadline_days);
    const formattedDeadline = deadlineDate.toISOString().split('T')[0];

    // Insert Goal
    const { data: goal, error: goalError } = await supabase
      .from('goals')
      .insert({
        user_id: USER_ID,
        title: plan.goal_title,
        deadline: formattedDeadline,
        status: 'active',
        priority: 'high',
      })
      .select()
      .single();

    if (goalError) throw new Error(goalError.message);

    // Insert Tasks
    const tasksToInsert = plan.daily_tasks.map((task: any) => {
      const taskDate = new Date(today);
      taskDate.setDate(today.getDate() + (task.day - 1));
      return {
        goal_id: goal.id,
        user_id: USER_ID,
        title: task.title,
        due_date: taskDate.toISOString().split('T')[0],
        estimated_minutes: task.estimated_minutes || 45,
        status: 'pending',
        order: task.day,
      };
    });

    const { error: tasksError } = await supabase
      .from('tasks')
      .insert(tasksToInsert);

    if (tasksError) throw new Error(tasksError.message);

    return NextResponse.json({ success: true, goalId: goal.id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
