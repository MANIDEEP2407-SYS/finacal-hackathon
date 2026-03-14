import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function LearningTopic({ icon: Icon, title, subtitle, children }: Props) {
  return (
    <div className="card mb-12 p-8 md:p-12 relative overflow-hidden group">
      {/* Subtle hover gradient background */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, rgba(34,76,135,0.03) 0%, rgba(218,56,50,0.03) 100%)' }}
      />

      <div className="flex items-start gap-5 mb-8 relative z-10">
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
          style={{ background: 'linear-gradient(135deg, #224c87, #1a3a6b)' }}
        >
          <Icon className="text-white" size={28} strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold mb-1" style={{ color: '#1a3a6b', fontFamily: 'Montserrat, sans-serif' }}>
            {title}
          </h2>
          <p className="text-xs font-semibold tracking-wide uppercase" style={{ color: '#da3832' }}>
            {subtitle}
          </p>
        </div>
      </div>

      <div className="prose prose-blue max-w-none relative z-10 text-gray-700 leading-relaxed text-base">
        {children}
      </div>
    </div>
  );
}
