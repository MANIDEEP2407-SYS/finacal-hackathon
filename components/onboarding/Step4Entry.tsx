'use client';
import { useLang } from '@/context/LangContext';
import type { GoalKey } from './OnboardingFlow';

interface Props {
  goalKey: GoalKey;
  goalLabel: string;
  goalDefaults: { presentCost: number; years: number };
  onBegin: () => void;
}

export function Step4Entry({ goalKey, goalLabel, goalDefaults, onBegin }: Props) {
  const { t } = useLang();
  const { onboarding: ol } = t;

  return (
    <div
      className="rounded-xl p-8 text-center"
      style={{
        background: '#f0f4fa',
        border: `2px solid #224c87`,
      }}
    >
      <span className="text-4xl block mb-4">⚡</span>

      <h1 className="text-xl font-bold mb-3" style={{ color: '#224c87' }}>
        {ol.setupWelcome}
      </h1>
      <p className="text-sm mb-2" style={{ color: '#3a3a3a' }}>
        {ol.setupDesc(goalLabel, goalDefaults.years)}
      </p>
      <p className="text-sm mb-6" style={{ color: '#919090' }}>
        {ol.setupGuide}
      </p>

      <button
        type="button"
        onClick={onBegin}
        className="btn-primary px-8 py-3 text-base"
      >
        {ol.begin}
      </button>
    </div>
  );
}
