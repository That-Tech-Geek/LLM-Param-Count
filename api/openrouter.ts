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
      error: 'OPENROUTER_API key is missing in environment variables or Vercel config.',
      fallback: true,
    });
  }

  const { prompt, model, assessmentData } = req.body || {};

  // Build a hyper-customized context string if assessmentData is provided
  let userPromptContext = prompt;
  if (assessmentData) {
    const {
      archetypeTitle,
      architectureCode,
      formattedParams,
      contextWindowFormatted,
      attentionHeadsValue,
      layerDepthValue,
      temperatureValue,
      topPValue,
      linguisticMetrics,
      answersSummary,
    } = assessmentData;

    userPromptContext = `
HUMAN NEURAL ASSESSMENT DATA:
- Archetype Title: ${archetypeTitle}
- Architecture Code: ${architectureCode}
- Total Parameters: ${formattedParams}
- Context Window: ${contextWindowFormatted}
- Attention Heads: ${attentionHeadsValue}
- Layer Depth: ${layerDepthValue} layers
- Sampling Temperature: ${temperatureValue}
- Top-p: ${topPValue}
- Lexical Richness Score: ${linguisticMetrics?.lexicalRichness} (${linguisticMetrics?.totalWords} words typed, ${linguisticMetrics?.punctuationCount} punctuation marks)
- Typed 5-Word Mental State (Q7): "${answersSummary?.typedMentalState || 'N/A'}"
- Typed Apology to Future Self (Q8): "${answersSummary?.typedApology || 'N/A'}"
- Sample MCQ Choices: ${JSON.stringify(answersSummary?.mcqSummary?.slice(0, 5) || [])}

INSTRUCTIONS:
Evaluate this human brain as if it were a custom fine-tuned Large Language Model. You MUST return ONLY valid JSON matching this exact structure:
{
  "customTitle": "A witty 3-5 word custom archetype title",
  "summaryOverview": "2-3 sentences evaluating their overall neural parameters, specifically referencing their 5-word mental state and future self apology.",
  "linguisticAnalysis": "Detailed linguistic evaluation of their typed words (vocabulary diversity, tone, compression, emotional temperature).",
  "parameterExplanation": "Explain why they received ${formattedParams} parameters compared to human brain biology (~86B neurons) and AI models.",
  "contextWindowExplain": "Why their ${contextWindowFormatted} context window matches their memory and focus habits.",
  "attentionHeadsExplain": "Why their ${attentionHeadsValue} attention heads reflect their social/multitasking style.",
  "temperatureExplain": "Why their ${temperatureValue} temperature reflects their creative chaos vs logic.",
  "behavioralQuirks": ["3 hyper-specific funny predictions about their daily life habits"],
  "optimizationAdvice": "1 actionable advice to optimize their mental parameters.",
  "roast": "A hilarious, cutting 2-sentence roast of their neural parameters.",
  "praise": "A sincere 1-sentence praise of their cognitive superpower."
}
DO NOT wrap the output in markdown codeblocks if possible, or use plain JSON.
`;
  }

  const selectedModel = model || 'meta-llama/llama-3.1-8b-instruct:free';

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
        model: selectedModel,
        messages: [
          {
            role: 'system',
            content:
              'You are a world-class AI neural architecture diagnostician and computational psychologist. Respond strictly with structured JSON analysis evaluating the human as an LLM.',
          },
          {
            role: 'user',
            content: userPromptContext,
          },
        ],
        max_tokens: 600,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: `OpenRouter API error: ${errText}` });
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || '';

    // Attempt to parse JSON if returned
    let parsedJson = null;
    try {
      const cleanJsonStr = rawContent
        .replace(/^```json/g, '')
        .replace(/^```/g, '')
        .replace(/```$/g, '')
        .trim();
      parsedJson = JSON.parse(cleanJsonStr);
    } catch {
      // If parsing failed, pass raw text
    }

    return res.status(200).json({
      result: rawContent,
      synthesis: parsedJson,
      model: data.model || selectedModel,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Server error calling OpenRouter' });
  }
}
