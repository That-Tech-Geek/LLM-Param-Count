export interface OpenRouterResponse {
  result: string;
  model?: string;
  error?: string;
}

export async function fetchOpenRouterDiagnosis(
  archetypeTitle: string,
  architectureCode: string,
  formattedParams: string,
  roast: string,
  praise: string
): Promise<OpenRouterResponse | null> {
  const prompt = `Human Assessment Summary:
- Archetype: ${archetypeTitle}
- Architecture Code: ${architectureCode}
- Total Parameters: ${formattedParams}
- Base Roast: ${roast}
- Base Praise: ${praise}

Generate a hilarious 2-sentence AI fine-tuned synaptic roast and 1-sentence praise evaluating this human brain architecture. Be extremely clever and witty.`;

  try {
    // 1. Try server API route first (/api/openrouter)
    const apiRes = await fetch('/api/openrouter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (apiRes.ok) {
      const data = await apiRes.json();
      if (data.result) {
        return { result: data.result, model: data.model };
      }
    }

    // 2. Fallback to direct OpenRouter API if client key exists (VITE_OPENROUTER_API / VITE_OPENROUTER_API_KEY)
    const envObj = (import.meta as unknown as { env?: Record<string, string> }).env || {};
    const clientKey = envObj.VITE_OPENROUTER_API || envObj.VITE_OPENROUTER_API_KEY;

    if (clientKey) {
      const directRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${clientKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Neural Architecture Assessment',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.1-8b-instruct:free',
          messages: [
            {
              role: 'system',
              content:
                'You are an ultra-witty AI neural evaluator. Provide a concise 2-sentence roast and 1-sentence praise.',
            },
            { role: 'user', content: prompt },
          ],
          max_tokens: 250,
        }),
      });

      if (directRes.ok) {
        const data = await directRes.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          return { result: content, model: data.model };
        }
      }
    }

    return null;
  } catch (err) {
    console.warn('OpenRouter API request skipped or failed:', err);
    return null;
  }
}
