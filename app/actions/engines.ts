'use server';

import { supabase } from '@/lib/supabase';
import Groq from 'groq-sdk';
import { revalidatePath } from 'next/cache';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const USER_ID = '5ab9ee3e-4bfc-4e51-8935-cbb926668752';

export async function calculateCompanyReadiness(companyName: string) {
  try {
    const { data: companyReqs } = await supabase
      .from('company_requirements')
      .select('weight_percentage, skills(name, logged_hours, target_hours)')
      .eq('user_id', USER_ID)
      .eq('company_name', companyName);

    if (!companyReqs || companyReqs.length === 0) return 0;

    let totalScore = 0;
    for (const req of companyReqs) {
      const skill = req.skills as any;
      if (!skill || !skill.target_hours) continue;
      
      const skillMastery = Math.min(100, (skill.logged_hours / skill.target_hours) * 100);
      const weightedContribution = (skillMastery * req.weight_percentage) / 100;
      totalScore += weightedContribution;
    }

    return Math.round(totalScore);
  } catch (err) {
    return 0; // Failsafe during setup
  }
}

export async function getDreamCompanies() {
  const companies = ['Google', 'Amazon', 'Microsoft', 'Meta'];
  const results = [];
  
  for (const company of companies) {
    const { data: companyReqs } = await supabase
      .from('company_requirements')
      .select('weight_percentage, skills(name, logged_hours, target_hours)')
      .eq('user_id', USER_ID)
      .eq('company_name', company);

    let readiness = 0;
    let insight = '"Awaiting skill requirements to formulate placement analysis."';

    if (companyReqs && companyReqs.length > 0) {
      let totalScore = 0;
      let lowestSkill = null;
      let lowestMastery = 101;

      for (const req of companyReqs) {
        const skill = req.skills as any;
        if (!skill || !skill.target_hours) continue;
        
        const skillMastery = Math.min(100, (skill.logged_hours / skill.target_hours) * 100);
        if (skillMastery < lowestMastery) {
          lowestMastery = skillMastery;
          lowestSkill = skill.name;
        }

        const weightedContribution = (skillMastery * req.weight_percentage) / 100;
        totalScore += weightedContribution;
      }
      readiness = Math.round(totalScore);
      if (lowestSkill) {
        insight = `"${lowestSkill} mastery is bottlenecking placement probability."`;
      } else {
         insight = '"All core requirements are currently optimal."';
      }
    } else {
       // If no reqs, calculate readiness is 0 anyway
       readiness = 0;
    }

    results.push({ name: company, readiness, insight });
  }
  
  return results.sort((a, b) => b.readiness - a.readiness);
}

export async function calculateAIEngineerScore() {
  try {
    const { data: skills } = await supabase
      .from('skills')
      .select('*')
      .eq('user_id', USER_ID);

    if (!skills || skills.length === 0) return 0;

    let totalMastery = 0;
    for (const skill of skills) {
      if(skill.target_hours) {
         totalMastery += Math.min(100, (skill.logged_hours / skill.target_hours) * 100);
      }
    }

    return Math.round(totalMastery / skills.length);
  } catch (err) {
    return 0;
  }
}

export async function calculateMissionDay() {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('created_at')
      .eq('id', USER_ID)
      .single();
      
    if (!profile) return 1;
    
    const start = new Date(profile.created_at).getTime();
    const now = new Date().getTime();
    const days = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    
    return Math.max(1, days);
  } catch (err) {
    return 1;
  }
}

export async function calculateStreak() {
  try {
    const { data: sessions, error } = await supabase
      .from('study_sessions')
      .select('ended_at')
      .eq('user_id', USER_ID)
      .order('ended_at', { ascending: false });

    if (error || !sessions || sessions.length === 0) return 0;

    let currentStreak = 0;
    let lastDate = new Date();
    lastDate.setHours(0,0,0,0); // Today midnight

    // Check if there is a session today or yesterday to even have a streak
    const latestSession = new Date(sessions[0].ended_at);
    latestSession.setHours(0,0,0,0);
    const diffTimeFirst = lastDate.getTime() - latestSession.getTime();
    const diffDaysFirst = Math.ceil(diffTimeFirst / (1000 * 60 * 60 * 24));

    if (diffDaysFirst > 1) return 0; // Lost streak

    let checkDate = new Date(latestSession);

    // Group by unique dates backwards
    const uniqueDates = new Set(sessions.map(s => {
      const d = new Date(s.ended_at);
      d.setHours(0,0,0,0);
      return d.getTime();
    }));

    const sortedDates = Array.from(uniqueDates).sort((a, b) => b - a);

    let expectedDate = new Date(sortedDates[0]);

    for (const time of sortedDates) {
      if (time === expectedDate.getTime()) {
        currentStreak++;
        expectedDate.setDate(expectedDate.getDate() - 1); // Expect previous day next
      } else {
        break; // Streak broken
      }
    }

    return currentStreak;
  } catch (err) {
    return 0;
  }
}

export async function calculateEnergy() {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // 1. Task Completion Ratio
    const { data: tasks } = await supabase
      .from('tasks')
      .select('status')
      .eq('user_id', USER_ID)
      .lte('due_date', today);

    let energy = 100;
    if (tasks && tasks.length > 0) {
      const completed = tasks.filter((t: any) => t.status === 'done').length;
      energy = Math.round((completed / tasks.length) * 100);
    }

    // 2. Burnout Predictor
    const { data: sessions } = await supabase
      .from('study_sessions')
      .select('duration_minutes')
      .eq('user_id', USER_ID)
      .gte('ended_at', `${today}T00:00:00Z`)
      .lte('ended_at', `${today}T23:59:59Z`);

    if (sessions && sessions.length > 0) {
      const totalMinutes = sessions.reduce((acc: number, s: any) => acc + s.duration_minutes, 0);
      if (totalMinutes > 300) { // 5 hours
        // Burnout override! Force energy to critical levels to enforce rest.
        energy = Math.min(energy, 15);
      } else if (totalMinutes > 240) { // 4 hours
        energy = Math.min(energy, 40);
      }
    }

    return Math.max(10, energy);
  } catch (err) {
    return 100;
  }
}

export async function getDailyDirective() {
  const pillars = await getFAANGPillars();
  if (pillars.length === 0) {
    return {
      id: null,
      name: 'Establish a Neural Pillar',
      readiness: 0,
      isFallback: true
    };
  }

  // Find the weakest pillar (lowest readiness)
  const sorted = pillars.sort((a: any, b: any) => a.readiness - b.readiness);
  const weakest = sorted[0];

  return {
    id: weakest.id,
    name: weakest.name,
    readiness: weakest.readiness,
    isFallback: false
  };
}

export async function calculateSystemState() {
  const streak = await calculateStreak();
  const energy = await calculateEnergy();
  const directive = await getDailyDirective();
  
  const systemPrompt = `
    You are Jarvis, the ruthless AI Chief of Staff for a student trying to break into FAANG with a 1Cr package.
    You must output ONLY valid JSON.
    Current Status:
    Energy: ${energy}%
    Streak: ${streak} days
    Weakest Skill: ${directive.name} (Readiness: ${directive.readiness}%)

    Rules:
    - If energy < 20%, status must be "CRITICAL", color "red". You must order them to rest.
    - If streak is 0, status must be "WARNING", color "orange". Be harsh.
    - If energy > 70% and streak > 0, status must be "OPTIMAL", color "emerald".
    - Otherwise "NOMINAL", color "indigo".
    - Battle Plan must have exactly 3 short, punchy, actionable steps tailored to their weakest skill (${directive.name}).

    Output format MUST be EXACTLY this JSON structure:
    {
      "status": "CRITICAL" | "WARNING" | "OPTIMAL" | "NOMINAL",
      "color": "red" | "orange" | "emerald" | "indigo",
      "message": "A 1-sentence brutal tactical summary.",
      "battlePlan": [
        "Step 1...",
        "Step 2...",
        "Step 3..."
      ]
    }
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: systemPrompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_completion_tokens: 300,
      response_format: { type: "json_object" }
    });

    const result = chatCompletion.choices[0]?.message?.content || "";
    return JSON.parse(result);
  } catch (error) {
    console.error("Groq JSON error:", error);
    return { 
      status: 'WARNING', 
      color: 'orange', 
      message: 'Neural link to Groq severed. Proceed with manual overrides.',
      battlePlan: ["Re-establish connection", "Review weakest pillar manually", "Log manual session"]
    };
  }
}

export async function getConsistencyGrid() {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const { data: sessions } = await supabase
      .from('study_sessions')
      .select('ended_at, duration_minutes')
      .eq('user_id', USER_ID)
      .gte('ended_at', thirtyDaysAgo.toISOString())
      .lte('ended_at', today.toISOString());

    const grid = [];
    const sessionMap = new Map();

    if (sessions) {
      sessions.forEach(s => {
        const dateStr = s.ended_at.split('T')[0];
        sessionMap.set(dateStr, (sessionMap.get(dateStr) || 0) + s.duration_minutes);
      });
    }

    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const minutes = sessionMap.get(dateStr) || 0;
      
      let intensity = 0;
      if (minutes > 0 && minutes <= 30) intensity = 1;
      else if (minutes > 30 && minutes <= 90) intensity = 2;
      else if (minutes > 90 && minutes <= 180) intensity = 3;
      else if (minutes > 180) intensity = 4;

      grid.push({ date: dateStr, minutes, intensity });
    }

    return grid;
  } catch (err) {
    return [];
  }
}

export async function getFAANGPillars() {
  try {
    const { data: skills, error } = await supabase
      .from('skills')
      .select('id, name, logged_hours, target_hours')
      .eq('user_id', USER_ID);

    if (error || !skills || skills.length === 0) {
      return [];
    }

    return skills.map((s: any) => ({
      id: s.id,
      name: s.name,
      type: s.name, 
      hours: s.logged_hours || 0,
      target: s.target_hours || 100,
      description: `Target: ${s.target_hours || 100} hours`,
      readiness: Math.min(100, Math.round(((s.logged_hours || 0) / (s.target_hours || 100)) * 100))
    }));
  } catch (err) {
    return [];
  }
}

export async function addCustomPillar(name: string, targetHours: number) {
  // Check for duplicates
  const { data: existing } = await supabase
    .from('skills')
    .select('id')
    .eq('user_id', USER_ID)
    .ilike('name', name);
    
  if (existing && existing.length > 0) {
    throw new Error('A neural pillar with this exact designation already exists.');
  }

  const { error } = await supabase.from('skills').insert({
    user_id: USER_ID,
    name,
    target_hours: targetHours,
    logged_hours: 0
  });
  if (error) throw new Error(error.message);
  revalidatePath('/career');
}

export async function deleteCustomPillar(id: string) {
  const { error } = await supabase
    .from('skills')
    .delete()
    .eq('id', id)
    .eq('user_id', USER_ID);
    
  if (error) throw new Error(error.message);
  revalidatePath('/career');
}
