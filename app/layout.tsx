import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { SkipLink } from '@/components/layout/SkipLink';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { KnowledgeBot } from '@/components/bot/KnowledgeBot';
import { FloatingBotButton } from '@/components/bot/BotTrigger';
import { LangProvider } from '@/context/LangContext';
import { UserProvider } from '@/context/UserContext';
import { ScenarioProvider } from '@/context/ScenarioContext';
import { ModeProvider } from '@/context/ModeContext';
import { CalculatorProvider } from '@/context/CalculatorContext';
import { BotProvider } from '@/context/BotContext';

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
            <ModeProvider>
              <CalculatorProvider>
                <ScenarioProvider>
                  <BotProvider>
                    <SkipLink />
                    <SiteHeader />
                    <main id="main-content" className="flex-1" tabIndex={-1}>
                      {children}
                    </main>
                    <KnowledgeBot />
                    <FloatingBotButton />
                    <SiteFooter />
                  </BotProvider>
                </ScenarioProvider>
              </CalculatorProvider>
            </ModeProvider>
          </UserProvider>
        </LangProvider>
      </body>
    </html>
  );
}
