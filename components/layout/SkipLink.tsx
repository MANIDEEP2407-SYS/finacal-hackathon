'use client';
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only bg-hdfc-blue text-white font-semibold px-4 py-2 rounded z-50"
      style={{ position: 'absolute', top: 8, left: 8 }}
    >
      Skip to main content
    </a>
  );
}
