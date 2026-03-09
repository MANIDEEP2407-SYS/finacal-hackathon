'use client';
import { DepthShell } from './DepthShell';
import { OutputCard } from '@/components/shared/OutputCard';
import { Money } from '@/lib/money';
import type { GoalResult } from '@/lib/goalEngine';

interface Props {
  result: GoalResult;
  presentCost: number;
  inflationRate: number;
  years: number;
  open: boolean;
  onToggle: () => void;
}

export function Depth2Inflation({ result, presentCost, inflationRate, years, open, onToggle }: Props) {
  const inflationMultiplier = ((Math.pow(1 + inflationRate / 100, years) - 1) * 100).toFixed(0);
  const extraCost = (
    parseFloat(result.inflatedGoalValue.replace(/[₹,]/g, '').replace(/[LC]/g, match => match === 'L' ? '00000' : '0000000'))
    - presentCost
  );

  return (
    <DepthShell
      depth={2}
      title="The Reality Check"
      hook='"Your goal today feels manageable. In 15 years? Not quite."'
      badge="Inflation"
      formulaLabel="PDF Formula: Inflation Adjustment"
      formula={`Future Goal = Present Cost × (1 + Inflation %)^Years\n= ₹${presentCost.toLocaleString('en-IN')} × (1 + ${inflationRate}%)^${years}`}
      isOpen={open}
      onToggle={onToggle}
      conceptContent={
        <p>
          Inflation is the silent tax on your savings. At {inflationRate}% per year, prices roughly double every {Math.round(72 / inflationRate)} years.
          If you plan for today's price, you'll fall short by the time you actually need the money.
        </p>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="card flex-1 text-center" style={{ borderTop: '3px solid #919090' }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#919090' }}>Today's Price</p>
            <p className="output-number text-2xl" style={{ color: '#919090', fontVariantNumeric: 'tabular-nums' }}>
              {Money.format(presentCost)}
            </p>
          </div>
          <div className="flex items-center justify-center text-2xl" aria-hidden="true">→</div>
          <div className="card flex-1 text-center card-blue-border">
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#919090' }}>In {years} Years</p>
            <p className="output-number text-2xl" style={{ color: '#224c87', fontVariantNumeric: 'tabular-nums' }}>
              {result.inflatedGoalValue}
            </p>
          </div>
        </div>
        <div className="insight-badge">
          <span aria-hidden="true">📈</span>
          <span className="text-sm">
            Prices will be <strong>+{inflationMultiplier}% higher</strong> in {years} years.
            Your goal grows from {Money.format(presentCost)} to {result.inflatedGoalValue} — that's the number we're actually targeting.
          </span>
        </div>
      </div>
    </DepthShell>
  );
}
