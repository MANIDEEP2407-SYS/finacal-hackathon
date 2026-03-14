'use client';
import { useMemo } from 'react';
import { DepthShell } from './DepthShell';
import { InputSlider } from '@/components/shared/InputSlider';
import { useLang } from '@/context/LangContext';
import { useScenario } from '@/context/ScenarioContext';
import { simulateCrash } from '@/lib/crashEngine';
import dynamic from 'next/dynamic';

const CrashChartInner = dynamic(() => import('@/components/charts/CrashChartInner'), { ssr: false });

interface Props { sip: number; years: number; annualReturn: number; open: boolean; onToggle: () => void; }

export function Depth4Crash({ sip, years, annualReturn, open, onToggle }: Props) {
  const { t } = useLang();
  const { state, update } = useScenario();
  const { crashDepth, crashAtYear, recoveryMonths } = state.primary;

  const result = useMemo(() =>
    simulateCrash(sip, { monthlyReturn: annualReturn, crashDepth, crashAtYear: Math.min(crashAtYear, years - 1), recoveryMonths, years }),
    [sip, annualReturn, crashDepth, crashAtYear, recoveryMonths, years]
  );

  return (
    <DepthShell
      depth={4}
      title={t.depthData.d4.title}
      hook={t.depthData.d4.hook}
      badge={t.depthData.d4.badge}
      formulaLabel={t.depthData.d4.formulaLabel}
      formula={`NAV_crash = NAV_pre × (1 − CrashDepth/3) per month\nNAV_recovery: linear from crash-low to pre-crash trend over RecoveryMonths`}
      isOpen={open}
      onToggle={onToggle}
      conceptContent={<p>{t.depthData.d4.p1}</p>}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">
          <InputSlider id="d4-depth" label={t.depthData.d4.drop} min={10} max={60} step={5} value={crashDepth}
            onChange={v => update({ crashDepth: v })} format={v => `-${v}%`} />
          <InputSlider id="d4-year" label={t.depthData.d4.year} min={1} max={Math.max(1, years - 1)} step={1} value={crashAtYear}
            onChange={v => update({ crashAtYear: v })} format={v => `${t.table.year} ${v}`} />
          <InputSlider id="d4-recovery" label={t.depthData.d4.recov} min={6} max={48} step={3} value={recoveryMonths}
            onChange={v => update({ recoveryMonths: v })} format={v => `${v}mo`} />
        </div>

        {/* Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="card text-center" style={{ borderTop: '3px solid #224c87' }}>
            <p className="text-xs font-semibold uppercase" style={{ color: '#919090' }}>{t.depthData.d4.cont}</p>
            <p className="output-number text-xl" style={{ color: '#224c87', fontVariantNumeric: 'tabular-nums' }}>{result.continuedCorpus}</p>
          </div>
          <div className="card text-center" style={{ borderTop: '3px solid #da3832' }}>
            <p className="text-xs font-semibold uppercase" style={{ color: '#919090' }}>{t.depthData.d4.pause}</p>
            <p className="output-number text-xl" style={{ color: '#da3832', fontVariantNumeric: 'tabular-nums' }}>{result.stoppedCorpus}</p>
          </div>
        </div>

        <div className="insight-badge">
          <span aria-hidden="true">💪</span>
          <span className="text-sm">
            {t.depthData.d4.hi(result.advantage)}
          </span>
        </div>

        {open && result.crashData.length > 0 && (
          <div aria-hidden="true" style={{ height: 200 }}>
            <CrashChartInner data={result.crashData} crashAtYear={crashAtYear} />
          </div>
        )}

        <p className="text-xs italic" style={{ color: '#da3832' }}>
          {t.depthData.d4.note}
        </p>
      </div>
    </DepthShell>
  );
}
