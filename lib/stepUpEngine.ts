import Decimal from 'decimal.js';
import { Money } from './money';

Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

/**
 * Step-Up SIP: solve for starting SIP such that SIP increases by
 * `stepUpPct`% each year and the portfolio reaches `targetCorpus`.
 * Uses binary search (converges in ~60 iterations to ₹1 precision).
 * MUST be labelled as "illustrative estimate" in UI.
 */
export function calcStepUpSIP(
  targetCorpus: Decimal,
  annualReturnPct: number,
  years: number,
  stepUpPct: number,
): { startingSIP: string; savings: string; glide: GlideRow[] } {
  const monthlyRate = new Decimal(annualReturnPct).div(100).div(12);
  const g = new Decimal(stepUpPct).div(100);

  let lo = new Decimal(100);
  let hi = new Decimal(1000000);

  for (let i = 0; i < 80; i++) {
    const mid = lo.add(hi).div(2);
    const fv = computeFV(mid, monthlyRate, years, g);
    if (fv.lt(targetCorpus)) lo = mid; else hi = mid;
    if (hi.sub(lo).abs().lt(0.5)) break;
  }

  const startingSIP = lo.add(hi).div(2);
  const flatSIP = targetCorpus
    .mul(monthlyRate)
    .div(Decimal.pow(new Decimal(1).add(monthlyRate), years * 12).sub(1).mul(new Decimal(1).add(monthlyRate)));

  const savings = flatSIP.sub(startingSIP).abs();
  const glide = buildGlide(startingSIP, g, years);

  return {
    startingSIP: Money.format(startingSIP),
    savings: Money.format(savings),
    glide,
  };
}

function computeFV(sip: Decimal, monthlyRate: Decimal, years: number, annualStepUp: Decimal): Decimal {
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

export interface GlideRow { year: number; sip: string; }
function buildGlide(startingSIP: Decimal, g: Decimal, years: number): GlideRow[] {
  const rows: GlideRow[] = [];
  let sip = new Decimal(startingSIP);
  const keyYears = [1, 3, 5, 10, years].filter((y, i, arr) => y <= years && arr.indexOf(y) === i);
  for (const y of keyYears) {
    const sipAtY = startingSIP.mul(Decimal.pow(new Decimal(1).add(g), y - 1));
    rows.push({ year: y, sip: Money.format(sipAtY) });
  }
  return rows;
}
