// src/app/api/generate-research/route.ts
import { NextResponse } from 'next/server';

// Set maximum duration to 60 seconds
export const maxDuration = 60;

// Use Edge runtime for better performance with long-running requests
export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { industry, targetMarket, additionalDetails } = await request.json();
    
    const prompt = `
      As a market research specialist, create a comprehensive market segmentation analysis for the ${industry} industry.
      ${targetMarket ? `Focus particularly on the ${targetMarket} market.` : ''}
      ${additionalDetails ? `Additional context: ${additionalDetails}` : ''}
      
      Please provide a detailed analysis with these sections:
      
      1. Industry Overview
      - Brief description of the industry
      - Current market size and growth rate
      - Key trends and drivers
      
      2. Primary Market Segments
      - Identify 4-6 distinct market segments
      - For each segment, provide:
        * Detailed demographic profile
        * Estimated segment size (percentage of total market)
        * Key needs and pain points
        * Buying behaviors and preferences
        * Growth potential
      
      3. Competitive Landscape
      - Major players targeting each segment
      - What positioning and value propositions work for each segment
      
      4. Strategic Opportunities
      - Underserved segments
      - Emerging niche markets
      - Segment-specific recommendations
      
      5. Targeting Recommendations
      - Which segments offer the best opportunity
      - How to effectively position for these segments
      
      Format the report in a clear, professional manner with plain text only.
    `;
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://market-segment-generator.vercel.app',
        'X-Title': 'Market Segment Generator',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini', // Using Claude for cleaner output
        messages: [{ role: 'user', content: prompt }],
        stream: true,
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });
    
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in market research generation:', error);
    return NextResponse.json({ error: 'Failed to generate market research' }, { status: 500 });
  }
}