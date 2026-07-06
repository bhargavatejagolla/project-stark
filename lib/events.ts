import { supabase } from './supabase';

const USER_ID = '5ab9ee3e-4bfc-4e51-8935-cbb926668752';

export type OSEvent = 'LOG_STUDY_SESSION' | 'PROJECT_COMPLETED' | 'COURSE_COMPLETED';

export async function emitEvent(eventType: OSEvent, payload: any) {
  console.log(`[OS Event Bus] Emitted: ${eventType}`, payload);

  switch (eventType) {
    case 'LOG_STUDY_SESSION':
      await handleStudySession(payload);
      break;
    case 'PROJECT_COMPLETED':
      await handleProjectCompletion(payload);
      break;
    default:
      console.warn(`[OS Event Bus] Unhandled event: ${eventType}`);
  }
}

async function handleStudySession(payload: { taskId: string, durationMinutes: number, skillId?: string }) {
  // 1. Log the raw session
  await supabase.from('study_sessions').insert({
    user_id: USER_ID,
    task_id: payload.taskId,
    duration_minutes: payload.durationMinutes,
    ended_at: new Date().toISOString()
  });

  // 2. Cascade: Update Skill Mastery
  if (payload.skillId) {
    const { data: skill } = await supabase
      .from('skills')
      .select('logged_hours')
      .eq('id', payload.skillId)
      .single();
      
    if (skill) {
      // Add fractional hours
      const newHours = skill.logged_hours + (payload.durationMinutes / 60);
      await supabase
        .from('skills')
        .update({ logged_hours: newHours })
        .eq('id', payload.skillId);
    }
  }
}

async function handleProjectCompletion(payload: { projectId: string }) {
  await supabase
    .from('projects')
    .update({ status: 'finished', progress_percentage: 100 })
    .eq('id', payload.projectId);
}
