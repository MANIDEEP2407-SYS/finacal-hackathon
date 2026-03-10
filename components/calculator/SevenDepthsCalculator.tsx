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
import { ModeToggle } from '@/components/shared/ModeToggle';
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
  annualReturn: 12, salary: 50000, stepUpPct: 10, expenseRatio: 1,
  ltcgRate: 12.5, enableStepUp: false, enableExpense: false, enableTax: false,
};

const MAX_DEPTH: DepthId = 7;

export function SevenDepthsCalculator() {
  const { state: userState } = useUser();
  const { state: scenario, update, isUnlocked, unlockDepth } = useScenario();
  const { t } = useLang();
  const { isLearning, isPlanning } = useMode();
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
      goalLabel: selectedPreset ?? 'your goal',
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

  // In planning mode, auto-unlock all depths
  const effectiveUnlocked = isPlanning
    ? new Set([1, 2, 3, 4, 5, 6, 7] as DepthId[])
    : scenario.unlockedDepths;

  const effectiveIsUnlocked = (d: DepthId) => isPlanning || isUnlocked(d);

  const liveMsg = result
    ? `Updated: Required SIP is ${result.requiredMonthlySIP} to reach ${result.inflatedGoalValue}`
    : '';

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <LiveRegion message={liveMsg} />

      {/* Level chip */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        {userState.level && (
          <span className="text-sm font-semibold px-3 py-1 rounded-full" style={{ background: '#e8eef7', color: '#224c87' }}>
            {userState.level === 'beginner' && '🌱 Foundations Mode'}
            {userState.level === 'intermediate' && '📈 Building Up'}
            {userState.level === 'advanced' && '🎯 Advanced Mode'}
          </span>
        )}
        {/* Mobile mode toggle (hidden on desktop since it's in header) */}
        <div className="sm:hidden">
          <ModeToggle />
        </div>
      </div>

      {/* Goal presets */}
      <GoalPresets onSelect={handlePreset} selected={selectedPreset} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Input panel */}
        <section aria-label="Calculator inputs" className="lg:col-span-2">
          <div className="card">
            <h2 className="text-base font-bold mb-4" style={{ color: '#224c87' }}>
              {isLearning ? 'Your Goal Details' : 'Goal Parameters'}
            </h2>
            <InputPanel inputs={inputs} onChange={handleChange} />
          </div>
        </section>

        {/* Goal Mountain + Depths */}
        <section aria-label="Results and depths" className="lg:col-span-3 flex flex-col gap-4">
          {/* GoalMountain */}
          {result && (
            <div className="card">
              <h2 className="text-sm font-bold mb-3" style={{ color: '#224c87' }}>Your Goal Mountain</h2>
              <GoalMountain
                sipAmount={parseFloat(result.requiredMonthlySIP.replace(/[₹, ]/g, ''))}
                targetCorpus={inflatedGoalRaw}
                currentCorpus={lastRow?.rawCorpus ?? 0}
                years={inputs.yearsToGoal}
                hasCrash={effectiveIsUnlocked(4)}
                crashAtYear={scenario.primary.crashAtYear}
                hasFeeDrag={effectiveIsUnlocked(3)}
                feeDragAmount={effectiveIsUnlocked(3) ? scenario.primary.expenseRatio * inflatedGoalRaw / 100 : 0}
                label={`Goal Mountain: SIP of ${result.requiredMonthlySIP}/month over ${inputs.yearsToGoal} years`}
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
                  open={isPlanning || openDepths.has(1)}
                  onToggle={() => toggleDepth(1)}
                />
                {isLearning && (
                  <div className="mt-1 ml-4">
                    <InlineBotTrigger nodeId="what-is-sip" label="What is a SIP?" />
                  </div>
                )}
              </div>
            )}
            {effectiveIsUnlocked(2) && result && (
              <div>
                <Depth2Inflation
                  result={result}
                  presentCost={inputs.presentCost}
                  inflationRate={inputs.inflationRate}
                  years={inputs.yearsToGoal}
                  open={isPlanning || openDepths.has(2)}
                  onToggle={() => toggleDepth(2)}
                />
                {isLearning && (
                  <div className="mt-1 ml-4">
                    <InlineBotTrigger nodeId="what-is-inflation" label="What is inflation?" />
                  </div>
                )}
              </div>
            )}
            {effectiveIsUnlocked(3) && (
              <div>
                <Depth3Fees
                  sip={parseFloat(result?.requiredMonthlySIP?.replace(/[₹, ]/g, '') ?? '0')}
                  years={inputs.yearsToGoal}
                  annualReturn={inputs.annualReturn}
                  open={isPlanning || openDepths.has(3)}
                  onToggle={() => toggleDepth(3)}
                />
                {isLearning && (
                  <div className="mt-1 ml-4">
                    <InlineBotTrigger nodeId="what-is-expense-ratio" label="What is an expense ratio?" />
                  </div>
                )}
              </div>
            )}
            {effectiveIsUnlocked(4) && (
              <div>
                <Depth4Crash
                  sip={parseFloat(result?.requiredMonthlySIP?.replace(/[₹, ]/g, '') ?? '0')}
                  years={inputs.yearsToGoal}
                  annualReturn={inputs.annualReturn}
                  open={isPlanning || openDepths.has(4)}
                  onToggle={() => toggleDepth(4)}
                />
                {isLearning && (
                  <div className="mt-1 ml-4">
                    <InlineBotTrigger nodeId="what-happens-in-a-crash" />
                  </div>
                )}
              </div>
            )}
            {effectiveIsUnlocked(5) && result && (
              <div>
                <Depth5StepUp
                  inflatedGoal={inflatedGoalRaw}
                  annualReturn={inputs.annualReturn}
                  years={inputs.yearsToGoal}
                  flatSIP={result.requiredMonthlySIP}
                  open={isPlanning || openDepths.has(5)}
                  onToggle={() => toggleDepth(5)}
                />
                {isLearning && (
                  <div className="mt-1 ml-4">
                    <InlineBotTrigger nodeId="what-is-step-up-sip" label="What is a step-up SIP?" />
                  </div>
                )}
              </div>
            )}
            {effectiveIsUnlocked(6) && lastRow && (
              <div>
                <Depth6Tax
                  grossCorpus={lastRow.rawCorpus}
                  totalInvested={lastRow.rawInvested}
                  open={isPlanning || openDepths.has(6)}
                  onToggle={() => toggleDepth(6)}
                />
                {isLearning && (
                  <div className="mt-1 ml-4">
                    <InlineBotTrigger nodeId="what-is-ltcg" label="What is LTCG tax?" />
                  </div>
                )}
              </div>
            )}
            {effectiveIsUnlocked(7) && result && (
              <Depth7FullPicture
                result={result}
                open={isPlanning || openDepths.has(7)}
                onToggle={() => toggleDepth(7)}
              />
            )}

            {/* Unlock next depth CTA — only in learning mode */}
            {isLearning && canUnlockMore && result && (
              <div className="flex justify-center py-2">
                <button
                  type="button"
                  onClick={unlockNext}
                  className="btn-primary gap-2"
                  aria-label={`Unlock depth ${highestUnlocked + 1} of 7`}
                >
                  <ChevronDown size={16} aria-hidden="true" />
                  Show me more · Depth {highestUnlocked + 1} / {MAX_DEPTH}
                </button>
              </div>
            )}

            {isLearning && !canUnlockMore && (
              <div className="text-center py-4">
                <p className="text-sm font-semibold" style={{ color: '#224c87' }}>
                  🎉 You&apos;ve unlocked the full picture — all 7 depths explored!
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
