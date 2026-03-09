'use client';
interface Props { message: string; }
export function LiveRegion({ message }: Props) {
  return (
    <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </div>
  );
}
