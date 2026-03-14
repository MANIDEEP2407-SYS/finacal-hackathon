'use client';
import { useLang } from '@/context/LangContext';
import { InputSlider } from '@/components/shared/InputSlider';
import { Money } from '@/lib/money';

export interface CalcInputs {
  presentCost:   number;
  yearsToGoal:   number;
  inflationRate: number;
  annualReturn:  number;
  salary:        number;
  stepUpPct:     number;
  expenseRatio:  number;
  ltcgRate:      number;
  enableStepUp:   boolean;
  enableExpense:  boolean;
  enableTax:      boolean;
}

interface Props {
  inputs: CalcInputs;
  onChange: (k: keyof CalcInputs, v: number | boolean) => void;
}

export function InputPanel({ inputs, onChange }: Props) {
  const { t } = useLang();
  const { inputs: il, education: el } = t;

  const fmt  = (v: number) => Money.format(v);
  const fmtP = (v: number) => `${v}%`;
  const fmtY = (v: number) => `${v} ${il.yearsSuffix}`;

  return (
    <div>
      <InputSlider id="cost"      label={il.currentCost}  min={100000}  max={50000000} step={50000}  value={inputs.presentCost}  onChange={v => onChange('presentCost', v)}  format={fmt} />
      <InputSlider id="years"     label={il.years}         min={1}       max={40}       step={1}      value={inputs.yearsToGoal}   onChange={v => onChange('yearsToGoal', v)}   format={fmtY} hint={il.hints.years} />
      <InputSlider id="inflation" label={il.inflation}     min={1}       max={15}       step={0.5}    value={inputs.inflationRate}  onChange={v => onChange('inflationRate', v)}  format={fmtP} hint={il.hints.inflation} />
      <InputSlider id="return"    label={il.return}        min={4}       max={20}       step={0.5}    value={inputs.annualReturn}   onChange={v => onChange('annualReturn', v)}   format={fmtP} hint={il.hints.returns} />

      <div className="mt-8 space-y-4">
        {/* Step-Up accordion */}
        <AccordionToggle
          id="stepup"
          label={el.stepUpTitle}
          enabled={inputs.enableStepUp}
          onToggle={v => onChange('enableStepUp', v)}
          note={el.stepUpNote}
        >
          <InputSlider id="stepup-pct" label={il.stepUp} min={0} max={30} step={1} value={inputs.stepUpPct} onChange={v => onChange('stepUpPct', v)} format={fmtP} hint={il.hints.stepUp} />
        </AccordionToggle>

        {/* Expense Ratio accordion */}
        <AccordionToggle
          id="expense"
          label={el.expenseTitle}
          enabled={inputs.enableExpense}
          onToggle={v => onChange('enableExpense', v)}
          note={el.expenseNote}
        >
          <InputSlider id="expense-ratio" label={il.expenseRatio} min={0} max={3} step={0.1} value={inputs.expenseRatio} onChange={v => onChange('expenseRatio', v)} format={fmtP} hint={il.hints.expense} />
        </AccordionToggle>

        {/* Tax accordion */}
        <AccordionToggle
          id="tax"
          label={el.taxTitle}
          enabled={inputs.enableTax}
          onToggle={v => onChange('enableTax', v)}
          note={el.taxNote}
        >
          <InputSlider id="ltcg" label={il.taxRate} min={0} max={30} step={0.5} value={inputs.ltcgRate} onChange={v => onChange('ltcgRate', v)} format={fmtP} hint={il.hints.tax} />
        </AccordionToggle>
      </div>
    </div>
  );
}

/* ── Internal: Accordion Toggle ── */
interface AccordionProps {
  id: string; label: string; note: string;
  enabled: boolean; onToggle: (v: boolean) => void;
  children: React.ReactNode;
}
function AccordionToggle({ id, label, note, enabled, onToggle, children }: AccordionProps) {
  const { t } = useLang();
  const { common: cl } = t;

  return (
    <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#e8eef7' }}>
      <button
        type="button"
        className="accordion-header px-4"
        onClick={() => onToggle(!enabled)}
        aria-expanded={enabled}
        aria-controls={`${id}-panel`}
        id={`${id}-header`}
      >
        <span>+ {label}</span>
        <span style={{ color: '#919090', fontSize: '0.75rem' }}>
          {enabled ? `${cl.hide} ▲` : `${cl.show} ▼`}
        </span>
      </button>
      {enabled && (
        <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-header`} className="px-4 pt-3 pb-1">
          <p className="text-xs mb-3 italic" style={{ color: '#da3832' }}>{note}</p>
          {children}
        </div>
      )}
    </div>
  );
}
