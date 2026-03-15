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
  currentSavings: number;
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
      <hr className="my-6 border-slate-200" />
      <InputSlider id="savings"   label={il.currentSavings} min={0}      max={10000000} step={10000}  value={inputs.currentSavings} onChange={v => onChange('currentSavings', v)} format={fmt}  hint={il.hints.currentSavings} />
      <InputSlider id="salary"    label={il.salary}         min={0}      max={1000000}  step={5000}   value={inputs.salary}         onChange={v => onChange('salary', v)}         format={fmt}  hint={il.hints.salary} />

    </div>
  );
}

