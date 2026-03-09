'use client';
import { useMemo } from 'react';
import { DepthShell } from './DepthShell';
import { useScenario } from '@/context/ScenarioContext';
import { calcStepUpSIP } from '@/lib/stepUpEngine';
import { InputSlider } from '@/components/shared/InputSlider';
import Decimal from 'decimal.js';
import { Money } from '@/lib/money';

interface Props { inflatedGoal: number; annualReturn: number; years: number; flatSIP: string; open: boolean; onToggle: () => void; }

export function Depth5StepUp({ inflatedGoal, annualReturn, years, flatSIP, open, onToggle }: Props) {
  const { state, update } = useScenario();
  const { stepUpPct } = state.primary;

  const result = useMemo(() =>
    calcStepUpSIP(new Decimal(inflatedGoal), annualReturn, years, stepUpPct),
    [inflatedGoal, annualReturn, years, stepUpPct]
  );

  return (
    <DepthShell
      depth={5}
      title="The Optimisation"
      hook={`"Increase your SIP by just a little each year. You'll need far less to start."`}
      badge="Step-Up SIP"
      formulaLabel="Step-Up SIP formula"
      formula={`Binary search: find startingSIP such that\nCorpus = Σ [SIP × (1+g)^y × (1+r)^(n-m)] = Target\nWhere g = annual step-up %, r = monthly return rate`}
      isOpen={open}
      onToggle={onToggle}
      conceptContent={
        <p>
          Your salary will likely grow over time. So can your SIP — by the same small %. A step-up SIP means you invest
          less today (when money is tighter) and more later (when you earn more). Everyone wins.
        </p>
      }
    >
      <div className="space-y-4">
        <InputSlider id="d5-stepup" label="Annual SIP Increase (%)" min={1} max={30} step={1} value={stepUpPct}
          onChange={v => update({ stepUpPct: v })} format={v => `+${v}% / yr`} hint="How much your SIP grows each year" />

        <div className="grid grid-cols-3 gap-3">
          <div className="card text-center" style={{ borderTop: '3px solid #919090' }}>
            <p className="text-xs font-semibold uppercase" style={{ color: '#919090' }}>Flat SIP (today)</p>
            <p className="output-number text-xl" style={{ color: '#919090', fontVariantNumeric: 'tabular-nums' }}>{flatSIP}</p>
          </div>
          <div className="card text-center" style={{ borderTop: '3px solid #224c87' }}>
            <p className="text-xs font-semibold uppercase" style={{ color: '#919090' }}>Step-Up Start</p>
            <p className="output-number text-xl" style={{ color: '#224c87', fontVariantNumeric: 'tabular-nums' }}>{result.startingSIP}</p>
          </div>
          <div className="card text-center" style={{ borderTop: '3px solid #16a34a' }}>
            <p className="text-xs font-semibold uppercase" style={{ color: '#919090' }}>You Save Today</p>
            <p className="output-number text-xl" style={{ color: '#16a34a', fontVariantNumeric: 'tabular-nums' }}>{result.savings}</p>
          </div>
        </div>

        {result.glide.length > 0 && (
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: '#919090' }}>Your SIP glide path over the years:</p>
            <div className="flex flex-wrap gap-3">
              {result.glide.map(r => (
                <div key={r.year} className="card text-center px-3 py-2 flex-1 min-w-[80px]">
                  <p className="text-xs" style={{ color: '#919090' }}>Year {r.year}</p>
                  <p className="text-sm font-bold" style={{ color: '#224c87', fontVariantNumeric: 'tabular-nums' }}>{r.sip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs italic" style={{ color: '#da3832' }}>
          * Illustrative estimate. Actual step-up should match your income trajectory.
        </p>
      </div>
    </DepthShell>
  );
}
