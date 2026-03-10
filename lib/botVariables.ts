import { Money } from './money';
import type { CalculatorState } from '@/context/CalculatorContext';
import Decimal from 'decimal.js';

type VarComputer = (s: CalculatorState) => string;

const VARIABLE_COMPUTERS: Record<string, VarComputer> = {
  // ── Basic inputs ──
  presentCost: s => Money.format(s.presentCost),
  years: s => `${s.years}`,
  annualReturn: s => `${s.annualReturn}`,
  inflationRate: s => `${s.inflationRate}`,
  expenseRatio: s => `${s.expenseRatio}`,
  stepUpRate: s => `${s.stepUpRate}`,
  goalLabel: s => s.goalLabel,

  // ── From computed results ──
  requiredSIP: s => Money.format(s.requiredMonthlySIP),
  inflatedGoal: s => Money.format(s.inflatedGoalValue),
  totalInvested: s => Money.format(s.totalInvested),
  wealthGained: s => Money.format(s.wealthGained),

  // ── Derived ──
  monthlyReturn: s => `${(s.annualReturn / 12).toFixed(3)}`,
  realReturn: s => `${(s.annualReturn - s.inflationRate).toFixed(1)}`,

  inflationMultiplier: s =>
    `${Math.pow(1 + s.inflationRate / 100, s.years).toFixed(2)}`,

  inflationCost: s => {
    const inflated = Math.pow(1 + s.inflationRate / 100, s.years) * s.presentCost;
    return Money.format(inflated - s.presentCost);
  },

  inflationRatePlus2: s => `${s.inflationRate + 2}`,

  inflatedGoalHigher: s => {
    const inflated = Math.pow(1 + (s.inflationRate + 2) / 100, s.years) * s.presentCost;
    return Money.format(inflated);
  },

  effectiveReturn: s => `${(s.annualReturn - s.expenseRatio).toFixed(1)}`,

  doublingYears: s => `${Math.round(72 / s.annualReturn)}`,
  doublingCount: s => `${Math.floor(s.years / (72 / s.annualReturn))}`,

  // ── Timeline sensitivity ──
  yearsPlus5: s => `${s.years + 5}`,
  extendedYears: s => `${s.years + 5}`,
  extendedSip: s => {
    try {
      const inflated = Math.pow(1 + s.inflationRate / 100, s.years) * s.presentCost;
      const r = new Decimal(s.annualReturn - s.expenseRatio).div(100).div(12);
      const n = new Decimal((s.years + 5) * 12);
      const sip = new Decimal(inflated).mul(r)
        .div(Decimal.pow(r.add(1), n).sub(1).mul(r.add(1)));
      return Money.format(sip);
    } catch { return 'N/A'; }
  },

  // ── NAV examples ──
  unitsAtNav100: s => {
    const sip = s.requiredMonthlySIP;
    return `${(sip / 100).toFixed(1)}`;
  },
  valueAtNav105: s => {
    const units = s.requiredMonthlySIP / 100;
    return Money.format(units * 105);
  },
  normalUnits: s => `${(s.requiredMonthlySIP / 100).toFixed(1)}`,
  crashUnits: s => `${(s.requiredMonthlySIP / 60).toFixed(1)}`,
  extraUnits: s => `${((s.requiredMonthlySIP / 60) - (s.requiredMonthlySIP / 100)).toFixed(1)}`,
  lowUnitsExample: s => `${(s.requiredMonthlySIP / 120).toFixed(1)} units`,
  highUnitsExample: s => `${(s.requiredMonthlySIP / 80).toFixed(1)} units`,

  // ── Step-up SIP ──
  stepUpSip: s => {
    try {
      const inflated = Math.pow(1 + s.inflationRate / 100, s.years) * s.presentCost;
      const monthlyRate = new Decimal(s.annualReturn - s.expenseRatio).div(100).div(12);
      const g = new Decimal(s.stepUpRate).div(100);
      let lo = new Decimal(100);
      let hi = new Decimal(1000000);
      for (let i = 0; i < 60; i++) {
        const mid = lo.add(hi).div(2);
        const fv = computeStepUpFV(mid, monthlyRate, s.years, g);
        if (fv.lt(inflated)) lo = mid; else hi = mid;
        if (hi.sub(lo).abs().lt(0.5)) break;
      }
      return Money.format(lo.add(hi).div(2));
    } catch { return 'N/A'; }
  },

  stepUpSaving: s => {
    try {
      const inflated = Math.pow(1 + s.inflationRate / 100, s.years) * s.presentCost;
      const monthlyRate = new Decimal(s.annualReturn - s.expenseRatio).div(100).div(12);
      const g = new Decimal(s.stepUpRate).div(100);
      let lo = new Decimal(100);
      let hi = new Decimal(1000000);
      for (let i = 0; i < 60; i++) {
        const mid = lo.add(hi).div(2);
        const fv = computeStepUpFV(mid, monthlyRate, s.years, g);
        if (fv.lt(inflated)) lo = mid; else hi = mid;
        if (hi.sub(lo).abs().lt(0.5)) break;
      }
      const stepUp = lo.add(hi).div(2).toNumber();
      return Money.format(Math.abs(s.requiredMonthlySIP - stepUp));
    } catch { return 'N/A'; }
  },

  // ── Lumpsum ──
  lumpsumValue: s => {
    const fv = s.totalInvested * Math.pow(1 + s.annualReturn / 100, s.years);
    return Money.format(fv);
  },

  // ── Savings vs investing ──
  savingsValue: s => Money.format(s.presentCost * Math.pow(1.035, s.years)),
  investmentValue: s => Money.format(s.inflatedGoalValue),
  investmentGap: s => {
    const savings = s.presentCost * Math.pow(1.035, s.years);
    return Money.format(s.inflatedGoalValue - savings);
  },

  // ── Tax ──
  estimatedLTCG: s => {
    const taxableGains = Math.max(0, s.wealthGained - 125000);
    return Money.format(taxableGains * 0.125);
  },
  postTaxCorpus: s => {
    const tax = Math.max(0, s.wealthGained - 125000) * 0.125;
    return Money.format(s.inflatedGoalValue - tax);
  },

  // ── Fee drag ──
  totalFeeDrag: s => {
    try {
      const r1 = new Decimal(s.annualReturn - s.expenseRatio).div(100).div(12);
      const r2 = new Decimal(s.annualReturn).div(100).div(12);
      const n = new Decimal(s.years * 12);
      const sip = new Decimal(s.requiredMonthlySIP);
      const fv1 = sip.mul(Decimal.pow(r1.add(1), n).sub(1).mul(r1.add(1)).div(r1));
      const fv2 = sip.mul(Decimal.pow(r2.add(1), n).sub(1).mul(r2.add(1)).div(r2));
      return Money.format(fv2.sub(fv1).abs());
    } catch { return 'N/A'; }
  },
};

function computeStepUpFV(sip: Decimal, monthlyRate: Decimal, years: number, annualStepUp: Decimal): Decimal {
  let corpus = new Decimal(0);
  let current = new Decimal(sip);
  for (let y = 0; y < years; y++) {
    for (let m = 0; m < 12; m++) {
      corpus = corpus.add(current).mul(new Decimal(1).add(monthlyRate));
    }
    current = current.mul(new Decimal(1).add(annualStepUp));
  }
  return corpus;
}

export function resolveVariables(template: string, state: CalculatorState): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
    const computer = VARIABLE_COMPUTERS[varName];
    if (!computer) return match;
    try {
      return computer(state);
    } catch {
      return match;
    }
  });
}

const DEFAULT_STATE: CalculatorState = {
  presentCost: 1500000,
  years: 12,
  inflationRate: 6,
  annualReturn: 12,
  expenseRatio: 1.0,
  stepUpRate: 10,
  goalLabel: 'your goal',
  inflatedGoalValue: 3018790,
  requiredMonthlySIP: 11520,
  totalInvested: 1659840,
  wealthGained: 1358950,
};

export function resolveWithFallback(
  template: string,
  state: CalculatorState | null
): { text: string; usedDefaults: boolean } {
  const effectiveState = state && state.requiredMonthlySIP > 0 ? state : DEFAULT_STATE;
  const usedDefaults = !state || state.requiredMonthlySIP === 0;
  return {
    text: resolveVariables(template, effectiveState),
    usedDefaults,
  };
}
