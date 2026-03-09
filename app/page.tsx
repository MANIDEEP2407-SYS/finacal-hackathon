import { redirect } from 'next/navigation';

// Root page — redirect to onboarding on first visit (handled client-side).
// This server component just redirects to /calculator as default.
// The real first-visit detection is in /calculator/page.tsx (client component).
export default function Home() {
  redirect('/calculator');
}
