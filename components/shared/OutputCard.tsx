'use client';
import { useEffect, useRef, useState } from 'react';

interface Props {
  value: string;
  label: string;
  sublabel?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'red' | 'green';
  borderAccent?: 'blue' | 'red';
}

export function OutputCard({ value, label, sublabel, size = 'md', color = 'blue', borderAccent }: Props) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    if (value !== prevRef.current) {
      setDisplay(value);
      prevRef.current = value;
    }
  }, [value]);

  const sizeClass = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-lg' : 'text-2xl';
  const colorStyle = color === 'red' ? '#da3832' : color === 'green' ? '#16a34a' : '#224c87';

  return (
    <div
      className={`card p-4 ${borderAccent === 'red' ? 'card-red-border' : borderAccent === 'blue' ? 'card-blue-border' : ''}`}
      role="region"
      aria-label={label}
    >
      <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#919090' }}>
        {label}
      </p>
      <p
        className={`output-number ${sizeClass} count-flash`}
        key={value}
        style={{ color: colorStyle, fontVariantNumeric: 'tabular-nums' }}
        aria-live="polite"
        aria-atomic="true"
      >
        {display}
      </p>
      {sublabel && (
        <p className="text-xs mt-1" style={{ color: '#919090' }}>{sublabel}</p>
      )}
    </div>
  );
}
