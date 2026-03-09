'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Legend } from 'recharts';
import { Money } from '@/lib/money';
import type { CrashPoint } from '@/lib/crashEngine';

interface Props { data: CrashPoint[]; crashAtYear: number; }

export default function CrashChartInner({ data, crashAtYear }: Props) {
  const every3 = data.filter(d => d.month % 6 === 0);
  const crashMonth = crashAtYear * 12;
  const chartData = every3.map(d => ({
    mo: `M${d.month}`,
    continued: d.corpus_continued,
    stopped:   d.corpus_stopped,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="contGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#224c87" stopOpacity={0.2}/>
            <stop offset="95%" stopColor="#224c87" stopOpacity={0.01}/>
          </linearGradient>
          <linearGradient id="stopGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#da3832" stopOpacity={0.15}/>
            <stop offset="95%" stopColor="#da3832" stopOpacity={0.01}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e8eef7" />
        <XAxis dataKey="mo" tick={{ fontSize: 9, fill: '#919090'}} axisLine={false} tickLine={false} interval={3}/>
        <YAxis tickFormatter={v => Money.formatCompact(v)} tick={{ fontSize: 9, fill: '#919090'}} axisLine={false} tickLine={false} width={54}/>
        <Tooltip formatter={(v: number, n: string) => [Money.format(v), n === 'continued' ? 'Continued SIP' : 'Paused SIP']} contentStyle={{ fontSize: 11, borderRadius: 8, borderColor: '#224c87' }} />
        <Legend formatter={v => v === 'continued' ? 'Continued SIP' : 'Paused SIP'} wrapperStyle={{ fontSize: 11 }} />
        <ReferenceLine x={`M${crashMonth}`} stroke="#da3832" strokeDasharray="4 2" label={{ value: 'Crash', fill: '#da3832', fontSize: 9 }}/>
        <Area type="monotone" dataKey="stopped" stroke="#da3832" strokeWidth={1.5} fill="url(#stopGrad)" dot={false}/>
        <Area type="monotone" dataKey="continued" stroke="#224c87" strokeWidth={2} fill="url(#contGrad)" dot={false}/>
      </AreaChart>
    </ResponsiveContainer>
  );
}
