'use client';

import Link from 'next/link';
import { BookOpen, Calculator, ArrowRight } from 'lucide-react';
import { useLang } from '@/context/LangContext';

export default function Home() {
  const { t } = useLang();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden">
      
      {/* Background Decorators */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-20 pointer-events-none" 
        style={{ background: 'radial-gradient(circle, #224c87 0%, transparent 70%)', filter: 'blur(80px)' }} 
      />
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full opacity-10 pointer-events-none" 
        style={{ background: 'radial-gradient(circle, #da3832 0%, transparent 70%)', filter: 'blur(80px)' }} 
      />

      <div className="max-w-4xl w-full text-center relative z-10 fade-up">
        {/* Hero Copy */}
        <h1 
          className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight"
          style={{ 
            color: '#1a3a6b',
            fontFamily: 'Montserrat, sans-serif'
          }}
        >
          {t.landing.title1} <br/>
          <span style={{ color: '#da3832' }}>{t.landing.title2}</span>
        </h1>
        <p className="text-lg md:text-xl mb-16 opacity-80 max-w-2xl mx-auto" style={{ color: '#3a3a3a' }}>
          {t.landing.description}
        </p>

        {/* Dual Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          
          {/* Learn Card */}
          <Link href="/learn" className="group block focus:outline-none focus-visible:ring-4 focus-visible:ring-[#224c87] rounded-3xl">
            <div 
              className="card h-full p-8 md:p-10 flex flex-col items-center text-center transition-all duration-300 transform group-hover:-translate-y-2 group-hover:shadow-2xl"
              style={{ 
                background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(240,244,250,0.8) 100%)',
                border: '1px solid rgba(226,232,240,0.8)'
              }}
            >
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm transition-transform duration-300 group-hover:scale-110"
                style={{ background: 'linear-gradient(135deg, #224c87, #1a3a6b)' }}
              >
                <BookOpen className="text-white" size={32} strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-bold mb-3" style={{ color: '#224c87' }}>{t.landing.learnTitle}</h2>
              <p className="text-sm opacity-80 mb-8 flex-grow" style={{ color: '#3a3a3a' }}>
                {t.landing.learnDesc}
              </p>
              <span 
                className="flex items-center gap-2 font-semibold text-sm px-6 py-2.5 rounded-full transition-colors duration-300 group-hover:bg-[#224c87] group-hover:text-white"
                style={{ color: '#224c87', background: 'rgba(34,76,135,0.08)' }}
              >
                {t.landing.learnBtn} <ArrowRight size={16} />
              </span>
            </div>
          </Link>

          {/* Calculator Card */}
          <Link href="/calculator" className="group block focus:outline-none focus-visible:ring-4 focus-visible:ring-[#224c87] rounded-3xl">
            <div 
              className="card h-full p-8 md:p-10 flex flex-col items-center text-center transition-all duration-300 transform group-hover:-translate-y-2 group-hover:shadow-2xl"
              style={{ 
                background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,245,245,0.6) 100%)',
                border: '1px solid rgba(226,232,240,0.8)'
              }}
            >
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm transition-transform duration-300 group-hover:scale-110"
                style={{ background: 'linear-gradient(135deg, #da3832, #b92c27)' }}
              >
                <Calculator className="text-white" size={32} strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-bold mb-3" style={{ color: '#da3832' }}>{t.landing.calcTitle}</h2>
              <p className="text-sm opacity-80 mb-8 flex-grow" style={{ color: '#3a3a3a' }}>
                {t.landing.calcDesc}
              </p>
              <span 
                className="flex items-center gap-2 font-semibold text-sm px-6 py-2.5 rounded-full transition-colors duration-300 group-hover:bg-[#da3832] group-hover:text-white"
                style={{ color: '#da3832', background: 'rgba(218,56,50,0.08)' }}
              >
                {t.landing.calcBtn} <ArrowRight size={16} />
              </span>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}
