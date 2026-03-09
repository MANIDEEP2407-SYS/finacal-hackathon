'use client';
import { useLang } from '@/context/LangContext';
import { GraduationCap, Home, Car, Sunset } from 'lucide-react';

export interface Preset {
  key: string;
  icon: React.ReactNode;
  label: string;
  defaults: { presentCost: number; yearsToGoal: number; inflationRate: number; annualReturn: number };
}

interface Props { onSelect: (p: Preset) => void; selected: string | null; }

export function GoalPresets({ onSelect, selected }: Props) {
  const { t } = useLang();

  const presets: Preset[] = [
    { key: 'education', icon: <GraduationCap size={22} aria-hidden="true" />, label: t.presets.education,
      defaults: { presentCost: 2000000, yearsToGoal: 15, inflationRate: 8, annualReturn: 12 } },
    { key: 'home',      icon: <Home size={22} aria-hidden="true" />, label: t.presets.home,
      defaults: { presentCost: 5000000, yearsToGoal: 10, inflationRate: 7, annualReturn: 12 } },
    { key: 'car',       icon: <Car size={22} aria-hidden="true" />, label: t.presets.car,
      defaults: { presentCost: 1000000, yearsToGoal: 5, inflationRate: 6, annualReturn: 10 } },
    { key: 'retirement', icon: <Sunset size={22} aria-hidden="true" />, label: t.presets.retirement,
      defaults: { presentCost: 10000000, yearsToGoal: 30, inflationRate: 6, annualReturn: 12 } },
  ];

  return (
    <nav aria-label={t.presets.title}>
      <p className="text-sm font-semibold mb-3" style={{ color: '#919090' }}>{t.presets.title}</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {presets.map(p => (
          <button
            key={p.key}
            onClick={() => onSelect(p)}
            aria-pressed={selected === p.key}
            className="flex flex-col items-center gap-2 p-3 rounded-lg border-2 text-sm font-semibold transition-all"
            style={{
              borderColor: selected === p.key ? '#224c87' : '#d0d8e8',
              background:  selected === p.key ? '#e8eef7' : '#fff',
              color:       selected === p.key ? '#224c87' : '#3a3a3a',
            }}
          >
            <span style={{ color: selected === p.key ? '#224c87' : '#919090' }}>{p.icon}</span>
            {p.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
