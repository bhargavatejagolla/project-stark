import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const systemPrompt = `You are a ruthless, elite L5 FAANG Interviewer (Staff Engineer level).
The user just activated the Interrogation Protocol.
Generate a highly complex, brutal 1-sentence technical question.
It must be either a System Design question or a hard DSA concept question.
Do NOT provide the answer. ONLY ask the question. Make it aggressive.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'system', content: systemPrompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.9,
      max_tokens: 150,
    });

    const question = chatCompletion.choices[0]?.message?.content || 'Design a highly available distributed rate limiter. Go.';

    return NextResponse.json({ success: true, question });
  } catch (error: any) {
    console.error('Groq Grill Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
