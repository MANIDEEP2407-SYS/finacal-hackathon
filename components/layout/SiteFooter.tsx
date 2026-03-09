'use client';
import { useLang } from '@/context/LangContext';

const DISCLAIMER = 'This tool has been designed for information purposes only. Actual results may vary depending on various factors involved in capital market. Investor should not consider above as a recommendation for any schemes of HDFC Mutual Fund. Past performance may or may not be sustained in future and is not a guarantee of any future returns.';

export function SiteFooter() {
  const { t } = useLang();
  return (
    <footer role="contentinfo" className="bg-white border-t border-gray-200 mt-8">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Mandatory Disclaimer — verbatim, always visible */}
        <p className="disclaimer-text" aria-label="Investment disclaimer">
          {DISCLAIMER}
        </p>
        <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
          <p className="text-xs" style={{ color: '#919090' }}>
            © HDFC Mutual Fund · Investor Education & Awareness Initiative
          </p>
          <p className="text-xs" style={{ color: '#919090' }}>
            An AMFI Registered Mutual Fund
          </p>
        </div>
      </div>
    </footer>
  );
}
