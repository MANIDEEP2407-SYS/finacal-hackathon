'use client';
import dynamic from 'next/dynamic';
import { useLang } from '@/context/LangContext';
import type { YearSnapshot } from '@/lib/goalEngine';

/* Recharts must be client-side only — prevents SSR hydration mismatch */
const Chart = dynamic(() => import('./ChartInner'), { ssr: false });

interface Props {
  data: YearSnapshot[];
  inflatedGoal: number;
}

export function GrowthChart({ data, inflatedGoal }: Props) {
  const { t } = useLang();
  if (!data.length) return null;

  return (
    <div>
      {/* Visible chart (aria-hidden — screen readers get the table below) */}
      <div aria-hidden="true" className="w-full" style={{ height: 280 }}>
        <Chart data={data} inflatedGoal={inflatedGoal} />
      </div>

      {/* Screen-reader accessible data table */}
      <div className="sr-only">
        <table>
          <caption>Goal progress by year</caption>
          <thead>
            <tr>
              <th scope="col">{t.table.year}</th>
              <th scope="col">{t.table.invested}</th>
              <th scope="col">{t.table.corpus}</th>
              <th scope="col">{t.table.progress}</th>
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr key={row.year}>
                <td>Year {row.year}</td>
                <td>{row.sipPaid}</td>
                <td>{row.corpusValue}</td>
                <td>{row.goalProgress}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
