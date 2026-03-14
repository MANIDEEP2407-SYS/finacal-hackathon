'use client';

import Link from 'next/link';
import { BookOpen, TrendingUp, AlertTriangle, Calculator, ArrowRight, Wallet, Receipt } from 'lucide-react';
import { LearningTopic } from '@/components/learn/LearningTopic';
import { useLang } from '@/context/LangContext';

export default function LearnPage() {
  const { t } = useLang();

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden">
      {/* Background Decorators */}
      <div 
        className="fixed top-0 left-0 w-full h-[50vh] opacity-20 pointer-events-none z-[-1]" 
        style={{ background: 'linear-gradient(180deg, #e8eef7 0%, transparent 100%)' }} 
      />

      {/* Header Area */}
      <div className="max-w-4xl mx-auto px-4 pt-16 pb-12 md:pt-24 md:pb-16 text-center fade-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 font-semibold text-sm" style={{ background: 'rgba(34,76,135,0.1)', color: '#224c87' }}>
          <BookOpen size={16} /> {t.learn.masterclass}
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6" style={{ color: '#1a3a6b', fontFamily: 'Montserrat, sans-serif' }}>
          {t.learn.title}
        </h1>
        <p className="text-xl md:text-2xl max-w-2xl mx-auto opacity-80" style={{ color: '#3a3a3a' }}>
          {t.learn.subtitle}
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 fade-up" style={{ animationDelay: '0.1s' }}>
        
        <LearningTopic icon={TrendingUp} title={t.learn.topic1.title} subtitle={t.learn.topic1.sub}>
          <p>{t.learn.topic1.p1}</p>
          <p className="mt-4">{t.learn.topic1.p2}</p>
        </LearningTopic>

        <LearningTopic icon={BookOpen} title={t.learn.topic2.title} subtitle={t.learn.topic2.sub}>
          <p>{t.learn.topic2.p1}</p>
          <div className="mt-6 p-6 rounded-xl border border-blue-100" style={{ background: 'rgba(34,76,135,0.04)' }}>
            <p className="italic text-center text-xl font-medium" style={{ color: '#224c87' }}>
              "{t.learn.topic2.quote}"
            </p>
          </div>
          <p className="mt-6">{t.learn.topic2.p2}</p>
        </LearningTopic>

        <LearningTopic icon={AlertTriangle} title={t.learn.topic3.title} subtitle={t.learn.topic3.sub}>
          <p>{t.learn.topic3.p1}</p>
          <p className="mt-4">{t.learn.topic3.p2}</p>
        </LearningTopic>

        <LearningTopic icon={Wallet} title={t.learn.topic4.title} subtitle={t.learn.topic4.sub}>
          <p>{t.learn.topic4.p1}</p>
          <p className="mt-4">{t.learn.topic4.p2}</p>
        </LearningTopic>

        <LearningTopic icon={Receipt} title={t.learn.topic5.title} subtitle={t.learn.topic5.sub}>
          <p>{t.learn.topic5.p1}</p>
          <ul className="list-disc pl-5 mt-4 space-y-2">
            <li>{t.learn.topic5.l1}</li>
            <li>{t.learn.topic5.l2}</li>
          </ul>
        </LearningTopic>

        {/* Final CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a3a6b' }}>{t.learn.final.h}</h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            {t.learn.final.p}
          </p>
          <Link href="/onboarding" className="inline-block focus:outline-none focus-visible:ring-4 focus-visible:ring-[#da3832] rounded-full transition-transform hover:scale-105 active:scale-95">
            <button className="btn-primary text-lg px-10 py-5 flex items-center gap-3">
              <Calculator size={24} />
              {t.learn.final.btn}
              <ArrowRight size={20} />
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
