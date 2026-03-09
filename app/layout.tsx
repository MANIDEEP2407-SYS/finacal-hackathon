import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { SkipLink } from '@/components/layout/SkipLink';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { LangProvider } from '@/context/LangContext';
import { UserProvider } from '@/context/UserContext';
import { ScenarioProvider } from '@/context/ScenarioContext';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FinCal — Goal-Based Investment Calculator | HDFC Mutual Fund',
  description: 'Calculate how much you need to invest monthly to reach your financial goals. Educational tool by HDFC Mutual Fund.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="flex flex-col min-h-screen bg-hdfc-grey-light">
        <LangProvider>
          <UserProvider>
            <ScenarioProvider>
              <SkipLink />
              <SiteHeader />
              <main id="main-content" className="flex-1" tabIndex={-1}>
                {children}
              </main>
              <SiteFooter />
            </ScenarioProvider>
          </UserProvider>
        </LangProvider>
      </body>
    </html>
  );
}
