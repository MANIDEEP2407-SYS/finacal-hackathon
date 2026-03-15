'use client';
import { useLang } from '@/context/LangContext';
import { OutputCard } from '@/components/shared/OutputCard';
import { LiveRegion } from '@/components/shared/LiveRegion';
import type { GoalResult } from '@/lib/goalEngine';
import type { GlideRow } from '@/lib/stepUpEngine';
import { TrendingUp, PiggyBank, Target } from 'lucide-react';

interface Props {
  result: GoalResult | null;
  stepUpSIP?: string;
  stepUpGlide?: GlideRow[];
  postTax?: string;
  enableStepUp: boolean;
  enableTax: boolean;
  salary?: number;
}

export function ResultPanel({ result, stepUpSIP, stepUpGlide, postTax, enableStepUp, enableTax, salary = 0 }: Props) {
  const { t } = useLang();
  const r = t.results;

  if (!result) {
    return (
      <div className="card flex items-center justify-center h-48 text-center" style={{ color: '#919090' }}>
        <div>
          <Target size={36} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm">Enter your goal details to see your required SIP</p>
        </div>
      </div>
    );
  }

  const liveMsg = t.accessibility.liveResults(result.requiredMonthlySIP, result.inflatedGoalValue);

  return (
    <div className="space-y-4">
      <LiveRegion message={liveMsg} />

      {/* Hero SIP */}
      <div className="card card-blue-border text-center py-6">
        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#919090' }}>
          {r.requiredSIP}
        </p>
        <p
          className="output-number count-flash"
          key={result.requiredMonthlySIP}
          style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', color: '#224c87', fontVariantNumeric: 'tabular-nums' }}
          aria-live="polite"
          aria-atomic="true"
        >
          {result.requiredMonthlySIP}
        </p>
        <p className="text-sm mt-1" style={{ color: '#919090' }}>per month, starting today</p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <OutputCard
          value={result.inflatedGoalValue}
          label={r.inflatedGoal}
          sublabel="After inflation"
          borderAccent="blue"
        />
        <OutputCard
          value={result.totalInvested}
          label={r.totalInvested}
          sublabel="Your contribution"
          color="blue"
          borderAccent="blue"
        />
        <OutputCard
          value={result.wealthGained}
          label={r.wealthGained}
          sublabel="Returns earned"
          color="green"
          borderAccent="blue"
        />
      </div>

      {/* Salary affordability insight */}
      {salary > 0 && result && (() => {
        const sipNum = parseFloat(result.requiredMonthlySIP.replace(/[₹, ]/g, ''));
        if (sipNum <= 0) return null;
        const pct = ((sipNum / salary) * 100).toFixed(1);
        return (
          <div className="card insight-badge flex gap-3 text-sm items-start">
            <TrendingUp className="text-blue-600 mt-0.5 flex-shrink-0" size={18} />
            <div>
              <p><strong>Affordability Check:</strong> This SIP is <strong>{pct}%</strong> of your monthly salary (₹{salary.toLocaleString()}).</p>
              <p className="text-xs opacity-80 mt-1">Financial experts recommend saving at least 20% of income across all goals.</p>
            </div>
          </div>
        );
      })()}

      {/* Step-up result */}
      {enableStepUp && stepUpSIP && (
        <div className="card" style={{ borderLeft: '4px solid #da3832' }}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#919090' }}>
            {r.stepUpSIP}
          </p>
          <p
            className="output-number text-2xl count-flash"
            key={stepUpSIP}
            style={{ color: '#da3832', fontVariantNumeric: 'tabular-nums' }}
            aria-live="polite"
          >
            {stepUpSIP}
          </p>
          {stepUpGlide && stepUpGlide.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-semibold mb-2" style={{ color: '#919090' }}>Your SIP grows over time:</p>
              <div className="flex flex-wrap gap-3">
                {stepUpGlide.map(row => (
                  <div key={row.year} className="text-center">
                    <p className="text-xs" style={{ color: '#919090' }}>Year {row.year}</p>
                    <p className="text-sm font-bold" style={{ color: '#224c87', fontVariantNumeric: 'tabular-nums' }}>{row.sip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Post-tax result */}
      {enableTax && postTax && (
        <div className="card insight-badge">
          <TrendingUp size={18} className="flex-shrink-0 mt-0.5" />
          <p className="text-sm">
            After estimated LTCG tax, your post-tax corpus may be approximately <strong>{postTax}</strong>.
            <span className="block text-xs mt-1 opacity-70">* Simplified illustration. Consult a tax advisor.</span>
          </p>
        </div>
      )}
    </div>
  );
}
