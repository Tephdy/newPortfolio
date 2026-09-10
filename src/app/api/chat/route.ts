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

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });

        const reposContext =
          repos.length > 0
            ? `\n\nPUBLIC GITHUB REPOSITORIES FROM @Tephdy:\n` +
              repos
                .map(
                  (r: GitHubRepo) =>
                    `- ${r.name}: ${r.description || 'No description'} (Language: ${
                      r.language || 'Code'
                    }, URL: ${r.html_url})`
                )
                .join('\n')
            : '';

        const systemInstruction = SYSTEM_PROMPT + reposContext;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: lastUserMessage,
          config: {
            systemInstruction,
          },
        });

        const reply = response.text || generatePortfolioAiResponse(lastUserMessage, repos);
        return NextResponse.json({ reply });
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to local engine:', geminiError);
        const reply = generatePortfolioAiResponse(lastUserMessage, repos);
        return NextResponse.json({ reply });
      }
    }

    // Built-in intelligent portfolio knowledge response
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
