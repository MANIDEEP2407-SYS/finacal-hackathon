'use client';
import { useState } from 'react';
import { DepthShell } from './DepthShell';
import { GrowthChart } from '@/components/charts/GrowthChart';
import { YearTable } from '@/components/calculator/YearTable';
import type { GoalResult } from '@/lib/goalEngine';

interface Props {
  result: GoalResult;
  open: boolean;
  onToggle: () => void;
}

export function Depth7FullPicture({ result, open, onToggle }: Props) {
  const [tableOpen, setTableOpen] = useState(false);
  const lastRow = result.yearByYear[result.yearByYear.length - 1];

  return (
    <DepthShell
      depth={7}
      title="The Full Picture"
      hook='"Your complete, honest, year-by-year roadmap from today to your goal."'
      badge="Complete View"
      isOpen={open}
      onToggle={onToggle}
      conceptContent={
        <p>
          This is the unfiltered truth of your investment journey — every year, how much you've contributed,
          and how close you are to your goal. No surprises. No hidden fees. Just your money, working.
        </p>
      }
    >
      <div className="space-y-4">
        {/* Summary assumptions strip */}
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Horizon', value: `${result.yearByYear.length} yrs` },
            { label: 'Total Invested', value: result.totalInvested },
            { label: 'Final Corpus', value: result.yearByYear.length > 0 ? result.yearByYear[result.yearByYear.length - 1].corpusValue : 'N/A' },
            { label: 'Wealth Gained', value: result.wealthGained },
          ].map(item => (
            <div key={item.label} className="px-3 py-2 rounded-lg text-center" style={{ background: '#e8eef7' }}>
              <p className="text-xs" style={{ color: '#919090' }}>{item.label}</p>
              <p className="text-sm font-bold" style={{ color: '#224c87', fontVariantNumeric: 'tabular-nums' }}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Growth chart */}
        {result.yearByYear.length > 0 && (
          <GrowthChart
            data={result.yearByYear}
            inflatedGoal={lastRow ? lastRow.rawCorpus * 1.02 : 0}
          />
        )}

        {/* Year table */}
        <YearTable result={result} open={tableOpen} onToggle={() => setTableOpen(v => !v)} />
      </div>
    </DepthShell>
  );
}
