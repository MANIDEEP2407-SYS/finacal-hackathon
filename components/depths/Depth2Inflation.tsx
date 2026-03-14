'use client';
import { DepthShell } from './DepthShell';
import { OutputCard } from '@/components/shared/OutputCard';
import { useLang } from '@/context/LangContext';
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
  const { t } = useLang();
  const inflationMultiplier = ((Math.pow(1 + inflationRate / 100, years) - 1) * 100).toFixed(0);
  const extraCost = (
    parseFloat(result.inflatedGoalValue.replace(/[₹,]/g, '').replace(/[LC]/g, match => match === 'L' ? '00000' : '0000000'))
    - presentCost
  );

  return (
    <DepthShell
      depth={2}
      title={t.depthData.d2.title}
      hook={t.depthData.d2.hook}
      badge={t.depthData.d2.badge}
      formulaLabel={t.depthData.d2.formulaLabel}
      formula={`Future Goal = Present Cost × (1 + Inflation %)^Years\n= ₹${presentCost.toLocaleString('en-IN')} × (1 + ${inflationRate}%)^${years}`}
      isOpen={open}
      onToggle={onToggle}
      conceptContent={
        <p>
          {t.depthData.d2.p1(inflationRate, Math.round(72 / inflationRate))}
        </p>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="card flex-1 text-center" style={{ borderTop: '3px solid #919090' }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#919090' }}>{t.depthData.d2.l1}</p>
            <p className="output-number text-2xl" style={{ color: '#919090', fontVariantNumeric: 'tabular-nums' }}>
              {Money.format(presentCost)}
            </p>
          </div>
          <div className="flex items-center justify-center text-2xl" aria-hidden="true">→</div>
          <div className="card flex-1 text-center card-blue-border">
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#919090' }}>{t.depthData.d2.l2(years)}</p>
            <p className="output-number text-2xl" style={{ color: '#224c87', fontVariantNumeric: 'tabular-nums' }}>
              {result.inflatedGoalValue}
            </p>
          </div>
        </div>
        <div className="insight-badge">
          <span aria-hidden="true">📈</span>
          <span className="text-sm">
            {t.depthData.d2.hi(inflationMultiplier)}
          </span>
        </div>
      </div>
    </DepthShell>
  );
}
