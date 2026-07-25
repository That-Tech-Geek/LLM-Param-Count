import { NeuralResults, OpenRouterSynthesis } from '../types';

export interface OpenRouterFetchResult {
  synthesis: OpenRouterSynthesis;
  model: string;
  isFallback?: boolean;
  error?: string;
}

export async function fetchOpenRouterDiagnosis(
  results: NeuralResults,
  selectedModel?: string,
  customApiKey?: string
): Promise<OpenRouterFetchResult> {
  const modelToUse = selectedModel || 'meta-llama/llama-3.1-8b-instruct:free';

  try {
    // 1. Try server API route (/api/openrouter)
    const apiRes = await fetch('/api/openrouter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(customApiKey ? { Authorization: `Bearer ${customApiKey}` } : {}),
      },
      body: JSON.stringify({
        model: modelToUse,
        assessmentData: {
          archetypeTitle: results.archetypeTitle,
          architectureCode: results.architectureCode,
          formattedParams: results.formattedParams,
          contextWindowFormatted: results.contextWindowFormatted,
          attentionHeadsValue: results.attentionHeadsValue,
          layerDepthValue: results.layerDepthValue,
          temperatureValue: results.temperatureValue,
          topPValue: results.topPValue,
          linguisticMetrics: results.linguisticMetrics,
          answersSummary: results.answersSummary,
        },
      }),
    });

    if (apiRes.ok) {
      const data = await apiRes.json();
      if (data.synthesis) {
        return {
          synthesis: { ...data.synthesis, rawText: data.result, modelUsed: data.model },
          model: data.model || modelToUse,
        };
      } else if (data.result) {
        const parsed = parseRawTextToSynthesis(data.result, results);
        return {
          synthesis: { ...parsed, rawText: data.result, modelUsed: data.model },
          model: data.model || modelToUse,
        };
      }
    }

    // 2. Try direct client key if present
    const envObj = (import.meta as unknown as { env?: Record<string, string> }).env || {};
    const clientKey = customApiKey || envObj.VITE_OPENROUTER_API || envObj.VITE_OPENROUTER_API_KEY;

    if (clientKey) {
      const promptContext = `
HUMAN ASSESSMENT SUMMARY:
- Archetype: ${results.archetypeTitle}
- Code: ${results.architectureCode}
- Parameters: ${results.formattedParams}
- Context: ${results.contextWindowFormatted}
- Heads: ${results.attentionHeadsValue}
- Layers: ${results.layerDepthValue}
- Temperature: ${results.temperatureValue}
- Lexical Richness: ${results.linguisticMetrics.lexicalRichness}
- Typed Mental State (Q7): "${results.answersSummary?.typedMentalState || ''}"
- Typed Apology (Q8): "${results.answersSummary?.typedApology || ''}"

Respond with ONLY valid JSON:
{
  "customTitle": "...",
  "summaryOverview": "...",
  "linguisticAnalysis": "...",
  "parameterExplanation": "...",
  "contextWindowExplain": "...",
  "attentionHeadsExplain": "...",
  "temperatureExplain": "...",
  "behavioralQuirks": ["...", "...", "..."],
  "optimizationAdvice": "...",
  "roast": "...",
  "praise": "..."
}`;

      const directRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${clientKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Neural Architecture Assessment',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelToUse,
          messages: [
            {
              role: 'system',
              content:
                'You are an expert AI neural diagnostician. Evaluate this human brain as an LLM and return strict JSON.',
            },
            { role: 'user', content: promptContext },
          ],
          max_tokens: 600,
          temperature: 0.7,
        }),
      });

      if (directRes.ok) {
        const data = await directRes.json();
        const content = data.choices?.[0]?.message?.content || '';
        try {
          const cleanJsonStr = content
            .replace(/^```json/g, '')
            .replace(/^```/g, '')
            .replace(/```$/g, '')
            .trim();
          const parsedJson = JSON.parse(cleanJsonStr);
          return {
            synthesis: { ...parsedJson, rawText: content, modelUsed: data.model },
            model: data.model || modelToUse,
          };
        } catch {
          const parsed = parseRawTextToSynthesis(content, results);
          return {
            synthesis: { ...parsed, rawText: content, modelUsed: data.model },
            model: data.model || modelToUse,
          };
        }
      }
    }

    // 3. Fallback to Local Smart Synthesis Engine
    const localSynthesis = generateLocalSynthesis(results);
    return {
      synthesis: localSynthesis,
      model: 'Local Synaptic Engine (Custom AI Fallback)',
      isFallback: true,
    };
  } catch (err: any) {
    console.warn('OpenRouter request exception:', err);
    const localSynthesis = generateLocalSynthesis(results);
    return {
      synthesis: localSynthesis,
      model: 'Local Synaptic Engine (Custom AI Fallback)',
      isFallback: true,
      error: err?.message,
    };
  }
}

function parseRawTextToSynthesis(rawText: string, results: NeuralResults): OpenRouterSynthesis {
  return {
    customTitle: results.archetypeTitle,
    summaryOverview: rawText.slice(0, 300),
    linguisticAnalysis: `Analyzing typed input: "${results.answersSummary?.typedMentalState || ''}". Lexical richness of ${results.linguisticMetrics.lexicalRichness} indicates high token density.`,
    parameterExplanation: `Calibrated at ${results.formattedParams} parameters based on cognitive depth and response latency.`,
    contextWindowExplain: `Your ${results.contextWindowFormatted} context window governs your active working memory buffer.`,
    attentionHeadsExplain: `${results.attentionHeadsValue} attention heads handle parallel social and logical thread parsing.`,
    temperatureExplain: `Sampling temperature of ${results.temperatureValue} balances deterministic output with spontaneous creative entropy.`,
    behavioralQuirks: [
      'Checks group chat notifications immediately upon receiving a ping',
      'Over-optimizes daily routines before abandoning them for new hobbies',
      'Re-reads sent messages to evaluate their emotional temperature',
    ],
    optimizationAdvice: 'Lower your sampling temperature during intense focused work to prevent memory leakage.',
    roast: results.roast,
    praise: results.praise,
    rawText,
  };
}

export function generateLocalSynthesis(results: NeuralResults): OpenRouterSynthesis {
  const { linguisticMetrics, answersSummary, archetypeTitle, formattedParams, contextWindowFormatted, attentionHeadsValue, temperatureValue } = results;
  const mentalState = answersSummary?.typedMentalState || 'focused state';
  const apologyText = answersSummary?.typedApology || 'no regrets';

  return {
    customTitle: `Fine-Tuned ${archetypeTitle}`,
    summaryOverview: `Your neural architecture was fine-tuned on custom human training inputs. Your 5-word mental state declaration ("${mentalState}") combined with your future self message ("${apologyText}") reveals a highly specific synaptic compression pattern.`,
    linguisticAnalysis: `Your typed input achieved a vocabulary lexical richness score of ${(linguisticMetrics.lexicalRichness * 100).toFixed(0)}%. By typing "${mentalState}", you demonstrated semantic density with ${linguisticMetrics.punctuationCount} punctuation tokens.`,
    parameterExplanation: `At ${formattedParams} parameters, your human neural network contains ~${(results.finalParams / 1e9).toFixed(1)} Billion trainable weights—placing your cognitive capacity alongside frontier LLM architectures.`,
    contextWindowExplain: `Your ${contextWindowFormatted} context window buffer allows you to hold multi-turn social history in active RAM without dropping core objectives.`,
    attentionHeadsExplain: `With ${attentionHeadsValue} multi-headed attention projection layers, you process social nuance, emotional undertones, and raw logic simultaneously.`,
    temperatureExplain: `A sampling temperature of ${temperatureValue} means you alternate between precise deterministic logic and spontaneous creative leaps.`,
    behavioralQuirks: [
      `Frequently re-reads your typed statement ("${mentalState.slice(0, 25)}...") to ensure exact semantic resonance.`,
      `Keeps 20+ active browser tabs open in working RAM without crashing active context.`,
      `Apologizes to future self ("${apologyText.slice(0, 30)}...") while still making impulsive midnight choices.`,
    ],
    optimizationAdvice: `To reduce memory overhead, consider flushing low-priority context buffer items before starting high-entropy creative tasks.`,
    roast: results.roast,
    praise: results.praise,
  };
}
