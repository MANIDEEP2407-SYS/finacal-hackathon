'use client';
import { useLang } from '@/context/LangContext';
import type { GoalResult, YearSnapshot } from '@/lib/goalEngine';

interface Props { result: GoalResult; open: boolean; onToggle: () => void; }

export function YearTable({ result, open, onToggle }: Props) {
  const { t } = useLang();
  const tbl = t.table;

  return (
    <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#e8eef7' }}>
      <button
        className="accordion-header px-4"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls="year-table-panel"
        id="year-table-header"
        type="button"
      >
        <span>{t.education.yearTableTitle}</span>
        <span style={{ color: '#919090', fontSize: '0.75rem' }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div id="year-table-panel" role="region" aria-labelledby="year-table-header" className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">Year-by-year goal progress</caption>
            <thead>
              <tr style={{ background: '#e8eef7' }}>
                <th scope="col" className="px-4 py-2 text-left font-semibold text-xs" style={{ color: '#224c87' }}>{tbl.year}</th>
                <th scope="col" className="px-4 py-2 text-right font-semibold text-xs" style={{ color: '#224c87' }}>{tbl.invested}</th>
                <th scope="col" className="px-4 py-2 text-right font-semibold text-xs" style={{ color: '#224c87' }}>{tbl.corpus}</th>
                <th scope="col" className="px-4 py-2 text-right font-semibold text-xs" style={{ color: '#224c87' }}>{tbl.progress}</th>
              </tr>
            </thead>
            <tbody>
              {result.yearByYear.map((row, i) => (
                <tr
                  key={row.year}
                  style={{ background: i % 2 === 0 ? '#fff' : '#f9fbff' }}
                >
                  <td className="px-4 py-2 font-medium">{row.year}</td>
                  <td className="px-4 py-2 text-right" style={{ fontVariantNumeric: 'tabular-nums', color: '#3a3a3a' }}>{row.sipPaid}</td>
                  <td className="px-4 py-2 text-right font-bold" style={{ fontVariantNumeric: 'tabular-nums', color: '#224c87' }}>{row.corpusValue}</td>
                  <td className="px-4 py-2 text-right">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full overflow-hidden" style={{ background: '#e8eef7' }}>
                        <div className="h-full rounded-full" style={{ width: `${row.goalProgress}%`, background: row.goalProgress >= 100 ? '#16a34a' : '#224c87' }} />
                      </div>
                      <span className="text-xs font-semibold" style={{ color: row.goalProgress >= 100 ? '#16a34a' : '#224c87' }}>
                        {row.goalProgress}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
