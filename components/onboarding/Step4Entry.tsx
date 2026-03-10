'use client';
import { Money } from '@/lib/money';
import type { GoalKey } from './OnboardingFlow';

interface Props {
  mode: 'learning' | 'planning';
  goalKey: GoalKey;
  goalLabel: string;
  goalDefaults: { presentCost: number; years: number };
  onBegin: () => void;
}

export function Step4Entry({ mode, goalKey, goalLabel, goalDefaults, onBegin }: Props) {
  const isLearning = mode === 'learning';

  return (
    <div
      className="rounded-xl p-8 text-center"
      style={{
        background: isLearning ? '#f0f4fa' : '#fafbfc',
        border: `2px solid ${isLearning ? '#224c87' : '#e0e0e0'}`,
      }}
    >
      <span className="text-4xl block mb-4">{isLearning ? '🌱' : '⚡'}</span>

      {isLearning ? (
        <>
          <h1 className="text-xl font-bold mb-3" style={{ color: '#224c87' }}>
            Welcome! Here&apos;s your personalized plan.
          </h1>
          <p className="text-sm mb-2" style={{ color: '#3a3a3a' }}>
            We&apos;ve set up your calculator for <strong>{goalLabel}</strong> in{' '}
            <strong>{goalDefaults.years} years</strong>.
          </p>
          <p className="text-sm mb-4" style={{ color: '#919090' }}>
            We&apos;ll guide you step by step — starting with the most important number.
          </p>
          <p className="text-xs mb-6" style={{ color: '#919090' }}>
            You can switch to Planning mode anytime using the toggle in the header.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-xl font-bold mb-3" style={{ color: '#224c87' }}>
            Your calculator is ready.
          </h1>
          <p className="text-sm mb-2" style={{ color: '#3a3a3a' }}>
            Goal: <strong>{goalLabel}</strong>
            {goalDefaults.presentCost > 0 && (
              <> — <strong>{Money.formatCompact(goalDefaults.presentCost)}</strong> in{' '}
              <strong>{goalDefaults.years} years</strong></>
            )}
          </p>
          <p className="text-sm mb-6" style={{ color: '#919090' }}>
            All inputs are pre-filled. Adjust as needed.
          </p>
        </>
      )}

      <button
        type="button"
        onClick={onBegin}
        className="btn-primary px-8 py-3 text-base"
      >
        {isLearning ? "Let's Begin →" : 'Open Calculator →'}
      </button>
    </div>
  );
}
