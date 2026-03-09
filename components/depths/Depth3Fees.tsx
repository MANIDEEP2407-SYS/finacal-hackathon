'use client';
import { DepthShell } from './DepthShell';
import { OutputCard } from '@/components/shared/OutputCard';
import { InputSlider } from '@/components/shared/InputSlider';
import { useScenario } from '@/context/ScenarioContext';
import { calcExpenseDrag } from '@/lib/expenseEngine';
import { Money } from '@/lib/money';
import { useMemo } from 'react';

interface Props { sip: number; years: number; annualReturn: number; open: boolean; onToggle: () => void; }

export function Depth3Fees({ sip, years, annualReturn, open, onToggle }: Props) {
  const { state, update } = useScenario();
  const { expenseRatio } = state.primary;

  const drag = useMemo(() =>
    calcExpenseDrag(sip, annualReturn, years, 0.5, expenseRatio),
    [sip, years, annualReturn, expenseRatio]
  );

  const savedByLow = drag.feeDrag;

  return (
    <DepthShell
      depth={3}
      title="The Hidden Cost"
      hook='"Two funds, same returns — but one leaves you with lakhs less. The only difference: fees."'
      badge="Expense Ratio"
      formulaLabel="How fees drag returns"
      formula={`Net Return = Gross Return − Expense Ratio\nFee Drag = FV(best) − FV(fund)`}
      isOpen={open}
      onToggle={onToggle}
      conceptContent={
        <p>
          Expense ratio is the annual fee a mutual fund charges — deducted automatically, every single day, whether the market goes up or down.
          Like a gym membership that bills you even when you don't visit. Over {years} years, even 1% difference compounds massively.
        </p>
      }
    >
      <div className="space-y-4">
        <InputSlider
          id="depth3-expense"
          label={`Your fund's expense ratio (%)`}
          min={0.1} max={3} step={0.1}
          value={expenseRatio}
          onChange={v => update({ expenseRatio: v })}
          format={v => `${v.toFixed(1)}%`}
        />

        <div className="grid grid-cols-3 gap-3">
          <div className="card text-center" style={{ borderTop: '3px solid #16a34a' }}>
            <p className="text-xs font-semibold uppercase" style={{ color: '#919090' }}>Low-cost (0.5%)</p>
            <p className="output-number text-xl" style={{ color: '#16a34a', fontVariantNumeric: 'tabular-nums' }}>{drag.corpusLowFee}</p>
          </div>
          <div className="card text-center" style={{ borderTop: '3px solid #da3832' }}>
            <p className="text-xs font-semibold uppercase" style={{ color: '#919090' }}>Your fund ({expenseRatio.toFixed(1)}%)</p>
            <p className="output-number text-xl" style={{ color: '#da3832', fontVariantNumeric: 'tabular-nums' }}>{drag.corpusHighFee}</p>
          </div>
          <div className="card text-center" style={{ borderTop: '3px solid #919090' }}>
            <p className="text-xs font-semibold uppercase" style={{ color: '#919090' }}>Fees consume</p>
            <p className="output-number text-xl" style={{ color: '#da3832', fontVariantNumeric: 'tabular-nums' }}>{drag.feeDrag}</p>
          </div>
        </div>

        <p className="text-xs italic" style={{ color: '#da3832' }}>
          * Illustrative estimate. Actual fee impact depends on fund type and NAV movement. Not a recommendation.
        </p>
      </div>
    </DepthShell>
  );
}
