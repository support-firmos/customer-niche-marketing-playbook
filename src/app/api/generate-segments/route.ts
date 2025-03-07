// src/app/api/generate-segments/route.ts
import { NextResponse } from 'next/server';

// Set maximum duration to 60 seconds
export const maxDuration = 60;

// Use Edge runtime for better performance with long-running requests
export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { industry } = await request.json();
    
    const prompt = `
Instruction
You are a Product Market Fit expert specializing in Go-To-Market Engineering, Revenue Operations (RevOps), and Message-Market Fit. Your objective is to optimize outbound campaigns for a Fractional CFO targeting the ${industry} industry via cold email and LinkedIn. Your task is to identify the best B2B subsectors to refine the target segment list for companies needing a 10-15 person Fractional CFO team.

Task
Determine 7 ${industry} industry segments that would be the best fit for high-ticket, recurring CFO services. These must meet:
1. Financial Viability: $5M–$150M annual revenue (can afford $15K–$30K/month retainers)
2. Recurring Need Justification: Requires ongoing financial strategy, not one-time services
3. Accessibility: CEOs/CFOs reachable via LinkedIn/email/phone
4. Service Fit: Needs budgeting, cash flow management, KPI tracking, or financial advisory

Output Format
Ranked list of 7 subsectors with this structure for each entry:
1. [Subsector Name]
   - Justification for CFO Services: [Specific need for recurring financial leadership]
   - Estimated Market US Potential: [X companies, $Y–$Z revenue]
   - Ease of Outreach: [Low/Medium/High based on decision-maker visibility]

Example:
1. Medical Device Distributors
   - Justification for CFO Services: Complex inventory financing and recurring FDA compliance budgeting needs
   - Estimated Market US Potential: 600 companies, $10M–$45M revenue
   - Ease of Outreach: Medium

Provide only the numbered list without markdown or additional explanations. Arrange them from Highest to Lowest Profiting Segments for Fractional CFO Services.`;
    
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
        max_tokens: 20000,
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