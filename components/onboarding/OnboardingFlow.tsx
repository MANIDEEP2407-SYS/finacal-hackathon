'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLang } from '@/context/LangContext';
import { useUser } from '@/context/UserContext';
import { useMode } from '@/context/ModeContext';
import { useScenario } from '@/context/ScenarioContext';
import { Step1Language } from './Step1Language';
import { Step2Level } from './Step2Level';
import { Step3Goal } from './Step3Goal';
import { Step4Entry } from './Step4Entry';

export type GoalKey = 'education' | 'home' | 'vehicle' | 'retirement' | 'custom';

export const GOAL_DEFAULTS: Record<GoalKey, { presentCost: number; years: number; inflationRate: number; annualReturn: number; label: string }> = {
  education:  { presentCost: 1500000,  years: 12, inflationRate: 8,  annualReturn: 12, label: "Child's Education" },
  home:       { presentCost: 5000000,  years: 7,  inflationRate: 6,  annualReturn: 12, label: 'Home Purchase' },
  vehicle:    { presentCost: 800000,   years: 3,  inflationRate: 5,  annualReturn: 10, label: 'Vehicle' },
  retirement: { presentCost: 10000000, years: 25, inflationRate: 6,  annualReturn: 12, label: 'Retirement Corpus' },
  custom:     { presentCost: 0,        years: 10, inflationRate: 6,  annualReturn: 12, label: 'My Goal' },
};

export function OnboardingFlow() {
  const router = useRouter();
  const { setLang } = useLang();
  const { setLevel } = useUser();
  const { setMode } = useMode();
  const { setPreset } = useScenario();
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState<GoalKey>('education');
  const [selectedMode, setSelectedMode] = useState<'learning' | 'planning'>('learning');

  const handleLanguage = (langCode: string) => {
    setLang(langCode);
    setStep(2);
  };

  const handleLevel = (level: 'beginner' | 'intermediate' | 'advanced') => {
    setLevel(level);
    const autoMode = level === 'advanced' ? 'planning' : 'learning';
    setSelectedMode(autoMode);
    setMode(autoMode);
    setStep(3);
  };

  const handleGoal = (goal: GoalKey) => {
    setSelectedGoal(goal);
    const defaults = GOAL_DEFAULTS[goal];
    setPreset({
      presentCost: defaults.presentCost,
      yearsToGoal: defaults.years,
      inflationRate: defaults.inflationRate,
      annualReturn: defaults.annualReturn,
    });
    setStep(4);
  };

  const handleBegin = () => {
    router.push('/calculator');
  };

  const progress = (step / 4) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="h-1 rounded-full overflow-hidden" style={{ background: '#e8eef7' }}>
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%`, background: '#224c87' }}
          />
        </div>
        <p className="text-xs mt-2 text-right" style={{ color: '#919090' }}>
          Step {step} of 4
        </p>
      </div>

      {/* Steps */}
      <div className="fade-up">
        {step === 1 && <Step1Language onSelect={handleLanguage} />}
        {step === 2 && <Step2Level onSelect={handleLevel} />}
        {step === 3 && <Step3Goal onSelect={handleGoal} />}
        {step === 4 && (
          <Step4Entry
            mode={selectedMode}
            goalKey={selectedGoal}
            goalLabel={GOAL_DEFAULTS[selectedGoal].label}
            goalDefaults={GOAL_DEFAULTS[selectedGoal]}
            onBegin={handleBegin}
          />
        )}
      </div>
    </div>
  );
}
