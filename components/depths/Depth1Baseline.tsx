'use client';
import { DepthShell } from './DepthShell';
import { OutputCard } from '@/components/shared/OutputCard';
import { useLang } from '@/context/LangContext';
import type { GoalResult } from '@/lib/goalEngine';
import { TrendingUp } from 'lucide-react';

interface Props {
  result: GoalResult;
  sip: number;
  salary: number;
  open: boolean;
  onToggle: () => void;
}

export function Depth1Baseline({ result, sip, salary, open, onToggle }: Props) {
  const { t } = useLang();
  return (
    <DepthShell
      depth={1}
      title={t.depthData.d1.title}
      hook={t.depthData.d1.hook}
      badge={t.depthData.d1.badge}
      formulaLabel={t.depthData.d1.formulaLabel}
      formula={`Required SIP = FV × r ÷ [((1 + r)^n − 1) × (1 + r)]\nWhere: FV = goal corpus, r = monthly return rate, n = months`}
      isOpen={open}
      onToggle={onToggle}
      conceptContent={<p>{t.depthData.d1.p1}</p>}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <OutputCard value={result.requiredMonthlySIP} label={t.results.requiredSIP} size="lg" borderAccent="blue" />
        <OutputCard value={result.inflatedGoalValue}  label={t.results.inflatedGoal} size="lg" borderAccent="blue" />
        <OutputCard value={result.totalInvested}       label={t.results.totalInvested} size="lg" borderAccent="blue" />
        <OutputCard value={result.wealthGained}        label={t.results.wealthGained} size="lg" color="green" borderAccent="blue" />
      </div>

      {salary > 0 && sip > 0 && (
        <div className="card insight-badge mt-4 flex gap-3 text-sm items-start">
          <TrendingUp className="text-blue-600 mt-0.5" size={18} />
          <div>
            <p><strong>Affordability Check:</strong> This SIP requires <strong>{((sip / salary) * 100).toFixed(1)}%</strong> of your monthly salary input (₹{salary.toLocaleString()}).</p>
            <p className="text-xs opacity-80 mt-1">Financial experts generally recommend saving at least 20% of your income across all your goals.</p>
          </div>
        </div>
      )}
    </DepthShell>
  );
}
