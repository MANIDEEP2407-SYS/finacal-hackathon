'use client';
import { useLang } from '@/context/LangContext';

interface Props { onSelect: (langCode: string) => void; }

const LANGUAGES = [
  { code: 'en', label: 'English', script: 'EN', icon: '🇬🇧' },
  { code: 'hi', label: 'हिन्दी', script: 'हि', icon: '🇮🇳' },
  { code: 'ta', label: 'தமிழ்', script: 'த', icon: '🇮🇳' },
];

export function Step1Language({ onSelect }: Props) {
  const { t } = useLang();
  const { onboarding: ol } = t;

  return (
    <div className="text-center">
      <h1 className="text-xl font-bold mb-2" style={{ color: '#224c87' }}>
        {ol.headline}
      </h1>
      <p className="text-xs mb-1" style={{ color: '#919090' }}>
        {ol.sub}
      </p>
      <div className="h-1 w-12 mx-auto mt-3 mb-6 rounded" style={{ background: '#224c87' }} />

      <p className="text-sm font-medium mb-5" style={{ color: '#1a1a1a' }}>
        {ol.chooseLang}
      </p>

      <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
        {LANGUAGES.map(l => (
          <button
            key={l.code}
            type="button"
            onClick={() => onSelect(l.code)}
            className="flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all hover:shadow-md"
            style={{
              borderColor: '#e0e0e0',
              background: 'white',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = '#224c87';
              (e.currentTarget as HTMLElement).style.background = '#f0f4fa';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = '#e0e0e0';
              (e.currentTarget as HTMLElement).style.background = 'white';
            }}
            aria-label={`Select ${l.label}`}
          >
            <span className="text-2xl font-bold" style={{ color: '#224c87' }}>{l.script}</span>
            <span className="text-sm font-medium" style={{ color: '#3a3a3a' }}>{l.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
