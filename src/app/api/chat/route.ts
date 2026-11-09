import { NextResponse } from 'next/server';
import { CHATBOT_SYSTEM_PROMPT } from '@/lib/chatbot-knowledge';
import { getFallbackResponse } from '@/lib/chatbot-fallback';

export async function POST(req: Request) {
  let query = '';
  try {
    const body = await req.json().catch(() => ({}));
    query = body.query || '';
    const history = body.history || [];

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const geminiKey = process.env.GEMINI_API_KEY;

    if (!geminiKey) {
      console.log('[Chatbot] GEMINI_API_KEY is not set. Using local semantic matching fallback.');
      const fallbackReply = getFallbackResponse(query);
      return NextResponse.json({ text: fallbackReply, fallback: true });
    }

    console.log('[Chatbot] Sending query to Gemini API...');
    
    // Construct request body for Gemini API with system instruction
    const requestBody = {
      systemInstruction: {
        parts: [
          {
            text: CHATBOT_SYSTEM_PROMPT
          }
        ]
      },
      contents: [
        // Include simple history formatting if provided
        ...(history || []).map((msg: any) => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        })),
        {
          role: 'user',
          parts: [{ text: query }]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 250
      }
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Chatbot] Gemini API returned error status:', response.status, errorText);
      // Fallback if API fails
      const fallbackReply = getFallbackResponse(query);
      return NextResponse.json({ text: fallbackReply, fallback: true });
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!replyText) {
      console.warn('[Chatbot] Gemini API response parsed successfully but returned no candidates.');
      const fallbackReply = getFallbackResponse(query);
      return NextResponse.json({ text: fallbackReply, fallback: true });
    }

    return NextResponse.json({ text: replyText.trim(), fallback: false });

  } catch (err: any) {
    console.error('[Chatbot] Error inside API route:', err?.message);
    const fallbackReply = getFallbackResponse(query);
    return NextResponse.json({ text: fallbackReply, fallback: true });
  }
}
