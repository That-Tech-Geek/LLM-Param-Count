import { Question } from '../types';

export const QUESTIONS: Question[] = [
  // Phase 1: Core Cognition (Q1-Q6)
  {
    id: 1,
    type: 'mcq',
    phase: 'core',
    phaseName: 'Phase 1: Core Cognition',
    question: 'In a group chat, you are usually...',
    subtitle: 'Measures multi-node communication & active attention routing',
    options: [
      {
        id: 'A',
        label: 'The one keeping it alive',
        stats: { context: 8, heads: 9, layers: 5, temperature: 8, topP: 9 },
      },
      {
        id: 'B',
        label: 'The reactor (emojis only)',
        stats: { context: 3, heads: 4, layers: 3, temperature: 6, topP: 7 },
      },
      {
        id: 'C',
        label: 'The ghost reader',
        stats: { context: 9, heads: 7, layers: 8, temperature: 2, topP: 3 },
      },
      {
        id: 'D',
        label: 'The one who derails it',
        stats: { context: 5, heads: 6, layers: 4, temperature: 10, topP: 10 },
      },
    ],
  },
  {
    id: 2,
    type: 'mcq',
    phase: 'core',
    phaseName: 'Phase 1: Core Cognition',
    question: 'Your ideal planning style is...',
    subtitle: 'Measures structural graph depth & inference predictability',
    options: [
      {
        id: 'A',
        label: 'Spreadsheet god',
        stats: { context: 9, heads: 8, layers: 10, temperature: 1, topP: 2 },
      },
      {
        id: 'B',
        label: 'Vague mental notes',
        stats: { context: 6, heads: 5, layers: 5, temperature: 6, topP: 6 },
      },
      {
        id: 'C',
        label: 'Vibes-based',
        stats: { context: 4, heads: 6, layers: 3, temperature: 9, topP: 9 },
      },
      {
        id: 'D',
        label: 'Panic at the last minute',
        stats: { context: 7, heads: 10, layers: 6, temperature: 10, topP: 8 },
      },
    ],
  },
  {
    id: 3,
    type: 'mcq',
    phase: 'core',
    phaseName: 'Phase 1: Core Cognition',
    question: 'When reading a long article, you...',
    subtitle: 'Determines token window retention and attention allocation',
    options: [
      {
        id: 'A',
        label: 'Read every word',
        stats: { context: 10, heads: 8, layers: 9, temperature: 3, topP: 4 },
      },
      {
        id: 'B',
        label: 'Skim for bold text',
        stats: { context: 5, heads: 7, layers: 5, temperature: 5, topP: 6 },
      },
      {
        id: 'C',
        label: 'Skip to the end',
        stats: { context: 3, heads: 5, layers: 3, temperature: 8, topP: 8 },
      },
      {
        id: 'D',
        label: 'Save it to bookmarks (never read)',
        stats: { context: 8, heads: 3, layers: 6, temperature: 4, topP: 5 },
      },
    ],
  },
  {
    id: 4,
    type: 'mcq',
    phase: 'core',
    phaseName: 'Phase 1: Core Cognition',
    question: 'Your conflict resolution style:',
    subtitle: 'Evaluates loss function penalization and gradient descent path',
    options: [
      {
        id: 'A',
        label: 'Logic over feelings',
        stats: { context: 7, heads: 9, layers: 9, temperature: 2, topP: 3 },
      },
      {
        id: 'B',
        label: 'Feelings over logic',
        stats: { context: 6, heads: 8, layers: 5, temperature: 8, topP: 8 },
      },
      {
        id: 'C',
        label: 'Avoid at all costs',
        stats: { context: 4, heads: 3, layers: 7, temperature: 2, topP: 4 },
      },
      {
        id: 'D',
        label: 'Gaslight, gatekeep, girlboss',
        stats: { context: 8, heads: 10, layers: 8, temperature: 10, topP: 10 },
      },
    ],
  },
  {
    id: 5,
    type: 'mcq',
    phase: 'core',
    phaseName: 'Phase 1: Core Cognition',
    question: 'How do you take your coffee?',
    subtitle: 'Calibrates neural baseline voltage & systemic activation energy',
    options: [
      {
        id: 'A',
        label: 'Black (no sugar)',
        stats: { context: 8, heads: 9, layers: 9, temperature: 2, topP: 3 },
      },
      {
        id: 'B',
        label: 'Sugary milkshake',
        stats: { context: 5, heads: 6, layers: 4, temperature: 9, topP: 8 },
      },
      {
        id: 'C',
        label: "I don't drink coffee",
        stats: { context: 6, heads: 5, layers: 6, temperature: 4, topP: 5 },
      },
      {
        id: 'D',
        label: 'Decaf (psychopath)',
        stats: { context: 4, heads: 8, layers: 8, temperature: 8, topP: 7 },
      },
    ],
  },
  {
    id: 6,
    type: 'mcq',
    phase: 'core',
    phaseName: 'Phase 1: Core Cognition',
    question: 'Your memory is best described as:',
    subtitle: 'Maps vector embedding density & RAM cache architecture',
    options: [
      {
        id: 'A',
        label: 'Photographic',
        stats: { context: 10, heads: 10, layers: 9, temperature: 2, topP: 3 },
      },
      {
        id: 'B',
        label: 'Fact-based',
        stats: { context: 8, heads: 8, layers: 8, temperature: 3, topP: 4 },
      },
      {
        id: 'C',
        label: 'Emotional vibes',
        stats: { context: 5, heads: 6, layers: 5, temperature: 9, topP: 8 },
      },
      {
        id: 'D',
        label: '"What was the question?"',
        stats: { context: 2, heads: 3, layers: 2, temperature: 10, topP: 9 },
      },
    ],
  },

  // Phase 2: Fine-Tuning Phase (Q7-Q8)
  {
    id: 7,
    type: 'typing',
    phase: 'typing',
    phaseName: 'Phase 2: Fine-Tuning Phase',
    prompt: 'Describe your current mental state in exactly 5 words. No more, no less.',
    subtitle: 'Linguistic sample required for fine-tuning calibration. Strict 5-word constraint.',
    placeholder: 'e.g., Overworked coffee fueled quiet chaos',
    exactWordCount: 5,
    minChars: 5,
  },
  {
    id: 8,
    type: 'typing',
    phase: 'typing',
    phaseName: 'Phase 2: Fine-Tuning Phase',
    prompt: 'Write a one-sentence apology to your future self for something you did today.',
    subtitle: 'Analyzes forward-looking temporal loss function & syntactic nuance.',
    placeholder: 'e.g., I am sorry for scrolling social media instead of sleeping early.',
    minChars: 12,
  },

  // Phase 3: Emotional / Social Calibration (Q9-Q10)
  {
    id: 9,
    type: 'mcq',
    phase: 'calibration',
    phaseName: 'Phase 3: Emotional Calibration',
    question: 'If you were an LLM, your fatal flaw would be:',
    subtitle: 'Establishes error distribution profile & entropy bounds',
    options: [
      {
        id: 'A',
        label: 'Hallucination',
        stats: { context: 5, heads: 8, layers: 4, temperature: 10, topP: 10 },
      },
      {
        id: 'B',
        label: 'Repetition',
        stats: { context: 6, heads: 4, layers: 7, temperature: 1, topP: 2 },
      },
      {
        id: 'C',
        label: 'Bias',
        stats: { context: 7, heads: 7, layers: 8, temperature: 5, topP: 4 },
      },
      {
        id: 'D',
        label: 'Being too verbose',
        stats: { context: 10, heads: 9, layers: 9, temperature: 7, topP: 8 },
      },
    ],
  },
  {
    id: 10,
    type: 'mcq',
    phase: 'calibration',
    phaseName: 'Phase 3: Emotional Calibration',
    question: 'The universe is...',
    subtitle: 'Calibrates final stochastics and system-level Top-p sampling',
    options: [
      {
        id: 'A',
        label: 'Deterministic',
        stats: { context: 8, heads: 9, layers: 10, temperature: 1, topP: 2 },
      },
      {
        id: 'B',
        label: 'Random',
        stats: { context: 4, heads: 6, layers: 4, temperature: 9, topP: 9 },
      },
      {
        id: 'C',
        label: 'A simulation',
        stats: { context: 9, heads: 9, layers: 9, temperature: 7, topP: 7 },
      },
      {
        id: 'D',
        label: 'A cosmic joke',
        stats: { context: 6, heads: 7, layers: 5, temperature: 10, topP: 10 },
      },
    ],
  },
];
