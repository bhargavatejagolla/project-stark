import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const USER_ID = '5ab9ee3e-4bfc-4e51-8935-cbb926668752';

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data: tasks } = await supabase
      .from('tasks')
      .select('title, goals(title)')
      .eq('user_id', USER_ID)
      .eq('status', 'pending')
      .lte('due_date', today)
      .limit(5);

    const { data: profile } = await supabase
      .from('profiles')
      .select('mother_quote, emergency_paused_at')
      .eq('id', USER_ID)
      .single();

    if (profile?.emergency_paused_at) {
      return NextResponse.json({ success: true, message: "Emergency mode is active. Take care of yourself first. We resume when you are ready." });
    }

    const quote = profile?.mother_quote || "Try and try even if you fail, those failures are the steps to success.";
    
    // Only call Groq if we have an API key, otherwise fallback
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ success: true, message: `Remember: "${quote}" Let's crush today's tasks.` });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: `You are Bhargava's personal AI coach. Write a SHORT (max 2 sentences) morning pep-talk. Incorporate this theme: "${quote}". Be firm, loving, and urgent. Do not use quotes around the message.` },
        { role: 'user', content: `Today I have ${tasks?.length || 0} tasks pending. My top priority is: ${tasks?.[0]?.title || 'Staying focused'}.` }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
    });

    const pepTalk = chatCompletion.choices[0]?.message?.content || "Good morning, Bhargava. Start strong.";

    return NextResponse.json({ success: true, message: pepTalk });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
