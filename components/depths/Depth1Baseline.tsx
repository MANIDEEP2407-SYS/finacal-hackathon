'use client';
import { DepthShell } from './DepthShell';
import { OutputCard } from '@/components/shared/OutputCard';
import type { GoalResult } from '@/lib/goalEngine';

interface Props {
  result: GoalResult;
  sip: number;
  open: boolean;
  onToggle: () => void;
}

export function Depth1Baseline({ result, sip, open, onToggle }: Props) {
  return (
    <DepthShell
      depth={1}
      title="The Number"
      hook={`Here's exactly what you need to save — instantly.`}
      badge="Baseline"
      formulaLabel="PDF Formula: Baseline SIP"
      formula={`Required SIP = FV × r ÷ [((1 + r)^n − 1) × (1 + r)]\nWhere: FV = goal corpus, r = monthly return rate, n = months`}
      isOpen={open}
      onToggle={onToggle}
      conceptContent={
        <p>
          This is the minimum you need to invest every month to reach your goal, assuming a steady return.
          Think of it as your financial GPS — it tells you exactly where to go and how fast to get there.
        </p>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <OutputCard value={result.requiredMonthlySIP} label="Required Monthly SIP" size="lg" borderAccent="blue" />
        <OutputCard value={result.inflatedGoalValue}  label="Target Corpus" />
        <OutputCard value={result.totalInvested}       label="You Invest" />
        <OutputCard value={result.wealthGained}        label="Market Adds" color="green" />
      </div>
    </DepthShell>
  );
}
