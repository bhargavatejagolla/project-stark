import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { supabase } from '@/lib/supabase';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const USER_ID = '5ab9ee3e-4bfc-4e51-8935-cbb926668752';

export async function POST(req: NextRequest) {
  try {
    const { reflection } = await req.json();

    const systemPrompt = `You are an elite, ruthless FAANG Career Coach earning 1Cr+. 
Your student just submitted a reflection of their deep work session.
Analyze their reflection and determine their exact knowledge gap. 
Then, assign ONE highly specific, targeted learning task for them to complete TOMORROW to close that gap.

Rules:
1. Return ONLY valid JSON.
2. The JSON must contain "analysis" (your brutal but encouraging 1-sentence breakdown) and "next_task_title" (the exact task they must do tomorrow).

Response Schema:
{
  "analysis": "string",
  "next_task_title": "string"
}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: reflection },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const responseText = chatCompletion.choices[0]?.message?.content || '{}';
    const result = JSON.parse(responseText);

    if (!result.next_task_title) {
      throw new Error('AI failed to determine next task');
    }

    // Schedule the task for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const { error } = await supabase.from('tasks').insert({
      user_id: USER_ID,
      title: result.next_task_title,
      status: 'pending',
      due_date: tomorrow.toISOString().split('T')[0]
    });

    if (error) throw error;

    return NextResponse.json({ success: true, analysis: result.analysis, next_task: result.next_task_title });
  } catch (error: any) {
    console.error('Groq Reflection Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
