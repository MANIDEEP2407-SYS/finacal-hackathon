import Decimal from 'decimal.js';
import { Money } from './money';

Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

export interface ExpenseResult {
  corpusLowFee:  string;
  corpusHighFee: string;
  feeDrag:       string;
  feeDragRaw:    number;
  feePctOfGoal:  string;
}

/**
 * Calculate the fee drag between two expense ratios on the same SIP.
 * Returns both corpus values and the difference (fees consumed).
 */
export function calcExpenseDrag(
  sip: number,
  grossReturnPct: number,
  years: number,
  lowFee: number,
  highFee: number,
): ExpenseResult {
  const P = new Decimal(sip);
  const n = years * 12;

  function futureVal(netReturnPct: number): Decimal {
    const r = new Decimal(netReturnPct).div(100).div(12);
    const onePlusR = new Decimal(1).add(r);
    return P.mul(Decimal.pow(onePlusR, n).sub(1)).div(r).mul(onePlusR);
  }

  const fvLow  = futureVal(grossReturnPct - lowFee);
  const fvHigh = futureVal(grossReturnPct - highFee);
  const drag   = fvLow.sub(fvHigh);
  const pct    = drag.div(fvLow).mul(100).toFixed(1);

  return {
    corpusLowFee:  Money.format(fvLow),
    corpusHighFee: Money.format(fvHigh),
    feeDrag:       Money.format(drag),
    feeDragRaw:    drag.toNumber(),
    feePctOfGoal:  `${pct}%`,
  };
}
