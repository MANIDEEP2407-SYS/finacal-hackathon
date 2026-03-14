'use client';
import { useState } from 'react';
import { DepthShell } from './DepthShell';
import { useLang } from '@/context/LangContext';
import { GrowthChart } from '@/components/charts/GrowthChart';
import { YearTable } from '@/components/calculator/YearTable';
import type { GoalResult } from '@/lib/goalEngine';

interface Props {
  result: GoalResult;
  open: boolean;
  onToggle: () => void;
}

export function Depth7FullPicture({ result, open, onToggle }: Props) {
  const { t } = useLang();
  const [tableOpen, setTableOpen] = useState(false);
  const lastRow = result.yearByYear[result.yearByYear.length - 1];

  return (
    <DepthShell
      depth={7}
      title={t.depthData.d7.title}
      hook={t.depthData.d7.hook}
      badge={t.depthData.d7.badge}
      isOpen={open}
      onToggle={onToggle}
      conceptContent={<p>{t.depthData.d7.p1}</p>}
    >
      <div className="space-y-4">
        {/* Summary assumptions strip */}
        <div className="flex flex-wrap gap-2">
          {[
            { label: t.depthData.d7.h, value: `${result.yearByYear.length} ${t.table.year}s` },
            { label: t.depthData.d7.ti, value: result.totalInvested },
            { label: t.depthData.d7.fc, value: result.yearByYear.length > 0 ? result.yearByYear[result.yearByYear.length - 1].corpusValue : 'N/A' },
            { label: t.depthData.d7.wg, value: result.wealthGained },
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
