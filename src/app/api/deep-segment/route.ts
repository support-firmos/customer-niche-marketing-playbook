// src/app/api/deep-segment-research/route.ts
import { NextResponse } from 'next/server';

// Set maximum duration to 60 seconds
export const maxDuration = 60;

// Use Node.js runtime to support longer execution times
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    let segmentInfo;
    console.log('Request data:', JSON.stringify(requestData));
    
    // Handle both string and object formats
    if (typeof requestData.segmentInfo === 'string') {
      segmentInfo = requestData.segmentInfo;
    } else if (requestData.segmentInfo && typeof requestData.segmentInfo === 'object') {
      console.log('Segment info is an object:', requestData.segmentInfo);
      
      // If it's an object with content property, use that
      if (requestData.segmentInfo.content) {
        segmentInfo = requestData.segmentInfo.content;
        console.log('Using content property:', segmentInfo.substring(0, 100) + '...');
      } else {
        // Otherwise stringify the whole object
        segmentInfo = JSON.stringify(requestData.segmentInfo);
        console.log('Stringified object:', segmentInfo.substring(0, 100) + '...');
      }
    } else {
      console.log('Invalid segment info:', requestData.segmentInfo);
      return NextResponse.json({ error: 'Invalid segment information' }, { status: 400 });
    }
    
    // Extract segment name for the title
    let segmentName = "";
    if (typeof requestData.segmentInfo === 'object' && requestData.segmentInfo.name) {
      segmentName = requestData.segmentInfo.name;
      console.log('Extracted segment name:', segmentName);
    }
    
    // Remove emoji numbers if present in the segment name
    segmentName = segmentName.replace(/^\d️⃣\s*/, '');
    console.log('Cleaned segment name:', segmentName);
    segmentName = segmentName.replace(/^\d️⃣\s*/, '');
    
    const prompt = `You are an empathetic B2B Researcher capable of deeply understanding and embodying the Ideal Customer Profile (ICP) for CFO services.

## Your Task
Analyze the ICP below provided below and generate a comprehensive market research profile following the exact structure below. Use the information to identify the most relevant and impactful insights.

## Analysis Requirements
Provide exactly 5 items per category. There is a guide below to help you write each item.

### FEARS (the deep-seated fears that drive the decision-making process of the target audience)
  Fear 1 - What keeps your ideal customer up at night regarding their business?
  Fear 2 - What are the worst-case scenarios they imagine could happen to their company?
  Fear 3 - How do they perceive potential threats to their job security or business stability?
  Fear 4 - What industry changes or market trends do they fear the most?
  Fear 5 - How do they feel about the possibility of making a wrong decision in their role?

### PAINS (Identify the specific problems and challenges the target audience faces regularly)
  Pain 1 - What are the biggest daily frustrations your ideal customer experiences in their role?
   Pain 2 - What tasks or processes do they find most time-consuming or inefficient?
   Pain 3 - How do they describe their main challenges when talking to peers or colleagues?
   Pain 4 - What negative experiences have they had with similar products or services in the past?
   Pain 5 - How do their current problems affect their ability to achieve their business goals?

### OBJECTIONS (Recognize the reasons why the target audience might hesitate to buy or engage with your product or service)
    Objection 1 - What are the primary reasons your ideal customer might be skeptical about your product or service?
    Objection 2 - How do they evaluate the risks versus the benefits of adopting a new solution?
    Objection 3 - What previous experiences with other providers might make them wary of trying your solution?
    Objection 4 - What financial or budgetary concerns do they have regarding your offering?
    Objection 5 - How do they perceive the difficulty of integrating your product or service into their existing workflows?

### GOALS (Determine the primary objectives and aspirations that drive the target audience's actions)
    Goal 1 - What are the top three goals your ideal customer aims to achieve in the next year?
    Goal 2 - How do they measure success in their role or business?
    Goal 3 - What long-term visions or ambitions do they have for their company?
    Goal 4 - What are the immediate milestones they are working towards?
    Goal 5 - How do they prioritize their goals in the context of their daily responsibilities?

### VALUES (Understand the core values that influence the target audience's decision-making process)
    Value 1 - What ethical considerations are most important to your ideal customer when choosing a provider?
    Value 2 - How do they define quality and value in a product or service?
    Value 3 - What company culture aspects do they value in their own organization?
    Value 4 - How do they prefer to build relationships with vendors and partners?
    Value 5 - What do they value most in their business relationships (e.g., transparency, reliability, innovation)?

### DECISION-MAKING PROCESSES (Gain insight into how the target audience makes purchasing decisions)
    Decision-Making Process 1 - What steps do they typically follow when evaluating a new product or service?
    Decision-Making Process 2 - Who else is involved in the decision-making process within their company?
    Decision-Making Process 3 - What criteria are most important to them when selecting a solution?
    Decision-Making Process 4- How do they gather and assess information before making a decision?
    Decision-Making Process 5 - What external resources (reviews, testimonials, case studies) do they rely on during the decision-making process?

### INFLUENCES (Identify the key factors and individuals that influence the target audience's choices)
    Influence 1 - Who are the thought leaders or industry experts your ideal customer trusts the most?
    Influence 2 - What publications, blogs, or websites do they frequently read for industry news and insights?
    Influence 3 - How do they engage with their professional network to seek advice or recommendations?
    Influence 4 - What role do customer reviews and testimonials play in their purchasing decisions?
    Influence 5 - How do industry events, conferences, and webinars influence their perceptions and decisions?

### COMMUNICATION PREFERENCES (Understand how the target audience prefers to receive and interact with marketing messages)
    Communication Preference 1 - What communication channels do they use most frequently (email, social media, phone, etc.)?
    Communication Preference 2 - How do they prefer to receive information about new products or services?
    Communication Preference 3 - What type of content (articles, videos, infographics) do they find most engaging and useful?
    Communication Preference 4 - How often do they like to be contacted by potential vendors?
    Communication Preference 5 - What tone and style of communication do they respond to best (formal, casual, informative, etc.)?

## Response Format

  🔎 🔎 🔎 MARKET RESEARCH - ${segmentName} 🔎 🔎 🔎

  ⚠️ FEARS ⚠️

  1️⃣ [Fear 1 title]
  [A comprehensive explanation of the fear. Must include real-world business impact. Use paragraph and/or bullet points.]
  💡 How CFO's Can Help
  [Comprehensively discuss how CFO services address it. Use paragraph and/or bullet points.]

  [*Repeat the format above for the remaining 4 fears*]

  ⚙️ PAINS ⚙️

  1️⃣ [Pain 1 title]
  [A comprehensive explanation of the pain. Must include real-world negative consequences or financial impact. Use paragraph and/or bullet points.]
  💡 How CFO's Can Help
  [Comprehensively discuss how CFO services address it. Use paragraph and/or bullet points.]

  [*Repeat the format above for the remaining 4 pains*]

  ⛔ OBJECTIONS ⛔

  1️⃣ [Objection 1 title]
  [A comprehensive explanation of the objection. Must include real-world client concerns. Use paragraph and/or bullet points.]
  💡 How CFO's Can Help
  [Comprehensively discuss and counter by providing benefits of a CFO's services. Use paragraph and/or bullet points.]

  [*Repeat the format above for the remaining 4 objections*]

  🎯 GOALS 🎯

  1️⃣ [Goal 1 title]
  [A comprehensive explanation of the goal. Must include desired real-world outcomes. Use paragraph and/or bullet points.]
  💡 How CFO's Can Help
  [Comprehensively discuss how CFO's services help attain the goal. Use paragraph and/or bullet points.]

  [*Repeat the format above for the remaining 4 goals]

  💎 VALUES 💎

  1️⃣ [Value 1 title]
  [A comprehensive explanation of the value. Must align the value to real-world business decisions. Use paragraph and/or bullet points.]
  💡 How CFO's Can Help
  [Comprehensively discuss how CFO's services help preserve that value. Use paragraph and/or bullet points.]

  [*Repeat the format above for the remaining 4 values]

  🔄 DECISION-MAKING PROCESSES 🔄

  1️⃣ [Process  1 title]
  [A comprehensive explanation of the decision-making process. Must identify key stakeholders and actions. Use paragraph and/or bullet points.]
  💡 How CFO's Can Help
  [Comprehensively discuss how CFO's services help fit in or improve that process. Use paragraph and/or bullet points.]

  [*Repeat the format above for the remaining 4 values]

  🔊 INFLUENCES 🔊

  1️⃣ [Influence 1 title]
  [A comprehensive explanation of the influence. Must identify who/what shapes decisions and provide a specific marketing approach. Use paragraph and/or bullet points.]
  💡 How CFO's Can Help
  [Comprehensively discuss how CFO's services help leverage this influence. Use paragraph and/or bullet points.]

  [*Repeat the format above for the remaining 4 influences]

  📱 COMMUNICATION PREFERENCES 📱

  1️⃣ [Preference 1 title]
  [A comprehensive explanation of the communication preference and best practices. Must include channel preferences and specific content recommendations. Use paragraph and/or bullet points.]
  💡 How CFO's Can Help
  [Comprehensively discuss how CFO's services help aid, improve or leverage this preference. Use paragraph and/or bullet points.]

  [*Repeat the format above for the remaining 4 preferences]


## ICP:
${segmentInfo}

Important notes:
- Follow the exact structure shown in the template with precise emoji placement
- Explanations must include both the issue/need AND how CFO services specifically address it
- Ensure consistent sentence structure and formatting across all sections
- DO NOT include introductions, disclaimers, or conclusions
- Maintain exact spacing shown in the template
`;

    
    console.log('Segment info:', segmentInfo);
    console.log('Segment name:', segmentName);
    
    // Make the API request without streaming
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://deep-segment-researcher.vercel.app/',
        'X-Title': 'Deep Segment Research',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: [{ role: 'user', content: prompt }],
        stream: false, // Don't stream the response
        max_tokens: 25000,
        temperature: 1,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status}, ${errorText}`);
    }
    
    // Parse the response as JSON
    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || '';
    
    console.log('API response content (raw):', content.substring(0, 100) + '...');
    
    // Clean up the content if it contains markdown code blocks
    if (content.includes('```json')) {
      content = content.replace(/```json\n/g, '').replace(/\n```/g, '');
    } else if (content.includes('```')) {
      content = content.replace(/```\n/g, '').replace(/\n```/g, '');
    }
    
    console.log('API response content (cleaned):', content.substring(0, 100) + '...');
    
    // Return the content as JSON
    return NextResponse.json({
      result: content
    });
    
  } catch (error) {
    console.error('Error generating segments:', error);
    return NextResponse.json({ 
      error: 'Failed to generate strategy',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}