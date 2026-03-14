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

// GOAL_DEFAULTS moved inside OnboardingFlow to access localized labels

export function OnboardingFlow() {
  const router = useRouter();
  const { setLang, t } = useLang();
  const { onboarding: ol } = t;
  const { setLevel } = useUser();

  const GOAL_DEFAULTS: Record<GoalKey, { presentCost: number; years: number; inflationRate: number; annualReturn: number; label: string }> = {
    education:  { presentCost: 1500000,  years: 12, inflationRate: 8,  annualReturn: 12, label: ol.goals.education },
    home:       { presentCost: 5000000,  years: 7,  inflationRate: 6,  annualReturn: 12, label: ol.goals.home },
    vehicle:    { presentCost: 800000,   years: 3,  inflationRate: 5,  annualReturn: 10, label: ol.goals.vehicle },
    retirement: { presentCost: 10000000, years: 25, inflationRate: 6,  annualReturn: 12, label: ol.goals.retirement },
    custom:     { presentCost: 0,        years: 10, inflationRate: 6,  annualReturn: 12, label: ol.goals.custom },
  };

  const { setMode } = useMode();
  const { setPreset } = useScenario();
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState<GoalKey>('education');
  const [selectedMode, setSelectedMode] = useState<'calculator'>('calculator');

  const handleLanguage = (langCode: string) => {
    setLang(langCode);
    setStep(2);
  };

  const handleLevel = (level: 'beginner' | 'intermediate' | 'advanced') => {
    setLevel(level);
    const autoMode = 'calculator';
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
    <div className="max-w-2xl mx-auto px-4 py-12 md:py-24">
      {/* Progress bar */}
      <div className="mb-12">
        <div className="flex justify-between items-end text-sm font-bold mb-3" style={{ color: '#224c87' }}>
          <span className="uppercase tracking-wider text-xs">{ol.setupProgress}</span>
          <span>{ol.stepOf(step, 4)}</span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden shadow-inner" style={{ background: 'rgba(34,76,135,0.1)' }}>
          <div
            className="h-full rounded-full transition-all duration-700 ease-in-out relative"
            style={{ 
              width: `${progress}%`, 
              background: 'linear-gradient(90deg, #3d6aad 0%, #224c87 100%)',
              boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3)'
            }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="fade-up">
        {step === 1 && <Step1Language onSelect={handleLanguage} />}
        {step === 2 && <Step2Level onSelect={handleLevel} />}
        {step === 3 && <Step3Goal onSelect={handleGoal} />}
        {step === 4 && (
          <Step4Entry
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
