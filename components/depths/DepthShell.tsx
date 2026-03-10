'use client';
import { type ReactNode } from 'react';
import { ChevronDown, Info } from 'lucide-react';
import { type DepthId } from '@/context/ScenarioContext';
import { useMode } from '@/context/ModeContext';

interface Props {
  depth: DepthId;
  title: string;
  hook: string;
  badge?: string;
  formulaLabel?: string;
  formula?: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
  conceptContent?: ReactNode;
}

const DEPTH_COLORS: Record<DepthId, string> = {
  1: '#224c87',
  2: '#3d6aad',
  3: '#5a7dbf',
  4: '#da3832',
  5: '#224c87',
  6: '#7a1a17',
  7: '#1a3a6b',
};

export function DepthShell({
  depth, title, hook, badge, formulaLabel, formula,
  isOpen, onToggle, children, conceptContent
}: Props) {
  const { isLearning } = useMode();
  const color = DEPTH_COLORS[depth];

  return (
    <div
      className="rounded-xl overflow-hidden shadow-sm transition-all"
      style={{ border: `1.5px solid ${color}22`, background: '#fff' }}
      id={`depth-${depth}`}
    >
      {/* Header */}
      <button
        type="button"
        className="w-full text-left px-5 py-4 flex items-start gap-4"
        style={{ background: `${color}09` }}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`depth-${depth}-body`}
        id={`depth-${depth}-header`}
      >
        {/* Depth number badge */}
        <span
          className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5"
          style={{ background: color }}
          aria-hidden="true"
        >
          {depth}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-base leading-tight" style={{ color }}>{title}</p>
          {isLearning && <p className="text-xs mt-1 italic" style={{ color: '#919090' }}>{hook}</p>}
        </div>
        {badge && (
          <span
            className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-bold"
            style={{ background: `${color}18`, color }}
          >
            {badge}
          </span>
        )}
        <ChevronDown
          size={18} aria-hidden="true"
          style={{ flexShrink: 0, color, transition: 'transform 0.22s', transform: isOpen ? 'rotate(180deg)' : 'none', marginTop: 3 }}
        />
      </button>

      {/* Body */}
      {isOpen && (
        <div id={`depth-${depth}-body`} role="region" aria-labelledby={`depth-${depth}-header`}>
          {/* Main content */}
          <div className="px-5 py-4">{children}</div>

          {/* Concept section (learning mode only) */}
          {isLearning && conceptContent && (
            <div className="px-5 pb-4">
              <div
                className="rounded-lg p-4"
                style={{ background: `${color}07`, borderLeft: `3px solid ${color}` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Info size={13} style={{ color }} aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color }}>
                    Why this matters
                  </span>
                </div>
                <div className="text-sm" style={{ color: '#3a3a3a' }}>{conceptContent}</div>
              </div>
            </div>
          )}

          {/* Formula reveal */}
          {formula && (
            <div className="px-5 pb-4">
              <details>
                <summary
                  className="cursor-pointer text-xs font-semibold select-none"
                  style={{ color: '#919090' }}
                >
                  🔢 {formulaLabel ?? 'Show formula'}
                </summary>
                <code
                  className="block mt-2 text-xs px-3 py-2 rounded"
                  style={{ background: '#f4f4f4', fontFamily: 'monospace', color: '#1a3a6b', lineHeight: 1.8 }}
                >
                  {formula}
                </code>
              </details>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
