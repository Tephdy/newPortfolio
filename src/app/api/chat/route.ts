import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { SYSTEM_PROMPT, generatePortfolioAiResponse } from '@/lib/portfolioAi';
import { GitHubRepo } from '@/types/os';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages = [], repos = [] } = body;

    const lastUserMessage =
      messages && messages.length > 0
        ? messages[messages.length - 1].content
        : '';

    if (!lastUserMessage.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      console.error('❌ GEMINI_API_KEY is missing from environment variables.');
      const reply = generatePortfolioAiResponse(lastUserMessage, repos);
      return NextResponse.json({ reply });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });

      const reposContext =
        repos.length > 0
          ? `\n\nPUBLIC GITHUB REPOSITORIES FROM @Tephdy:\n` +
          repos
            .map(
              (r: GitHubRepo) =>
                `- ${r.name}: ${r.description || 'No description'} (Language: ${r.language || 'Code'
                }, URL: ${r.html_url})`
            )
            .join('\n')
          : '';

      const systemInstruction = SYSTEM_PROMPT + reposContext;

      const formattedContents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      // Using the standard active model name
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: formattedContents,
        config: {
          systemInstruction,
        },
      });

      const reply = response.text;
      if (reply) {
        return NextResponse.json({ reply });
      }
    } catch (geminiError) {
      console.error('🔥 GEMINI API CONNECTION FAILED:', geminiError);
    }

    // Fallback if API throws an error
    const reply = generatePortfolioAiResponse(lastUserMessage, repos);
    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}