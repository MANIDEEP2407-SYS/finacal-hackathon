import Decimal from 'decimal.js';
import { Money } from './money';

Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

export interface CrashInputs {
  monthlyReturn: number;      // Annual return % (e.g. 12)
  crashDepth: number;         // How far the market drops (e.g. 40 for -40%)
  crashAtYear: number;        // When crash occurs
  recoveryMonths: number;     // How many months the recovery takes
  years: number;              // Total investment years
}

export interface CrashResult {
  continuedCorpus: string;    // Corpus if SIP continued during crash
  stoppedCorpus: string;      // Corpus if SIP paused during crash
  advantage: string;          // Benefit of continuing
  crashData: CrashPoint[];
}

export interface CrashPoint {
  month: number;
  nav: number;                // Normalised NAV (starts at 100)
  corpus_continued: number;
  corpus_stopped: number;
}

/**
 * Deterministic piecewise-linear NAV model.
 * Market grows at normalRate, crashes linearly over 3 months,
 * then recovers linearly over `recoveryMonths`.
 */
export function simulateCrash(sip: number, inputs: CrashInputs): CrashResult {
  const { monthlyReturn, crashDepth, crashAtYear, recoveryMonths, years } = inputs;
  const totalMonths = years * 12;
  const crashStartMonth = crashAtYear * 12;
  const crashEndMonth = crashStartMonth + 3;          // 3-month crash
  const recoveryEndMonth = crashEndMonth + recoveryMonths;

  const monthlyRate = monthlyReturn / 100 / 12;
  const monthlyGrowth = 1 + monthlyRate;

  let corpusCont = 0;
  let corpusStop = 0;
  let nav = 100;
  const data: CrashPoint[] = [];

  for (let m = 1; m <= totalMonths; m++) {
    // Determine NAV change this month
    if (m >= crashStartMonth && m < crashEndMonth) {
      // Crash: linear drop over 3 months
      const dropPerMonth = (crashDepth / 100) / 3;
      nav = nav * (1 - dropPerMonth);
    } else if (m >= crashEndMonth && m < recoveryEndMonth) {
      // Recovery: linear rise back to pre-crash trajectory
      const monthsInRecovery = m - crashEndMonth;
      const targetNav = 100 * Math.pow(monthlyGrowth, m);
      const currentBase = 100 * Math.pow(monthlyGrowth, crashEndMonth) * (1 - crashDepth / 100);
      const progress = monthsInRecovery / recoveryMonths;
      nav = currentBase + (targetNav - currentBase) * progress;
    } else {
      nav = nav * monthlyGrowth;
    }

    // SIP continued investor always adds SIP
    corpusCont = corpusCont * monthlyGrowth + sip;

    // SIP stopped investor pauses only during crash + recovery window
    const inCrash = m >= crashStartMonth && m <= recoveryEndMonth;
    corpusStop = corpusStop * monthlyGrowth + (inCrash ? 0 : sip);

    data.push({
      month: m,
      nav: Math.round(nav * 100) / 100,
      corpus_continued: Math.round(corpusCont),
      corpus_stopped: Math.round(corpusStop),
    });
  }

  const advantage = new Decimal(corpusCont).sub(corpusStop);
  return {
    continuedCorpus: Money.format(new Decimal(corpusCont)),
    stoppedCorpus: Money.format(new Decimal(corpusStop)),
    advantage: Money.format(advantage),
    crashData: data,
  };
}
