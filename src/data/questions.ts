import { Question } from '../types';

export const QUESTIONS: Question[] = [
  // Phase 1: Core Cognition (Q1-Q6)
  {
    id: 1,
    type: 'mcq',
    phase: 'core',
    phaseName: 'Core Cognition',
    question: 'In a group chat, you are usually...',
    subtitle: 'Assesses multi-channel communication and active engagement',
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
        label: 'The quiet observer',
        stats: { context: 9, heads: 7, layers: 8, temperature: 2, topP: 3 },
      },
      {
        id: 'D',
        label: 'The topic shifter',
        stats: { context: 5, heads: 6, layers: 4, temperature: 10, topP: 10 },
      },
    ],
  },
  {
    id: 2,
    type: 'mcq',
    phase: 'core',
    phaseName: 'Core Cognition',
    question: 'Your ideal planning style is...',
    subtitle: 'Evaluates structural reasoning and predictability',
    options: [
      {
        id: 'A',
        label: 'Detailed spreadsheets and schedules',
        stats: { context: 9, heads: 8, layers: 10, temperature: 1, topP: 2 },
      },
      {
        id: 'B',
        label: 'Flexible mental outlines',
        stats: { context: 6, heads: 5, layers: 5, temperature: 6, topP: 6 },
      },
      {
        id: 'C',
        label: 'Spontaneous and intuition-led',
        stats: { context: 4, heads: 6, layers: 3, temperature: 9, topP: 9 },
      },
      {
        id: 'D',
        label: 'High-pressure last-minute bursts',
        stats: { context: 7, heads: 10, layers: 6, temperature: 10, topP: 8 },
      },
    ],
  },
  {
    id: 3,
    type: 'mcq',
    phase: 'core',
    phaseName: 'Core Cognition',
    question: 'When reading a long article, you...',
    subtitle: 'Measures working memory capacity and focus allocation',
    options: [
      {
        id: 'A',
        label: 'Read every word carefully',
        stats: { context: 10, heads: 8, layers: 9, temperature: 3, topP: 4 },
      },
      {
        id: 'B',
        label: 'Skim key headings and bold text',
        stats: { context: 5, heads: 7, layers: 5, temperature: 5, topP: 6 },
      },
      {
        id: 'C',
        label: 'Jump straight to the conclusion',
        stats: { context: 3, heads: 5, layers: 3, temperature: 8, topP: 8 },
      },
      {
        id: 'D',
        label: 'Bookmark it for later reference',
        stats: { context: 8, heads: 3, layers: 6, temperature: 4, topP: 5 },
      },
    ],
  },
  {
    id: 4,
    type: 'mcq',
    phase: 'core',
    phaseName: 'Core Cognition',
    question: 'Your conflict resolution style:',
    subtitle: 'Evaluates logical analysis versus emotional empathy',
    options: [
      {
        id: 'A',
        label: 'Logic and objective facts first',
        stats: { context: 7, heads: 9, layers: 9, temperature: 2, topP: 3 },
      },
      {
        id: 'B',
        label: 'Empathy and relational harmony',
        stats: { context: 6, heads: 8, layers: 5, temperature: 8, topP: 8 },
      },
      {
        id: 'C',
        label: 'De-escalate and avoid friction',
        stats: { context: 4, heads: 3, layers: 7, temperature: 2, topP: 4 },
      },
      {
        id: 'D',
        label: 'Direct confrontation and debate',
        stats: { context: 8, heads: 10, layers: 8, temperature: 10, topP: 10 },
      },
    ],
  },
  {
    id: 5,
    type: 'mcq',
    phase: 'core',
    phaseName: 'Core Cognition',
    question: 'How do you approach daily energy and coffee/tea routines?',
    subtitle: 'Assesses personal routine stability and baseline activation',
    options: [
      {
        id: 'A',
        label: 'Strict ritual (black coffee / tea, no sugar)',
        stats: { context: 8, heads: 9, layers: 9, temperature: 2, topP: 3 },
      },
      {
        id: 'B',
        label: 'Indulgent treats or flavored drinks',
        stats: { context: 5, heads: 6, layers: 4, temperature: 9, topP: 8 },
      },
      {
        id: 'C',
        label: 'Natural energy without caffeine',
        stats: { context: 6, heads: 5, layers: 6, temperature: 4, topP: 5 },
      },
      {
        id: 'D',
        label: 'Irregular caffeine intake as needed',
        stats: { context: 4, heads: 8, layers: 8, temperature: 8, topP: 7 },
      },
    ],
  },
  {
    id: 6,
    type: 'mcq',
    phase: 'core',
    phaseName: 'Core Cognition',
    question: 'Your memory is best described as:',
    subtitle: 'Maps information retention style and recall speed',
    options: [
      {
        id: 'A',
        label: 'Detailed and near-photographic',
        stats: { context: 10, heads: 10, layers: 9, temperature: 2, topP: 3 },
      },
      {
        id: 'B',
        label: 'Fact and structure oriented',
        stats: { context: 8, heads: 8, layers: 8, temperature: 3, topP: 4 },
      },
      {
        id: 'C',
        label: 'Emotionally grounded and impressionistic',
        stats: { context: 5, heads: 6, layers: 5, temperature: 9, topP: 8 },
      },
      {
        id: 'D',
        label: 'Selective and context-dependent',
        stats: { context: 2, heads: 3, layers: 2, temperature: 10, topP: 9 },
      },
    ],
  },

  // Phase 2: Communication Sample (Q7-Q8)
  {
    id: 7,
    type: 'typing',
    phase: 'typing',
    phaseName: 'Communication Style',
    prompt: 'Describe your current mental state in exactly 5 words.',
    subtitle: 'Evaluates concise expression under a strict 5-word requirement.',
    placeholder: 'e.g., Calm focused momentum driving progress',
    exactWordCount: 5,
    minChars: 5,
  },
  {
    id: 8,
    type: 'typing',
    phase: 'typing',
    phaseName: 'Communication Style',
    prompt: 'Write a one-sentence message or advice to your future self.',
    subtitle: 'Analyzes long-term perspective, phrasing nuance, and tone.',
    placeholder: 'e.g., Remember to prioritize steady balance over short-term busyness.',
    minChars: 12,
  },

  // Phase 3: Emotional & Decision Calibration (Q9-Q10)
  {
    id: 9,
    type: 'mcq',
    phase: 'calibration',
    phaseName: 'Decision Calibration',
    question: 'When under pressure, your tendency is to:',
    subtitle: 'Identifies stress responses and cognitive trade-offs',
    options: [
      {
        id: 'A',
        label: 'Overthink creative alternatives',
        stats: { context: 5, heads: 8, layers: 4, temperature: 10, topP: 10 },
      },
      {
        id: 'B',
        label: 'Stick strictly to known procedures',
        stats: { context: 6, heads: 4, layers: 7, temperature: 1, topP: 2 },
      },
      {
        id: 'C',
        label: 'Double down on personal beliefs',
        stats: { context: 7, heads: 7, layers: 8, temperature: 5, topP: 4 },
      },
      {
        id: 'D',
        label: 'Provide lengthy explanations',
        stats: { context: 10, heads: 9, layers: 9, temperature: 7, topP: 8 },
      },
    ],
  },
  {
    id: 10,
    type: 'mcq',
    phase: 'calibration',
    phaseName: 'Decision Calibration',
    question: 'How do you view unpredictable changes?',
    subtitle: 'Calibrates adaptability and creative flexibility',
    options: [
      {
        id: 'A',
        label: 'Challenges to be structured and controlled',
        stats: { context: 8, heads: 9, layers: 10, temperature: 1, topP: 2 },
      },
      {
        id: 'B',
        label: 'Natural opportunities for growth',
        stats: { context: 4, heads: 6, layers: 4, temperature: 9, topP: 9 },
      },
      {
        id: 'C',
        label: 'Complex puzzles with deeper patterns',
        stats: { context: 9, heads: 9, layers: 9, temperature: 7, topP: 7 },
      },
      {
        id: 'D',
        label: 'Unavoidable chaotic events to navigate',
        stats: { context: 6, heads: 7, layers: 5, temperature: 10, topP: 10 },
      },
    ],
  },
];
