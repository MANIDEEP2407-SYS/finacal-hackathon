'use client';
import { useState, useMemo, useCallback } from 'react';
import { useLang } from '@/context/LangContext';
import { GoalPresets, type Preset } from '@/components/calculator/GoalPresets';
import { InputPanel, type CalcInputs } from '@/components/calculator/InputPanel';
import { ResultPanel } from '@/components/calculator/ResultPanel';
import { GrowthChart } from '@/components/charts/GrowthChart';
import { YearTable } from '@/components/calculator/YearTable';
import { ConceptCard } from '@/components/education/ConceptCard';
import { calculateGoal } from '@/lib/goalEngine';
import { calcStepUpSIP } from '@/lib/stepUpEngine';
import { calcPostTaxCorpus } from '@/lib/goalEngine';
import { Money } from '@/lib/money';
import Decimal from 'decimal.js';

const DEFAULT_INPUTS: CalcInputs = {
  presentCost: 2500000, yearsToGoal: 15,  inflationRate: 6,
  annualReturn: 12,
  salary: 0,
  currentSavings: 0,
  stepUpPct: 10, expenseRatio: 1,
  ltcgRate: 12.5, enableStepUp: false, enableExpense: false, enableTax: false,
};

export function GoalCalculator() {
  const { t } = useLang();
  const [inputs, setInputs] = useState<CalcInputs>(DEFAULT_INPUTS);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [yearTableOpen, setYearTableOpen] = useState(false);
  const [conceptOpen, setConceptOpen] = useState(false);
  const [formulaOpen, setFormulaOpen] = useState(false);

  const handleChange = useCallback((k: keyof CalcInputs, v: number | boolean) => {
    setInputs(prev => ({ ...prev, [k]: v }));
  }, []);

  const handlePreset = useCallback((p: Preset) => {
    setSelectedPreset(p.key);
    setInputs(prev => ({ ...prev, ...p.defaults }));
  }, []);

  const result = useMemo(() => {
    try {
      return calculateGoal({
        presentCost:   inputs.presentCost,
        yearsToGoal:   inputs.yearsToGoal,
        inflationRate: inputs.inflationRate,
        annualReturn:  inputs.annualReturn,
        expenseRatio:  inputs.enableExpense ? inputs.expenseRatio : 0,
        currentSavings: inputs.currentSavings,
      });
    } catch { return null; }
  }, [inputs]);

  const stepUpResult = useMemo(() => {
    if (!result || !inputs.enableStepUp) return null;
    try {
      const inflated = new Decimal(inputs.presentCost)
        .mul(Math.pow(1 + inputs.inflationRate / 100, inputs.yearsToGoal));
      return calcStepUpSIP(inflated, inputs.annualReturn, inputs.yearsToGoal, inputs.stepUpPct);
    } catch { return null; }
  }, [result, inputs]);

  const taxResult = useMemo(() => {
    if (!result || !inputs.enableTax) return null;
    const lastRow = result.yearByYear[result.yearByYear.length - 1];
    if (!lastRow) return null;
    return calcPostTaxCorpus(lastRow.rawCorpus, lastRow.rawInvested, inputs.ltcgRate);
  }, [result, inputs]);

  const inflatedRaw = result
    ? new Decimal(inputs.presentCost).mul(Math.pow(1 + inputs.inflationRate / 100, inputs.yearsToGoal)).toNumber()
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <GoalPresets onSelect={handlePreset} selected={selectedPreset} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Input side */}
        <section className="lg:col-span-2 card" aria-label="Calculator inputs">
          <h2 className="text-base font-bold mb-4" style={{ color: '#224c87' }}>Your Goal Details</h2>
          <InputPanel inputs={inputs} onChange={handleChange} />
        </section>

        {/* Results side */}
        <section className="lg:col-span-3 flex flex-col gap-4" aria-label="Results">
          <ResultPanel
            result={result}
            stepUpSIP={stepUpResult?.startingSIP}
            stepUpGlide={stepUpResult?.glide}
            postTax={taxResult?.postTax}
            enableStepUp={inputs.enableStepUp}
            enableTax={inputs.enableTax}
            salary={inputs.salary}
          />

          {/* Growth Chart */}
          {result && result.yearByYear.length > 0 && (
            <div className="card">
              <h3 className="text-sm font-bold mb-4" style={{ color: '#224c87' }}>Wealth Growth Over Time</h3>
              <GrowthChart data={result.yearByYear} inflatedGoal={inflatedRaw} />
            </div>
          )}
        </section>
      </div>

      {/* Education layer */}
      {result && (
        <div className="mt-6 space-y-3">
          <ConceptCard
            result={result}
            inputs={inputs}
            open={conceptOpen}
            onToggle={() => setConceptOpen(v => !v)}
            formulaOpen={formulaOpen}
            onFormulaToggle={() => setFormulaOpen(v => !v)}
          />
          <YearTable
            result={result}
            open={yearTableOpen}
            onToggle={() => setYearTableOpen(v => !v)}
          />
        </div>
      )}
    </div>
  );
}
