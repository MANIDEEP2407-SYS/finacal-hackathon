'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLang } from '@/context/LangContext';
import { useUser, classifyLevel } from '@/context/UserContext';
import { ChevronRight } from 'lucide-react';

export function QuizScreen() {
  const { t } = useLang();
  const { setLevel, skipOnboarding } = useUser();
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const questions = [
    { key: 'q1', ...t.onboarding.q1 },
    { key: 'q2', ...t.onboarding.q2 },
    { key: 'q3', ...t.onboarding.q3 },
  ];

  const allAnswered = questions.every(q => questions.length > 0 && answers[q.key] !== undefined);

  function handleSubmit() {
    if (!allAnswered) return;
    const level = classifyLevel({ q1: answers.q1 ?? 0, q2: answers.q2 ?? 0, q3: answers.q3 ?? 0 });
    setLevel(level);
    router.push('/calculator');
  }

  function handleSkip() {
    skipOnboarding();
    router.push('/calculator');
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Skip link */}
      <div className="flex justify-end mb-6">
        <button onClick={handleSkip} className="text-sm underline" style={{ color: '#919090' }}>
          {t.onboarding.skip} →
        </button>
      </div>

      {/* Headline */}
      <div className="mb-8 fade-up">
        <h1 className="mb-2" style={{ color: '#224c87' }}>{t.onboarding.headline}</h1>
        <p style={{ color: '#919090' }}>{t.onboarding.sub}</p>
        <div className="h-1 w-16 mt-4 rounded" style={{ background: '#224c87' }} />
      </div>

      {/* Questions */}
      <form onSubmit={e => { e.preventDefault(); handleSubmit(); }} noValidate>
        {questions.map((q, qi) => (
          <fieldset key={q.key} className="mb-8 fade-up" style={{ border: 'none', padding: 0, margin: 0 }}>
            <legend className="font-semibold text-base mb-3" style={{ color: '#1a1a1a' }}>
              <span className="text-sm font-bold mr-2" style={{ color: '#224c87' }}>
                {String(qi + 1).padStart(2, '0')} —
              </span>
              {q.text}
            </legend>
            <div className="space-y-2" role="group" aria-labelledby={`q${qi}-legend`}>
              {q.options.map((opt, oi) => (
                <button
                  key={oi}
                  type="button"
                  className={`quiz-pill ${answers[q.key] === oi ? 'selected' : ''}`}
                  onClick={() => setAnswers(prev => ({ ...prev, [q.key]: oi }))}
                  aria-pressed={answers[q.key] === oi}
                >
                  {opt}
                </button>
              ))}
            </div>
          </fieldset>
        ))}

        {/* CTA */}
        <div className="mt-4 fade-up">
          <button
            type="submit"
            className="btn-primary w-full sm:w-auto justify-center"
            disabled={!allAnswered}
            aria-disabled={!allAnswered}
          >
            {t.onboarding.begin}
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </form>
    </div>
  );
}
