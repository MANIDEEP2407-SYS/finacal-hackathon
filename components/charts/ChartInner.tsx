'use client';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Legend,
} from 'recharts';
import type { YearSnapshot } from '@/lib/goalEngine';
import { Money } from '@/lib/money';

interface Props { data: YearSnapshot[]; inflatedGoal: number; }

export default function ChartInner({ data, inflatedGoal }: Props) {
  const chartData = data.map(d => ({
    year: `Y${d.year}`,
    corpus:   Math.round(d.rawCorpus),
    invested: Math.round(d.rawInvested),
  }));

  const fmt = (v: number) => Money.formatCompact(v);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="corpusGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#224c87" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#224c87" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="investedGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#3d6aad" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#3d6aad" stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e8eef7" />
        <XAxis
          dataKey="year" tick={{ fontSize: 11, fill: '#919090' }}
          axisLine={false} tickLine={false}
        />
        <YAxis
          tickFormatter={fmt} tick={{ fontSize: 10, fill: '#919090' }}
          axisLine={false} tickLine={false} width={60}
        />
        <Tooltip
          formatter={(value: number, name: string) => [Money.format(value), name === 'corpus' ? 'Corpus Value' : 'Amount Invested']}
          labelFormatter={l => `${l}`}
          contentStyle={{ borderColor: '#224c87', borderRadius: 8, fontSize: 13 }}
        />
        <Legend
          formatter={v => v === 'corpus' ? 'Corpus Value' : 'Amount Invested'}
          wrapperStyle={{ fontSize: 12, color: '#3a3a3a' }}
        />
        <ReferenceLine
          y={inflatedGoal}
          stroke="#da3832"
          strokeDasharray="6 3"
          strokeWidth={1.5}
          label={{ value: 'Goal', position: 'insideTopRight', fill: '#da3832', fontSize: 11 }}
        />
        <Area
          type="monotone" dataKey="invested" name="invested"
          stroke="#3d6aad" strokeWidth={1.5}
          fill="url(#investedGrad)"
          animationDuration={1000}
        />
        <Area
          type="monotone" dataKey="corpus" name="corpus"
          stroke="#224c87" strokeWidth={2}
          fill="url(#corpusGrad)"
          animationDuration={1200}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
