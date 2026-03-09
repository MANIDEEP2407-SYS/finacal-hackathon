'use client';
import { useState } from 'react';
import { useLang } from '@/context/LangContext';
import type { GoalResult } from '@/lib/goalEngine';
import type { CalcInputs } from '@/components/calculator/InputPanel';
import { BookOpen, Calculator, ChevronDown } from 'lucide-react';

interface Props {
  result: GoalResult;
  inputs: CalcInputs;
  open: boolean;
  onToggle: () => void;
  formulaOpen: boolean;
  onFormulaToggle: () => void;
}

export function ConceptCard({ result, inputs, open, onToggle, formulaOpen, onFormulaToggle }: Props) {
  const { t } = useLang();
  const ed = t.education;
  const f  = t.formula;

  /* ── Dynamic narrative using user's actual numbers ── */
  const narrative = `You want to save ${result.inflatedGoalValue} (in today's terms, your goal is ₹${inputs.presentCost.toLocaleString('en-IN')}). After ${inputs.yearsToGoal} years of inflation at ${inputs.inflationRate}%, you'll actually need ${result.inflatedGoalValue}. Investing at ${inputs.annualReturn}% annual return, you need to put away ${result.requiredMonthlySIP} every month. Over that time you'll invest ${result.totalInvested} and the market does the rest — earning you an additional ${result.wealthGained}.`;

  /* ── Analogy based on timehorizon ── */
  const analogy = inputs.yearsToGoal <= 5
    ? '"Think of it like a fixed deposit that works overtime. Instead of a flat interest rate, your returns compound — earning returns on your returns."'
    : '"Imagine a snowball rolling down a hill. You start small, but each year the snowball picks up snow on a larger surface area. The longer you let it roll, the less pushing you have to do."';

  return (
    <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#e8eef7' }}>
      <button
        className="accordion-header px-4"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls="concept-panel"
        id="concept-header"
        type="button"
      >
        <span className="flex items-center gap-2">
          <BookOpen size={16} aria-hidden="true" />
          {ed.whatMeansTitle}
        </span>
        <ChevronDown size={16} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} aria-hidden="true" />
      </button>

      {open && (
        <div id="concept-panel" role="region" aria-labelledby="concept-header">
          {/* Your numbers in plain English */}
          <div className="px-4 py-4" style={{ background: '#f9fbff', borderBottom: '1px solid #e8eef7' }}>
            <p className="text-sm leading-relaxed" style={{ color: '#3a3a3a' }}>{narrative}</p>
          </div>

          {/* Analogy */}
          <div className="px-4 py-3" style={{ borderBottom: '1px solid #e8eef7' }}>
            <p className="text-sm italic" style={{ color: '#224c87' }}>{analogy}</p>
          </div>

          {/* Insight badges */}
          <div className="px-4 py-3 space-y-2">
            {result.wealthGained.startsWith('₹') && (
              <div className="insight-badge">
                <span aria-hidden="true">💡</span>
                <span className="text-sm">
                  The market contributed <strong>{result.wealthGained}</strong> in returns — more than your total investment of {result.totalInvested}. That's compound interest working for you.
                </span>
              </div>
            )}
          </div>

          {/* Formula disclosure */}
          <div className="px-4 pb-4">
            <button
              className="accordion-header"
              onClick={onFormulaToggle}
              aria-expanded={formulaOpen}
              aria-controls="formula-panel"
              id="formula-header"
              type="button"
            >
              <span className="flex items-center gap-2">
                <Calculator size={14} aria-hidden="true" />
                {ed.howCalculatedTitle}
              </span>
              <ChevronDown size={14} style={{ transform: formulaOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} aria-hidden="true" />
            </button>
            {formulaOpen && (
              <div id="formula-panel" role="region" aria-labelledby="formula-header" className="mt-3 p-4 rounded-lg" style={{ background: '#f4f4f4' }}>
                <p className="text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: '#224c87' }}>{f.step1}</p>
                <code className="text-sm block mb-3 p-2 rounded" style={{ background: '#e8eef7', fontFamily: 'monospace', color: '#1a3a6b' }}>{f.step1formula}</code>
                <p className="text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: '#224c87' }}>{f.step2}</p>
                <code className="text-sm block mb-3 p-2 rounded" style={{ background: '#e8eef7', fontFamily: 'monospace', color: '#1a3a6b' }}>{f.step2formula}</code>
                <p className="text-xs" style={{ color: '#919090' }}>{f.where}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
