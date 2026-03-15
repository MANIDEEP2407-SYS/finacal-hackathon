'use client';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { useScenario, type DepthId } from '@/context/ScenarioContext';
import { useLang } from '@/context/LangContext';
import { useMode } from '@/context/ModeContext';
import { useCalculator } from '@/context/CalculatorContext';
import { calculateGoal } from '@/lib/goalEngine';
import { GoalMountain } from '@/components/visualizer/GoalMountain';
import { GoalPresets, type Preset } from '@/components/calculator/GoalPresets';
import { InputPanel } from '@/components/calculator/InputPanel';
import { Depth1Baseline } from '@/components/depths/Depth1Baseline';
import { Depth2Inflation } from '@/components/depths/Depth2Inflation';
import { Depth3Fees } from '@/components/depths/Depth3Fees';
import { Depth4Crash } from '@/components/depths/Depth4Crash';
import { Depth5StepUp } from '@/components/depths/Depth5StepUp';
import { Depth6Tax } from '@/components/depths/Depth6Tax';
import { Depth7FullPicture } from '@/components/depths/Depth7FullPicture';
import { LiveRegion } from '@/components/shared/LiveRegion';
import { InlineBotTrigger } from '@/components/bot/BotTrigger';
import Decimal from 'decimal.js';
import { ChevronDown } from 'lucide-react';
import { CalcInputs } from '@/components/calculator/InputPanel';

const DEFAULT_CALC: CalcInputs = {
  presentCost: 2500000, yearsToGoal: 15, inflationRate: 6,
  annualReturn: 12,
  salary: 50000,
  currentSavings: 0,
  stepUpPct: 10, expenseRatio: 1,
  ltcgRate: 12.5, enableStepUp: false, enableExpense: false, enableTax: false,
};

const MAX_DEPTH: DepthId = 7;

export function SevenDepthsCalculator() {
  const { state: userState } = useUser();
  const { state: scenario, update, isUnlocked, unlockDepth } = useScenario();
  const { t } = useLang();
  const { updateState: updateCalcCtx } = useCalculator();

  const [inputs, setInputs] = useState<CalcInputs>(DEFAULT_CALC);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [openDepths, setOpenDepths] = useState<Set<DepthId>>(new Set([1]));

  const handleChange = useCallback((k: keyof CalcInputs, v: number | boolean) => {
    setInputs(prev => ({ ...prev, [k]: v }));
  }, []);

  const handlePreset = useCallback((p: Preset) => {
    setSelectedPreset(p.key);
    setInputs(prev => ({ ...prev, ...p.defaults }));
    update(p.defaults);
  }, [update]);

  const result = useMemo(() => {
    try {
      return calculateGoal({
        presentCost:   inputs.presentCost,
        yearsToGoal:   inputs.yearsToGoal,
        inflationRate: inputs.inflationRate,
        annualReturn:  inputs.annualReturn,
        expenseRatio:  scenario.primary.expenseRatio,
        currentSavings: inputs.currentSavings,
      });
    } catch { return null; }
  }, [inputs, scenario.primary.expenseRatio]);

  const inflatedGoalRaw = useMemo(() =>
    inputs.presentCost * Math.pow(1 + inputs.inflationRate / 100, inputs.yearsToGoal),
    [inputs.presentCost, inputs.inflationRate, inputs.yearsToGoal]
  );

  const lastRow = result?.yearByYear[result.yearByYear.length - 1];

  // Feed calculator state to CalculatorContext (for bot)
  useEffect(() => {
    if (!result || !lastRow) return;
    const sipNum = parseFloat(result.requiredMonthlySIP.replace(/[₹, ]/g, '')) || 0;
    updateCalcCtx({
      presentCost: inputs.presentCost,
      years: inputs.yearsToGoal,
      inflationRate: inputs.inflationRate,
      annualReturn: inputs.annualReturn,
      expenseRatio: scenario.primary.expenseRatio,
      stepUpRate: inputs.stepUpPct,
      goalLabel: selectedPreset ?? t.common.yourGoal,
      inflatedGoalValue: inflatedGoalRaw,
      requiredMonthlySIP: sipNum,
      totalInvested: lastRow.rawInvested,
      wealthGained: lastRow.rawCorpus - lastRow.rawInvested,
    });
  }, [result, inputs, lastRow, inflatedGoalRaw, selectedPreset, scenario.primary.expenseRatio, updateCalcCtx]);

  function toggleDepth(d: DepthId) {
    setOpenDepths(prev => {
      const next = new Set(prev);
      next.has(d) ? next.delete(d) : next.add(d);
      return next;
    });
  }

  function unlockNext() {
    const current = Math.max(...([...scenario.unlockedDepths])) as DepthId;
    if (current < MAX_DEPTH) {
      const next = (current + 1) as DepthId;
      unlockDepth(next);
      setOpenDepths(prev => new Set([...prev, next]));
      setTimeout(() => {
        document.getElementById(`depth-${next}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }

  const highestUnlocked = Math.max(...([...scenario.unlockedDepths])) as DepthId;
  const canUnlockMore = highestUnlocked < MAX_DEPTH;

  const effectiveUnlocked = scenario.unlockedDepths;
  const effectiveIsUnlocked = (d: DepthId) => isUnlocked(d);

  const liveMsg = result
    ? t.accessibility.liveResults(result.requiredMonthlySIP, result.inflatedGoalValue)
    : '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <LiveRegion message={liveMsg} />

      {/* Level chip */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        {userState.level && (
          <span className="text-sm font-bold px-4 py-1.5 rounded-full shadow-sm" style={{ background: 'linear-gradient(135deg, rgba(232,238,247,0.9), rgba(255,255,255,0.9))', color: '#224c87', border: '1px solid rgba(34,76,135,0.1)' }}>
            {userState.level === 'beginner' && t.levels.foundations}
            {userState.level === 'intermediate' && t.levels.building}
            {userState.level === 'advanced' && t.levels.advanced}
          </span>
        )}
      </div>

      {/* Goal presets */}
      <div className="mb-8">
        <GoalPresets onSelect={handlePreset} selected={selectedPreset} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
        {/* Input panel */}
        <section aria-label="Calculator inputs" className="lg:col-span-5">
          <div className="card sticky top-24">
            <h2 className="text-lg font-extrabold mb-6" style={{ color: '#0f172a' }}>
              {t.common.goalDetails}
            </h2>
            <InputPanel inputs={inputs} onChange={handleChange} />
          </div>
        </section>

        {/* Goal Mountain + Depths */}
        <section aria-label="Results and depths" className="lg:col-span-7 flex flex-col gap-6">
          {/* GoalMountain */}
          {result && (
            <div className="card">
              <h2 className="text-sm font-bold mb-3" style={{ color: '#224c87' }}>{t.common.goalMountain}</h2>
              <GoalMountain
                sipAmount={parseFloat(result.requiredMonthlySIP.replace(/[₹, ]/g, ''))}
                targetCorpus={inflatedGoalRaw}
                currentCorpus={lastRow?.rawCorpus ?? 0}
                years={inputs.yearsToGoal}
                hasCrash={effectiveIsUnlocked(4)}
                crashAtYear={scenario.primary.crashAtYear}
                hasFeeDrag={effectiveIsUnlocked(3)}
                feeDragAmount={effectiveIsUnlocked(3) ? scenario.primary.expenseRatio * inflatedGoalRaw / 100 : 0}
                label={t.accessibility.mountainLabel(result.requiredMonthlySIP, inputs.yearsToGoal)}
              />
            </div>
          )}

          {/* 7 Depths stack */}
          <div className="space-y-3">
            {effectiveIsUnlocked(1) && result && (
              <div>
                <Depth1Baseline
                  result={result}
                  sip={parseFloat(result.requiredMonthlySIP.replace(/[₹, ]/g, ''))}
                  salary={inputs.salary}
                  open={openDepths.has(1)}
                  onToggle={() => toggleDepth(1)}
                />
                <div className="mt-1 ml-4">
                  <InlineBotTrigger nodeId="what-is-sip" label={t.bot.questions.sip} />
                </div>
              </div>
            )}
            {effectiveIsUnlocked(2) && result && (
              <div>
                <Depth2Inflation
                  result={result}
                  presentCost={inputs.presentCost}
                  inflationRate={inputs.inflationRate}
                  years={inputs.yearsToGoal}
                  open={openDepths.has(2)}
                  onToggle={() => toggleDepth(2)}
                />
                <div className="mt-1 ml-4">
                  <InlineBotTrigger nodeId="what-is-inflation" label={t.bot.questions.inflation} />
                </div>
              </div>
            )}
            {effectiveIsUnlocked(3) && (
              <div>
                <Depth3Fees
                  sip={parseFloat(result?.requiredMonthlySIP?.replace(/[₹, ]/g, '') ?? '0')}
                  years={inputs.yearsToGoal}
                  annualReturn={inputs.annualReturn}
                  open={openDepths.has(3)}
                  onToggle={() => toggleDepth(3)}
                />
                <div className="mt-1 ml-4">
                  <InlineBotTrigger nodeId="what-is-expense-ratio" label={t.bot.questions.fees} />
                </div>
              </div>
            )}
            {effectiveIsUnlocked(4) && (
              <div>
                <Depth4Crash
                  sip={parseFloat(result?.requiredMonthlySIP?.replace(/[₹, ]/g, '') ?? '0')}
                  years={inputs.yearsToGoal}
                  annualReturn={inputs.annualReturn}
                  open={openDepths.has(4)}
                  onToggle={() => toggleDepth(4)}
                />
                <div className="mt-1 ml-4">
                  <InlineBotTrigger nodeId="what-happens-in-a-crash" label={t.bot.questions.crash} />
                </div>
              </div>
            )}
            {effectiveIsUnlocked(5) && result && (
              <div>
                <Depth5StepUp
                  inflatedGoal={inflatedGoalRaw}
                  annualReturn={inputs.annualReturn}
                  years={inputs.yearsToGoal}
                  flatSIP={result.requiredMonthlySIP}
                  open={openDepths.has(5)}
                  onToggle={() => toggleDepth(5)}
                />
                <div className="mt-1 ml-4">
                  <InlineBotTrigger nodeId="what-is-step-up-sip" label={t.bot.questions.stepup} />
                </div>
              </div>
            )}
            {effectiveIsUnlocked(6) && lastRow && (
              <div>
                <Depth6Tax
                  grossCorpus={lastRow.rawCorpus}
                  totalInvested={lastRow.rawInvested}
                  open={openDepths.has(6)}
                  onToggle={() => toggleDepth(6)}
                />
                <div className="mt-1 ml-4">
                  <InlineBotTrigger nodeId="what-is-ltcg" label={t.bot.questions.tax} />
                </div>
              </div>
            )}
            {effectiveIsUnlocked(7) && result && (
              <Depth7FullPicture
                result={result}
                open={openDepths.has(7)}
                onToggle={() => toggleDepth(7)}
              />
            )}

            {canUnlockMore && result && (
              <div className="flex justify-center py-2">
                <button
                  type="button"
                  onClick={unlockNext}
                  className="btn-primary gap-2"
                  aria-label={`Unlock depth ${highestUnlocked + 1} of 7`}
                >
                  <ChevronDown size={16} aria-hidden="true" />
                  {t.common.showMore(highestUnlocked + 1)}
                </button>
              </div>
            )}

            {!canUnlockMore && (
              <div className="text-center py-4">
                <p className="text-sm font-semibold" style={{ color: '#224c87' }}>
                  {t.common.fullPicture}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
