'use client';
import type { UserLevel } from '@/context/UserContext';

interface Props { onSelect: (level: UserLevel) => void; }

const LEVELS = [
  {
    level: 'beginner' as UserLevel,
    icon: '🌱',
    title: 'Just starting out',
    desc: "I'm new to investing",
  },
  {
    level: 'intermediate' as UserLevel,
    icon: '📈',
    title: 'I know the basics',
    desc: "I've invested before",
  },
  {
    level: 'advanced' as UserLevel,
    icon: '🎯',
    title: "I'm experienced",
    desc: 'I invest regularly',
  },
];

export function Step2Level({ onSelect }: Props) {
  return (
    <div>
      <h1 className="text-xl font-bold mb-2" style={{ color: '#224c87' }}>
        How familiar are you with mutual fund investing?
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
