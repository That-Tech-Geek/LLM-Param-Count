import { AnswersState, MCQOption, NeuralResults, TraitScores, QuestionMCQ, QuestionTyping, LinguisticMetrics } from '../types';
import { QUESTIONS } from '../data/questions';

export function calculateResults(answers: AnswersState, submitTimestamp: number = Date.now()): NeuralResults {
  const traitAccumulator: TraitScores = {
    context: 0,
    heads: 0,
    layers: 0,
    temperature: 0,
    topP: 0,
  };

  let mcqCount = 0;

  // 1. Process MCQs
  QUESTIONS.forEach((q) => {
    if (q.type === 'mcq') {
      const mcq = q as QuestionMCQ;
      const selectedOptionId = answers[q.id];
      const option = mcq.options.find((opt) => opt.id === selectedOptionId);
      if (option) {
        traitAccumulator.context += option.stats.context;
        traitAccumulator.heads += option.stats.heads;
        traitAccumulator.layers += option.stats.layers;
        traitAccumulator.temperature += option.stats.temperature;
        traitAccumulator.topP += option.stats.topP;
        mcqCount++;
      }
    }
  });

  // Calculate raw cognitive score (range ~40 to ~320)
  const rawCognitiveScore =
    traitAccumulator.context +
    traitAccumulator.heads +
    traitAccumulator.layers +
    traitAccumulator.temperature +
    traitAccumulator.topP;

  // Base parameters formula: scales nicely from ~12 Billion to ~120 Billion base
  // base_params = 12_500_000_000 + (rawCognitiveScore * 420_000_000)
  const baseParams = 12_500_000_000 + rawCognitiveScore * 420_000_000;

  // 2. Process Typing Prompts (Q7 and Q8)
  const text7 = answers[7] || '';
  const text8 = answers[8] || '';
  const combinedText = `${text7} ${text8}`.trim();

  // Words breakdown
  const rawWords = combinedText.length > 0 ? combinedText.split(/\s+/).filter(Boolean) : [];
  const wordCount = rawWords.length;

  // Unique words
  const cleanWords = rawWords.map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, '')).filter(Boolean);
  const uniqueWordsSet = new Set(cleanWords);
  const uniqueWordsCount = uniqueWordsSet.size;

  // Lexical richness ratio (0.3 to 1.0)
  const rawRichness = wordCount > 0 ? uniqueWordsCount / wordCount : 0.5;
  const lexicalRichness = Math.min(1.0, Math.max(0.3, Number(rawRichness.toFixed(3))));

  // Punctuation count (!, ?, ..., ;, :, -)
  const punctuationMatches = combinedText.match(/[!?,.;:-]/g) || [];
  const punctuationCount = punctuationMatches.length;

  // Average word length
  const totalCharsInWords = cleanWords.join('').length;
  const avgWordLength = wordCount > 0 ? Number((totalCharsInWords / wordCount).toFixed(2)) : 4.5;

  // Detect LLM / Canned Suspicious Phrases
  const lowerText = combinedText.toLowerCase();
  const llmTriggers = [
    'i am a conscious being',
    'as an ai language model',
    'as an ai',
    'test test test',
    'lorem ipsum',
    'i am an artificial intelligence',
    'hello world hello world',
    'as a large language model',
  ];

  let isLLMSuspicious = false;
  let llmReason = '';

  for (const trigger of llmTriggers) {
    if (lowerText.includes(trigger)) {
      isLLMSuspicious = true;
      llmReason = `Detected canned synthetic token signature: "${trigger}"`;
      break;
    }
  }

  // Check for repeated identical words (3+ times in a row)
  if (!isLLMSuspicious && cleanWords.length >= 4) {
    for (let i = 0; i < cleanWords.length - 2; i++) {
      if (cleanWords[i] === cleanWords[i + 1] && cleanWords[i] === cleanWords[i + 2]) {
        isLLMSuspicious = true;
        llmReason = 'Detected repetitive synthetic token loop (3x word repeat)';
        break;
      }
    }
  }

  // Linguistic Fine-Tune Multiplier
  let textMultiplier = 0.85 + lexicalRichness * 0.35 + punctuationCount * 0.02;
  textMultiplier = Math.min(1.45, Math.max(0.70, Number(textMultiplier.toFixed(4))));

  // 3. Heisenberg Chaos Seed (Microsecond submission variance)
  const chaosValue = (submitTimestamp % 9999) / 10000; // 0 to 0.9999
  const chaosBonus = Number((1 + chaosValue * 0.0005).toFixed(6)); // max +0.05%

  // 4. Calculate Final Parameters
  let finalParams = baseParams * textMultiplier * chaosBonus;

  // If LLM suspicious, apply synthetic penalty cap unless overridden
  if (isLLMSuspicious) {
    finalParams = 500_000_000 + (finalParams % 499_999_999);
  }

  // Format with exact commas & 3 decimals
  const formattedParams = finalParams.toLocaleString('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });

  // 5. Build Architecture Code
  const avgContext = traitAccumulator.context / Math.max(1, mcqCount);
  const avgHeads = traitAccumulator.heads / Math.max(1, mcqCount);
  const avgLayers = traitAccumulator.layers / Math.max(1, mcqCount);
  const avgTemp = traitAccumulator.temperature / Math.max(1, mcqCount);
  const avgTopP = traitAccumulator.topP / Math.max(1, mcqCount);

  // Map to architecture tags
  const contextCode = mapContextCode(avgContext);
  const headsCode = mapHeadsCode(avgHeads);
  const layersCode = mapLayersCode(avgLayers);
  const architectureCode = `${contextCode} / ${headsCode} / ${layersCode}`;

  // Formatted Trait values for sliders
  const contextWindowValue = Math.round(avgContext * 16); // e.g., 32 to 128 (k tokens)
  const contextWindowFormatted = `${contextWindowValue}k tokens`;

  const attentionHeadsValue = Math.round(16 + avgHeads * 11.2); // 32 to 128 heads
  const layerDepthValue = Math.round(12 + avgLayers * 8.4); // 20 to 96 layers

  const temperatureValue = Number((0.15 + avgTemp * 0.085).toFixed(2)); // 0.20 to 1.00
  const topPValue = Number((0.50 + avgTopP * 0.048).toFixed(2)); // 0.55 to 0.98

  // 6. Generate Archetype & Diagnosis
  const { title, description, roast, praise } = generateDiagnosis(
    avgContext,
    avgHeads,
    avgLayers,
    avgTemp,
    avgTopP,
    lexicalRichness,
    isLLMSuspicious
  );

  const linguisticMetrics: LinguisticMetrics = {
    totalWords: wordCount,
    uniqueWords: uniqueWordsCount,
    lexicalRichness,
    punctuationCount,
    avgWordLength,
    textMultiplier,
    isLLMSuspicious,
    llmReason,
  };

  return {
    baseParams,
    textMultiplier,
    chaosBonus,
    chaosValue,
    finalParams,
    formattedParams,
    architectureCode,
    archetypeTitle: title,
    archetypeDescription: description,
    roast,
    praise,
    isSyntheticOverride: isLLMSuspicious,
    contextWindowFormatted,
    contextWindowValue,
    attentionHeadsValue,
    layerDepthValue,
    temperatureValue,
    topPValue,
    linguisticMetrics,
    stats: traitAccumulator,
    timestamp: submitTimestamp,
  };
}

function mapContextCode(avg: number): string {
  if (avg >= 8.5) return 'C-128k';
  if (avg >= 7.0) return 'C-64k';
  if (avg >= 5.0) return 'C-32k';
  if (avg >= 3.5) return 'C-16k';
  return 'C-8k';
}

function mapHeadsCode(avg: number): string {
  if (avg >= 8.5) return 'H-128';
  if (avg >= 7.0) return 'H-96';
  if (avg >= 5.0) return 'H-64';
  if (avg >= 3.5) return 'H-32';
  return 'H-16';
}

function mapLayersCode(avg: number): string {
  if (avg >= 8.5) return 'L-64';
  if (avg >= 7.0) return 'L-48';
  if (avg >= 5.0) return 'L-36';
  if (avg >= 3.5) return 'L-24';
  return 'L-16';
}

function generateDiagnosis(
  context: number,
  heads: number,
  layers: number,
  temp: number,
  topP: number,
  richness: number,
  isLLMSuspicious: boolean
) {
  if (isLLMSuspicious) {
    return {
      title: 'Synthetic Impostor (Bot Penalty)',
      description: 'Your responses triggered neural anomaly filters. High likelihood of canned script or mechanical repetitive inputs.',
      roast: 'Your context window collapsed under synthetic detection. You sound like an AI trying to pass a captcha test written for humans.',
      praise: 'Your punctuation consistency and speed were impeccably machine-like.',
    };
  }

  // Determine dominant traits
  if (temp >= 7.5 && context <= 5.5) {
    return {
      title: 'The Overclocked Hallucinator',
      description: 'High sampling variance paired with a compact context cache. You move fast and break logical consistency.',
      roast: 'Your Context Window is modest, but your Temperature is running dangerously high. You are an overthinker who still makes impulsive decisions.',
      praise: 'Your creative top-p sampling generates brilliant, unexpected ideas before your guardrails even notice.',
    };
  }

  if (context >= 7.5 && temp <= 4.0) {
    return {
      title: 'The Deterministic Compiler',
      description: 'Deep structural layers and ultra-low temperature sampling. Extremely reliable, hyper-focused, and immune to chaos.',
      roast: 'You remember group chat details from 2021, but your emotional response temperature is as cold as a compiled C++ binary.',
      praise: 'Unmatched precision and context retention. When the world collapses, people come to you to check the logs.',
    };
  }

  if (heads >= 7.5 && layers >= 7.5) {
    return {
      title: 'The Ultra-Deep Synthesizer',
      description: 'Massive multi-headed attention structure with deep transformer layers. Capable of processing extreme nuance.',
      roast: 'You possess 96 attention heads, which means you spend 4 hours over-analyzing a two-word text message from your friend.',
      praise: 'Your cognitive bandwidth is staggering. You process subtle social signals that lesser architectures miss entirely.',
    };
  }

  if (temp >= 7.0 && topP >= 7.5) {
    return {
      title: 'The Quantum Chaos Node',
      description: 'High temperature and broad nucleus sampling. Unpredictable, highly adaptable, and endlessly inventive.',
      roast: 'Your sampling temperature is at maximum entropy. Your friends call you adventurous; your neural debugger calls you a memory leak.',
      praise: 'Your dynamic flexibility keeps life thrilling. You solve problems with non-linear leaps that stump traditional logic.',
    };
  }

  return {
    title: 'The Balanced Transformer',
    description: 'Harmonious alignment across context depth, attention heads, and sampling temperature.',
    roast: 'You are remarkably balanced, which is a polite way of saying your neural parameters are suspiciously reasonable.',
    praise: 'Optimal trade-offs between precision and creativity. You know when to analyze and when to go with the vibes.',
  };
}
