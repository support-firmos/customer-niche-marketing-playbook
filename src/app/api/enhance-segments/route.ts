// src/app/api/enhance-segments/route.ts
import { NextResponse } from 'next/server';

// Set maximum duration to 60 seconds
export const maxDuration = 60;

// Use Edge runtime for better performance with long-running requests
export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { industry, segments } = await request.json();
    
    if (!segments || typeof segments !== 'string') {
      return NextResponse.json({ error: 'Invalid segments data' }, { status: 400 });
    }
    
    const prompt = `
      You are a market research expert specializing in high-ticket accounting advisory services. Below is a list of promising segments in the ${industry} industry:

      ${segments.substring(0, 20000)}

      ## FORMAT INSTRUCTIONS

      Create an enhanced analysis with clear visual formatting. Begin with this centered title:

      ***********************************************************************
      #  DEEP DIVE: BEST ${industry} SEGMENTS FOR HIGH-TICKET ADVISORY/ACCOUNTING SERVICES
      ***********************************************************************

      Do not include introductory sentences.

      For each segment, use this exact visual formatting:

      ======================================
      SEGMENT #: [SEGMENT NAME]
      ======================================

      A. **WHY THIS SEGMENT?**
        Explain in 3 sentences why this segment needs premium accounting advisory services.

      B. **HIGH-TICKET JUSTIFICATION**
        • [Specific financial challenge/task]
        • [Specific financial challenge/task]
        • [Specific financial challenge/task]
        • [Specific financial challenge/task]

      C. **HOW LUCRATIVE IS THIS MARKET?**
        Assess market size, growth trends, and profitability potential in 2-3 sentences.

      D. **MARKETING ANGLES**
        • [Compelling marketing message #1]
        • [Compelling marketing message #2]
        • [Compelling marketing message #3]

      ------------------------------------------

      Keep each section concise and actionable. Maintain consistent formatting with clear visual separation between segments and sections.
      `;

    
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
        temperature: 1,
      }),
    });
    
    const responseText = await response.text();
    
    if (!response.ok) {
      console.error('OpenRouter error response:', responseText);
      return NextResponse.json({ 
        error: `OpenRouter API error: ${response.status}`,
        details: responseText
      }, { status: 500 });
    }
    
    const data = JSON.parse(responseText);
    if (!data.choices?.[0]?.message) {
      return NextResponse.json({ 
        error: 'Invalid response format from OpenRouter',
        details: responseText 
      }, { status: 500 });
    }
      
    return NextResponse.json({ 
      result: data.choices[0].message.content 
    });
  } catch (error) {
    console.error('Error enhancing segments:', error);
    return NextResponse.json({ 
      error: 'Failed to enhance segments',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}