'use client';
import { DepthShell } from './DepthShell';
import { OutputCard } from '@/components/shared/OutputCard';
import { InputSlider } from '@/components/shared/InputSlider';
import { useLang } from '@/context/LangContext';
import { useScenario } from '@/context/ScenarioContext';
import { calcExpenseDrag } from '@/lib/expenseEngine';
import { Money } from '@/lib/money';
import { useMemo } from 'react';

interface Props { sip: number; years: number; annualReturn: number; open: boolean; onToggle: () => void; }

export function Depth3Fees({ sip, years, annualReturn, open, onToggle }: Props) {
  const { t } = useLang();
  const { state, update } = useScenario();
  const { expenseRatio } = state.primary;

  const drag = useMemo(() =>
    calcExpenseDrag(sip, annualReturn, years, 0.5, expenseRatio),
    [sip, years, annualReturn, expenseRatio]
  );

  return (
    <DepthShell
      depth={3}
      title={t.depthData.d3.title}
      hook={t.depthData.d3.hook}
      badge={t.depthData.d3.badge}
      formulaLabel={t.depthData.d3.formulaLabel}
      formula={`Net Return = Gross Return − Expense Ratio\nFee Drag = FV(best) − FV(fund)`}
      isOpen={open}
      onToggle={onToggle}
      conceptContent={<p>{t.depthData.d3.p1(years)}</p>}
    >
      <div className="space-y-4">
        <InputSlider
          id="depth3-expense"
          label={t.depthData.d3.label}
          min={0.1} max={3} step={0.1}
          value={expenseRatio}
          onChange={v => update({ expenseRatio: v })}
          format={v => `${v.toFixed(1)}%`}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="card text-center" style={{ borderTop: '3px solid #16a34a' }}>
            <p className="text-xs font-semibold uppercase" style={{ color: '#919090' }}>{t.depthData.d3.low}</p>
            <p className="output-number text-xl" style={{ color: '#16a34a', fontVariantNumeric: 'tabular-nums' }}>{drag.corpusLowFee}</p>
          </div>
          <div className="card text-center" style={{ borderTop: '3px solid #da3832' }}>
            <p className="text-xs font-semibold uppercase" style={{ color: '#919090' }}>{t.depthData.d3.yours(expenseRatio.toFixed(1))}</p>
            <p className="output-number text-xl" style={{ color: '#da3832', fontVariantNumeric: 'tabular-nums' }}>{drag.corpusHighFee}</p>
          </div>
          <div className="card text-center" style={{ borderTop: '3px solid #919090' }}>
            <p className="text-xs font-semibold uppercase" style={{ color: '#919090' }}>{t.depthData.d3.consume}</p>
            <p className="output-number text-xl" style={{ color: '#da3832', fontVariantNumeric: 'tabular-nums' }}>{drag.feeDrag}</p>
          </div>
        </div>

        <p className="text-xs italic" style={{ color: '#da3832' }}>
          {t.depthData.d3.note}
        </p>
      </div>
    </DepthShell>
  );
}
