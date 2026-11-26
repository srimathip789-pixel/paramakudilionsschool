import { NextResponse } from 'next/server';
import { CHATBOT_SYSTEM_PROMPT } from '@/lib/chatbot-knowledge';
import { getFallbackResponse } from '@/lib/chatbot-fallback';

// ── Abuse protection ──────────────────────────────────────────────
const MAX_QUERY_CHARS = 500;
const MAX_HISTORY_ITEMS = 6;
const MAX_HISTORY_CHARS = 500;
const MAX_BODY_BYTES = 8_000;
const RATE_LIMIT = 10;              // requests…
const RATE_WINDOW_MS = 60_000;      // …per minute per IP
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter(t => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5_000) hits.clear(); // keep memory bounded
  return recent.length > RATE_LIMIT;
}

type ChatMsg = { sender: 'user' | 'bot'; text: string };
function cleanHistory(raw: unknown): ChatMsg[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((m): m is { sender: unknown; text: unknown } => !!m && typeof m === 'object')
    .filter(m => typeof m.text === 'string' && m.text.trim() !== '')
    .slice(-MAX_HISTORY_ITEMS)
    .map(m => ({ sender: m.sender === 'user' ? 'user' : 'bot', text: (m.text as string).slice(0, MAX_HISTORY_CHARS) }));
}

export async function POST(req: Request) {
  let query = '';
  try {
    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 });
    }
    if (Number(req.headers.get('content-length') || 0) > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'Request too large' }, { status: 413 });
    }

    const body = await req.json().catch(() => ({}));
    query = typeof body.query === 'string' ? body.query.trim() : '';
    const history = cleanHistory(body.history);

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }
    if (query.length > MAX_QUERY_CHARS) {
      return NextResponse.json({ error: `Please keep questions under ${MAX_QUERY_CHARS} characters.` }, { status: 400 });
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
        ...history.map(msg => ({
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
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
      {
        method: 'POST',
        // API key in a header, not the URL (URLs end up in logs)
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': geminiKey },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Chatbot] Gemini API returned error status:', response.status, errorText.slice(0, 300));
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

  } catch (err: unknown) {
    console.error('[Chatbot] Error inside API route:', err instanceof Error ? err.message : err);
    const fallbackReply = getFallbackResponse(query);
    return NextResponse.json({ text: fallbackReply, fallback: true });
  }
}
