'use client';
import type { GoalKey } from './OnboardingFlow';

interface Props { onSelect: (goal: GoalKey) => void; }

const GOALS: { key: GoalKey; icon: string; title: string }[] = [
  { key: 'education',  icon: '🎓', title: "Child's Education" },
  { key: 'home',       icon: '🏠', title: 'Home / Property' },
  { key: 'vehicle',    icon: '🚗', title: 'Vehicle' },
  { key: 'retirement', icon: '🌅', title: 'Retirement' },
  { key: 'custom',     icon: '✏️', title: "Something else — I'll set my own goal" },
];

export function Step3Goal({ onSelect }: Props) {
  return (
    <div>
      <h1 className="text-xl font-bold mb-2" style={{ color: '#224c87' }}>
        What are you planning for?
      </h1>
      <div className="h-1 w-16 mt-3 mb-8 rounded" style={{ background: '#224c87' }} />

      <div className="grid grid-cols-2 gap-4">
        {GOALS.slice(0, 4).map(g => (
          <button
            key={g.key}
            type="button"
            onClick={() => onSelect(g.key)}
            className="flex flex-col items-center gap-2 p-6 rounded-xl border-2 transition-all hover:shadow-md"
            style={{ borderColor: '#e0e0e0', background: 'white' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = '#224c87';
              (e.currentTarget as HTMLElement).style.background = '#f0f4fa';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = '#e0e0e0';
              (e.currentTarget as HTMLElement).style.background = 'white';
            }}
          >
            <span className="text-3xl">{g.icon}</span>
            <span className="text-sm font-semibold" style={{ color: '#1a1a1a' }}>{g.title}</span>
          </button>
        ))}
      </div>

      {/* Custom goal — full width */}
      <button
        type="button"
        onClick={() => onSelect('custom')}
        className="w-full flex items-center gap-3 p-4 mt-4 rounded-xl border-2 text-left transition-all hover:shadow-md"
        style={{ borderColor: '#e0e0e0', background: 'white' }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = '#224c87';
          (e.currentTarget as HTMLElement).style.background = '#f0f4fa';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = '#e0e0e0';
          (e.currentTarget as HTMLElement).style.background = 'white';
        }}
      >
        <span className="text-xl">✏️</span>
        <span className="text-sm font-semibold" style={{ color: '#1a1a1a' }}>
          Something else — I&apos;ll set my own goal
        </span>
      </button>
    </div>
  );
}
