// src/app/api/generate-segments/route.ts
import { NextResponse } from 'next/server';

// Set maximum duration to 60 seconds
export const maxDuration = 60;

// Use Edge runtime for better performance with long-running requests
export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { segmentInfo } = await request.json();
    
    if (!segmentInfo || typeof segmentInfo !== 'string') {
      return NextResponse.json({ error: 'Invalid segment information' }, { status: 400 });
    }
    // Modified section of the prompt in src/app/api/generate-segments/route.ts
    const prompt = `
    You are a specialized LinkedIn Sales Navigator outreach strategist with deep expertise in B2B targeting and account-based marketing. Your task is to transform the segment information below into a structured LinkedIn Sales Navigator targeting strategy for fractional CFO services.

    FORMAT YOUR RESPONSE AS A JSON ARRAY OF OBJECTS, where each object represents a segment with two attributes, namely name and content:
    [
      {
        "name": "segment name here",
        "content":
          "
            Why This Segment?
            [3-5 sentences explaining why this segment needs fractional CFO services. Provide specific business context, industry challenges, and financial pain points. Detail how their size, growth stage, and business model create a need for sophisticated financial leadership without the cost of a full-time CFO. Explain their complexity and why they're particularly suited for fractional services.]
        
            Key Challenges:
            👉 [Challenge 1]—[Detailed explanation of the challenge with specific examples and business implications]
            👉 [Challenge 2]—[Detailed explanation of the challenge with specific examples and business implications]
            👉 [Challenge 3]—[Detailed explanation of the challenge with specific examples and business implications]
            👉 [Challenge 4]—[Detailed explanation of the challenge with specific examples and business implications]
        
            🎯 Sales Navigator Filters:
            ✅ Job Titles (Business Decision-Makers & Leaders):
            [List 20-30 non-finance job titles, one per line, focusing on business owners, executives, and operational leadership who would make decisions about hiring financial services. Include multiple variants of similar roles (Owner, Co-Owner, Founder, Co-Founder, etc.)]
            Examples:
            Owner
            Co-Owner
            Founder
            Co-Founder
            CEO
            President
            Managing Director
            Managing Partner
            Partner
            Director
            Executive Director
            Chief Operating Officer
            COO
            VP of Operations
            General Manager
                
            ✅ Industry:
            [List 3-5 industry categories, one per line]
                
            ✅ Company Headcount:
            [Specify employee range using LinkedIn's standard brackets: 11-50, 51-200, 201-500, etc.]
                
            ✅ Company Type:
            [List company types, one per line]
                
            ✅ Keywords in Company Name:
            [List relevant keywords in quotation marks]
                
            ✅ Boolean Search Query:
            [Provide a sample boolean search string using OR operators]
                
            Best Intent Data Signals
            🔹 [Signal 1] (Detailed explanation with specific business implications)
            🔹 [Signal 2] (Detailed explanation with specific business implications)
            🔹 [Signal 3] (Detailed explanation with specific business implications)
            🔹 [Signal 4] (Detailed explanation with specific business implications)
          "
      },
      {...same format above for the next segments}
    ]

    IMPORTANT INSTRUCTIONS:
    - Format your ENTIRE response as a valid JSON array that can be parsed with JSON.parse()
    - Do NOT include any text before or after the JSON
    - Please provide a valid JSON response without markdown formatting or additional text.
    - Maintain the exact structure shown above
    - Use the exact emoji formatting shown above (1️⃣, 👉, 🎯, ✅, 🔹)
    - Do NOT include any introductory text, disclaimers, or conclusions
    - Start immediately with "1️⃣" and the first segment name
    - Extract and transform information from the provided segment analysis
    - Focus on creating practical Sales Navigator targeting parameters
    - For Job Titles: Do NOT include finance roles (CFO, Finance Director, Controller, etc.) since these positions would NOT hire fractional CFO services. Instead, focus on business leaders/owners who would make these decisions.
    - Include a diverse range of job title variants to maximize the total addressable market
    - Provide in-depth, detailed explanations for "Why This Segment?" and "Key Challenges" sections
    - End after completing the last segment with no closing remarks

    ${segmentInfo.substring(0, 20000)}
    `;
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://market-segment-generator.vercel.app/',
        'X-Title': 'LinkedIn Sales Navigator Targeting',
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
    
    try {
      const data = JSON.parse(responseText);
      if (!data.choices?.[0]?.message) {
        return NextResponse.json({ 
          error: 'Invalid response format from OpenRouter',
          details: responseText 
        }, { status: 500 });
      }
      
      let content = data.choices[0].message.content;
      
      // Clean up the content if it contains markdown code blocks
      if (content.includes('```json')) {
        content = content.replace(/```json\n/g, '').replace(/\n```/g, '');
      } else if (content.includes('```')) {
        content = content.replace(/```\n/g, '').replace(/\n```/g, '');
      }
      
      console.log('Cleaned content:', content.substring(0, 100) + '...');
      
      // Try to parse the content as JSON
      try {
        // This will throw if content is not valid JSON
        const parsedSegments = JSON.parse(content);
        
        // Create a readable text format for display
        let readableContent = '';
        
        if (Array.isArray(parsedSegments)) {
          parsedSegments.forEach((segment, index) => {
            if (segment.name && segment.content) {
              // Add segment name as a header with formatting
              readableContent += `${index + 1}. ${segment.name.toUpperCase()}\n`;
              readableContent += '='.repeat(segment.name.length + 4) + '\n\n';
              
              // Process the content to ensure proper formatting
              let formattedContent = segment.content.trim();
              
              // Ensure proper line breaks for sections
              formattedContent = formattedContent.replace(/Why This Segment\?/g, '\nWhy This Segment?\n' + '-'.repeat(18) + '\n');
              formattedContent = formattedContent.replace(/Key Challenges:/g, '\nKey Challenges:\n' + '-'.repeat(15) + '\n');
              formattedContent = formattedContent.replace(/🎯 Sales Navigator Filters:/g, '\n🎯 Sales Navigator Filters:\n' + '-'.repeat(25) + '\n');
              formattedContent = formattedContent.replace(/Best Intent Data Signals/g, '\nBest Intent Data Signals\n' + '-'.repeat(24) + '\n');
              
              // Add the formatted content
              readableContent += formattedContent + '\n\n';
              
              // Add separator between segments
              if (index < parsedSegments.length - 1) {
                readableContent += '\n' + '*'.repeat(50) + '\n\n';
              }
            }
          });
        }
        
        // Return both the readable text for display and structured data for segment selection
        return NextResponse.json({
          result: readableContent || JSON.stringify(parsedSegments, null, 2), // Readable text or fallback to JSON
          segments: parsedSegments // Structured data for segment selection
        });
      } catch (jsonError) {
        console.error('Error parsing LLM response as JSON:', jsonError);
        // If parsing fails, return the raw content
        return NextResponse.json({
          result: content,
          error: 'Failed to parse LLM response as JSON. Returning raw content.'
        });
      }
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      return NextResponse.json({ 
        error: 'Failed to parse API response',
        details: responseText 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error generating segments:', error);
    return NextResponse.json({ 
      error: 'Failed to generate strategy',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}