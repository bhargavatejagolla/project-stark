'use server';

import { supabase } from '@/lib/supabase';

const USER_ID = '5ab9ee3e-4bfc-4e51-8935-cbb926668752';

export async function getCourseAnalytics() {
  // 1. Fetch all skills
  const { data: skills, error: skillsError } = await supabase
    .from('skills')
    .select('id, name, target_hours, logged_hours')
    .eq('user_id', USER_ID);

  if (skillsError || !skills) return [];

  // 2. Fetch all study sessions linked to a skill
  const { data: sessions, error: sessionsError } = await supabase
    .from('study_sessions')
    .select('skill_id, duration_minutes, ended_at')
    .eq('user_id', USER_ID)
    .not('skill_id', 'is', null);

  if (sessionsError) return [];

  // Group sessions by skill_id
  const sessionsBySkill: Record<string, any[]> = {};
  if (sessions) {
    sessions.forEach(s => {
      if (!sessionsBySkill[s.skill_id]) sessionsBySkill[s.skill_id] = [];
      sessionsBySkill[s.skill_id].push(s);
    });
  }

  // 3. Generate 90-day matrix for each skill
  // A 365-day matrix on a regular screen can be overwhelming, but 90 days fits perfectly in a grid
  const today = new Date();
  
  return skills.map(skill => {
    const skillSessions = sessionsBySkill[skill.id] || [];
    
    // Create 90 day grid
    const grid = [];
    for (let i = 89; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const daySessions = skillSessions.filter(s => s.ended_at.startsWith(dateStr));
      const totalMinutes = daySessions.reduce((sum, s) => sum + s.duration_minutes, 0);
      
      let intensity = 0;
      if (totalMinutes > 0) intensity = 1;
      if (totalMinutes >= 30) intensity = 2;
      if (totalMinutes >= 60) intensity = 3;
      if (totalMinutes >= 120) intensity = 4;
      
      grid.push({
        date: dateStr,
        minutes: totalMinutes,
        intensity
      });
    }

    return {
      id: skill.id,
      name: skill.name,
      logged_hours: skill.logged_hours || 0,
      target_hours: skill.target_hours || 100,
      grid
    };
  });
}
