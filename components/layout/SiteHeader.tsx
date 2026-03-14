'use client';
import { useLang } from '@/context/LangContext';
import { Globe } from 'lucide-react';

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'हिं' },
  { code: 'ta', label: 'தமி' },
];

export function SiteHeader() {
  const { lang, setLang } = useLang();
  return (
    <header
      role="banner"
      className="text-white sticky top-0 z-50 transition-all duration-300"
      style={{ 
        background: 'linear-gradient(135deg, rgba(34,76,135,0.95) 0%, rgba(26,58,107,0.98) 100%)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 4px 24px -4px rgba(0,0,0,0.2)'
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-sm flex items-center justify-center font-bold text-sm"
            style={{ background: '#da3832', color: '#fff', fontFamily: 'Arial, Verdana, sans-serif' }}
            aria-hidden="true"
          >
            FC
          </div>
          <div>
            <div className="font-bold text-lg leading-tight" style={{ fontFamily: 'Montserrat, Arial, Verdana, sans-serif' }}>
              FinCal
            </div>
            <div className="text-xs opacity-80 hidden sm:block">Goal-Based Investment Calculator</div>
          </div>
        </div>

        {/* Removed Center Mode toggle */}

        {/* Right: language toggle */}
        <nav aria-label="Language selection" className="flex items-center gap-1">
          <Globe size={14} className="opacity-70 mr-1" aria-hidden="true" />
          {LANGS.map(l => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={`px-2 py-1 rounded text-sm font-semibold transition-colors`}
              style={{ color: lang === l.code ? '#224c87' : 'white', background: lang === l.code ? '#fff' : 'transparent' }}
              aria-pressed={lang === l.code}
              aria-label={`Switch to ${l.label}`}
            >
              {l.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Removed Mobile Mode toggle row */}
    </header>
  );
}
