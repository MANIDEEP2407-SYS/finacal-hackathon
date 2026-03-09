'use client';
import { useMemo } from 'react';

interface GoalMountainProps {
  sipAmount: number;          // monthly SIP
  targetCorpus: number;       // inflated goal
  currentCorpus: number;      // current corpus (for compare)
  years: number;
  primaryColor?: string;
  compareColor?: string;
  compareCorpus?: number;
  hasFeeDrag?: boolean;
  feeDragAmount?: number;
  hasCrash?: boolean;
  crashAtYear?: number;
  label?: string;
}

/* Generates an SVG path from base to summit, optionally with a crash dip */
function buildPath(
  progress: number,         // 0..1 fraction of the way to summit
  hasCrash: boolean,
  crashFraction: number,    // 0..1 when crash happens
  width: number,
  height: number,
): string {
  const baseX = 40;
  const baseY = height - 20;
  const summitX = width - 40;
  const summitY = 30;

  const currentX = baseX + (summitX - baseX) * progress;
  const currentY = baseY + (summitY - baseY) * progress;

  if (!hasCrash || crashFraction >= progress) {
    // Smooth climb — quadratic bezier
    const cpX = baseX + (currentX - baseX) * 0.4;
    const cpY = baseY - 30;
    return `M ${baseX} ${baseY} Q ${cpX} ${cpY} ${currentX} ${currentY}`;
  }

  // Crash dip: climb to crash point, dip, then recover
  const crashX = baseX + (summitX - baseX) * crashFraction;
  const crashY = baseY + (summitY - baseY) * crashFraction;
  const dipY = crashY + 40;   // drops by 40px visually

  const midX = crashX + (currentX - crashX) * 0.5;
  const midY = crashY + (currentY - crashY) * 0.5;

  return `M ${baseX} ${baseY} ` +
    `Q ${baseX + (crashX - baseX) * 0.4} ${baseY - 20} ${crashX} ${crashY} ` +
    `L ${crashX + 15} ${dipY} ` +
    `Q ${midX} ${dipY - 10} ${currentX} ${currentY}`;
}

export function GoalMountain({
  sipAmount, targetCorpus, currentCorpus, years,
  primaryColor = '#224c87',
  compareColor = '#da3832',
  compareCorpus, hasFeeDrag = false, feeDragAmount = 0,
  hasCrash = false, crashAtYear = 5, label,
}: GoalMountainProps) {
  const W = 440;
  const H = 220;

  const progress = useMemo(() => Math.min(1, currentCorpus / targetCorpus), [currentCorpus, targetCorpus]);
  const compareProgress = useMemo(() => compareCorpus != null ? Math.min(1, compareCorpus / targetCorpus) : null, [compareCorpus, targetCorpus]);
  const crashFraction = crashAtYear / years;

  const primaryPath   = buildPath(progress, hasCrash, crashFraction, W, H);
  const comparePath   = compareProgress !== null ? buildPath(compareProgress, false, 0, W, H) : null;

  // Mountain outline
  const mountain = `M 20 ${H - 10} L ${W / 2} 15 L ${W - 20} ${H - 10} Z`;

  // Fee-drag shadow: show lost portion of summit
  const feePct = targetCorpus > 0 ? feeDragAmount / targetCorpus : 0;
  const feeShadowY = 15 + feePct * (H - 40);

  const summitX = W / 2;
  const summitY = 15;
  const endX = 20 + (W - 40) * progress;
  const endY = (H - 10) - (H - 25) * progress;

  return (
    <figure
      role="img"
      aria-label={label ?? `Goal Mountain: your SIP of ₹${sipAmount.toLocaleString('en-IN')}/month takes you ${Math.round(progress * 100)}% of the way to your goal.`}
      className="w-full"
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block" aria-hidden="true">
        <defs>
          <linearGradient id="mtnGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#e8eef7" />
            <stop offset="100%" stopColor="#c8d8ee" />
          </linearGradient>
          <linearGradient id="pathGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor={primaryColor} stopOpacity="0.8"/>
            <stop offset="100%" stopColor={primaryColor} />
          </linearGradient>
        </defs>

        {/* Mountain body */}
        <path d={mountain} fill="url(#mtnGrad)" stroke="#c0ccdd" strokeWidth="1" />

        {/* Fee drag shadow (hatched) */}
        {hasFeeDrag && feeDragAmount > 0 && (
          <path
            d={`M ${summitX - 10} ${summitY} L ${summitX + 10} ${summitY} L ${summitX + 10} ${feeShadowY} L ${summitX - 10} ${feeShadowY} Z`}
            fill="#da3832" fillOpacity="0.18" stroke="#da3832" strokeWidth="0.5" strokeDasharray="3 2"
          />
        )}

        {/* Goal summit flag */}
        <line x1={summitX} y1={summitY} x2={summitX} y2={summitY + 22} stroke={primaryColor} strokeWidth="1.5"/>
        <polygon points={`${summitX},${summitY - 1} ${summitX + 12},${summitY + 6} ${summitX},${summitY + 12}`} fill={primaryColor} />

        {/* Compare path */}
        {comparePath && (
          <path d={comparePath} stroke={compareColor} strokeWidth="2" fill="none" strokeDasharray="5 3" strokeLinecap="round" opacity="0.7"/>
        )}

        {/* Primary climber path */}
        <path d={primaryPath} stroke={primaryColor} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.9"/>

        {/* Current position dot */}
        <circle cx={endX} cy={endY} r="5" fill="#fff" stroke={primaryColor} strokeWidth="2.5"/>

        {/* Progress label */}
        <text x={endX + 8} y={endY - 6} fontSize="11" fontWeight="700" fill={primaryColor} fontFamily="Montserrat, Arial, sans-serif">
          {Math.round(progress * 100)}%
        </text>

        {/* Crash marker */}
        {hasCrash && (
          <g>
            <line
              x1={20 + (W - 40) * crashFraction}
              y1={(H - 10) - (H - 25) * crashFraction - 20}
              x2={20 + (W - 40) * crashFraction}
              y2={(H - 10) - (H - 25) * crashFraction + 5}
              stroke="#da3832" strokeWidth="1.5" strokeDasharray="3 2"
            />
            <text
              x={20 + (W - 40) * crashFraction + 4}
              y={(H - 10) - (H - 25) * crashFraction - 22}
              fontSize="9" fill="#da3832" fontFamily="Montserrat, Arial, sans-serif" fontWeight="600"
            >
              CRASH
            </text>
          </g>
        )}

        {/* Baseline */}
        <line x1="20" y1={H - 10} x2={W - 20} y2={H - 10} stroke="#919090" strokeWidth="0.5"/>
      </svg>

      {/* Screen reader caption */}
      <figcaption className="sr-only">
        Your SIP of ₹{sipAmount.toLocaleString('en-IN')}/month puts you at {Math.round(progress * 100)}% of your goal.
        {hasCrash && ` A market crash is shown at year ${crashAtYear}, followed by recovery.`}
        {hasFeeDrag && feeDragAmount > 0 && ` Expense ratio reduces your peak corpus by ₹${feeDragAmount.toLocaleString('en-IN')}.`}
      </figcaption>
    </figure>
  );
}
