'use client';
import { useScenario } from '@/context/ScenarioContext';
import { BookOpen, BarChart2 } from 'lucide-react';

export function ModeToggle() {
  const { state, setMode } = useScenario();
  const isLearning = state.mode === 'learning';

  return (
    <div
      className="inline-flex rounded-lg overflow-hidden border"
      style={{ borderColor: '#224c87' }}
      role="group"
      aria-label="Calculator mode"
    >
      <button
        type="button"
        onClick={() => setMode('learning')}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold transition-all"
        style={{
          background: isLearning ? '#224c87' : 'transparent',
          color: isLearning ? '#fff' : '#224c87',
        }}
        aria-pressed={isLearning}
      >
        <BookOpen size={13} aria-hidden="true" />
        Learning
      </button>
      <button
        type="button"
        onClick={() => setMode('planning')}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold transition-all"
        style={{
          background: !isLearning ? '#224c87' : 'transparent',
          color: !isLearning ? '#fff' : '#224c87',
        }}
        aria-pressed={!isLearning}
      >
        <BarChart2 size={13} aria-hidden="true" />
        Planning
      </button>
    </div>
  );
}
