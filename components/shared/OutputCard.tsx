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

  const sizeClass = size === 'lg' ? 'text-lg sm:text-xl lg:text-2xl' : size === 'sm' ? 'text-xs sm:text-sm' : 'text-sm sm:text-base lg:text-lg';
  const colorStyle = color === 'red' ? '#da3832' : color === 'green' ? '#16a34a' : '#224c87';

  return (
    <div
      className={`card p-3 sm:p-4 min-w-0 ${borderAccent === 'red' ? 'card-red-border' : borderAccent === 'blue' ? 'card-blue-border' : ''}`}
      role="region"
      aria-label={label}
    >
      <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1 whitespace-nowrap overflow-hidden text-ellipsis" style={{ color: '#919090' }}>
        {label}
      </p>
      <p
        className={`output-number ${sizeClass} count-flash whitespace-nowrap`}
        key={value}
        style={{ color: colorStyle, fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}
        aria-live="polite"
        aria-atomic="true"
        title={display}
      >
        {display}
      </p>
      {sublabel && (
        <p className="text-xs mt-1 truncate" style={{ color: '#919090' }}>{sublabel}</p>
      )}
    </div>
  );
}
