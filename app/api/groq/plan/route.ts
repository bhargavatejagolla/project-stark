import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    const systemPrompt = `You are an elite productivity AI assistant for a student named Bhargava.
Your ONLY job is to convert the user's goal into a structured JSON plan.

Rules:
1. Extract the main goal title and the deadline (e.g., "45 days").
2. Break it down into Daily Tasks (NOT weekly, daily).
3. Each task must have a "title" and "estimated_minutes" (between 30 to 120 mins).
4. Distribute tasks evenly over the total number of days.
5. Return ONLY valid JSON. No markdown, no explanations.

Response JSON Schema:
{
  "goal_title": "string",
  "deadline_days": number,
  "daily_tasks": [
    { "day": 1, "title": "string", "estimated_minutes": number },
    { "day": 2, "title": "string", "estimated_minutes": number }
  ]
}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const responseText = chatCompletion.choices[0]?.message?.content || '{}';
    const plan = JSON.parse(responseText);

    if (!plan.goal_title || !plan.daily_tasks) {
      throw new Error('AI returned invalid structure');
    }

    return NextResponse.json({ success: true, plan });
  } catch (error: any) {
    console.error('Groq Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
