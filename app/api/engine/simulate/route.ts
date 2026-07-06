import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const USER_ID = '5ab9ee3e-4bfc-4e51-8935-cbb926668752';

export async function POST(req: NextRequest) {
  try {
    const { targetDays } = await req.json();
    
    // Fetch all active goals and tasks to calculate load
    const { data: tasks } = await supabase
      .from('tasks')
      .select('id, estimated_minutes, goals(title)')
      .eq('user_id', USER_ID)
      .eq('status', 'pending');

    const totalMinutes = tasks?.reduce((acc, task) => acc + (task.estimated_minutes || 30), 0) || 0;
    const totalHours = totalMinutes / 60;

    // Simulate 3 Paths based on targetDays
    const requiredHoursPerDay = totalHours / targetDays;
    
    let pathA, pathB, pathC;

    // Path A: Current Pace (Assume user does 1.5 hours a day historically)
    const currentPace = 1.5; 
    const completionA = Math.min((currentPace * targetDays) / (totalHours || 1) * 100, 100).toFixed(0);
    pathA = `At your current pace of ${currentPace}h/day, you will complete ${completionA}% of your backlog.`;

    // Path B: Required Pace
    pathB = `To finish 100%, you must average ${requiredHoursPerDay.toFixed(1)}h/day for ${targetDays} days. Burnout risk is ${requiredHoursPerDay > 3 ? 'HIGH 🔴' : 'LOW 🟢'}.`;

    // Path C: Strategic Pivot
    if (requiredHoursPerDay > 3) {
      pathC = `PIVOT RECOMMENDED: Pause your longest goal. Focus strictly on remaining items for 1.5h/day to achieve mastery without burnout.`;
    } else {
      pathC = `PIVOT: You have excess capacity. Add a weekend portfolio project to boost FAANG readiness by 20%.`;
    }

    return NextResponse.json({ success: true, paths: { a: pathA, b: pathB, c: pathC }, requiredHoursPerDay, totalHours });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
