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
      headline: 'Welcome to FinCal',
      sub: 'HDFC Investor Education',
      chooseLang: 'Choose your language to get started',
      setupProgress: 'Setup Progress',
      stepOf: (s: number, t: number) => `Step ${s} of ${t}`,
      levelTitle: 'How familiar are you with mutual fund investing?',
      levels: {
        beginner: { title: 'Just starting out', desc: "I'm new to investing" },
        intermediate: { title: 'I know the basics', desc: "I've invested before" },
        advanced: { title: "I'm experienced", desc: 'I invest regularly' },
      },
      goalTitle: 'What are you calculating for?',
      goals: {
        education: "Child's Education",
        home: 'Home / Property',
        vehicle: 'Vehicle',
        retirement: 'Retirement',
        custom: "Something else — I'll set my own goal",
      },
      setupWelcome: "Welcome! Here's your personalized setup.",
      setupDesc: (g: string, y: number) => `We've set up your calculator for ${g} in ${y} years.`,
      setupGuide: "We'll guide you step by step — starting with the most important number. All inputs are pre-filled, but you can adjust them as needed.",
      begin: "Let's Begin →",
    },
    presets: {
      title: 'Choose a Goal to Get Started',
      education: 'Child\'s Education', home: 'Home Purchase',
      car: 'Car Purchase', retirement: 'Retirement',
    },
    inputs: {
      currentCost: 'Current Cost of Goal (₹)',
      years: 'Years to Goal',
      yearsSuffix: 'yrs',
      inflation: 'Inflation Rate (%)',
      return: 'Expected Annual Return (%)',
      stepUp: 'Annual SIP Increase (%)',
      expenseRatio: 'Expense Ratio (%)',
      taxRate: 'LTCG Tax Rate (%)',
      hints: {
        years: 'How many years until you need this money?',
        inflation: 'Prices typically rise 5–7% per year in India',
        returns: 'Assumed return, not guaranteed. Equity funds historically ~10–14%',
        stepUp: 'How much you\'ll increase your SIP each year',
        expense: 'Annual fee charged by the fund, deducted from returns',
        tax: 'Long-term capital gains tax rate (currently 12.5%)',
      }
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
    accessibility: {
      liveResults: (sip: string, goal: string) => `Updated: Required monthly SIP is ${sip} to reach your goal of ${goal}`,
      mountainLabel: (sip: string, y: number) => `Goal Mountain: SIP of ${sip}/month over ${y} years`
    },
    bot: {
      panelTitle: 'FinCal Knowledge Bot',
      panelAria: 'Knowledge Bot — learn about financial concepts',
      askBot: 'Ask Bot',
      learnMore: 'Learn more',
      learnAbout: 'Learn about',
      close: 'Close knowledge bot',
      back: 'Back',
      backTo: (q: string) => `Go back to: ${q}`,
      relatedTitle: 'Related Questions',
      defaultsNotice: 'ℹ️ Numbers shown are based on example values. Fill in the calculator for personalized figures.',
      questions: {
        sip: 'What is a SIP?',
        inflation: 'What is inflation?',
        fees: 'What is an expense ratio?',
        crash: 'What happens in a market crash?',
        stepup: 'What is a step-up SIP?',
        tax: 'What is LTCG tax?',
      },
      categories: {
        'goal-basics': '🎯 Goal Basics',
        'inflation': '📈 Inflation',
        'returns': '💰 Returns',
        'fees': '💳 Fees',
        'tax': '🏛️ Tax',
        'market-behavior': '📊 Market Behavior',
        'sip-mechanics': '⚙️ SIP Mechanics',
        'optimization': '🚀 Optimization',
      }
    },
    common: {
      learn: 'Learn',
      calculator: 'Calculator',
      backToHome: 'Back to Home',
      proceedToCalc: 'Proceed to Calculator',
      whyMatters: 'Why this matters',
      showFormula: 'Show formula',
      hide: 'Hide',
      show: 'Show',
      years: 'Years',
      rupees: 'Rupees',
      next: 'Next',
      finish: 'Finish',
      unlockMessage: 'Level 7 Unlocked! You now have the full picture.',
      goalDetails: 'Your Goal Details',
      goalMountain: 'Your Goal Mountain',
      yourGoal: 'your goal',
      showMore: (n: number) => `Show me more · Depth ${n} / 7`,
      fullPicture: "🎉 You've unlocked the full picture — all 7 depths explored!",
    },
    levels: {
      foundations: "🌱 Foundations Mode",
      building: "📈 Building Up",
      advanced: "🎯 Advanced Mode",
    },
    landing: {
      title1: "Master Your",
      title2: "Financial Future",
      description: "Whether you want to learn the fundamentals of wealth building or dive straight into powerful SIP calculations, we have you covered.",
      learnTitle: "Learn Basics",
      learnDesc: "New to investing? Take our crash course on SIPs, Inflation, Compounding Interest, and Taxes.",
      learnBtn: "Start Learning",
      calcTitle: "Use Calculator",
      calcDesc: "Already know what you're doing? Jump right in and plan your goals across the 7 Depths of investing.",
      calcBtn: "Open Calculator"
    },
    learn: {
      masterclass: "SIP 101 Masterclass",
      title: "The Foundations of Wealth Creation",
      subtitle: "Before you calculate your targets, understand the financial engines that power your money.",
      topic1: {
        title: "Systematic Investment Plan",
        sub: "The Engine",
        p1: "A Systematic Investment Plan (SIP) is a simple yet powerful strategy where you invest a fixed amount of money at regular intervals—usually monthly—into a mutual fund.",
        p2: "Think of it as planting a seed every month. By consistently investing regardless of market conditions, you average out the purchase cost of your investments (Rupee Cost Averaging) and enforce financial discipline."
      },
      topic2: {
        title: "Compounding Interest",
        sub: "The Magic",
        p1: "Albert Einstein reportedly called compound interest the \"eighth wonder of the world.\" It occurs when the returns you earn on your investments begin to generate their own returns.",
        quote: "Time in the market beats timing the market.",
        p2: "The longer you leave your money invested, the more explosive the growth. In the later years of a 20-year SIP, the returns generated in a single year can often eclipse the total money you invested over the entire period."
      },
      topic3: {
        title: "Understanding Inflation",
        sub: "The Silent Thief",
        p1: "If you hide ₹1,000 under your mattress for 10 years, you still have ₹1,000. But the cost of goods will have risen. That is Inflation.",
        p2: "Historically averaging around 6% in India, inflation slowly erodes the purchasing power of your money. This means a goal that costs ₹25 Lakhs today might cost nearly ₹60 Lakhs in 15 years. To build real wealth, your investments must grow faster than the rate of inflation."
      },
      topic4: {
        title: "The Step-Up SIP",
        sub: "The Accelerator",
        p1: "As your career progresses, your salary typically increases. A Step-Up SIP mimics this by automatically increasing your monthly investment by a fixed percentage (e.g., 10%) every year.",
        p2: "By stepping up your investments, you can reach your financial goals significantly faster or build a much larger corpus without feeling the pinch on your initial budget."
      },
      topic5: {
        title: "Taxes & Fees",
        sub: "The Friction",
        p1: "Two things are certain: death and taxes. In investing, Expense Ratios and Taxes create friction that drags down your net returns.",
        l1: "Expense Ratio: The annual fee charged by mutual funds to manage your money (typically 0.5% - 1.5%).",
        l2: "LTCG Tax: Long Term Capital Gains tax. In India, equity gains over ₹1.25 Lakhs held for more than a year are currently taxed at 12.5%."
      },
      final: {
        h: "Ready to apply your knowledge?",
        p: "Now that you understand the mechanics of wealth creation, use our 7-Depths Calculator to map out your exact path to financial freedom.",
        btn: "Open the FinCal Calculator"
      }
    },
    depthData: {
      d1: {
        title: "The Number",
        hook: "Here's exactly what you need to save — instantly.",
        badge: "Baseline",
        formulaLabel: "PDF Formula: Baseline SIP",
        p1: "This is the minimum you need to invest every month to reach your goal, assuming a steady return. Think of it as your financial GPS — it tells you exactly where to go and how fast to get there."
      },
      d2: {
        title: "The Reality Check",
        hook: "\"Your goal today feels manageable. In 15 years? Not quite.\"",
        badge: "Inflation",
        formulaLabel: "PDF Formula: Inflation Adjustment",
        p1: (rate: number, years: number) => `Inflation is the silent tax on your savings. At ${rate}% per year, prices roughly double every ${years} years. If you plan for today's price, you'll fall short by the time you actually need the money.`,
        l1: "Today's Price",
        l2: (y: number) => `In ${y} Years`,
        hi: (m: string) => `Prices will be +${m}% higher. Your goal grows — that's the number we're actually targeting.`
      },
      d3: {
        title: "The Hidden Cost",
        hook: "\"Two funds, same returns — but one leaves you with lakhs less. The only difference: fees.\"",
        badge: "Expense Ratio",
        formulaLabel: "How fees drag returns",
        p1: (y: number) => `Expense ratio is the annual fee a mutual fund charges — deducted automatically every day. Like a gym membership that bills you even when you don't visit. Over ${y} years, even 1% difference compounds massively.`,
        label: "Your fund's expense ratio (%)",
        low: "Low-cost (0.5%)",
        yours: (r: string) => `Your fund (${r}%)`,
        consume: "Fees consume",
        note: "* Illustrative estimate. Actual fee impact depends on fund type and NAV movement. Not a recommendation."
      },
      d4: {
        title: "The Market Reality",
        hook: "\"A crash will happen. The only question is what you do when it does.\"",
        badge: "Crash Simulation",
        formulaLabel: "Deterministic NAV model",
        p1: "Markets have crashed and recovered every decade in India. The investors who continued their SIPs during the 2020 COVID crash bought units at the bottom. Time in market beats timing the market.",
        drop: "Market Drop (%)",
        year: "Crash at Year",
        recov: "Recovery (months)",
        cont: "Continued SIP ✅",
        pause: "Paused SIP ❌",
        hi: (a: string) => `Continuing your SIP through the crash earns you ${a} more by the end. Panic selling is the most expensive financial mistake.`,
        note: "* Illustrative model — not a prediction."
      },
      d5: {
        title: "The Optimisation",
        hook: "\"Increase your SIP by just a little each year. You'll need far less to start.\"",
        badge: "Step-Up SIP",
        formulaLabel: "Step-Up SIP formula",
        p1: "Your salary will likely grow over time. So can your SIP. A step-up SIP means you invest less today (when money is tighter) and more later (when you earn more). Everyone wins.",
        label: "Annual SIP Increase (%)",
        hint: "How much your SIP grows each year",
        flat: "Flat SIP (today)",
        start: "Step-Up Start",
        save: "You Save Today",
        glide: "Your SIP glide path over the years:",
        yr: (y: number) => `Year ${y}`,
        note: "* Illustrative estimate. Should match your income trajectory."
      },
      d6: {
        title: "The Tax Truth",
        hook: "\"Your corpus looks great — until the government takes its share.\"",
        badge: "LTCG Tax",
        formulaLabel: "LTCG calculation (simplified)",
        p1: (r: number) => `Long-term capital gains (LTCG) tax applies when you redeem units after 1 year. Currently ${r}% on gains above ₹1 lakh. Plan for this from day one — it's real money.`,
        label: "LTCG Tax Rate (%)",
        hint: "Currently 12.5% for equity MFs; consult a tax advisor",
        post: "Post-Tax Corpus",
        paid: "Tax Paid",
        exempt: "₹1L Exempt",
        note: "* Simplified illustration. Tax laws may change."
      },
      d7: {
        title: "The Full Picture",
        hook: "\"Your complete, honest, year-by-year roadmap from today to your goal.\"",
        badge: "Complete View",
        p1: "This is the unfiltered truth of your investment journey — every year, how much you've contributed, and how close you are to your goal. No surprises. Just your money, working.",
        h: "Horizon",
        ti: "Total Invested",
        fc: "Final Corpus",
        wg: "Wealth Gained"
      }
    }
  },
  hi: {
    app: { title: 'FinCal', subtitle: 'लक्ष्य-आधारित निवेश कैलकुलेटर' },
    onboarding: {
      headline: 'FinCal में आपका स्वागत है',
      sub: 'HDFC निवेशक शिक्षा',
      chooseLang: 'शुरू करने के लिए अपनी भाषा चुनें',
      setupProgress: 'सेटअप प्रगति',
      stepOf: (s: number, t: number) => `चरण ${s} का ${t}`,
      levelTitle: 'आप म्यूचुअल फंड निवेश से कितने परिचित हैं?',
      levels: {
        beginner: { title: 'अभी शुरुआत कर रहा हूँ', desc: "मैं निवेश में नया हूँ" },
        intermediate: { title: 'मैं मूल बातें जानता हूँ', desc: "मैंने पहले निवेश किया है" },
        advanced: { title: "मैं अनुभवी हूँ", desc: 'मैं नियमित रूप से निवेश करता हूँ' },
      },
      goalTitle: 'आप किसके लिए गणना कर रहे हैं?',
      goals: {
        education: "बच्चे की शिक्षा",
        home: 'घर / संपत्ति',
        vehicle: 'वाहन',
        retirement: 'रिटायरमेंट',
        custom: "कुछ और — मैं अपना लक्ष्य खुद तय करूँगा",
      },
      setupWelcome: "स्वागत है! यहाँ आपका व्यक्तिगत सेटअप है।",
      setupDesc: (g: string, y: number) => `हमने ${y} वर्षों में ${g} के लिए आपका कैलकुलेटर सेट किया है।`,
      setupGuide: "हम आपको चरण दर चरण मार्गदर्शन करेंगे — सबसे महत्वपूर्ण संख्या से शुरू करते हुए। सभी इनपुट प्री-फिल्ड हैं, लेकिन आप उन्हें आवश्यकतानुसार समायोजित कर सकते हैं।",
      begin: "चलो शुरू करें →",
    },
    presets: { title: 'शुरू करने के लिए एक लक्ष्य चुनें', education: 'बच्चे की शिक्षा', home: 'घर खरीदना', car: 'कार खरीदना', retirement: 'सेवानिवृत्ति' },
    inputs: {
      currentCost: 'लक्ष्य की वर्तमान लागत (₹)',
      years: 'लक्ष्य तक वर्ष',
      yearsSuffix: 'वर्ष',
      inflation: 'मुद्रास्फीति दर (%)',
      return: 'अपेक्षित वार्षिक रिटर्न (%)',
      stepUp: 'वार्षिक SIP वृद्धि (%)',
      expenseRatio: 'व्यय अनुपात (%)',
      taxRate: 'LTCG टैक्स दर (%)',
      hints: {
        years: 'आपको इस पैसे की आवश्यकता होने तक कितने वर्ष हैं?',
        inflation: 'भारत में कीमतें आमतौर पर हर साल 5-7% बढ़ती हैं',
        returns: 'मान लिया गया रिटर्न, गारंटीकृत नहीं। इक्विटी फंड ऐतिहासिक रूप से ~10-14%',
        stepUp: 'आप हर साल अपनी SIP कितनी बढ़ाएंगे',
        expense: 'फंड द्वारा लिया जाने वाला वार्षिक शुल्क, रिटर्न से काटा जाता है',
        tax: 'दीर्घकालिक पूंजीगत लाभ कर दर (वर्तमान में 12.5%)',
      }
    },
    results: { inflatedGoal: 'मुद्रास्फीति के बाद लक्ष्य', requiredSIP: 'आवश्यक मासिक SIP', totalInvested: 'कुल निवेश', wealthGained: 'अर्जित धन', stepUpSIP: 'प्रारंभिक SIP (स्टेप-अप सहित)' },
    education: { whatMeansTitle: 'इसका क्या मतलब है?', howCalculatedTitle: 'यह कैसे गणना की जाती है?', yearTableTitle: 'वर्ष-दर-वर्ष विवरण', stepUpTitle: 'स्टेप-अप SIP — अतिरिक्त उदाहरण', expenseTitle: 'व्यय अनुपात प्रभाव — उदाहरण', taxTitle: 'कर विचार — उदाहरण', scenarioTitle: 'दो परिदृश्यों की तुलना करें', stepUpNote: '* अनुमानित। वास्तविक परिणाम भिन्न हो सकते हैं।', expenseNote: '* व्यय अनुपात फंड के अनुसार अलग होता है।', taxNote: '* सरलीकृत उदाहरण। कर सलाहकार से परामर्श करें।' },
    formula: { step1: 'चरण 1 — लक्ष्य को महंगाई के अनुसार बढ़ाएं', step1formula: 'भविष्य लक्ष्य = वर्तमान लागत × (1 + महंगाई दर)^वर्ष', step2: 'चरण 2 — आवश्यक SIP गणना करें', step2formula: 'SIP = FV × r ÷ [((1+r)^n − 1) × (1+r)]', where: 'FV = महंगाई लक्ष्य, r = मासिक दर, n = कुल महीने' },
    table: { year: 'वर्ष', invested: 'निवेशित', corpus: 'कोष मूल्य', progress: 'लक्ष्य %' },
    insights: { feasible: (pct: number) => `✅ ${pct}% वेतन — बहुत प्रबंधनीय!`, moderate: (pct: number) => `⚡ ${pct}% वेतन। अनुशासन से प्राप्त करने योग्य।`, stretch: (pct: number) => `⚠️ ${pct}% वेतन। लंबा समय या स्टेप-अप SIP विचार करें।`, interestExceeds: '🏆 इस बिंदु के बाद, आपका लाभ आपके निवेश से अधिक!', stepupSavings: (saved: string) => `💡 स्टेप-अप से प्रारंभिक SIP ${saved}/माह कम।` },
    accessibility: {
      liveResults: (sip: string, goal: string) => `अपडेट: ${goal} के लिए आवश्यक मासिक SIP ${sip} है`,
      mountainLabel: (sip: string, y: number) => `लक्ष्य पर्वत: ${y} वर्षों में ${sip}/माह की SIP`
    },
    bot: {
      panelTitle: 'FinCal नॉलेज बॉट',
      panelAria: 'नॉलेज बॉट — वित्तीय अवधारणाओं के बारे में जानें',
      askBot: 'बॉट से पूछें',
      learnMore: 'और जानें',
      learnAbout: 'इसके बारे में जानें',
      close: 'नॉलेज बॉट बंद करें',
      back: 'पीछे',
      backTo: (q: string) => `पीछे जाएं: ${q}`,
      relatedTitle: 'संबंधित प्रश्न',
      defaultsNotice: 'ℹ️ दिखाई गई संख्याएँ उदाहरण मूल्यों पर आधारित हैं। व्यक्तिगत आंकड़ों के लिए कैलकुलेटर भरें।',
      questions: {
        sip: 'SIP क्या है?',
        inflation: 'मुद्रास्फीति क्या है?',
        fees: 'व्यय अनुपात क्या है?',
        crash: 'क्रेज़ में क्या होता है?',
        stepup: 'स्टेप-अप SIP क्या है?',
        tax: 'LTCG टैक्स क्या है?',
      },
      categories: {
        'goal-basics': '🎯 लक्ष्य मूल बातें',
        'inflation': '📈 मुद्रास्फीति',
        'returns': '💰 रिटर्न',
        'fees': '💳 फीस',
        'tax': '🏛️ टैक्स',
        'market-behavior': '📊 बाजार व्यवहार',
        'sip-mechanics': '⚙️ SIP यांत्रिकी',
        'optimization': '🚀 अनुकूलन',
      }
    },
    common: {
      learn: 'सीखें',
      calculator: 'कैलकुलेटर',
      backToHome: 'होम पर वापस जाएं',
      proceedToCalc: 'कैलकुलेटर पर जाएं',
      whyMatters: 'यह क्यों मायने रखता है',
      showFormula: 'फॉर्मूला दिखाएं',
      hide: 'छिपाएं',
      show: 'दिखाएं',
      years: 'वर्ष',
      rupees: 'रुपये',
      next: 'अगला',
      finish: 'समाप्त',
      unlockMessage: 'लेवल 7 अनलॉक! अब आपके पास पूरी तस्वीर है।',
      goalDetails: 'आपके लक्ष्य का विवरण',
      goalMountain: 'आपका लक्ष्य पर्वत',
      showMore: (n: number) => `और दिखाएं · गहराई ${n} / 7`,
      fullPicture: "🎉 आपने पूरी तस्वीर अनलॉक कर दी है — सभी 7 गहराइयों का पता लगा लिया गया है!",
    },
    levels: {
      foundations: "🌱 फाउंडेशन मोड",
      building: "📈 आगे बढ़ रहे हैं",
      advanced: "🎯 एडवांस मोड",
    },
    landing: {
      title1: "अपने",
      title2: "वित्तीय भविष्य में महारत हासिल करें",
      description: "चाहे आप धन निर्माण के मूल सिद्धांतों को सीखना चाहते हों या सीधे शक्तिशाली SIP गणनाओं में गोता लगाना चाहते हों, हमने आपको कवर किया है।",
      learnTitle: "मूल बातें सीखें",
      learnDesc: "निवेश में नए हैं? SIP, मुद्रास्फीति, चक्रवृद्धि ब्याज और करों पर हमारा क्रैश कोर्स लें।",
      learnBtn: "सीखना शुरू करें",
      calcTitle: "कैलकुलेटर का उपयोग करें",
      calcDesc: "पहले से ही जानते हैं कि आप क्या कर रहे हैं? सीधे अंदर कूदें और निवेश की 7 गहराइयों में अपने लक्ष्यों की योजना बनाएं।",
      calcBtn: "कैलकुलेटर खोलें"
    },
    learn: {
      masterclass: "SIP 101 मास्टरक्लास",
      title: "धन निर्माण की नींव",
      subtitle: "अपने लक्ष्यों की गणना करने से पहले, उन वित्तीय इंजनों को समझें जो आपके पैसे को शक्ति देते हैं।",
      topic1: {
        title: "सिस्टमैटिक इन्वेस्टमेंट प्लान",
        sub: "इंजन",
        p1: "एक सिस्टमैटिक इन्वेस्टमेंट प्लान (SIP) एक सरल लेकिन शक्तिशाली रणनीति है जहाँ आप एक म्यूचुअल फंड में नियमित अंतराल पर—आमतौर पर मासिक—एक निश्चित राशि का निवेश करते हैं।",
        p2: "इसे हर महीने एक बीज बोने के रूप में सोचें। बाजार की स्थितियों की परवाह किए बिना लगातार निवेश करके, आप अपने निवेश की खरीद लागत (रुपया लागत औसत) को औसत करते हैं और वित्तीय अनुशासन लागू करते हैं।"
      },
      topic2: {
        title: "चक्रवृद्धि ब्याज",
        sub: "जादू",
        p1: "अल्बर्ट आइंस्टीन ने कथित तौर पर चक्रवृद्धि ब्याज को \"दुनिया का आठवां अजूबा\" कहा था। यह तब होता है जब आपके निवेश पर मिलने वाला रिटर्न अपना रिटर्न देना शुरू कर देता है।",
        quote: "बाजार में समय बाजार के समय को मात देता है।",
        p2: "जितने समय तक आप अपना पैसा निवेशित छोड़ेंगे, उतनी ही विस्फोटक वृद्धि होगी। 20 साल के SIP के बाद के वर्षों में, एक साल में उत्पन्न रिटर्न अक्सर उस पूरी अवधि में आपके द्वारा निवेश किए गए कुल पैसे से अधिक हो सकता है।"
      },
      topic3: {
        title: "मुद्रास्फीति को समझना",
        sub: "शांत चोर",
        p1: "यदि आप 10 वर्षों के लिए अपने गद्दे के नीचे ₹1,000 छिपाते हैं, तो आपके पास अभी भी ₹1,000 हैं। लेकिन वस्तुओं की लागत बढ़ गई होगी। यही मुद्रास्फीति है।",
        p2: "भारत में ऐतिहासिक रूप से औसतन लगभग 6% रहने वाली मुद्रास्फीति धीरे-धीरे आपके पैसे की क्रय शक्ति को कम कर देती है। इसका मतलब है कि एक लक्ष्य जिसकी लागत आज ₹25 लाख है, 15 वर्षों में लगभग ₹60 लाख हो सकता है। वास्तविक धन बनाने के लिए, आपके निवेश को मुद्रास्फीति की दर से अधिक तेजी से बढ़ना चाहिए।"
      },
      topic4: {
        title: "स्टेप-अप SIP",
        sub: "त्वरक",
        p1: "जैसे-जैसे आपका करियर आगे बढ़ता है, आपका वेतन आमतौर पर बढ़ता है। एक स्टेप-अप SIP हर साल एक निश्चित प्रतिशत (जैसे, 10%) द्वारा अपने मासिक निवेश को स्वचालित रूप से बढ़ाकर इसकी नकल करता है।",
        p2: "अपने निवेश को बढ़ाकर, आप अपने वित्तीय लक्ष्यों तक काफी तेजी से पहुंच सकते हैं या अपने शुरुआती बजट पर दबाव महसूस किए बिना बहुत बड़ा कोष बना सकते हैं।"
      },
      topic5: {
        title: "कर और शुल्क",
        sub: "घर्षण",
        p1: "दो चीजें निश्चित हैं: मृत्यु और कर। निवेश में, व्यय अनुपात और कर घर्षण पैदा करते हैं जो आपके शुद्ध रिटर्न को कम कर देते हैं।",
        l1: "व्यय अनुपात: आपके पैसे का प्रबंधन करने के लिए म्यूचुअल फंड द्वारा लिया जाने वाला वार्षिक शुल्क (आमतौर पर 0.5% - 1.5%)।",
        l2: "LTCG कर: लॉन्ग टर्म कैपिटल गेन्स टैक्स। भारत में, एक वर्ष से अधिक समय तक रखे गए इक्विटी रिटर्न पर ₹1.25 लाख से अधिक के लाभ पर वर्तमान में 12.5% कर लगाया जाता है।"
      },
      final: {
        h: "अपने ज्ञान को लागू करने के लिए तैयार हैं?",
        p: "अब जब आप धन निर्माण के तंत्र को समझ गए हैं, तो वित्तीय स्वतंत्रता के लिए अपना सटीक रास्ता तैयार करने के लिए हमारे 7-गहराई कैलकुलेटर का उपयोग करें।",
        btn: "FinCal कैलकुलेटर खोलें"
      }
    },
    depthData: {
      d1: {
        title: "संख्या",
        hook: "यहाँ ठीक वही है जो आपको बचाने की आवश्यकता है — तुरंत।",
        badge: "बेसलाइन",
        formulaLabel: "PDF फॉर्मूला: बेसलाइन SIP",
        p1: "यह वह न्यूनतम राशि है जिसे आपको अपने लक्ष्य तक पहुँचने के लिए हर महीने निवेश करने की आवश्यकता है। इसे अपने वित्तीय GPS के रूप में सोचें — यह आपको बताता है कि कहाँ जाना है और कितनी तेज़ी से।"
      },
      d2: {
        title: "रियलिटी चेक",
        hook: "\"आज आपका लक्ष्य प्रबंधनीय लगता है। 15 वर्षों में? बिल्कुल नहीं।\"",
        badge: "मुद्रास्फीति",
        formulaLabel: "PDF फॉर्मूला: मुद्रास्फीति समायोजन",
        p1: (rate: number, years: number) => `मुद्रास्फीति आपकी बचत पर लगने वाला एक गुप्त कर है। ${rate}% प्रति वर्ष की दर से, कीमतें हर ${years} साल में लगभग दोगुनी हो जाती हैं। यदि आप आज की कीमत के लिए योजना बनाते हैं, तो समय आने पर आप पीछे रह जाएंगे।`,
        l1: "आज की कीमत",
        l2: (y: number) => `${y} वर्षों में`,
        hi: (m: string) => `कीमतें +${m}% अधिक होंगी। आपका लक्ष्य बढ़ता है — यही वह संख्या है जिसे हम वास्तव में लक्षित कर रहे हैं।`
      },
      d3: {
        title: "छिपी हुई लागत",
        hook: "\"दो फंड, समान रिटर्न — लेकिन एक में लाखों कम। एकमात्र अंतर: शुल्क।\"",
        badge: "व्यय अनुपात",
        formulaLabel: "शुल्क रिटर्न को कैसे कम करते हैं",
        p1: (y: number) => `व्यय अनुपात वह वार्षिक शुल्क है जो म्यूचुअल फंड लेता है — हर दिन स्वचालित रूप से काटा जाता है। एक जिम सदस्यता की तरह जो आपको तब भी बिल भेजती है जब आप नहीं जाते हैं। ${y} वर्षों में, 1% का अंतर भी बहुत बड़ा हो जाता है।`,
        label: "आपके फंड का व्यय अनुपात (%)",
        low: "कम लागत (0.5%)",
        yours: (r: string) => `आपका फंड (${r}%)`,
        consume: "फीस की खपत",
        note: "* अनुमानित। वास्तविक प्रभाव फंड के प्रकार पर निर्भर करता है।"
      },
      d4: {
        title: "बाजार की वास्तविकता",
        hook: "\"क्रैश होगा। एकमात्र सवाल यह है कि जब ऐसा होता है तो आप क्या करते हैं।\"",
        badge: "क्रैश सिमुलेशन",
        formulaLabel: "निश्चित NAV मॉडल",
        p1: "भारत में हर दशक में बाजार क्रैश हुए और संभले हैं। जिन निवेशकों ने 2020 के कोविड क्रैश के दौरान अपनी SIP जारी रखी, उन्होंने निचले स्तर पर यूनिट खरीदी। बाजार में समय बिताना बाजार को समय देने से बेहतर है।",
        drop: "बाजार में गिरावट (%)",
        year: "क्रैश वर्ष",
        recov: "रिकवरी (महीने)",
        cont: "SIP जारी रखा ✅",
        pause: "SIP रोक दिया ❌",
        hi: (a: string) => `क्रैश के दौरान अपनी SIP जारी रखने से अंत तक आपको ${a} अधिक मिलते हैं। घबराहट में बेचना सबसे महंगी वित्तीय गलती है।`,
        note: "* उदाहरण मॉडल — कोई भविष्यवाणी नहीं।"
      },
      d5: {
        title: "अनुकूलन",
        hook: "\"हर साल अपनी SIP में थोड़ी वृद्धि करें। शुरू करने के लिए आपको बहुत कम की आवश्यकता होगी।\"",
        badge: "स्टेप-अप SIP",
        formulaLabel: "स्टेप-अप SIP फॉर्मूला",
        p1: "समय के साथ आपका वेतन बढ़ने की संभावना है। आपकी SIP भी बढ़ सकती है। स्टेप-अप SIP का मतलब है कि आप आज कम निवेश करते हैं (जब पैसा कम होता है) और बाद में अधिक (जब आप अधिक कमाते हैं)।",
        label: "वार्षिक SIP वृद्धि (%)",
        hint: "आपकी SIP हर साल कितनी बढ़ती है",
        flat: "फ्लैट SIP (आज)",
        start: "स्टेप-अप शुरुआत",
        save: "आप आज बचाते हैं",
        glide: "वर्षों में आपका SIP पथ:",
        yr: (y: number) => `वर्ष ${y}`,
        note: "* अनुमानित। आपकी आय के अनुसार होना चाहिए।"
      },
      d6: {
        title: "टैक्स की सच्चाई",
        hook: "\"आपका कोष बहुत अच्छा लग रहा है — जब तक कि सरकार अपना हिस्सा नहीं ले लेती।\"",
        badge: "LTCG टैक्स",
        formulaLabel: "LTCG गणना (सरलीकृत)",
        p1: (r: number) => `1 साल के बाद रिडीम करने पर लॉन्ग-टर्म कैपिटल गेन्स (LTCG) टैक्स लगता है। वर्तमान में ₹1 लाख से ऊपर के लाभ पर ${r}%। पहले दिन से इसकी योजना बनाएं।`,
        label: "LTCG टैक्स दर (%)",
        hint: "वर्तमान में 12.5% इक्विटी MF के लिए; सलाहकार से परामर्श करें",
        post: "टैक्स के बाद कोष",
        paid: "टैक्स भुगतान",
        exempt: "₹1L छूट",
        note: "* सरलीकृत उदाहरण। कर कानून बदल सकते हैं।"
      },
      d7: {
        title: "पूरी तस्वीर",
        hook: "\"आज से आपके लक्ष्य तक आपका पूर्ण, ईमानदार, साल-दर-साल रोडमैप।\"",
        badge: "पूर्ण दृश्य",
        p1: "यह आपकी निवेश यात्रा की अनफिल्टर्ड सच्चाई है — हर साल, आपने कितना योगदान दिया है, और आप अपने लक्ष्य के कितने करीब हैं। कोई आश्चर्य नहीं।",
        h: "अवधि",
        ti: "कुल निवेश",
        fc: "अंतिम कोष",
        wg: "अर्जित धन"
      }
    }
  },
  ta: {
    app: { title: 'FinCal', subtitle: 'இலக்கு அடிப்படையிலான முதலீட்டு கணக்கீட்டு கருவி' },
    onboarding: {
      headline: 'FinCal-க்கு வரவேற்கிறோம்',
      sub: 'HDFC முதலீட்டாளர் கல்வி',
      chooseLang: 'தொடங்குவதற்கு உங்கள் மொழியைத் தேர்வு செய்யவும்',
      setupProgress: 'அமைப்பு முன்னேற்றம்',
      stepOf: (s: number, t: number) => `படி ${s} / ${t}`,
      levelTitle: 'மியூச்சுவல் ஃபண்ட் முதலீட்டில் உங்களுக்கு எவ்வளவு பரிச்சயம் உள்ளது?',
      levels: {
        beginner: { title: 'இப்போதுதான் தொடங்குகிறேன்', desc: "நான் முதலீட்டிற்கு புதியவன்" },
        intermediate: { title: 'எனக்கு அடிப்படைகள் தெரியும்', desc: "நான் ஏற்கனவே முதலீடு செய்துள்ளேன்" },
        advanced: { title: "நான் அனுபவம் வாய்ந்தவன்", desc: 'நான் தவறாமல் முதலீடு செய்கிறேன்' },
      },
      goalTitle: 'நீங்கள் எதற்காகக் கணக்கிடுகிறீர்கள்?',
      goals: {
        education: "குழந்தையின் கல்வி",
        home: 'வீடு / சொத்து',
        vehicle: 'வாகனம்',
        retirement: 'ஓய்வு',
        custom: "வேறு ஏதேனும் — எனது சொந்த இலக்கை நான் நிர்ணயிப்பேன்",
      },
      setupWelcome: "வரவேற்கிறோம்! இதோ உங்கள் தனிப்பயனாக்கப்பட்ட அமைப்பு.",
      setupDesc: (g: string, y: number) => `${y} ஆண்டுகளில் ${g}-க்கான உங்கள் கால்குலேட்டரை நாங்கள் அமைத்துள்ளோம்.`,
      setupGuide: "மிக முக்கியமான எண்ணிலிருந்து தொடங்கி — படிப்படியாக நாங்கள் உங்களுக்கு வழிகாட்டுவோம். அனைத்து உள்ளீடுகளும் முன்பே நிரப்பப்பட்டுள்ளன, ஆனால் நீங்கள் தேவைக்கேற்ப அவற்றை மாற்றிக்கொள்ளலாம்.",
      begin: "தொடங்குவோம் →",
    },
    presets: { title: 'ஒரு இலக்கை தேர்ந்தெடுக்கவும்', education: 'கல்வி', home: 'வீடு வாங்குதல்', car: 'கார் வாங்குதல்', retirement: 'ஓய்வூதியம்' },
    inputs: {
      currentCost: 'இலக்கின் தற்போதைய செலவு (₹)',
      years: 'இலக்கு வரை ஆண்டுகள்',
      yearsSuffix: 'ஆண்டுகள்',
      inflation: 'பணவீக்க விகிதம் (%)',
      return: 'எதிர்பார்க்கப்படும் வருமானம் (%)',
      stepUp: 'வருடாந்திர SIP அதிகரிப்பு (%)',
      expenseRatio: 'செலவு விகிதம் (%)',
      taxRate: 'LTCG வரி விகிதம் (%)',
      hints: {
        years: 'உங்களுக்கு இந்தப் பணம் தேவைப்படும் வரை எத்தனை ஆண்டுகள் உள்ளன?',
        inflation: 'இந்தியாவில் விலைகள் பொதுவாக ஆண்டுக்கு 5-7% உயரும்',
        returns: 'ஊகிக்கப்பட்ட வருமானம், உத்தரவாதம் இல்லை. ஈக்விட்டி ஃபண்டுகள் வரலாற்று ரீதியாக ~10-14%',
        stepUp: 'ஒவ்வொரு ஆண்டும் உங்கள் SIP-யை எவ்வளவு அதிகரிப்பீர்கள்',
        expense: 'ஃபண்ட் வசூலிக்கும் ஆண்டு கட்டணம், வருமானத்திலிருந்து கழிக்கப்படும்',
        tax: 'நீண்ட கால மூலதன ஆதாய வரி விகிதம் (தற்போது 12.5%)',
      }
    },
    results: { inflatedGoal: 'பணவீக்கத்திற்கு பின் இலக்கு', requiredSIP: 'தேவையான மாதாந்திர SIP', totalInvested: 'மொத்த முதலீடு', wealthGained: 'ஈட்டிய செல்வம்', stepUpSIP: 'தொடக்க SIP (நிலை-உயர்வு உடன்)' },
    education: { whatMeansTitle: 'இதன் அர்த்தம் என்ன?', howCalculatedTitle: 'இது எப்படி கணக்கிடப்படுகிறது?', yearTableTitle: 'வருடாந்திர விவரம்', stepUpTitle: 'நிலை-உயர்வு SIP — கூடுதல் விளக்கம்', expenseTitle: 'செலவு விகித தாக்கம் — விளக்கம்', taxTitle: 'வரி விஷயம் — விளக்கம்', scenarioTitle: 'இரண்டு சூழ்நிலைகளை ஒப்பிடுக', stepUpNote: '* மதிப்பீட்டு விளக்கம். உண்மையான முடிவுகள் மாறலாம்.', expenseNote: '* செலவு விகிதம் நிதிக்கு பொறுத்து மாறும்.', taxNote: '* எளிமைப்படுத்தப்பட்ட விளக்கம். வரி ஆலோசகரிடம் கேளுங்கள்.' },
    formula: { step1: 'படி 1 — இலக்கை பணவீக்கத்திற்கு ஏற்ப மாற்றவும்', step1formula: 'எதிர்கால இலக்கு = தற்போதைய செலவு × (1 + பணவீக்கம்)^ஆண்டுகள்', step2: 'படி 2 — தேவையான SIP கணக்கிடவும்', step2formula: 'SIP = FV × r ÷ [((1+r)^n − 1) × (1+r)]', where: 'FV = பணவீக்க இலக்கு, r = மாதாந்திர விகிதம், n = மொத்த மாதங்கள்' },
    table: { year: 'ஆண்டு', invested: 'முதலீட்டு', corpus: 'நிதி மதிப்பு', progress: 'இலக்கு %' },
    insights: { feasible: (pct: number) => `✅ ${pct}% சம்பளம் — மிகவும் நிர்வகிக்கக்கூடியது!`, moderate: (pct: number) => `⚡ ${pct}% சம்பளம். ஒழுக்கத்துடன் சாத்தியம்.`, stretch: (pct: number) => `⚠️ ${pct}% சம்பளம். நீண்ட கால அல்லது நிலை-உயர்வு SIP பரிசீலிக்கவும்.`, interestExceeds: '🏆 இந்த நேரத்தில் உங்கள் லாபம் முதலீட்டை மீறியது!', stepupSavings: (saved: string) => `💡 நிலை-உயர்வு தொடக்க SIPஐ ${saved}/மாதம் குறைக்கிறது.` },
    accessibility: {
      liveResults: (sip: string, goal: string) => `புதுப்பிக்கப்பட்டது: ${goal} இலக்கிற்கு தேவையான மாதாந்திர SIP ${sip}`,
      mountainLabel: (sip: string, y: number) => `இலக்கு மலை: ${y} ஆண்டுகளில் ${sip}/மாதம் SIP`
    },
    bot: {
      panelTitle: 'FinCal அறிவு பாட்',
      panelAria: 'அறிவு பாட் — நிதி சார்ந்த கருத்துக்களைப் பற்றி அறியுங்கள்',
      askBot: 'பாட்-யிடம் கேளுங்கள்',
      learnMore: 'மேலும் அறிய',
      learnAbout: 'பற்றி அறிய',
      close: 'அறிவு பாட்-யை மூடு',
      back: 'பின்செல்',
      backTo: (q: string) => `பின்செல்ல: ${q}`,
      relatedTitle: 'தொடர்புடைய கேள்விகள்',
      defaultsNotice: 'ℹ️ காட்டப்படும் எண்கள் உதாரண மதிப்புகளை அடிப்படையாகக் கொண்டவை. உங்கள் தனிப்பட்ட புள்ளிவிவரங்களுக்குக் கால்குலேட்டரைப் பயன்படுத்தவும்.',
      questions: {
        sip: 'SIP என்றால் என்ன?',
        inflation: 'பணவீக்கம் என்றால் என்ன?',
        fees: 'செலவு விகிதம் என்றால் என்ன?',
        crash: 'சரிவில் என்ன நடக்கும்?',
        stepup: 'ஸ்டெப்-அப் SIP என்றால் என்ன?',
        tax: 'LTCG வரி என்றால் என்ன?',
      },
      categories: {
        'goal-basics': '🎯 இலக்கு அடிப்படைகள்',
        'inflation': '📈 பணவீக்கம்',
        'returns': '💰 வருமானம்',
        'fees': '💳 கட்டணம்',
        'tax': '🏛️ வரி',
        'market-behavior': '📊 சந்தை நடத்தை',
        'sip-mechanics': '⚙️ SIP இயக்கவியல்',
        'optimization': '🚀 மேம்படுத்தல்',
      }
    },
    common: {
      learn: 'கற்க',
      calculator: 'கால்குலேட்டர்',
      backToHome: 'முகப்புக்குச் செல்லவும்',
      proceedToCalc: 'கால்குலேட்டருக்குச் செல்லவும்',
      whyMatters: 'இது ஏன் முக்கியம்',
      showFormula: 'சூத்திரத்தைக் காட்டு',
      hide: 'மறைக்கவும்',
      show: 'காண்பிக்கவும்',
      years: 'ஆண்டுகள்',
      rupees: 'ரூபாய்',
      next: 'அடுத்து',
      finish: 'முடிக்க',
      unlockMessage: 'நிலை 7 திறக்கப்பட்டது! இப்போது உங்களிடம் முழு படம் உள்ளது.',
      goalDetails: 'உங்கள் இலக்கு விவரங்கள்',
      goalMountain: 'உங்கள் இலக்கு மலை',
      showMore: (n: number) => `மேலும் காட்டு · நிலை ${n} / 7`,
      fullPicture: "🎉 நீங்கள் முழுப் படத்தையும் திறந்துவிட்டீர்கள் — அனைத்து 7 நிலைகளும் ஆராயப்பட்டன!",
    },
    levels: {
      foundations: "🌱 அடிப்படை முறை",
      building: "📈 வளர்ச்சி முறை",
      advanced: "🎯 மேம்பட்ட முறை",
    },
    landing: {
      title1: "உங்கள்",
      title2: "நிதி எதிர்காலத்தை மாஸ்டர் செய்யுங்கள்",
      description: "நீங்கள் செல்வத்தை உருவாக்குவதற்கான அடிப்படை விஷயங்களைக் கற்றுக்கொள்ள விரும்பினாலும் அல்லது சக்திவாய்ந்த SIP கணக்கீடுகளுக்கு நேரடியாகச் செல்ல விரும்பினாலும், நாங்கள் உங்களுக்கு உதவுகிறோம்.",
      learnTitle: "அடிப்படைகளைக் கற்றுக்கொள்ளுங்கள்",
      learnDesc: "முதலீட்டிற்கு புதியவரா? SIP-கள், பணவீக்கம், கூட்டு வட்டி மற்றும் வரிகள் குறித்த எங்களது குறுகிய கால பயிற்சியை மேற்கொள்ளுங்கள்.",
      learnBtn: "கற்றலைத் தொடங்குங்கள்",
      calcTitle: "கணக்கீட்டு கருவியைப் பயன்படுத்துங்கள்",
      calcDesc: "நீங்கள் என்ன செய்கிறீர்கள் என்று ஏற்கனவே தெரியுமா? நேரடியாக உள்ளே நுழைந்து 7 நிலைகளில் உங்கள் இலக்குகளைத் திட்டமிடுங்கள்.",
      calcBtn: "கணக்கீட்டு கருவியைத் திற"
    },
    learn: {
      masterclass: "SIP 101 மாஸ்டர்கிளாஸ்",
      title: "செல்வ உருவாக்கத்தின் அடிப்படைகள்",
      subtitle: "உங்கள் இலக்குகளைக் கணக்கிடுவதற்கு முன், உங்கள் பணத்தை இயக்கும் நிதி இயந்திரங்களைப் புரிந்து கொள்ளுங்கள்.",
      topic1: {
        title: "முறையான முதலீட்டுத் திட்டம்",
        sub: "இயந்திரம்",
        p1: "முறையான முதலீட்டுத் திட்டம் (SIP) என்பது ஒரு மியூச்சுவல் ஃபண்டில் சீரான இடைவெளியில்—பொதுவாக மாதந்தோறும்—ஒரு நிலையான தொகையை முதலீடு செய்யும் எளிய ஆனால் சக்திவாய்ந்த உத்தியாகும்.",
        p2: "ஒவ்வொரு மாதமும் ஒரு விதையை விதைப்பதாக நினைத்துக் கொள்ளுங்கள். சந்தை நிலவரங்களைப் பொருட்படுத்தாமல் தொடர்ந்து முதலீடு செய்வதன் மூலம், உங்கள் முதலீடுகளின் கொள்முதல் செலவைச் சமன் செய்கிறீர்கள் (ரூபாய் செலவுச் சராசரி) மற்றும் நிதி ஒழுக்கத்தை அமல்படுத்துகிறீர்கள்."
      },
      topic2: {
        title: "கூட்டு வட்டி",
        sub: "மாயம்",
        p1: "ஆல்பர்ட் ஐன்ஸ்டீன் கூட்டு வட்டியை \"உலகின் எட்டாவது அதிசயம்\" என்று அழைத்ததாகக் கூறப்படுகிறது. இது உங்கள் முதலீடுகளில் நீங்கள் ஈட்டும் வருமானம் அதன் சொந்த வருமானத்தை ஈட்டத் தொடங்கும் போது நிகழ்கிறது.",
        quote: "சந்தையில் இருக்கும் நேரம் சந்தையின் நேரத்தைக் கணிப்பதை விட சிறந்தது.",
        p2: "உங்கள் பணத்தை எவ்வளவு காலம் முதலீடு செய்திருக்கிறீர்களோ, அவ்வளவு வெடிக்கும் வளர்ச்சி இருக்கும். 20 ஆண்டு SIP-ன் பிந்தைய ஆண்டுகளில், ஒரு வருடத்தில் ஈட்டப்படும் வருமானம் பெரும்பாலும் அந்த முழு காலப்பகுதியில் நீங்கள் முதலீடு செய்த மொத்த தொகையை விட அதிகமாக இருக்கும்."
      },
      topic3: {
        title: "பணவீக்கத்தைப் புரிந்துகொள்ளுதல்",
        sub: "அமைதியான திருடன்",
        p1: "நீங்கள் 10 ஆண்டுகளுக்கு ₹1,000-ஐ மறைத்து வைத்திருந்தால், உங்களிடம் இன்னும் ₹1,000 தான் இருக்கும். ஆனால் பொருட்களின் விலை உயர்ந்திருக்கும். அதுதான் பணவீக்கம்.",
        p2: "இந்தியாவில் வரலாற்று ரீதியாக சராசரியாக 6% இருக்கும் பணவீக்கம், உங்கள் பணத்தின் வாங்கும் சக்தியை மெதுவாகக் குறைக்கிறது. இதன் பொருள் இன்று ₹25 லட்சம் செலவாகும் ஒரு இலக்கு 15 ஆண்டுகளில் கிட்டத்தட்ட ₹60 லட்சம் ஆகலாம். உண்மையான செல்வத்தை உருவாக்க, உங்கள் முதலீடுகள் பணவீக்க விகிதத்தை விட வேகமாக வளர வேண்டும்."
      },
      topic4: {
        title: "நிலை-உயர்வு SIP",
        sub: "முடுக்கி",
        p1: "உங்கள் தொழில் முன்னேறும்போது, உங்கள் சம்பளம் பொதுவாக உயரும். ஒரு நிலை-உயர்வு SIP ஒவ்வொரு ஆண்டும் உங்கள் மாதாந்திர முதலீட்டை ஒரு நிலையான சதவீதத்தால் (எ.கா., 10%) தானாகவே அதிகரிப்பதன் மூலம் இதைச் செய்கிறது.",
        p2: "உங்கள் முதலீடுகளை நிலை-உயர்த்துவதன் மூலம், உங்கள் நிதி இலக்குகளை கணிசமாக வேகமாக அடையலாம் அல்லது உங்கள் ஆரம்ப பட்ஜெட்டில் சுமையை உணராமல் மிகப்பெரிய நிதியை உருவாக்கலாம்."
      },
      topic5: {
        title: "வரிகள் மற்றும் கட்டணங்கள்",
        sub: "உராய்வு",
        p1: "இரண்டு காரியங்கள் நிச்சயம்: இறப்பு மற்றும் வரிகள். முதலீட்டில், செலவு விகிதங்கள் மற்றும் வரிகள் உங்கள் நிகர வருமானத்தை இழுக்கும் உராய்வை உருவாக்குகின்றன.",
        l1: "செலவு விகிதம்: உங்கள் பணத்தை நிர்வகிக்க மியூச்சுவல் ஃபண்டுகளால் வசூலிக்கப்படும் வருடாந்திர கட்டணம் (பொதுவாக 0.5% - 1.5%).",
        l2: "LTCG வரி: நீண்ட கால மூலதன ஆதாய வரி. இந்தியாவில், ஒரு ஆண்டிற்கு மேலாக வைத்திருக்கும் ஈக்விட்டி வருமானத்தில் ₹1.25 லட்சத்திற்கு மேலான ஆதாயங்களுக்கு தற்போது 12.5% வரி விதிக்கப்படுகிறது."
      },
      final: {
        h: "உங்கள் அறிவைப் பயன்படுத்தத் தயாரா?",
        p: "இப்போது நீங்கள் செல்வ உருவாக்கத்தின் இயக்கவியலைப் புரிந்து கொண்டீர்கள், நிதி சுதந்திரத்திற்கான உங்கள் சரியான பாதையைத் திட்டமிட எங்களது 7-நிலைகள் கணக்கீட்டு கருவியைப் பயன்படுத்துங்கள்.",
        btn: "FinCal கணக்கீட்டு கருவியைத் திற"
      }
    },
    depthData: {
      d1: {
        title: "எண்",
        hook: "நீங்கள் சேமிக்க வேண்டியது சரியாக இங்கே உள்ளது — உடனடியாக.",
        badge: "அடிப்படை",
        formulaLabel: "PDF சூத்திரம்: அடிப்படை SIP",
        p1: "உங்கள் இலக்கை அடைய ஒவ்வொரு மாதமும் நீங்கள் முதலீடு செய்ய வேண்டிய குறைந்தபட்சத் தொகை இதுவாகும். இதை உங்கள் நிதி GPS ஆக நினைத்துக் கொள்ளுங்கள் — இது எங்கே செல்ல வேண்டும், எவ்வளவு வேகமாகச் செல்ல வேண்டும் என்று உங்களுக்குக் கூறுகிறது."
      },
      d2: {
        title: "யதார்த்த சரிபார்ப்பு",
        hook: "\"உங்கள் இலக்கு இன்று சமாளிக்கக்கூடியதாகத் தோன்றுகிறது. 15 ஆண்டுகளில்? வாய்ப்பில்லை.\"",
        badge: "பணவீக்கம்",
        formulaLabel: "PDF சூத்திரம்: பணவீக்க சரிசெய்தல்",
        p1: (rate: number, years: number) => `பணவீக்கம் என்பது உங்கள் சேமிப்பின் மீதான அமைதியான வரி. ஆண்டுக்கு ${rate}% என்ற விகிதத்தில், ஒவ்வொரு ${years} ஆண்டுகளுக்கும் பொருட்கள் விலை இருமடங்காக இருக்கும். இன்றைய விலைக்கு நீங்கள் திட்டமிட்டால், காலம் வரும்போது நீங்கள் பின்தங்குவீர்கள்.`,
        l1: "இன்றைய விலை",
        l2: (y: number) => `${y} ஆண்டுகளில்`,
        hi: (m: string) => `விலைகள் +${m}% அதிகமாக இருக்கும். உங்கள் இலக்கு வளர்கிறது — அந்த எண்ணைத் தான் நாம் இலக்காகக் கொள்கிறோம்.`
      },
      d3: {
        title: "மறைக்கப்பட்ட செலவு",
        hook: "\"இரண்டு நிதிகள், ஒரே வருமானம் — ஆனால் ஒன்று உங்களுக்கு லட்சக்கணக்கான ரூபாய்களைக் குறைவாகத் தருகிறது. ஒரே வித்தியாசம்: கட்டணங்கள்.\"",
        badge: "செலவு விகிதம்",
        formulaLabel: "கட்டணங்கள் வருமானத்தைக் குறைப்பது எப்படி",
        p1: (y: number) => `செலவு விகிதம் என்பது மியூச்சுவல் ஃபண்ட் வசூலிக்கும் வருடாந்திர கட்டணமாகும் — இது ஒவ்வொரு நாளும் தானாகவே கழிக்கப்படும். ஒரு ஜிம் உறுப்பினர் சந்தாவைப் போன்றது. ${y} ஆண்டுகளில், 1% வித்தியாசம் கூட மிகப்பெரியதாக மாறும்.`,
        label: "உங்கள் நிதியின் செலவு விகிதம் (%)",
        low: "குறைந்த செலவு (0.5%)",
        yours: (r: string) => `உங்கள் நிதி (${r}%)`,
        consume: "கட்டணங்கள் எடுப்பது",
        note: "* மதிப்பீட்டு விளக்கம். உண்மையான தாக்கம் நிதி வகையைப் பொறுத்தது."
      },
      d4: {
        title: "சந்தை யதார்த்தம்",
        hook: "\"சந்தை வீழ்ச்சி ஏற்படும். அது நிகழும்போது நீங்கள் என்ன செய்கிறீர்கள் என்பதே கேள்வி.\"",
        badge: "வீழ்ச்சி உருவகப்படுத்துதல்",
        formulaLabel: "NAV மாதிரி",
        p1: "இந்தியாவில் ஒவ்வொரு பத்தாண்டிலும் சந்தை வீழ்ச்சியடைந்து மீண்டிருக்கிறது. 2020 கோவிட் வீழ்ச்சியின் போது தங்கள் SIP-களைத் தொடர்ந்த முதலீட்டாளர்கள் குறைந்த விலையில் யூனிட்களை வாங்கினர். சந்தையைக் கணிக்க முயல்வதை விட சந்தையில் தொடர்ந்து இருப்பதே சிறந்தது.",
        drop: "சந்தை வீழ்ச்சி (%)",
        year: "வீழ்ச்சி ஆண்டு",
        recov: "மீட்பு (மாதங்கள்)",
        cont: "தொடர்ந்த SIP ✅",
        pause: "நிறுத்தப்பட்ட SIP ❌",
        hi: (a: string) => `வீழ்ச்சியின் போது உங்கள் SIPஐத் தொடர்வது முடிவில் உங்களுக்கு ${a} அதிகமாக ஈட்டித் தரும். பயத்தில் விற்பது மிகப்பெரிய நிதித் தவறு.`,
        note: "* விளக்க மாதிரி — கணிப்பு அல்ல."
      },
      d5: {
        title: "மேம்படுத்தல்",
        hook: "\"ஒவ்வொரு ஆண்டும் உங்கள் SIPஐ சிறிது சிறிதாக உயர்த்துங்கள். தொடங்குவதற்கு உங்களுக்கு மிகக் குறைவான தொகையே தேவைப்படும்.\"",
        badge: "நிலை-உயர்வு SIP",
        formulaLabel: "நிலை-உயர்வு SIP சூத்திரம்",
        p1: "காலப்போக்கில் உங்கள் சம்பளம் உயரக்கூடும். எனவே உங்கள் SIP-யும் உயரலாம். நிலை-உயர்வு SIP என்பது இன்று குறைவாகவும் (பணம் குறைவாக இருக்கும்போது) பின்னர் அதிகமாகவும் (அதிகம் சம்பாதிக்கும் போது) முதலீடு செய்வதாகும்.",
        label: "வருடாந்திர SIP அதிகரிப்பு (%)",
        hint: "ஒவ்வொரு ஆண்டும் உங்கள் SIP எவ்வளவு வளர்கிறது",
        flat: "நிலையான SIP (இன்று)",
        start: "நிலை-உயர்வு தொடக்கம்",
        save: "நீங்கள் இன்று சேமிப்பது",
        glide: "ஆண்டுகளில் உங்கள் SIP பாதை:",
        yr: (y: number) => `ஆண்டு ${y}`,
        note: "* மதிப்பீட்டு விளக்கம். உங்கள் வருமான உயர்வுக்கு ஏற்ப இருக்க வேண்டும்."
      },
      d6: {
        title: "வரி உண்மை",
        hook: "\"உங்கள் நிதி நன்றாகத் தெரிகிறது — அரசாங்கம் அதன் பங்கைப் பெறும் வரை.\"",
        badge: "LTCG வரி",
        formulaLabel: "LTCG கணக்கீடு (எளிமைப்படுத்தப்பட்டது)",
        p1: (r: number) => `1 ஆண்டுக்கு பிறகு யூனிட்களை எடுக்கும்போது LTCG வரி விதிக்கப்படும். தற்போது ₹1 லட்சத்திற்கு மேலான ஆதாயங்களுக்கு ${r}% வரி. முதல் நாளிலிருந்தே இதற்காகத் திட்டமிடுங்கள்.`,
        label: "LTCG வரி விகிதம் (%)",
        hint: "தற்போது ஈக்விட்டி MF-களுக்கு 12.5%; ஆலோசகரை அணுகவும்",
        post: "வரிக்கு பிந்தைய நிதி",
        paid: "செலுத்திய வரி",
        exempt: "₹1L விலக்கு",
        note: "* எளிமைப்படுத்தப்பட்ட விளக்கம். வரிச் சட்டங்கள் மாறலாம்."
      },
      d7: {
        title: "முழுப் படம்",
        hook: "\"இன்றிலிருந்து உங்கள் இலக்கு வரை உங்களது முழுமையான, உண்மையான, ஆண்டு வாரியான வரைபடம்.\"",
        badge: "முழுமையான பார்வை",
        p1: "இது உங்கள் முதலீட்டு பயணத்தின் வடிகட்டப்படாத உண்மை — ஒவ்வொரு ஆண்டும் நீங்கள் எவ்வளவு பங்களித்துள்ளீர்கள், உங்கள் இலக்கிற்கு எவ்வளவு நெருக்கமாக இருக்கிறீர்கள். ஆச்சரியங்கள் இல்லை.",
        h: "கால அளவு",
        ti: "மொத்த முதலீடு",
        fc: "இறுதி நிதி",
        wg: "ஈட்டிய செல்வம்"
      }
    }
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
