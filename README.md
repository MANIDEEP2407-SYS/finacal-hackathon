# FinCal — Goal-Based Investment Calculator

**FinCal** is a premium, educational financial planning tool built for the **FinCal Innovation Hackathon (Technex’26)** in collaboration with **HDFC Mutual Fund**.

The project focuses on **simplifying long-term financial planning** by helping users understand how inflation, returns, time horizon, and investment behavior impact their ability to achieve financial goals.

Unlike traditional financial calculators that only display numbers, FinCal uses a **progressive learning architecture ("7 Depths") and an offline knowledge assistant** to guide users step-by-step through the logic of investing.

---

# Problem Statement

Most financial calculators available online are:

* overly simplistic
* difficult for beginners to understand
* lacking educational guidance
* overwhelming for new investors

This project aims to **transform a calculator into an educational experience** that gradually builds financial understanding.

---

# Solution Overview

FinCal is a **Goal-Based Investment Calculator** that helps users estimate the **monthly SIP required to achieve a future financial goal**.

It explains the financial reasoning through a **layered learning model** where complexity increases gradually.

Users can explore deeper insights such as:

* inflation impact
* compounding effects
* investment costs
* step-up strategies
* market behavior

---

# Key Features

## 7-Depth Progressive Learning Architecture

FinCal reveals financial complexity gradually so users are not overwhelmed.

| Depth   | Concept Introduced                  |
| ------- | ----------------------------------- |
| Depth 1 | Baseline Goal (Today's Cost)        |
| Depth 2 | Inflation Impact (Future Goal Cost) |
| Depth 3 | Returns & Compounding               |
| Depth 4 | Fees & Expense Ratios               |
| Depth 5 | Step-Up SIP Strategy                |
| Depth 6 | Market Volatility Awareness         |
| Depth 7 | Tax Efficiency Concepts             |

This architecture allows users to **learn financial planning step by step** rather than confronting all variables at once.

---

# Offline Knowledge Bot

FinCal includes a **custom-built educational assistant** that works **completely offline**.

### Capabilities

* Context-aware financial explanations
* Works without external APIs or LLM services
* Uses a structured **local knowledge graph**
* Explains financial concepts based on the user's current inputs

### Technical Characteristics

* Deterministic knowledge retrieval
* Data-structure driven search logic
* Zero external dependency
* Fully local computation

### Supported Languages

* English
* Hindi (हिन्दी)
* Tamil (தமிழ்)

---

# Financial Model

FinCal uses **industry-standard financial formulas** to calculate the required monthly SIP.

---

## Inflation Adjustment

Future goal value is calculated by adjusting today's cost for inflation.

[
FV_{goal} = PresentCost \times (1 + InflationRate)^{Years}
]

---

## Required SIP Formula

Monthly SIP required to reach the future corpus is calculated using the **Future Value of an Annuity Due**.

[
Required\ SIP =
\frac{FV \times r}
{((1+r)^n - 1)(1+r)}
]

Where:

| Variable | Meaning                    |
| -------- | -------------------------- |
| r        | Monthly return rate        |
| n        | Total investment months    |
| FV       | Inflated future goal value |

---

## Variable Impact Analysis

| Variable      | Change   | Impact                            |
| ------------- | -------- | --------------------------------- |
| Years         | Increase | SIP decreases due to compounding  |
| Inflation     | Increase | Required SIP increases            |
| Returns       | Increase | Required SIP decreases            |
| Expense Ratio | Increase | Required SIP increases            |
| Step-Up       | Increase | Initial SIP requirement decreases |

---

# Tech Stack

| Layer               | Technology   |
| ------------------- | ------------ |
| Framework           | Next.js 15.5 |
| Runtime             | Node.js      |
| Styling             | Tailwind CSS |
| State Management    | React        |
| Financial Precision | Decimal.js   |
| Data Visualization  | Recharts     |
| Icons               | Lucide React |
| Testing             | Vitest       |

---

# Architecture Overview

The application is structured into modular layers:

```
components/
  calculator/
  charts/
  ui/

lib/
  financialMath.ts
  knowledgeGraph.ts
  calculations/

app/
  calculator/
  api/
```

Key modules include:

* **financialMath.ts** → high-precision financial calculations
* **knowledgeGraph.ts** → offline knowledge bot dataset
* **charts/** → investment growth visualization

---

# Accessibility

FinCal is designed to support **WCAG 2.1 AA accessibility guidelines**.

Key accessibility features:

* semantic HTML structure
* keyboard navigation support
* screen reader compatibility
* accessible form labels
* logical tab order
* color contrast compliance

---

# Responsive Design

The application supports:

* Desktop
* Tablet
* Mobile

All interactions are **touch-friendly and responsive**.

---

# Installation

Clone the repository

```bash
git clone https://github.com/yourusername/fincal
```

Install dependencies

```bash
npm install
```

Run the development server

```bash
npm run dev
```

Build for production

```bash
npm run build
```

---

# Testing

Run financial calculation unit tests:

```bash
npm test
```

Tests validate:

* SIP formula correctness
* inflation adjustments
* precision math reliability

---

# Compliance

This project follows the financial calculator guidelines defined for the hackathon.

The calculator:

* uses mathematically correct financial formulas
* keeps all assumptions editable
* avoids predictive or guaranteed outcomes
* focuses on financial education

---

# Disclaimer

This tool has been designed for information purposes only.
Actual results may vary depending on various factors involved in capital markets.
Investors should not consider this as a recommendation for any scheme of HDFC Mutual Fund.
Past performance may or may not be sustained in the future and is not a guarantee of future returns.

---

# Future Enhancements

Potential future improvements include:

* additional financial planning scenarios
* retirement modelling extensions
* behavioral finance insights
* scenario simulation tools

---

# License

This project was created for the **FinCal Innovation Hackathon** and is intended for educational purposes.
