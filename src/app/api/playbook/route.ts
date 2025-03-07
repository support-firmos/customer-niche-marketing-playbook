// src/app/api/playbook/route.ts
import { NextResponse } from 'next/server';

// Set maximum duration to 60 seconds
export const maxDuration = 60;

// Use Edge runtime for better performance with long-running requests
export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const industry = await request.json();
    console.log('test kani', industry);
    const segment = industry.segmentInfo;
    const prompt = `You are an expert AI copywriter tasked with creating a highly detailed, industry-specific marketing playbook for CFO services based on the provided deep segment research. Your goal is to transform the segment research into concrete, actionable marketing guidance with specific examples, metrics, and strategies.

## Your Task
Create a comprehensive marketing playbook that leverages ALL insights from the provided segment research. Extract specific details, examples, metrics, and industry terminology from the research to ensure the playbook is deeply relevant and practical, not generic or high-level.

## Format Requirements
- Create a compelling title: "CFO Services Marketing Playbook: *Segment Title"
- Format each section with a clear, numbered emoji header (e.g., "🔹 1️⃣ TARGET AUDIENCE 🔹")
- Use clean section dividers (✧═══════════════✧) between major sections
- Use number emojis (1️⃣, 2️⃣, 3️⃣, 4️⃣, 5️⃣) at the start of each point
- Do NOT use markdown formatting (no **, no *, no ## or #)
- Begin directly with the title and first section (no narrative introduction)
- Keep each point substantive, specific, and actionable

## Marketing Playbook Sections
For each section below, provide EXACTLY 5 points that offer concrete, specific insights directly extracted from the segment research:

✧═══════════════✧

🔹 1️⃣ TARGET AUDIENCE 🔹
[Provide 5 detailed points using number emojis (1️⃣, 2️⃣, 3️⃣, 4️⃣, 5️⃣). Extract specific audience profiles directly from the research. Include exact job titles, company sizes, and growth stages mentioned. Focus on the exact pain points, needs, and characteristics described in the research rather than generic descriptions.]

✧═══════════════✧

🔹 2️⃣ PAIN POINTS 🔹
[Provide 5 detailed points using number emojis (1️⃣, 2️⃣, 3️⃣, 4️⃣, 5️⃣). Use the exact pain points mentioned in the research. Include specific examples, scenarios, and quantifiable impacts described in the research. For each pain point, add how CFO services directly address this challenge based on information in the research.]

✧═══════════════✧

🔹 3️⃣ FEARS AND CONCERNS 🔹
[Provide 5 detailed points using number emojis (1️⃣, 2️⃣, 3️⃣, 4️⃣, 5️⃣). Extract the exact fears and concerns mentioned in the research. For each fear, include the "Why it's a fear" context, the "Worst-Case Scenario" details, and the "How a CFO Can Help" specifics directly from the research.]

✧═══════════════✧

🔹 4️⃣ GOALS AND ASPIRATIONS 🔹
[Provide 5 detailed points using number emojis (1️⃣, 2️⃣, 3️⃣, 4️⃣, 5️⃣). Use the exact goals mentioned in the research. For each goal, include the "Why it's a goal" context, relevant "Industry Insights," and the specific "How a CFO Can Help" details directly from the research.]

✧═══════════════✧

🔹 5️⃣ OBJECTIONS 🔹
[Provide 5 detailed points using number emojis (1️⃣, 2️⃣, 3️⃣, 4️⃣, 5️⃣). Extract the exact objections mentioned in the research. Format as "Objection: [exact objection from research]" followed by "Counter: [exact counter-argument from research]" on the same point.]

✧═══════════════✧

🔹 6️⃣ CORE VALUES 🔹
[Provide 5 detailed points using number emojis (1️⃣, 2️⃣, 3️⃣, 4️⃣, 5️⃣). Extract the exact values mentioned in the research. For each value, include the "Why it matters" context, specific "Industry Insights," and the precise "How a CFO Can Help" details directly from the research.]

✧═══════════════✧

🔹 7️⃣ DECISION-MAKING PROCESS 🔹
[Provide 5 detailed points using number emojis (1️⃣, 2️⃣, 3️⃣, 4️⃣, 5️⃣). Extract the exact decision-making processes mentioned in the research. For each process, include the "How they make decisions" details, specific "Industry Insights," and the precise "How a CFO Can Help" information directly from the research.]

✧═══════════════✧

🔹 8️⃣ KEY METRICS 🔹
[Provide 5 detailed points using number emojis (1️⃣, 2️⃣, 3️⃣, 4️⃣, 5️⃣). Extract industry-specific metrics mentioned or implied in the research. Use exact numbers, percentages, and benchmarks found in the research. For each metric, explain precisely how CFO services impact this metric based on information in the research.]

✧═══════════════✧

🔹 9️⃣ COMMUNICATION PREFERENCES 🔹
[Provide 5 detailed points using number emojis (1️⃣, 2️⃣, 3️⃣, 4️⃣, 5️⃣). Extract the exact communication preferences mentioned in the research. For each preference, include the "Why It Matters" context, specific "Industry Insights," and the precise "How a CFO Can Help" details directly from the research.]

✧═══════════════✧

🔹 🔟 CONTENT TONE AND STYLE 🔹
[Provide 5 detailed points using number emojis (1️⃣, 2️⃣, 3️⃣, 4️⃣, 5️⃣). Based on the research, determine the content style that would resonate with this segment. Include industry-specific terminology found in the research, communication norms mentioned or implied, and examples that relate directly to the segment's concerns and values.]

✧═══════════════✧

🔹 1️⃣1️⃣ LEAD MAGNET TITLES 🔹
[Provide 5 detailed points using number emojis (1️⃣, 2️⃣, 3️⃣, 4️⃣, 5️⃣). Create industry-specific lead magnet titles that directly address the pain points, fears, and goals identified in the research. Each title should use industry terminology found in the research and connect to a specific need or challenge mentioned.]

✧═══════════════✧

## Segment Research:
${segment}

Important notes:
- Extract SPECIFIC details from the research - do not generalize or water down
- Use EXACT terminology, examples, metrics, and concerns found in the research
- For any point where the research provides detailed context (e.g., "Why it's a fear" or "Industry Insights"), include these specific details rather than summarizing
- Maintain the depth and specificity of the original research in your playbook points
- If the research uses specific numbers or percentages, include these exact figures
- Include actual scenarios, consequences, and benefits mentioned in the research
- When describing how CFO services help, use the exact solutions mentioned in the research
- If the research includes specific industry challenges or trends, incorporate these directly
- Make each point highly detailed (4-6 sentences minimum) using content directly from the research
`;
    
    // Use non-streaming approach for this first prompt
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://market-segment-generator.vercel.app/',
        'X-Title': 'Market Segment Research',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: [{ role: 'user', content: prompt }],
        stream: false,
        max_tokens: 25000,
        temperature: 0.8,
      }),
    });
    
    const data = await response.json();
    
    return NextResponse.json({ 
      result: data.choices[0].message.content 
    });
  } catch (error) {
    console.error('Error generating segments:', error);
    return NextResponse.json({ error: 'Failed to generate segments' }, { status: 500 });
  }
}