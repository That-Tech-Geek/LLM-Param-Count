import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey =
    process.env.OPENROUTER_API ||
    process.env.OPENROUTER_API_KEY ||
    process.env.VITE_OPENROUTER_API_KEY;

  if (!apiKey) {
    return res.status(400).json({
      error: 'OPENROUTER_API key is missing in environment variables.',
      fallback: true,
    });
  }

  const { prompt, model } = req.body || {};

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.APP_URL || 'https://vercel.com',
        'X-Title': 'Neural Architecture Assessment',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [
          {
            role: 'system',
            content:
              'You are a witty, hyper-intelligent AI neural architecture evaluator. Provide a short 2-sentence roast and a 1-sentence praise based on the human assessment stats provided.',
          },
          {
            role: 'user',
            content: prompt || 'Analyze my neural architecture parameters.',
          },
        ],
        max_tokens: 250,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: `OpenRouter API error: ${errText}` });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    return res.status(200).json({ result: content, model: data.model });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Server error calling OpenRouter' });
  }
}
