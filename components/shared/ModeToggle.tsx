'use client';
import { useMode } from '@/context/ModeContext';
import { BookOpen, BarChart2 } from 'lucide-react';

export function ModeToggle() {
  const { mode, setMode, isLearning } = useMode();

  return (
    <div
      className="inline-flex rounded-lg overflow-hidden"
      style={{ border: '2px solid rgba(255,255,255,0.3)' }}
      role="group"
      aria-label="Calculator mode"
    >
      <button
        type="button"
        onClick={() => setMode('learning')}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold transition-all"
        style={{
          background: isLearning ? '#ffffff' : 'transparent',
          color: isLearning ? '#224c87' : '#ffffff',
        }}
        role="radio"
        aria-checked={isLearning}
        aria-label="Learning mode: includes explanations and guidance"
      >
        <BookOpen size={13} aria-hidden="true" />
        Learning
      </button>
      <button
        type="button"
        onClick={() => setMode('planning')}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold transition-all"
        style={{
          background: !isLearning ? '#ffffff' : 'transparent',
          color: !isLearning ? '#224c87' : '#ffffff',
        }}
        role="radio"
        aria-checked={!isLearning}
        aria-label="Planning mode: compact view for quick calculations"
      >
        <BarChart2 size={13} aria-hidden="true" />
        Planning
      </button>
    </div>
  );
}
