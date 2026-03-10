'use client';
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'ta', label: 'தமிழ்' },
];

export type LangCode = 'en' | 'hi' | 'ta';

/* ── Locale strings ── */
const LOCALES = {
  en: {
    app: { title: 'FinCal', subtitle: 'Goal-Based Investment Calculator' },
    onboarding: {
      headline: 'Personalise Your Learning Experience',
      sub: 'Answer 3 quick questions to get started',
      skip: 'Skip — take me to the calculator',
      begin: 'Show My Learning Path',
      q1: { text: 'Have you ever invested in a mutual fund before?', options: ['Never — I\'m just starting out', 'A few times — I know the basics', 'Regularly — I invest every month'] },
      q2: { text: 'What is your main financial goal today?', options: ['Save for my child\'s education', 'Buy a house or car', 'Build a retirement corpus', 'Grow general wealth'] },
      q3: { text: 'How familiar are you with terms like "SIP", "NAV", or "expense ratio"?', options: ['Not familiar at all', 'I\'ve heard them but not sure', 'I understand them well'] },
    },
    presets: {
      title: 'Choose a Goal to Get Started',
      education: 'Child\'s Education', home: 'Home Purchase',
      car: 'Car Purchase', retirement: 'Retirement',
    },
    inputs: {
      currentCost: 'Current Cost of Goal (₹)',
      years: 'Years to Goal',
      inflation: 'Inflation Rate (%)',
      return: 'Expected Annual Return (%)',
      stepUp: 'Annual SIP Increase (%)',
      expenseRatio: 'Expense Ratio (%)',
      taxRate: 'LTCG Tax Rate (%)',
    },
    results: {
      inflatedGoal: 'Goal After Inflation',
      requiredSIP: 'Required Monthly SIP',
      totalInvested: 'Total You Invest',
      wealthGained: 'Wealth Gained',
      stepUpSIP: 'Starting SIP (with step-up)',
    },
    education: {
      whatMeansTitle: 'What does this mean?',
      howCalculatedTitle: 'How is this calculated?',
      yearTableTitle: 'Year-by-Year Breakdown',
      stepUpTitle: 'Step-Up SIP — Additional Illustration',
      expenseTitle: 'Expense Ratio Impact — Additional Illustration',
      taxTitle: 'Tax Consideration — Additional Illustration',
      scenarioTitle: 'Compare Two Scenarios',
      stepUpNote: '* Illustrative estimate. Actual results may vary.',
      expenseNote: '* Illustrative. Actual expense ratios vary by fund.',
      taxNote: '* Simplified illustration. Tax laws may change. Consult a tax advisor.',
    },
    formula: {
      step1: 'Step 1 — Inflate your goal',
      step1formula: 'Future Goal = Present Cost × (1 + Inflation)^Years',
      step2: 'Step 2 — Calculate required SIP',
      step2formula: 'Required SIP = FV × r ÷ [((1+r)^n − 1) × (1+r)]',
      where: 'Where FV = inflated goal, r = monthly return rate, n = total months',
    },
    table: { year: 'Year', invested: 'Invested', corpus: 'Corpus Value', progress: 'Goal %' },
    insights: {
      feasible: (pct: number) => `✅ Great news! This SIP is only ${pct}% of your salary — very manageable.`,
      moderate: (pct: number) => `⚡ This SIP is ${pct}% of your salary. Achievable with discipline.`,
      stretch: (pct: number) => `⚠️ At ${pct}% of your salary, consider a longer timeline or step-up SIP.`,
      interestExceeds: '🏆 After this point, your investment gains exceed what you\'re putting in!',
      stepupSavings: (saved: string) => `💡 Step-up reduces your starting SIP by ${saved}/mo compared to a flat SIP.`,
    },
    accessibility: { liveResults: (sip: string, goal: string) => `Updated: Required monthly SIP is ${sip} to reach your goal of ${goal}` },
    bot: { panelLabel: 'Knowledge Bot', title: 'FinCal Knowledge Bot', close: 'Close', buttonLabel: 'Ask Bot', openLabel: 'Open Knowledge Bot', learnAbout: 'Learn about', learnMore: 'Learn more' },
  },
  hi: {
    app: { title: 'FinCal', subtitle: 'लक्ष्य-आधारित निवेश कैलकुलेटर' },
    onboarding: {
      headline: 'अपना सीखने का अनुभव वैयक्तिकृत करें',
      sub: 'शुरुआत के लिए 3 त्वरित प्रश्नों के उत्तर दें',
      skip: 'छोड़ें — सीधे कैलकुलेटर पर जाएं',
      begin: 'मेरा लर्निंग पाथ दिखाएं',
      q1: { text: 'क्या आपने कभी म्यूचुअल फंड में निवेश किया है?', options: ['कभी नहीं — मैं अभी शुरुआत कर रहा हूं', 'कुछ बार — मैं मूल बातें जानता हूं', 'नियमित — मैं हर महीने निवेश करता हूं'] },
      q2: { text: 'आज आपका मुख्य वित्तीय लक्ष्य क्या है?', options: ['बच्चे की शिक्षा के लिए बचत', 'घर या कार खरीदना', 'रिटायरमेंट कोष बनाना', 'सामान्य धन वृद्धि'] },
      q3: { text: '"SIP", "NAV", "एक्सपेंस रेशियो" जैसे शब्दों से कितना परिचित हैं?', options: ['बिल्कुल नहीं', 'सुना है लेकिन पूरी तरह नहीं समझता', 'अच्छी तरह समझता हूं'] },
    },
    presets: { title: 'शुरू करने के लिए एक लक्ष्य चुनें', education: 'बच्चे की शिक्षा', home: 'घर खरीदना', car: 'कार खरीदना', retirement: 'सेवानिवृत्ति' },
    inputs: { currentCost: 'लक्ष्य की वर्तमान लागत (₹)', years: 'लक्ष्य तक वर्ष', inflation: 'महंगाई दर (%)', return: 'अपेक्षित वार्षिक रिटर्न (%)', stepUp: 'वार्षिक SIP वृद्धि (%)', expenseRatio: 'व्यय अनुपात (%)', taxRate: 'LTCG कर दर (%)' },
    results: { inflatedGoal: 'मुद्रास्फीति के बाद लक्ष्य', requiredSIP: 'आवश्यक मासिक SIP', totalInvested: 'कुल निवेश', wealthGained: 'अर्जित धन', stepUpSIP: 'प्रारंभिक SIP (स्टेप-अप सहित)' },
    education: { whatMeansTitle: 'इसका क्या मतलब है?', howCalculatedTitle: 'यह कैसे गणना की जाती है?', yearTableTitle: 'वर्ष-दर-वर्ष विवरण', stepUpTitle: 'स्टेप-अप SIP — अतिरिक्त उदाहरण', expenseTitle: 'व्यय अनुपात प्रभाव — उदाहरण', taxTitle: 'कर विचार — उदाहरण', scenarioTitle: 'दो परिदृश्यों की तुलना करें', stepUpNote: '* अनुमानित। वास्तविक परिणाम भिन्न हो सकते हैं।', expenseNote: '* व्यय अनुपात फंड के अनुसार अलग होता है।', taxNote: '* सरलीकृत उदाहरण। कर सलाहकार से परामर्श करें।' },
    formula: { step1: 'चरण 1 — लक्ष्य को महंगाई के अनुसार बढ़ाएं', step1formula: 'भविष्य लक्ष्य = वर्तमान लागत × (1 + महंगाई दर)^वर्ष', step2: 'चरण 2 — आवश्यक SIP गणना करें', step2formula: 'SIP = FV × r ÷ [((1+r)^n − 1) × (1+r)]', where: 'FV = महंगाई लक्ष्य, r = मासिक दर, n = कुल महीने' },
    table: { year: 'वर्ष', invested: 'निवेशित', corpus: 'कोष मूल्य', progress: 'लक्ष्य %' },
    insights: { feasible: (pct: number) => `✅ ${pct}% वेतन — बहुत प्रबंधनीय!`, moderate: (pct: number) => `⚡ ${pct}% वेतन। अनुशासन से प्राप्त करने योग्य।`, stretch: (pct: number) => `⚠️ ${pct}% वेतन। लंबा समय या स्टेप-अप SIP विचार करें।`, interestExceeds: '🏆 इस बिंदु के बाद, आपका लाभ आपके निवेश से अधिक!', stepupSavings: (saved: string) => `💡 स्टेप-अप से प्रारंभिक SIP ${saved}/माह कम।` },
    accessibility: { liveResults: (sip: string, goal: string) => `अपडेट: ${goal} के लिए आवश्यक मासिक SIP ${sip} है` },
  },
  ta: {
    app: { title: 'FinCal', subtitle: 'இலக்கு அடிப்படையிலான முதலீட்டு கணக்கீட்டு கருவி' },
    onboarding: {
      headline: 'உங்கள் கற்றல் அனுபவத்தை தனிப்பயனாக்குங்கள்',
      sub: 'தொடங்க 3 கேள்விகளுக்கு பதிலளிக்கவும்',
      skip: 'தவிர்க்கவும் — கணக்கீட்டு கருவிக்கு செல்லவும்',
      begin: 'என் கற்றல் பாதையை காட்டு',
      q1: { text: 'நீங்கள் எப்போதாவது மியூச்சுவல் ஃபண்டில் முதலீடு செய்தீர்களா?', options: ['ஒருபோதும் இல்லை', 'சில முறை', 'தவறாமல் முதலீடு செய்கிறேன்'] },
      q2: { text: 'உங்கள் முக்கிய நிதி இலக்கு என்ன?', options: ['குழந்தையின் கல்வி', 'வீடு அல்லது கார் வாங்குதல்', 'ஓய்வூதிய நிதி', 'பொது செல்வம்'] },
      q3: { text: '"SIP", "NAV", "செலவு விகிதம்" என்ற வார்த்தைகள் உங்களுக்கு எவ்வளவு தெரியும்?', options: ['அறிமுகமே இல்லை', 'கேட்டிருக்கிறேன் ஆனால் புரியவில்லை', 'நன்றாக புரிகிறது'] },
    },
    presets: { title: 'ஒரு இலக்கை தேர்ந்தெடுக்கவும்', education: 'கல்வி', home: 'வீடு வாங்குதல்', car: 'கார் வாங்குதல்', retirement: 'ஓய்வூதியம்' },
    inputs: { currentCost: 'இலக்கின் தற்போதைய செலவு (₹)', years: 'இலக்கு வரை ஆண்டுகள்', inflation: 'பணவீக்க விகிதம் (%)', return: 'எதிர்பார்க்கப்படும் வருமானம் (%)', stepUp: 'வருடாந்திர SIP அதிகரிப்பு (%)', expenseRatio: 'செலவு விகிதம் (%)', taxRate: 'LTCG வரி விகிதம் (%)' },
    results: { inflatedGoal: 'பணவீக்கத்திற்கு பின் இலக்கு', requiredSIP: 'தேவையான மாதாந்திர SIP', totalInvested: 'மொத்த முதலீடு', wealthGained: 'ஈட்டிய செல்வம்', stepUpSIP: 'தொடக்க SIP (நிலை-உயர்வு உடன்)' },
    education: { whatMeansTitle: 'இதன் அர்த்தம் என்ன?', howCalculatedTitle: 'இது எப்படி கணக்கிடப்படுகிறது?', yearTableTitle: 'வருடாந்திர விவரம்', stepUpTitle: 'நிலை-உயர்வு SIP — கூடுதல் விளக்கம்', expenseTitle: 'செலவு விகித தாக்கம் — விளக்கம்', taxTitle: 'வரி விஷயம் — விளக்கம்', scenarioTitle: 'இரண்டு சூழ்நிலைகளை ஒப்பிடுக', stepUpNote: '* மதிப்பீட்டு விளக்கம். உண்மையான முடிவுகள் மாறலாம்.', expenseNote: '* செலவு விகிதம் நிதிக்கு பொறுத்து மாறும்.', taxNote: '* எளிமைப்படுத்தப்பட்ட விளக்கம். வரி ஆலோசகரிடம் கேளுங்கள்.' },
    formula: { step1: 'படி 1 — இலக்கை பணவீக்கத்திற்கு ஏற்ப மாற்றவும்', step1formula: 'எதிர்கால இலக்கு = தற்போதைய செலவு × (1 + பணவீக்கம்)^ஆண்டுகள்', step2: 'படி 2 — தேவையான SIP கணக்கிடவும்', step2formula: 'SIP = FV × r ÷ [((1+r)^n − 1) × (1+r)]', where: 'FV = பணவீக்க இலக்கு, r = மாதாந்திர விகிதம், n = மொத்த மாதங்கள்' },
    table: { year: 'ஆண்டு', invested: 'முதலீட்டு', corpus: 'நிதி மதிப்பு', progress: 'இலக்கு %' },
    insights: { feasible: (pct: number) => `✅ ${pct}% சம்பளம் — மிகவும் நிர்வகிக்கக்கூடியது!`, moderate: (pct: number) => `⚡ ${pct}% சம்பளம். ஒழுக்கத்துடன் சாத்தியம்.`, stretch: (pct: number) => `⚠️ ${pct}% சம்பளம். நீண்ட கால அல்லது நிலை-உயர்வு SIP பரிசீலிக்கவும்.`, interestExceeds: '🏆 இந்த நேரத்தில் உங்கள் லாபம் முதலீட்டை மீறியது!', stepupSavings: (saved: string) => `💡 நிலை-உயர்வு தொடக்க SIPஐ ${saved}/மாதம் குறைக்கிறது.` },
    accessibility: { liveResults: (sip: string, goal: string) => `புதுப்பிக்கப்பட்டது: ${goal} இலக்கிற்கு தேவையான மாதாந்திர SIP ${sip}` },
  },
} as const;

export type LocaleType = typeof LOCALES.en;

interface LangCtx { lang: LangCode; t: LocaleType; setLang: (l: string) => void; langs: typeof LANGS; }

const LangContext = createContext<LangCtx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(() => {
    try { return (localStorage.getItem('fincal-lang') as LangCode) || 'en'; } catch { return 'en'; }
  });
  const setLang = useCallback((l: string) => {
    setLangState(l as LangCode);
    try { localStorage.setItem('fincal-lang', l); } catch { /* */ }
  }, []);
  const t = LOCALES[lang] as LocaleType;
  return <LangContext.Provider value={{ lang, t, setLang, langs: LANGS }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be inside LangProvider');
  return ctx;
}
