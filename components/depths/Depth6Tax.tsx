'use client';
import { DepthShell } from './DepthShell';
import { useScenario } from '@/context/ScenarioContext';
import { useLang } from '@/context/LangContext';
import { calcPostTaxCorpus } from '@/lib/goalEngine';
import { InputSlider } from '@/components/shared/InputSlider';
import { OutputCard } from '@/components/shared/OutputCard';
import { useMemo } from 'react';

interface Props { grossCorpus: number; totalInvested: number; open: boolean; onToggle: () => void; }

export function Depth6Tax({ grossCorpus, totalInvested, open, onToggle }: Props) {
  const { t } = useLang();
  const { state, update } = useScenario();
  const { ltcgRate } = state.primary;

  const taxResult = useMemo(() =>
    calcPostTaxCorpus(grossCorpus, totalInvested, ltcgRate),
    [grossCorpus, totalInvested, ltcgRate]
  );

  return (
    <DepthShell
      depth={6}
      title={t.depthData.d6.title}
      hook={t.depthData.d6.hook}
      badge={t.depthData.d6.badge}
      formulaLabel={t.depthData.d6.formulaLabel}
      formula={`Taxable Gains = Corpus − Invested − ₹1L exemption\nTax = Taxable Gains × LTCG Rate%\nPost-Tax Corpus = Gross Corpus − Tax`}
      isOpen={open}
      onToggle={onToggle}
      conceptContent={<p>{t.depthData.d6.p1(ltcgRate)}</p>}
    >
      <div className="space-y-4">
        <InputSlider
          id="d6-ltcg"
          label={t.depthData.d6.label}
          min={0} max={30} step={0.5}
          value={ltcgRate}
          onChange={v => update({ ltcgRate: v })}
          format={v => `${v}%`}
          hint={t.depthData.d6.hint}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <OutputCard value={taxResult.postTax} label={t.depthData.d6.post} borderAccent="blue" />
          <OutputCard value={taxResult.taxPaid}  label={t.depthData.d6.paid}  color="red"   borderAccent="red" />
          <div className="card text-center" style={{ borderTop: '3px solid #919090'}}>
            <p className="text-xs font-semibold uppercase" style={{ color: '#919090' }}>{t.depthData.d6.exempt}</p>
            <p className="output-number text-xl" style={{ color: '#919090' }}>₹1L / yr</p>
          </div>
        </div>

        <p className="text-xs italic" style={{ color: '#da3832' }}>
          {t.depthData.d6.note}
        </p>
      </div>
    </DepthShell>
  );
}
