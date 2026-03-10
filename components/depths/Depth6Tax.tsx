'use client';
import { DepthShell } from './DepthShell';
import { useScenario } from '@/context/ScenarioContext';
import { calcPostTaxCorpus } from '@/lib/goalEngine';
import { InputSlider } from '@/components/shared/InputSlider';
import { OutputCard } from '@/components/shared/OutputCard';
import { useMemo } from 'react';

interface Props { grossCorpus: number; totalInvested: number; open: boolean; onToggle: () => void; }

export function Depth6Tax({ grossCorpus, totalInvested, open, onToggle }: Props) {
  const { state, update } = useScenario();
  const { ltcgRate } = state.primary;

  const taxResult = useMemo(() =>
    calcPostTaxCorpus(grossCorpus, totalInvested, ltcgRate),
    [grossCorpus, totalInvested, ltcgRate]
  );

  return (
    <DepthShell
      depth={6}
      title="The Tax Truth"
      hook='"Your corpus looks great — until the government takes its share."'
      badge="LTCG Tax"
      formulaLabel="LTCG calculation (simplified)"
      formula={`Taxable Gains = Corpus − Invested − ₹1L exemption\nTax = Taxable Gains × LTCG Rate%\nPost-Tax Corpus = Gross Corpus − Tax`}
      isOpen={open}
      onToggle={onToggle}
      conceptContent={
        <p>
          Long-term capital gains (LTCG) tax applies when you redeem your mutual fund units after holding for more than a year.
          Currently {ltcgRate}% on gains above ₹1 lakh. Plan for this from day one — it's real money, not an afterthought.
        </p>
      }
    >
      <div className="space-y-4">
        <InputSlider
          id="d6-ltcg"
          label="LTCG Tax Rate (%)"
          min={0} max={30} step={0.5}
          value={ltcgRate}
          onChange={v => update({ ltcgRate: v })}
          format={v => `${v}%`}
          hint="Currently 12.5% for equity MFs; consult a tax advisor"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <OutputCard value={taxResult.postTax} label="Post-Tax Corpus" borderAccent="blue" />
          <OutputCard value={taxResult.taxPaid}  label="Tax Paid"       color="red"   borderAccent="red" />
          <div className="card text-center" style={{ borderTop: '3px solid #919090'}}>
            <p className="text-xs font-semibold uppercase" style={{ color: '#919090' }}>₹1L Exempt</p>
            <p className="output-number text-xl" style={{ color: '#919090' }}>₹1L / yr</p>
          </div>
        </div>

        <p className="text-xs italic" style={{ color: '#da3832' }}>
          * Simplified illustration. Assumes lump-sum redemption. Tax laws may change. Always consult a tax advisor.
        </p>
      </div>
    </DepthShell>
  );
}
