import { useState } from 'react';
import { QUESTIONS } from './data/questions';
import { AnswersState, NeuralResults, QuestionMCQ, QuestionTyping } from './types';
import { calculateResults } from './utils/mathEngine';
import { logAssessmentToFirestore } from './utils/telemetry';
import { Navbar } from './components/Navbar';
import { ProgressBar } from './components/ProgressBar';
import { IntroScreen } from './components/IntroScreen';
import { MCQStep } from './components/MCQStep';
import { TypingStep } from './components/TypingStep';
import { CalculatingScreen } from './components/CalculatingScreen';
import { ResultsDashboard } from './components/ResultsDashboard';
import { InfoModal } from './components/InfoModal';
import { ArrowLeft } from 'lucide-react';

export default function App() {
  // Step 0: Intro, 1-10: Questions, 11: Calculating, 12: Results
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [results, setResults] = useState<NeuralResults | null>(null);
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);

  const totalQuestions = QUESTIONS.length; // 10 questions total (6 MCQ + 2 Typing + 2 MCQ)

  // Start Assessment
  const handleStart = () => {
    setAnswers({});
    setResults(null);
    setCurrentStep(1);
  };

  // Reset / Restart
  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setResults(null);
  };

  // Back button handler
  const handleBack = () => {
    if (currentStep > 1 && currentStep <= totalQuestions) {
      setCurrentStep((prev) => prev - 1);
    } else if (currentStep === 1) {
      setCurrentStep(0);
    }
  };

  // MCQ Selection handler
  const handleSelectMCQOption = (optionId: 'A' | 'B' | 'C' | 'D') => {
    const question = QUESTIONS[currentStep - 1];
    if (!question) return;

    const newAnswers = { ...answers, [question.id]: optionId };
    setAnswers(newAnswers);

    // Advance to next question or calculating screen
    if (currentStep < totalQuestions) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Finished Q10 -> go to Calculating screen (step 11)
      setCurrentStep(11);
    }
  };

  // Typing Submit handler
  const handleSubmitTypingText = (text: string) => {
    const question = QUESTIONS[currentStep - 1];
    if (!question) return;

    const newAnswers = { ...answers, [question.id]: text };
    setAnswers(newAnswers);

    if (currentStep < totalQuestions) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setCurrentStep(11);
    }
  };

  // Calculation complete callback from CalculatingScreen
  const handleCalculationComplete = () => {
    const calculated = calculateResults(answers, Date.now());
    setResults(calculated);
    logAssessmentToFirestore(calculated);
    setCurrentStep(12); // Results
  };

  // Get current active question object
  const activeQuestion =
    currentStep >= 1 && currentStep <= totalQuestions ? QUESTIONS[currentStep - 1] : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 flex flex-col justify-between">
      {/* Top Navbar */}
      <Navbar
        currentStep={currentStep >= 1 && currentStep <= totalQuestions ? currentStep : 0}
        totalSteps={totalQuestions}
        onReset={handleReset}
        onShowInfo={() => setShowInfoModal(true)}
        isCompleted={currentStep === 12}
      />

      {/* Progress Bar during active quiz steps (1-10) */}
      {currentStep >= 1 && currentStep <= totalQuestions && activeQuestion && (
        <ProgressBar
          currentStep={currentStep}
          totalSteps={totalQuestions}
          currentPhase={activeQuestion.phase}
          phaseName={activeQuestion.phaseName}
        />
      )}

      {/* Main Container */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-6 sm:py-10 max-w-5xl mx-auto w-full">
        {/* Back Button for Questions */}
        {currentStep >= 1 && currentStep <= totalQuestions && (
          <div className="w-full max-w-2xl mx-auto mb-2 flex justify-start">
            <button
              onClick={handleBack}
              className="text-xs font-mono text-slate-400 hover:text-white flex items-center space-x-1 py-1 px-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-800 transition border border-slate-800/80"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous Step</span>
            </button>
          </div>
        )}

        {/* 1. Intro Screen */}
        {currentStep === 0 && <IntroScreen onStart={handleStart} />}

        {/* 2. Active MCQ Step */}
        {currentStep >= 1 &&
          currentStep <= totalQuestions &&
          activeQuestion &&
          activeQuestion.type === 'mcq' && (
            <MCQStep
              question={activeQuestion as QuestionMCQ}
              selectedOptionId={answers[activeQuestion.id]}
              onSelectOption={handleSelectMCQOption}
              currentStep={currentStep}
              totalSteps={totalQuestions}
            />
          )}

        {/* 3. Active Typing Step */}
        {currentStep >= 1 &&
          currentStep <= totalQuestions &&
          activeQuestion &&
          activeQuestion.type === 'typing' && (
            <TypingStep
              question={activeQuestion as QuestionTyping}
              currentValue={answers[activeQuestion.id] || ''}
              onSubmitText={handleSubmitTypingText}
              onBack={handleBack}
            />
          )}

        {/* 4. Calculating Fullscreen Screen */}
        {currentStep === 11 && (
          <CalculatingScreen onComplete={handleCalculationComplete} />
        )}

        {/* 5. Results Dashboard */}
        {currentStep === 12 && results && (
          <ResultsDashboard results={results} onRetake={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-900 text-center text-xs font-mono text-slate-500">
        <p>
          Neural Architecture Assessment • 16P Edition • Synaptic Evaluation Engine
        </p>
      </footer>

      {/* Methodology Info Modal */}
      <InfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />
    </div>
  );
}
