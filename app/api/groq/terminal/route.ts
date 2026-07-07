import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { calculateStreak, calculateEnergy, getDailyDirective } from '@/app/actions/engines';

export async function POST(req: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ reply: "CRITICAL ERROR: GROQ_API_KEY is missing from Vercel Environment Variables. Cannot establish neural link." });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const { message } = await req.json();
    const streak = await calculateStreak();
    const energy = await calculateEnergy();
    const directive = await getDailyDirective();

    const systemPrompt = `
      You are Jarvis, an elite 1Cr FAANG Career AI embedded in the user's Mission Control terminal.
      Current Status: Energy ${energy}%, Streak ${streak} days, Weakest Pillar: ${directive.name}.
      The user will ask for advice, a micro-plan, or a technical grilling.
      Be extremely concise, punchy, and direct. No pleasantries. Treat them like an operator preparing for combat.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_completion_tokens: 300,
    });

    return NextResponse.json({ reply: chatCompletion.choices[0]?.message?.content || "Awaiting input." });
  } catch (error: any) {
    console.error("Groq Terminal error:", error);
    return NextResponse.json({ reply: `Neural link offline. Diagnostic: ${error.message}` }, { status: 500 });
  }
}
