'use client';
import { DepthShell } from './DepthShell';
import { OutputCard } from '@/components/shared/OutputCard';
import { useLang } from '@/context/LangContext';
import type { GoalResult } from '@/lib/goalEngine';

interface Props {
  result: GoalResult;
  sip: number;
  open: boolean;
  onToggle: () => void;
}

export function Depth1Baseline({ result, sip, open, onToggle }: Props) {
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
        <OutputCard value={result.inflatedGoalValue}  label={t.results.inflatedGoal} />
        <OutputCard value={result.totalInvested}       label={t.results.totalInvested} />
        <OutputCard value={result.wealthGained}        label={t.results.wealthGained} color="green" />
      </div>
    </DepthShell>
  );
}
