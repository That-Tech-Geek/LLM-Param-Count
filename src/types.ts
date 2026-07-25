export type PhaseType = 'core' | 'typing' | 'calibration';

export interface MCQOption {
  id: 'A' | 'B' | 'C' | 'D';
  label: string;
  stats: {
    context: number;     // 1 - 10
    heads: number;       // 1 - 10
    layers: number;      // 1 - 10
    temperature: number; // 1 - 10
    topP: number;        // 1 - 10
  };
}

export interface QuestionMCQ {
  id: number;
  type: 'mcq';
  phase: PhaseType;
  phaseName: string;
  question: string;
  subtitle?: string;
  options: MCQOption[];
}

export interface QuestionTyping {
  id: number;
  type: 'typing';
  phase: PhaseType;
  phaseName: string;
  prompt: string;
  subtitle: string;
  placeholder: string;
  exactWordCount?: number;
  minChars?: number;
}

export type Question = QuestionMCQ | QuestionTyping;

export interface AnswersState {
  [questionId: number]: string; // Option ID for MCQ, raw text for Typing
}

export interface TraitScores {
  context: number;     // raw accumulated points
  heads: number;
  layers: number;
  temperature: number;
  topP: number;
}

export interface LinguisticMetrics {
  totalWords: number;
  uniqueWords: number;
  lexicalRichness: number; // 0.0 - 1.0
  punctuationCount: number;
  avgWordLength: number;
  textMultiplier: number;  // 0.70 - 1.45
  isLLMSuspicious: boolean;
  llmReason?: string;
}

export interface OpenRouterSynthesis {
  customTitle?: string;
  summaryOverview?: string;
  linguisticAnalysis?: string;
  parameterExplanation?: string;
  contextWindowExplain?: string;
  attentionHeadsExplain?: string;
  layerDepthExplain?: string;
  temperatureExplain?: string;
  behavioralQuirks?: string[];
  optimizationAdvice?: string;
  roast?: string;
  praise?: string;
  rawText?: string;
  modelUsed?: string;
}

export interface AnswersSummary {
  typedMentalState: string; // Q7
  typedApology: string;     // Q8
  mcqSummary: Array<{ questionId: number; question: string; selectedAnswer: string }>;
}

export interface NeuralResults {
  baseParams: number;
  textMultiplier: number;
  chaosBonus: number;
  chaosValue: number;
  finalParams: number;
  formattedParams: string;
  architectureCode: string; // e.g. "C-32k / H-96 / L-48"
  archetypeTitle: string;
  archetypeDescription: string;
  roast: string;
  praise: string;
  isSyntheticOverride: boolean;
  
  // Specific formatted traits
  contextWindowFormatted: string;
  contextWindowValue: number; // in thousands (k)
  
  attentionHeadsValue: number;
  
  layerDepthValue: number;
  
  temperatureValue: number; // e.g., 0.85
  
  topPValue: number; // e.g., 0.92

  linguisticMetrics: LinguisticMetrics;
  stats: TraitScores;
  answersSummary: AnswersSummary;
  timestamp: number;
}
