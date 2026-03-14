'use client';
import { useLang } from '@/context/LangContext';
import type { UserLevel } from '@/context/UserContext';

interface Props { onSelect: (level: UserLevel) => void; }

export function Step2Level({ onSelect }: Props) {
  const { t } = useLang();
  const { onboarding: ol } = t;

  const LEVELS = [
    {
      level: 'beginner' as UserLevel,
      icon: '🌱',
      title: ol.levels.beginner.title,
      desc: ol.levels.beginner.desc,
    },
    {
      level: 'intermediate' as UserLevel,
      icon: '📈',
      title: ol.levels.intermediate.title,
      desc: ol.levels.intermediate.desc,
    },
    {
      level: 'advanced' as UserLevel,
      icon: '🎯',
      title: ol.levels.advanced.title,
      desc: ol.levels.advanced.desc,
    },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold mb-2" style={{ color: '#224c87' }}>
        {ol.levelTitle}
      </h1>
      <div className="h-1 w-16 mt-3 mb-8 rounded" style={{ background: '#224c87' }} />

      <div className="space-y-3">
        {LEVELS.map(l => (
          <button
            key={l.level}
            type="button"
            onClick={() => onSelect(l.level)}
            className="w-full flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all hover:shadow-md"
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
            <span className="text-3xl">{l.icon}</span>
            <div>
              <div className="font-semibold text-base" style={{ color: '#1a1a1a' }}>{l.title}</div>
              <div className="text-sm" style={{ color: '#919090' }}>{l.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
