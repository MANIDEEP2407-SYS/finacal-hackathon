import Decimal from 'decimal.js';
import { Money } from './money';

Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

export interface GoalInputs {
  presentCost:    number;   // Current cost of goal in ₹
  yearsToGoal:    number;   // Time horizon in years
  inflationRate:  number;   // Annual inflation % (e.g. 6 for 6%)
  annualReturn:   number;   // Expected annual return % (e.g. 12 for 12%)
  expenseRatio?:  number;   // Optional: expense ratio % to deduct from return
  currentSavings?: number;  // Optional: Initial lumpsum invested
}

export interface YearSnapshot {
  year:         number;
  sipPaid:      string;    // Cumulative SIP paid
  corpusValue:  string;    // Portfolio value at year end
  goalProgress: number;    // % of inflated goal reached (capped 100)
  rawCorpus:    number;    // raw number for chart
  rawInvested:  number;    // raw number for chart
}

export interface GoalResult {
  inflatedGoalValue:  string;  // FV after inflation
  requiredMonthlySIP: string;  // Required SIP (annuity due)
  totalInvested:      string;  // SIP × months
  wealthGained:       string;  // inflatedGoal − totalInvested
  effectiveReturn:    number;  // annualReturn − expenseRatio
  yearByYear:         YearSnapshot[];
}

/**
 * EXACT PDF FORMULAS — Goal-Based Investment Calculator
 *
 * Step 1: FV = Present Cost × (1 + Inflation rate)^Years
 * Step 2: Required SIP = FV × r ÷ [((1 + r)^n − 1) × (1 + r)]
 *   where:  r = (Annual return − Expense ratio) ÷ 12
 *           n = Years × 12
 */
export function calculateGoal(inputs: GoalInputs): GoalResult {
  const { presentCost, yearsToGoal, inflationRate, annualReturn, expenseRatio = 0, currentSavings = 0 } = inputs;

  // Step 1 — Inflate goal
  const inflation = new Decimal(inflationRate).div(100);
  const inflatedGoal = new Decimal(presentCost)
    .mul(Decimal.pow(new Decimal(1).add(inflation), yearsToGoal));

  // Step 2 — Calculate required SIP (annuity due)
  const effectiveReturn = annualReturn - expenseRatio;
  const r = new Decimal(effectiveReturn).div(100).div(12);
  const n = new Decimal(yearsToGoal).mul(12);
  const onePlusR = new Decimal(1).add(r);

  // Future value of current savings
  const initialCorpus = new Decimal(currentSavings);
  const fvSavings = initialCorpus.mul(Decimal.pow(onePlusR, n));

  // Remaining goal to be funded via SIP
  let remainingGoal = inflatedGoal.sub(fvSavings);
  if (remainingGoal.isNegative()) remainingGoal = new Decimal(0);

  let requiredSIP = new Decimal(0);
  if (remainingGoal.greaterThan(0)) {
    const denominator = Decimal.pow(onePlusR, n).sub(1).mul(onePlusR);
    requiredSIP = remainingGoal.mul(r).div(denominator);
  }

  // Year-by-year breakdown
  const yearByYear = buildYearByYear(requiredSIP, r, yearsToGoal, inflatedGoal, initialCorpus);
  
  const finalCorpus = yearByYear.length > 0 ? new Decimal(yearByYear[yearByYear.length - 1].rawCorpus) : new Decimal(0);

  const totalInvested = requiredSIP.mul(n).add(initialCorpus);
  const wealthGained  = finalCorpus.sub(totalInvested);

  return {
    inflatedGoalValue:  Money.format(inflatedGoal),
    requiredMonthlySIP: Money.format(requiredSIP),
    totalInvested:      Money.format(totalInvested),
    wealthGained:       Money.format(wealthGained),
    effectiveReturn,
    yearByYear,
  };
}

function buildYearByYear(
  sip: Decimal,
  monthlyRate: Decimal,
  years: number,
  inflatedGoal: Decimal,
  initialCorpus: Decimal = new Decimal(0)
): YearSnapshot[] {
  const snapshots: YearSnapshot[] = [];
  let corpus = initialCorpus;

  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      corpus = corpus.add(sip).mul(new Decimal(1).add(monthlyRate));
    }
    const sipPaid = sip.mul(y * 12);
    const totalInvestedSoFar = sipPaid.add(initialCorpus);
    const progress = Math.min(100, Math.round(corpus.div(inflatedGoal).mul(100).toNumber()));

    snapshots.push({
      year: y,
      sipPaid:      Money.format(totalInvestedSoFar),
      corpusValue:  Money.format(corpus),
      goalProgress: progress,
      rawCorpus:    corpus.toNumber(),
      rawInvested:  totalInvestedSoFar.toNumber(),
    });
  }
  return snapshots;
}

/* ── Tax illustration (LTCG, simplified) ── */
export function calcPostTaxCorpus(
  grossCorpus: number, totalInvested: number, ltcgRate = 12.5
): { postTax: string; taxPaid: string } {
  const gains = new Decimal(grossCorpus).sub(totalInvested);
  const exemption = new Decimal(100000); // ₹1L LTCG exemption
  const taxableGains = Decimal.max(gains.sub(exemption), 0);
  const tax = taxableGains.mul(new Decimal(ltcgRate).div(100));
  const postTax = new Decimal(grossCorpus).sub(tax);
  return { postTax: Money.format(postTax), taxPaid: Money.format(tax) };
}
