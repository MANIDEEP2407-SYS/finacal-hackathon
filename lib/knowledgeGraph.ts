export interface KnowledgeNode {
  id: string;
  question: string;
  answer: string;
  questionI18n?: Partial<Record<string, string>>;
  answerI18n?: Partial<Record<string, string>>;
  variables: string[];
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  relatedNodes: string[];
  triggerDepth?: number;
}

export const CATEGORIES = [
  { id: 'goal-basics',      label: '🎯 Goal Basics',     count: 6 },
  { id: 'inflation',        label: '📈 Inflation',       count: 5 },
  { id: 'returns',          label: '💰 Returns',         count: 6 },
  { id: 'fees',             label: '💳 Fees',            count: 5 },
  { id: 'tax',              label: '🏛️ Tax',             count: 4 },
  { id: 'market-behavior',  label: '📊 Market Behavior', count: 5 },
  { id: 'sip-mechanics',    label: '⚙️ SIP Mechanics',   count: 5 },
  { id: 'optimization',     label: '🚀 Optimization',    count: 4 },
];

export const knowledgeGraph: Record<string, KnowledgeNode> = {

  // ─── GOAL BASICS (6 nodes) ───────────────────────────

  'what-is-a-financial-goal': {
    id: 'what-is-a-financial-goal',
    question: 'What is a financial goal?',
    questionI18n: {
      hi: 'वित्तीय लक्ष्य क्या होता है?',
      ta: 'நிதி இலக்கு என்றால் என்ன?',
    },
    answer: `A financial goal is a specific amount of money you want to have by a specific date — for a specific purpose.

Not "I want to save more money." That's a wish.
A goal is: "I want {{presentCost}} for {{goalLabel}} in {{years}} years."

The more specific your goal, the more accurately this calculator can tell you exactly what to invest.`,
    answerI18n: {
      hi: `एक वित्तीय लक्ष्य एक विशिष्ट राशि है जो आप एक विशिष्ट तारीख तक किसी विशिष्ट उद्देश्य के लिए रखना चाहते हैं।

"मैं और पैसे बचाना चाहता हूँ" एक इच्छा है, लक्ष्य नहीं।
लक्ष्य है: "मुझे {{years}} वर्षों में {{goalLabel}} के लिए {{presentCost}} चाहिए।"

जितना स्पष्ट आपका लक्ष्य, उतना सटीक यह कैलकुलेटर आपको बताएगा कि क्या निवेश करें।`,
      ta: `ஒரு நிதி இலக்கு என்பது குறிப்பிட்ட நோக்கத்திற்காக குறிப்பிட்ட தேதிக்குள் வைத்திருக்க விரும்பும் குறிப்பிட்ட தொகையாகும்.

"நான் அதிகமாக சேமிக்க விரும்புகிறேன்" என்பது ஒரு விருப்பம், இலக்கு அல்ல.
இலக்கு: "{{years}} ஆண்டுகளில் {{goalLabel}}-க்கு {{presentCost}} வேண்டும்."

உங்கள் இலக்கு எவ்வளவு தெளிவாக இருக்கிறதோ, அவ்வளவு துல்லியமாக இந்த கால்குலேட்டர் உதவும்.`,
    },
    variables: ['presentCost', 'goalLabel', 'years'],
    category: 'goal-basics',
    level: 'beginner',
    relatedNodes: ['what-is-sip', 'why-invest-instead-of-save', 'what-is-a-realistic-goal', 'how-long-should-i-invest'],
  },

  'why-invest-instead-of-save': {
    id: 'why-invest-instead-of-save',
    question: 'Why invest instead of just saving in a bank?',
    questionI18n: {
      hi: 'बैंक में बचत करने की जगह निवेश क्यों करें?',
      ta: 'வங்கியில் சேமிப்பதற்கு பதிலாக ஏன் முதலீடு செய்ய வேண்டும்?',
    },
    answer: `A savings account gives you roughly 3–4% per year. Your assumed return is {{annualReturn}}%.

At 3.5% for {{years}} years, your savings would grow to roughly {{savingsValue}}.
At {{annualReturn}}% for the same period, your investment could grow to {{investmentValue}}.

The difference: {{investmentGap}}.

That gap exists because investing puts your money to work in ways a savings account cannot.`,
    variables: ['annualReturn', 'years', 'savingsValue', 'investmentValue', 'investmentGap'],
    category: 'goal-basics',
    level: 'beginner',
    relatedNodes: ['what-is-compounding', 'what-is-sip', 'rule-of-72', 'what-is-annual-return'],
  },

  'what-is-sip': {
    id: 'what-is-sip',
    question: 'What is a SIP?',
    questionI18n: {
      hi: 'SIP क्या होती है?',
      ta: 'SIP என்றால் என்ன?',
    },
    answer: `SIP stands for Systematic Investment Plan.

Instead of investing a large amount once, you invest a fixed amount every month — automatically.

In your case, that's {{requiredSIP}} every month.

The power of SIP is discipline. You invest regardless of whether the market is up or down. When markets fall, your {{requiredSIP}} buys more units. When markets rise, your units are worth more.

Over time, this averaging effect works strongly in your favour.`,
    variables: ['requiredSIP'],
    category: 'goal-basics',
    level: 'beginner',
    relatedNodes: ['how-does-sip-work-monthly', 'what-is-lumpsum', 'why-continue-sip-in-crash', 'what-is-rupee-cost-averaging'],
  },

  'what-is-lumpsum': {
    id: 'what-is-lumpsum',
    question: 'What is a lumpsum investment?',
    questionI18n: {
      hi: 'एकमुश्त निवेश क्या होता है?',
      ta: 'மொத்த முதலீடு என்றால் என்ன?',
    },
    answer: `A lumpsum is a one-time investment of a larger amount — instead of monthly installments.

If you invested your entire {{totalInvested}} today as a lumpsum at {{annualReturn}}%, it could grow to approximately {{lumpsumValue}}.

Lumpsum works well if you have the money now and the market is at a reasonable level. SIP works better if you're investing from monthly income or if market timing is uncertain.`,
    variables: ['totalInvested', 'annualReturn', 'lumpsumValue', 'requiredSIP', 'inflatedGoal'],
    category: 'goal-basics',
    level: 'beginner',
    relatedNodes: ['what-is-sip', 'what-is-rupee-cost-averaging', 'why-continue-sip-in-crash', 'how-long-should-i-invest'],
  },

  'what-is-a-realistic-goal': {
    id: 'what-is-a-realistic-goal',
    question: 'Is my goal realistic?',
    questionI18n: {
      hi: 'क्या मेरा लक्ष्य यथार्थवादी है?',
      ta: 'என் இலக்கு நடைமுறையானதா?',
    },
    answer: `Your goal requires {{requiredSIP}} per month.

A common benchmark: your monthly investment should ideally be 20–30% of your monthly income.

If {{requiredSIP}} is more than 30% of your income, consider:
1. Extending your timeline from {{years}} to {{extendedYears}} years — SIP drops to approximately {{extendedSip}}.
2. Using a step-up SIP — start lower and increase as income grows.
3. Adjusting your goal target slightly.

Small changes in timeline or step-up rate can make a goal significantly more achievable.`,
    variables: ['requiredSIP', 'years', 'extendedYears', 'extendedSip'],
    category: 'goal-basics',
    level: 'beginner',
    relatedNodes: ['what-is-step-up-sip', 'how-to-reduce-required-sip', 'how-long-should-i-invest', 'starting-early-vs-investing-more'],
  },

  'how-long-should-i-invest': {
    id: 'how-long-should-i-invest',
    question: 'How does time affect my goal?',
    questionI18n: {
      hi: 'समय मेरे लक्ष्य को कैसे प्रभावित करता है?',
      ta: 'நேரம் என் இலக்கை எவ்வாறு பாதிக்கிறது?',
    },
    answer: `Time is the single most powerful variable in this calculator.

At {{annualReturn}}% returns:
- {{years}} years (your timeline): {{requiredSIP}}/month
- {{yearsPlus5}} years: {{extendedSip}}/month (less per month)

Adding just 5 years to your timeline reduces your required monthly investment significantly.

That's the cost of starting 5 years later — or the reward of starting 5 years earlier.`,
    variables: ['annualReturn', 'years', 'requiredSIP', 'yearsPlus5', 'extendedSip'],
    category: 'goal-basics',
    level: 'beginner',
    relatedNodes: ['starting-early-vs-investing-more', 'what-is-compounding', 'rule-of-72', 'what-is-a-realistic-goal'],
  },

  // ─── INFLATION (5 nodes) ─────────────────────────────

  'what-is-inflation': {
    id: 'what-is-inflation',
    question: 'What is inflation and why does it matter?',
    questionI18n: {
      hi: 'मुद्रास्फीति क्या है और यह क्यों महत्वपूर्ण है?',
      ta: 'பணவீக்கம் என்றால் என்ன, ஏன் முக்கியம்?',
    },
    answer: `Inflation means the same thing costs more money every year.

You've set your inflation assumption at {{inflationRate}}%.

At this rate, your goal of {{presentCost}} today will actually cost {{inflatedGoal}} when you need it in {{years}} years.

That's {{inflationCost}} more — just from prices rising. This is why we calculate for the future cost, not today's cost.

If you ignored inflation and saved for {{presentCost}} only, you'd be {{inflationCost}} short on the day you need it.`,
    variables: ['inflationRate', 'presentCost', 'inflatedGoal', 'years', 'inflationCost'],
    category: 'inflation',
    level: 'beginner',
    relatedNodes: ['why-does-inflation-affect-my-goal', 'what-is-a-realistic-inflation-rate', 'inflation-vs-returns-real-return', 'what-if-inflation-is-higher'],
    triggerDepth: 2,
  },

  'why-does-inflation-affect-my-goal': {
    id: 'why-does-inflation-affect-my-goal',
    question: 'Why is the inflated goal higher than my goal today?',
    questionI18n: {
      hi: 'मुद्रास्फीति के बाद लक्ष्य आज के लक्ष्य से अधिक क्यों है?',
      ta: 'பணவீக்கத்திற்கு பிறகு இலக்கு ஏன் அதிகமாக உள்ளது?',
    },
    answer: `The calculator inflates your goal using this formula:

Future Cost = {{presentCost}} × (1 + {{inflationRate}}%)^{{years}}
= {{presentCost}} × {{inflationMultiplier}}
= {{inflatedGoal}}

The {{inflationMultiplier}}x multiplier represents how much more expensive things get over {{years}} years at {{inflationRate}}% annual inflation.`,
    variables: ['presentCost', 'inflationRate', 'years', 'inflationMultiplier', 'inflatedGoal'],
    category: 'inflation',
    level: 'intermediate',
    relatedNodes: ['what-is-inflation', 'what-is-a-realistic-inflation-rate', 'inflation-vs-returns-real-return', 'what-if-inflation-is-higher'],
  },

  'what-is-a-realistic-inflation-rate': {
    id: 'what-is-a-realistic-inflation-rate',
    question: 'What inflation rate should I use?',
    questionI18n: {
      hi: 'मुझे कौन सी मुद्रास्फीति दर उपयोग करनी चाहिए?',
      ta: 'நான் என்ன பணவீக்க விகிதத்தை பயன்படுத்த வேண்டும்?',
    },
    answer: `India's consumer price inflation has averaged roughly 5–7% over the past decade.

Your current assumption: {{inflationRate}}%

General guidelines:
- General expenses: 5–6%
- Education costs: 8–10%
- Healthcare: 10–12%
- Property: varies by location

If your goal is education or healthcare, consider increasing your inflation assumption.`,
    variables: ['inflationRate'],
    category: 'inflation',
    level: 'beginner',
    relatedNodes: ['what-is-inflation', 'what-if-inflation-is-higher', 'inflation-vs-returns-real-return', 'what-is-a-realistic-goal'],
  },

  'inflation-vs-returns-real-return': {
    id: 'inflation-vs-returns-real-return',
    question: 'What is real return?',
    questionI18n: {
      hi: 'वास्तविक रिटर्न क्या होता है?',
      ta: 'உண்மையான வருமானம் என்றால் என்ன?',
    },
    answer: `Real return is what you actually earn after accounting for inflation.

Real Return ≈ Nominal Return − Inflation Rate

Your nominal return: {{annualReturn}}%
Your inflation rate: {{inflationRate}}%
Your real return: approximately {{realReturn}}%

This means your money is truly growing at {{realReturn}}% per year in purchasing power.

If your real return is negative, your money is actually losing value even as the number grows.`,
    variables: ['annualReturn', 'inflationRate', 'realReturn'],
    category: 'inflation',
    level: 'intermediate',
    relatedNodes: ['what-is-inflation', 'what-is-annual-return', 'is-12-percent-realistic', 'why-invest-instead-of-save'],
  },

  'what-if-inflation-is-higher': {
    id: 'what-if-inflation-is-higher',
    question: 'What if inflation is higher than I assumed?',
    questionI18n: {
      hi: 'अगर मुद्रास्फीति मेरी धारणा से अधिक हो तो?',
      ta: 'பணவீக்கம் என் அனுமானத்தை விட அதிகமாக இருந்தால்?',
    },
    answer: `You've assumed {{inflationRate}}% inflation.

If actual inflation is 2% higher ({{inflationRatePlus2}}%):
- Your goal inflates to {{inflatedGoalHigher}} instead of {{inflatedGoal}}
- Your required SIP increases accordingly

A practical approach: use a slightly higher inflation assumption as a safety buffer.`,
    variables: ['inflationRate', 'inflationRatePlus2', 'inflatedGoalHigher', 'inflatedGoal'],
    category: 'inflation',
    level: 'intermediate',
    relatedNodes: ['what-is-inflation', 'what-is-a-realistic-inflation-rate', 'how-to-reduce-required-sip', 'what-is-step-up-sip'],
  },

  // ─── RETURNS (6 nodes) ───────────────────────────────

  'what-is-annual-return': {
    id: 'what-is-annual-return',
    question: 'What does the expected return mean?',
    questionI18n: {
      hi: 'अपेक्षित रिटर्न का क्या मतलब है?',
      ta: 'எதிர்பார்க்கப்படும் வருமானம் என்றால் என்ன?',
    },
    answer: `Expected return is how much you assume your investment grows each year, on average.

You've set this at {{annualReturn}}%.

This is not guaranteed — it's an assumption for planning purposes. The {{annualReturn}}% is applied monthly in this calculator ({{monthlyReturn}}% per month), which is how mutual fund growth actually works.`,
    variables: ['annualReturn', 'monthlyReturn'],
    category: 'returns',
    level: 'beginner',
    relatedNodes: ['is-12-percent-realistic', 'what-affects-returns', 'what-is-compounding', 'inflation-vs-returns-real-return'],
  },

  'is-12-percent-realistic': {
    id: 'is-12-percent-realistic',
    question: 'Is my return assumption realistic?',
    questionI18n: {
      hi: 'क्या मेरी रिटर्न की धारणा यथार्थवादी है?',
      ta: 'என் வருமான அனுமானம் நடைமுறையானதா?',
    },
    answer: `Your assumed return: {{annualReturn}}%

Context (illustrative, not a guarantee):
- Large-cap equity funds: historically ~10–12%
- Mid-cap funds: historically ~12–15% (with higher volatility)
- Debt funds: typically 6–8%
- Fixed deposits: typically 6–7%

For long-term goals ({{years}}+ years), equity mutual funds have historically delivered returns in the 10–14% range.

Important: Past performance may or may not be sustained in future.`,
    variables: ['annualReturn', 'years'],
    category: 'returns',
    level: 'intermediate',
    relatedNodes: ['what-is-annual-return', 'what-affects-returns', 'what-is-nav', 'inflation-vs-returns-real-return'],
  },

  'what-is-compounding': {
    id: 'what-is-compounding',
    question: 'How does compounding work?',
    questionI18n: {
      hi: 'चक्रवृद्धि कैसे काम करती है?',
      ta: 'கூட்டு வட்டி எவ்வாறு செயல்படுகிறது?',
    },
    answer: `Compounding means you earn returns on your returns — not just on what you invested.

By year {{years}}, you will have invested {{totalInvested}} but your corpus will be {{inflatedGoal}} — the difference of {{wealthGained}} is entirely from compounding.

The longer the period, the more dramatic this effect becomes. This is why starting early matters so much more than the amount.`,
    variables: ['requiredSIP', 'years', 'totalInvested', 'inflatedGoal', 'wealthGained'],
    category: 'returns',
    level: 'beginner',
    relatedNodes: ['rule-of-72', 'starting-early-vs-investing-more', 'what-is-annual-return', 'how-does-sip-work-monthly'],
  },

  'rule-of-72': {
    id: 'rule-of-72',
    question: 'How quickly will my money double?',
    questionI18n: {
      hi: 'मेरा पैसा कितनी जल्दी दोगुना होगा?',
      ta: 'என் பணம் எவ்வளவு விரைவில் இரட்டிப்பாகும்?',
    },
    answer: `The Rule of 72 is a quick mental calculation:

72 ÷ {{annualReturn}}% = {{doublingYears}} years

So at {{annualReturn}}% returns, your money doubles every {{doublingYears}} years.

Over your {{years}}-year journey, your initial investment doubles approximately {{doublingCount}} times.

Compare: at a savings account rate of 3.5%: 72 ÷ 3.5 = 20.6 years to double.`,
    variables: ['annualReturn', 'doublingYears', 'years', 'doublingCount'],
    category: 'returns',
    level: 'beginner',
    relatedNodes: ['what-is-compounding', 'starting-early-vs-investing-more', 'what-is-annual-return', 'why-invest-instead-of-save'],
  },

  'what-is-nav': {
    id: 'what-is-nav',
    question: 'What is NAV?',
    questionI18n: {
      hi: 'NAV क्या होती है?',
      ta: 'NAV என்றால் என்ன?',
    },
    answer: `NAV stands for Net Asset Value — the price of one unit of a mutual fund.

When you invest {{requiredSIP}} this month, the fund buys you units at today's NAV price.

If NAV is ₹100 and you invest {{requiredSIP}}, you get {{unitsAtNav100}} units.

Next month, if NAV has risen to ₹105, your {{unitsAtNav100}} units are now worth {{valueAtNav105}}.

NAV rises when the fund's underlying investments rise, and falls when they fall.`,
    variables: ['requiredSIP', 'unitsAtNav100', 'valueAtNav105'],
    category: 'returns',
    level: 'beginner',
    relatedNodes: ['what-is-sip', 'what-is-rupee-cost-averaging', 'why-continue-sip-in-crash', 'what-affects-returns'],
  },

  'what-affects-returns': {
    id: 'what-affects-returns',
    question: 'What factors affect my actual returns?',
    questionI18n: {
      hi: 'मेरे वास्तविक रिटर्न को कौन से कारक प्रभावित करते हैं?',
      ta: 'என் உண்மையான வருமானத்தை எந்த காரணிகள் பாதிக்கின்றன?',
    },
    answer: `Several factors affect the returns you actually receive:

1. Market performance — the biggest factor, outside your control.
2. Expense ratio — your fund deducts {{expenseRatio}}% annually, reducing effective return from {{annualReturn}}% to {{effectiveReturn}}%.
3. Exit load — a fee if you redeem early (typically 1% within 1 year).
4. Tax — LTCG of 12.5% on gains above ₹1.25 lakh/year (FY 2024-25).
5. Fund selection — different categories have different risk-return profiles.

Of these, expense ratio is the one you can most directly control.`,
    variables: ['expenseRatio', 'annualReturn', 'effectiveReturn'],
    category: 'returns',
    level: 'intermediate',
    relatedNodes: ['what-is-expense-ratio', 'what-is-ltcg', 'what-is-nav', 'is-12-percent-realistic'],
  },

  // ─── FEES (5 nodes) ──────────────────────────────────

  'what-is-expense-ratio': {
    id: 'what-is-expense-ratio',
    question: 'What is an expense ratio?',
    questionI18n: {
      hi: 'व्यय अनुपात क्या होता है?',
      ta: 'செலவு விகிதம் என்றால் என்ன?',
    },
    answer: `An expense ratio is an annual fee that a mutual fund charges to manage your money. It's deducted automatically every day.

Your current assumption: {{expenseRatio}}%

Over your full {{years}}-year journey, fees reduce your final corpus by approximately {{totalFeeDrag}}.

Think of it as a gym membership fee — deducted whether you worked out or not.`,
    variables: ['expenseRatio', 'years', 'totalFeeDrag'],
    category: 'fees',
    level: 'beginner',
    relatedNodes: ['how-does-expense-ratio-affect-goal', 'what-is-a-good-expense-ratio', 'expense-ratio-vs-exit-load', 'how-to-reduce-required-sip'],
    triggerDepth: 3,
  },

  'how-does-expense-ratio-affect-goal': {
    id: 'how-does-expense-ratio-affect-goal',
    question: 'How does the expense ratio affect my goal?',
    questionI18n: {
      hi: 'व्यय अनुपात मेरे लक्ष्य को कैसे प्रभावित करता है?',
      ta: 'செலவு விகிதம் என் இலக்கை எவ்வாறு பாதிக்கிறது?',
    },
    answer: `Your expense ratio reduces your effective return.

Gross return: {{annualReturn}}%
Expense ratio: {{expenseRatio}}%
Effective return: {{effectiveReturn}}%

This {{expenseRatio}}% reduction means you need to invest more per month to compensate for fees.`,
    variables: ['annualReturn', 'expenseRatio', 'effectiveReturn'],
    category: 'fees',
    level: 'intermediate',
    relatedNodes: ['what-is-expense-ratio', 'what-is-a-good-expense-ratio', 'how-to-reduce-required-sip', 'what-affects-returns'],
  },

  'what-is-a-good-expense-ratio': {
    id: 'what-is-a-good-expense-ratio',
    question: 'What is a good expense ratio?',
    questionI18n: {
      hi: 'एक अच्छा व्यय अनुपात क्या होता है?',
      ta: 'நல்ல செலவு விகிதம் என்ன?',
    },
    answer: `Expense ratios in India typically range:

- Index funds (passive): 0.1% – 0.5%
- Large-cap active funds: 0.5% – 1.5%
- Mid/small-cap active funds: 1.0% – 2.5%
- Direct plans: lower than regular plans

Your current assumption: {{expenseRatio}}%

For long-term goals like yours ({{years}} years), even a difference of 1% matters enormously.`,
    variables: ['expenseRatio', 'years'],
    category: 'fees',
    level: 'intermediate',
    relatedNodes: ['what-is-expense-ratio', 'how-does-expense-ratio-affect-goal', 'expense-ratio-vs-exit-load', 'what-affects-returns'],
  },

  'expense-ratio-vs-exit-load': {
    id: 'expense-ratio-vs-exit-load',
    question: 'Expense ratio vs exit load — what is the difference?',
    questionI18n: {
      hi: 'व्यय अनुपात और एग्जिट लोड में क्या फर्क है?',
      ta: 'செலவு விகிதம் மற்றும் எக்சிட் லோட் — வேறுபாடு என்ன?',
    },
    answer: `These are two different types of fees:

EXPENSE RATIO — ongoing, annual
- Charged every year, automatically
- At {{expenseRatio}}%, costs you {{totalFeeDrag}} over {{years}} years

EXIT LOAD — one-time, on redemption
- Only charged if you redeem within a specified period (typically 1 year)
- Typical rate: 1% of redemption amount

The expense ratio is the more significant long-term cost.`,
    variables: ['expenseRatio', 'totalFeeDrag', 'years'],
    category: 'fees',
    level: 'intermediate',
    relatedNodes: ['what-is-expense-ratio', 'what-is-ltcg', 'when-does-tax-apply', 'what-affects-returns'],
  },

  'what-are-total-fund-costs': {
    id: 'what-are-total-fund-costs',
    question: 'What are all the costs of investing in a mutual fund?',
    questionI18n: {
      hi: 'म्यूचुअल फंड में निवेश के सभी खर्चे क्या हैं?',
      ta: 'மியூச்சுவல் ஃபண்டில் முதலீட்டின் அனைத்து செலவுகள் என்ன?',
    },
    answer: `Complete cost picture for your investment:

ONGOING COSTS (every year):
- Expense ratio: {{expenseRatio}}% annually

ONE-TIME COSTS (if applicable):
- Exit load: 1% if redeemed within 1 year

TAX ON GAINS (at redemption):
- LTCG above ₹1.25 lakh: 12.5%
- STCG (held < 1 year): 20%
- Estimated tax on your corpus: approximately {{estimatedLTCG}}`,
    variables: ['expenseRatio', 'years', 'estimatedLTCG'],
    category: 'fees',
    level: 'advanced',
    relatedNodes: ['what-is-expense-ratio', 'what-is-ltcg', 'when-does-tax-apply', 'how-to-reduce-required-sip'],
  },

  // ─── TAX (4 nodes) ───────────────────────────────────

  'what-is-ltcg': {
    id: 'what-is-ltcg',
    question: 'What is LTCG tax on mutual funds?',
    questionI18n: {
      hi: 'म्यूचुअल फंड पर LTCG टैक्स क्या है?',
      ta: 'மியூச்சுவல் ஃபண்டில் LTCG வரி என்றால் என்ன?',
    },
    answer: `LTCG stands for Long-Term Capital Gains.

For equity mutual funds (FY 2024-25):
- Gains from units held MORE than 1 year
- Tax rate: 12.5% on gains above ₹1.25 lakh/year

For your goal:
Total corpus at end: {{inflatedGoal}}
Total invested: {{totalInvested}}
Total gains: {{wealthGained}}

Estimated LTCG tax (simplified): approximately {{estimatedLTCG}}

Consult a tax advisor for exact figures.`,
    variables: ['inflatedGoal', 'totalInvested', 'wealthGained', 'estimatedLTCG'],
    category: 'tax',
    level: 'intermediate',
    relatedNodes: ['what-is-stcg', 'when-does-tax-apply', 'how-does-tax-affect-my-corpus', 'expense-ratio-vs-exit-load'],
    triggerDepth: 6,
  },

  'what-is-stcg': {
    id: 'what-is-stcg',
    question: 'What is STCG tax?',
    questionI18n: {
      hi: 'STCG टैक्स क्या है?',
      ta: 'STCG வரி என்றால் என்ன?',
    },
    answer: `STCG stands for Short-Term Capital Gains.

For equity mutual funds:
- Gains from units held LESS than 1 year
- Tax rate: 20% flat (FY 2024-25)
- No exemption threshold

For your goal ({{years}} years away), STCG is unlikely to apply unless you redeem early.

Holding over 1 year reduces your tax rate from 20% to 12.5% and gives you the ₹1.25L annual exemption.`,
    variables: ['requiredSIP', 'years'],
    category: 'tax',
    level: 'intermediate',
    relatedNodes: ['what-is-ltcg', 'when-does-tax-apply', 'why-continue-sip-in-crash', 'how-does-tax-affect-my-corpus'],
  },

  'when-does-tax-apply': {
    id: 'when-does-tax-apply',
    question: 'When exactly does tax apply?',
    questionI18n: {
      hi: 'टैक्स ठीक कब लागू होता है?',
      ta: 'வரி சரியாக எப்போது பொருந்தும்?',
    },
    answer: `Tax applies when you REDEEM (sell) your mutual fund units — not while you hold them.

For a SIP held to its full {{years}}-year term, the vast majority of your corpus qualifies for the lower LTCG rate.

Note: Tax laws can change. The figures here reflect FY 2024-25 rules and are illustrative only.`,
    variables: ['years'],
    category: 'tax',
    level: 'advanced',
    relatedNodes: ['what-is-ltcg', 'what-is-stcg', 'how-does-tax-affect-my-corpus', 'what-are-total-fund-costs'],
  },

  'how-does-tax-affect-my-corpus': {
    id: 'how-does-tax-affect-my-corpus',
    question: 'How much will tax reduce my final corpus?',
    questionI18n: {
      hi: 'टैक्स मेरे अंतिम कोष को कितना कम करेगा?',
      ta: 'வரி என் இறுதி நிதியை எவ்வளவு குறைக்கும்?',
    },
    answer: `Simplified tax impact on your goal:

Target corpus: {{inflatedGoal}}
Total you invest: {{totalInvested}}
Gains: {{wealthGained}}

LTCG tax estimate (12.5% on gains above ₹1.25L): approximately {{estimatedLTCG}}

Post-tax corpus: {{postTaxCorpus}}

Important: This is a simplified estimate. Consult a tax advisor for precise planning.`,
    variables: ['inflatedGoal', 'totalInvested', 'wealthGained', 'estimatedLTCG', 'postTaxCorpus'],
    category: 'tax',
    level: 'advanced',
    relatedNodes: ['what-is-ltcg', 'what-are-total-fund-costs', 'how-to-reduce-required-sip', 'what-is-step-up-sip'],
  },

  // ─── MARKET BEHAVIOR (5 nodes) ───────────────────────

  'what-is-market-volatility': {
    id: 'what-is-market-volatility',
    question: 'What is market volatility?',
    questionI18n: {
      hi: 'बाजार की अस्थिरता क्या है?',
      ta: 'சந்தை நிலையற்ற தன்மை என்றால் என்ன?',
    },
    answer: `Volatility means the market goes up and down — sometimes dramatically — in the short term.

Your assumed return of {{annualReturn}}% is an average over {{years}} years. In reality, some years might return +30%, others might fall −20%.

For a SIP investor, volatility is actually useful — when the market falls, your monthly {{requiredSIP}} buys more units at lower prices.

Your {{years}}-year timeline significantly reduces the risk of volatility.`,
    variables: ['annualReturn', 'years', 'requiredSIP'],
    category: 'market-behavior',
    level: 'intermediate',
    relatedNodes: ['what-happens-in-a-crash', 'why-continue-sip-in-crash', 'what-is-rupee-cost-averaging', 'how-long-do-markets-take-to-recover'],
  },

  'what-happens-in-a-crash': {
    id: 'what-happens-in-a-crash',
    question: 'What happens to my SIP during a market crash?',
    questionI18n: {
      hi: 'बाजार क्रैश के दौरान मेरी SIP का क्या होता है?',
      ta: 'சந்தை வீழ்ச்சியில் என் SIP-க்கு என்ன ஆகும்?',
    },
    answer: `During a market crash, NAV prices fall — which means your monthly {{requiredSIP}} buys more units than usual.

Example: If NAV falls 40% during a crash:
- Before crash: {{requiredSIP}} buys {{normalUnits}} units at NAV ₹100
- During crash: {{requiredSIP}} buys {{crashUnits}} units at NAV ₹60

Those extra {{extraUnits}} units were bought at a discount. When the market recovers, all your units rise in value.`,
    variables: ['requiredSIP', 'normalUnits', 'crashUnits', 'extraUnits', 'years'],
    category: 'market-behavior',
    level: 'intermediate',
    relatedNodes: ['why-continue-sip-in-crash', 'what-is-rupee-cost-averaging', 'how-long-do-markets-take-to-recover', 'what-is-market-volatility'],
  },

  'why-continue-sip-in-crash': {
    id: 'why-continue-sip-in-crash',
    question: 'Why should I keep investing during a crash?',
    questionI18n: {
      hi: 'क्रैश के दौरान मुझे निवेश जारी क्यों रखना चाहिए?',
      ta: 'வீழ்ச்சியின் போது ஏன் தொடர்ந்து முதலீடு செய்ய வேண்டும்?',
    },
    answer: `Stopping your SIP during a crash means missing the cheapest buying opportunity.

Imagine your favourite item goes on a 40% sale. You wouldn't stop buying it — you'd buy more.

The market has recovered from every historical crash. The question is whether you were still invested when it did.`,
    variables: [],
    category: 'market-behavior',
    level: 'intermediate',
    relatedNodes: ['what-is-rupee-cost-averaging', 'what-happens-in-a-crash', 'how-long-do-markets-take-to-recover', 'what-is-market-volatility'],
  },

  'what-is-rupee-cost-averaging': {
    id: 'what-is-rupee-cost-averaging',
    question: 'What is rupee cost averaging?',
    questionI18n: {
      hi: 'रुपया लागत औसत क्या है?',
      ta: 'ரூபாய் செலவுச் சராசரி என்றால் என்ன?',
    },
    answer: `Rupee cost averaging is what happens automatically when you invest a fixed amount every month via SIP.

Fixed amount: {{requiredSIP}}/month

When NAV is high (₹120): you buy fewer units — {{lowUnitsExample}}
When NAV is low (₹80): you buy more units — {{highUnitsExample}}

Your average cost per unit ends up lower than the average NAV over the period. This is why SIP is considered lower risk than lumpsum for most retail investors.`,
    variables: ['requiredSIP', 'lowUnitsExample', 'highUnitsExample'],
    category: 'market-behavior',
    level: 'intermediate',
    relatedNodes: ['why-continue-sip-in-crash', 'what-happens-in-a-crash', 'what-is-nav', 'what-is-lumpsum'],
  },

  'how-long-do-markets-take-to-recover': {
    id: 'how-long-do-markets-take-to-recover',
    question: 'How long do markets take to recover from crashes?',
    questionI18n: {
      hi: 'क्रैश के बाद बाजार को ठीक होने में कितना समय लगता है?',
      ta: 'வீழ்ச்சிக்கு பிறகு சந்தை மீண்டு வர எவ்வளவு நேரம் ஆகும்?',
    },
    answer: `Historical recovery times for Indian markets (illustrative):

- 2008 Global Financial Crisis: Nifty 50 fell ~60%, recovered in ~24 months
- 2020 COVID crash: Fell ~38%, recovered in ~6 months
- 2015-16 correction: Fell ~25%, recovered in ~18 months

For your {{years}}-year goal, even a 2-year crash and recovery leaves you with plenty of normal growth afterward. This is why time horizon matters so much.`,
    variables: ['years'],
    category: 'market-behavior',
    level: 'intermediate',
    relatedNodes: ['why-continue-sip-in-crash', 'what-happens-in-a-crash', 'what-is-market-volatility', 'how-long-should-i-invest'],
  },

  // ─── SIP MECHANICS (5 nodes) ─────────────────────────

  'how-does-sip-work-monthly': {
    id: 'how-does-sip-work-monthly',
    question: 'How does a SIP work month by month?',
    questionI18n: {
      hi: 'SIP महीने दर महीने कैसे काम करती है?',
      ta: 'SIP மாதந்தோறும் எவ்வாறு செயல்படுகிறது?',
    },
    answer: `Every month on your SIP date:

1. {{requiredSIP}} is debited from your bank account automatically
2. The fund's current NAV determines how many units you get
3. These units are added to your account
4. Your total corpus = all units × current NAV

The monthly compounding is why this calculator uses {{monthlyReturn}}%/month (not {{annualReturn}}%/year) — it's more accurate to how SIPs actually grow.`,
    variables: ['requiredSIP', 'monthlyReturn', 'annualReturn'],
    category: 'sip-mechanics',
    level: 'beginner',
    relatedNodes: ['what-is-sip', 'what-is-nav', 'what-is-compounding', 'what-is-rupee-cost-averaging'],
  },

  'what-is-step-up-sip': {
    id: 'what-is-step-up-sip',
    question: 'What is a step-up SIP?',
    questionI18n: {
      hi: 'स्टेप-अप SIP क्या होती है?',
      ta: 'நிலை-உயர்வு SIP என்றால் என்ன?',
    },
    answer: `A step-up SIP increases your monthly investment by a fixed percentage each year.

With {{stepUpRate}}% annual increase, you could achieve the same {{inflatedGoal}} goal starting with just {{stepUpSip}}/month instead of {{requiredSIP}}/month.

That's {{stepUpSaving}} less per month to start — making your goal significantly more achievable today.`,
    variables: ['stepUpRate', 'stepUpSip', 'inflatedGoal', 'requiredSIP', 'stepUpSaving'],
    category: 'sip-mechanics',
    level: 'beginner',
    relatedNodes: ['why-step-up-reduces-initial-sip', 'what-is-a-realistic-goal', 'how-to-reduce-required-sip', 'starting-early-vs-investing-more'],
    triggerDepth: 5,
  },

  'why-step-up-reduces-initial-sip': {
    id: 'why-step-up-reduces-initial-sip',
    question: 'Why does a step-up SIP need less money to start?',
    questionI18n: {
      hi: 'स्टेप-अप SIP शुरू करने के लिए कम पैसे क्यों चाहिए?',
      ta: 'நிலை-உயர்வு SIP-க்கு ஏன் குறைவான தொகை தேவை?',
    },
    answer: `Because you invest more in later years when compounding has already been running.

Without step-up: {{requiredSIP}}/month flat
With {{stepUpRate}}% step-up: starts at {{stepUpSip}}

Money invested earlier compounds longer and contributes more per rupee invested. Later money compensates by being a larger amount.`,
    variables: ['requiredSIP', 'stepUpRate', 'stepUpSip'],
    category: 'sip-mechanics',
    level: 'intermediate',
    relatedNodes: ['what-is-step-up-sip', 'what-is-compounding', 'starting-early-vs-investing-more', 'how-to-reduce-required-sip'],
  },

  'what-if-i-miss-a-month': {
    id: 'what-if-i-miss-a-month',
    question: 'What happens if I miss a SIP payment?',
    questionI18n: {
      hi: 'अगर मैं एक SIP किस्त चूक जाऊं तो क्या होता है?',
      ta: 'ஒரு SIP கட்டணம் தவறவிட்டால் என்ன ஆகும்?',
    },
    answer: `Missing one SIP month has a calculable but small impact.

You miss investing {{requiredSIP}}.

Practically: most mutual fund SIPs pause automatically if your bank account lacks funds, and resume the next month. There's no penalty for missing a month.`,
    variables: ['requiredSIP', 'years', 'inflatedGoal'],
    category: 'sip-mechanics',
    level: 'beginner',
    relatedNodes: ['what-is-sip', 'what-is-step-up-sip', 'how-does-sip-work-monthly', 'can-i-pause-my-sip'],
  },

  'can-i-pause-my-sip': {
    id: 'can-i-pause-my-sip',
    question: 'Can I pause or stop my SIP?',
    questionI18n: {
      hi: 'क्या मैं अपनी SIP रोक या बंद कर सकता हूँ?',
      ta: 'என் SIPஐ இடைநிறுத்தலாமா அல்லது நிறுத்தலாமா?',
    },
    answer: `Yes — you can pause, reduce, or stop a SIP at any time without penalty.

Your existing corpus continues to grow at {{annualReturn}}% even during the pause — you're just not adding new units.

After resuming, you can make up the shortfall by temporarily increasing your SIP or extending your timeline.

Important: your fund units and gains are safe when you pause. The market continues working on what's already there.`,
    variables: ['annualReturn', 'requiredSIP'],
    category: 'sip-mechanics',
    level: 'beginner',
    relatedNodes: ['what-if-i-miss-a-month', 'what-is-sip', 'how-to-reduce-required-sip', 'what-is-a-realistic-goal'],
  },

  // ─── OPTIMIZATION (4 nodes) ──────────────────────────

  'how-to-reduce-required-sip': {
    id: 'how-to-reduce-required-sip',
    question: 'How can I reduce my required monthly SIP?',
    questionI18n: {
      hi: 'मैं अपनी आवश्यक मासिक SIP कैसे कम कर सकता हूँ?',
      ta: 'என் தேவையான மாதாந்திர SIPஐ எப்படி குறைக்கலாம்?',
    },
    answer: `Four levers you control:

1. EXTEND YOUR TIMELINE (+5 years)
   Current: {{requiredSIP}}/month for {{years}} years
   Extended: {{extendedSip}}/month for {{extendedYears}} years

2. USE STEP-UP SIP ({{stepUpRate}}% annual increase)
   Starting SIP: {{stepUpSip}}/month vs flat {{requiredSIP}}/month

3. CHOOSE LOWER EXPENSE RATIO
   Reducing expense ratio saves money over time

4. REDUCE GOAL SLIGHTLY (−10%)
   Adjusting the goal target can make a meaningful difference`,
    variables: ['requiredSIP', 'years', 'extendedSip', 'extendedYears', 'stepUpSip', 'stepUpRate', 'expenseRatio'],
    category: 'optimization',
    level: 'intermediate',
    relatedNodes: ['what-is-step-up-sip', 'what-is-expense-ratio', 'starting-early-vs-investing-more', 'what-is-a-realistic-goal'],
  },

  'what-is-the-biggest-factor': {
    id: 'what-is-the-biggest-factor',
    question: 'What is the single biggest factor in reaching my goal?',
    questionI18n: {
      hi: 'मेरे लक्ष्य तक पहुँचने में सबसे बड़ा कारक कौन सा है?',
      ta: 'என் இலக்கை அடைவதில் மிக முக்கியமான காரணி என்ன?',
    },
    answer: `Time. By a significant margin.

At {{annualReturn}}% returns:

Starting TODAY ({{years}} years): {{requiredSIP}}/month

Every month you wait makes reaching your goal more expensive.

The total extra cost of delay compounds dramatically over time.`,
    variables: ['annualReturn', 'years', 'requiredSIP'],
    category: 'optimization',
    level: 'beginner',
    relatedNodes: ['starting-early-vs-investing-more', 'what-is-compounding', 'rule-of-72', 'how-long-should-i-invest'],
  },

  'starting-early-vs-investing-more': {
    id: 'starting-early-vs-investing-more',
    question: 'Is it better to start early or invest more?',
    questionI18n: {
      hi: 'क्या जल्दी शुरू करना बेहतर है या अधिक निवेश करना?',
      ta: 'முன்னதாக தொடங்குவது நல்லதா அல்லது அதிகமாக முதலீடு செய்வது நல்லதா?',
    },
    answer: `Starting early wins. The math is stark.

At {{annualReturn}}% returns for {{years}} years, your required SIP is {{requiredSIP}}/month.

Starting with even a small SIP today, then increasing it over time, typically outperforms waiting to invest a large amount later.

The principle: time in the market beats amount in the market for most real-world scenarios.`,
    variables: ['requiredSIP', 'years', 'annualReturn', 'inflatedGoal'],
    category: 'optimization',
    level: 'beginner',
    relatedNodes: ['what-is-the-biggest-factor', 'what-is-compounding', 'what-is-step-up-sip', 'rule-of-72'],
  },

  'how-to-reduce-required-sip-advanced': {
    id: 'how-to-reduce-required-sip-advanced',
    question: 'What is the mathematically optimal investment strategy?',
    questionI18n: {
      hi: 'गणितीय रूप से इष्टतम निवेश रणनीति क्या है?',
      ta: 'கணித ரீதியாக உகந்த முதலீட்டு உத்தி என்ன?',
    },
    answer: `Given your inputs, the optimized strategy is:

BASE CASE: {{requiredSIP}}/month flat for {{years}} years

OPTIMIZED:
- Start with a lower SIP using step-up at {{stepUpRate}}%/year
- Target expense ratio of 0.2–0.3%
- Same final corpus: {{inflatedGoal}} ✓

The optimization works because lower early SIP lets compounding do more work, step-up matches income growth, and lower expense ratio keeps more returns in your corpus.`,
    variables: ['requiredSIP', 'years', 'stepUpRate', 'inflatedGoal'],
    category: 'optimization',
    level: 'advanced',
    relatedNodes: ['what-is-step-up-sip', 'what-is-expense-ratio', 'how-to-reduce-required-sip', 'what-is-the-biggest-factor'],
  },
};
