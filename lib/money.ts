import Decimal from 'decimal.js';

Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

export class Money {
  static format(val: Decimal | number, decimals = 0): string {
    const n = new Decimal(val).toDecimalPlaces(decimals, Decimal.ROUND_HALF_UP).toNumber();
    return '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  }

  static formatCompact(val: Decimal | number): string {
    const n = new Decimal(val).toNumber();
    if (n >= 1e7)  return '₹' + (n / 1e7).toFixed(2)  + ' Cr';
    if (n >= 1e5)  return '₹' + (n / 1e5).toFixed(2)  + ' L';
    if (n >= 1e3)  return '₹' + (n / 1e3).toFixed(1)  + 'K';
    return Money.format(n);
  }

  static from(n: number): Decimal { return new Decimal(n); }
  static pct(n: number): Decimal  { return new Decimal(n).div(100); }
  static monthlyRate(annualPct: number): Decimal {
    return new Decimal(annualPct).div(100).div(12);
  }
}
