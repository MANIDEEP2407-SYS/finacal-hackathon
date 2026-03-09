'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { SevenDepthsCalculator } from '@/components/calculator/SevenDepthsCalculator';

export default function CalculatorPage() {
  const { state } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!state.onboardingDone) {
      router.replace('/onboarding');
    }
  }, [state.onboardingDone, router]);

  if (!state.onboardingDone) return null;

  return <SevenDepthsCalculator />;
}
