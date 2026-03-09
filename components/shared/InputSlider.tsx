'use client';
import { useRef, useEffect, useCallback } from 'react';

interface Props {
  id: string;
  label: string;
  hint?: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
  unit?: string;
  error?: string;
}

export function InputSlider({ id, label, hint, min, max, step, value, onChange, format, unit, error }: Props) {
  const sliderRef = useRef<HTMLInputElement>(null);
  const pct = ((value - min) / (max - min)) * 100;

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.setProperty('--pct', `${pct}%`);
    }
  }, [pct]);

  const handleSlider = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  }, [onChange]);

  const handleNumber = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    if (!isNaN(v) && v >= min && v <= max) onChange(v);
  }, [onChange, min, max]);

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-1">
        <label htmlFor={`${id}-num`} className="input-label">
          {label}
          {hint && (
            <span
              className="ml-1 text-xs font-normal cursor-help"
              style={{ color: '#919090' }}
              title={hint}
              aria-label={hint}
            >
              ⓘ
            </span>
          )}
        </label>
        <span className="text-sm font-bold" style={{ color: '#224c87', fontVariantNumeric: 'tabular-nums' }}>
          {format(value)}{unit}
        </span>
      </div>

      {/* Paired slider + number — both control the same value */}
      <input
        ref={sliderRef}
        type="range"
        id={`${id}-slider`}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleSlider}
        className="range-slider w-full mb-2"
        aria-labelledby={`${id}-label`}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={format(value)}
        aria-describedby={error ? `${id}-error` : undefined}
      />

      <input
        type="number"
        id={`${id}-num`}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleNumber}
        className="w-full border rounded px-3 py-2 text-sm"
        style={{ borderColor: error ? '#da3832' : '#d0d8e8', fontVariantNumeric: 'tabular-nums' }}
        aria-label={label}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs" style={{ color: '#da3832' }}>
          {error}
        </p>
      )}
    </div>
  );
}
