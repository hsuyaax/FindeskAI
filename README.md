# Findesk AI

**Smart Financial Intelligence Protocol — Automated Credit Decisioning Engine**

> Built on **25 April 2026** for the **[Lyzr Agentathon 2026](https://www.lyzr.ai/agentathon)** — Agentic AI Hackathon, Bengaluru. Theme: *Build AI Agents*.

Findesk AI transforms the credit appraisal process from a 3-5 day manual effort into an under-30-second automated pipeline. It ingests multi-format financial documents, performs real-time web research, runs forensic analytics, conducts a multi-agent AI debate, and produces a complete Credit Appraisal Memo (CAM) with explainable recommendations.

Built for the Indian corporate lending landscape — understands GSTR-2A vs 3B, lakhs/crores, CIBIL scores, RBI compliance norms, and Schedule III balance sheet structures.

---

## Hackathon Context

| Field | Detail |
|-------|--------|
| Event | Lyzr Agentathon 2026 |
| Theme | Build AI Agents |
| Location | Bengaluru |
| Date | 25 April 2026 |
| Organizer | Lyzr |
| Live App | https://findesk-fzj8mcd52-aayushkumaraak18-gmailcoms-projects.vercel.app/ |

**Why this fits the "Build AI Agents" theme:** Findesk AI is a multi-agent system in production form. A Research Agent autonomously plans queries across 7 financial dimensions, a three-agent Credit Committee (Hawk / Dove / Owl) debates with formal dissent, and a CAM Generator agent synthesizes the verdict into a regulator-ready memo — all coordinated through a shared analysis context.

---

## Problem

Credit managers face a **Data Paradox** — more information than ever, yet weeks to process a single loan application. Assessing a mid-sized Indian corporate requires stitching together:

- **Structured**: GST filings, ITRs, bank statements
- **Unstructured**: Annual reports, financial statements, board minutes, rating reports
- **External**: News, MCA filings, e-Courts litigation, sector trends
- **Primary**: Factory site visits, management interviews

The current process is slow, biased, and misses early warning signals buried in unstructured text.

## Solution

Findesk AI automates end-to-end CAM preparation across three pillars:

### Pillar 1 — Data Ingestor
- Accepts PDF, PNG, JPG, XLSX, CSV uploads
- Pre-extracted financial data for known companies (Vivriti Capital, Moneyboxx, Tata Capital, Kinara Capital) — instant analysis, zero latency
- OpenAI-powered extraction for unknown documents
- Indian number format parsing (lakhs, crores)

### Pillar 2 — Research Agent
- **Real-time web search** via Tavily API across 7 dimensions: company profile, financials, litigation, news, sector outlook, GST compliance, risk summary
- **FinBERT sentiment analysis** — domain-specific financial NLP running locally (zero API cost, ~50ms/text)
- **Credit Officer portal** — textarea for qualitative notes (site visit observations, management impressions) with AI-adjusted scoring (-10 to +10 points)
- MCA filings, CIBIL data, e-Courts litigation, RBI regulatory changes

### Pillar 3 — Recommendation Engine
- **Five C Framework** — Character, Capacity, Capital, Collateral, Conditions with configurable weights and transparent scoring
- **Multi-Agent Credit Committee** — Hawk (reject bias), Dove (approve bias), Owl (synthesis) using Financial Chain-of-Thought architecture
- **CAM Generator** — Professional Credit Appraisal Memo with term sheet, rate decomposition, and covenants
- **Explainable decisions** — every recommendation includes per-pillar reasoning, risk drivers, and dissent notes

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FINDESK AI ARCHITECTURE                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  LAYER 1: DOCUMENT UNDERSTANDING                            │
│  ├── PDF/Image/Excel upload + OCR                           │
│  ├── Pre-extracted data for known companies (instant)        │
│  ├── OpenAI extraction for unknown documents                 │
│  └── Indian financial format parser (₹Cr/Lakh)              │
│                          ↓                                   │
│  LAYER 2: ANALYSIS ENGINE (Local, $0.00)                    │
│  ├── Ratio Engine — DSCR, D/E, RoA, RoE, NIM, 15+ ratios  │
│  ├── GST Cross-Verifier — 3B vs 2A reconciliation           │
│  ├── Benford's Law — chi-squared forensic test              │
│  ├── FinBERT — domain-specific sentiment (local)            │
│  ├── Five C Scorecard — weighted, configurable              │
│  ├── RBI Compliance Checker — 8 norms                       │
│  ├── Break-Even Calculator                                   │
│  ├── Three-Way Reconciliation + Trust Hierarchy              │
│  └── What-If Stress Simulator                                │
│                          ↓                                   │
│  LAYER 3: MULTI-AGENT REASONING                             │
│  ├── Tavily Web Search — real-time sector/company data       │
│  ├── Data-CoT — structured data aggregation                  │
│  ├── Concept-CoT — Hawk (risk) + Dove (growth)              │
│  └── Thesis-CoT — Owl synthesizes final verdict              │
│                          ↓                                   │
│  LAYER 4: OUTPUT                                             │
│  ├── Credit Appraisal Memo (streaming generation)            │
│  ├── Term Sheet with rate decomposition                      │
│  ├── RBI Compliance Report                                   │
│  └── Early Warning Signal Monitor                            │
│                                                              │
│  11 components LOCAL ($0.00) | 3 components API (~$0.14)    │
├─────────────────────────────────────────────────────────────┤
│  Research: FinRobot (ICAIF 2024), FinBERT (Araci 2019),     │
│  FinGPT (Yang 2023), LayoutLMv3 (Microsoft 2022)            │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS 4, Recharts |
| AI/LLM | OpenAI GPT-4o-mini |
| NLP | FinBERT via HuggingFace Transformers.js |
| Web Search | Tavily API |
| Computation | Custom ratio engine, scoring model, compliance checker (TypeScript) |
| UI Components | Radix UI, Framer Motion, Lucide Icons |

---

## Features — 11 Tabs

| # | Tab | What It Does |
|---|-----|-------------|
| 01 | Research Agent | Real-time web search (Tavily) + FinBERT sentiment across 7 dimensions |
| 02 | Five C Analysis | Radar chart, configurable weights, per-pillar scoring with AI explanations |
| 03 | Credit Committee | Live Hawk/Dove/Owl AI debate with formal dissent recording |
| 04 | GST Forensics | 3B vs 2A cross-verification, circular trading detection, quarter-end spike analysis |
| 05 | Reconciliation | Three-way data verification (AR vs GST vs Bank) with trust hierarchy |
| 06 | Stress Test | What-if simulator with 5 parameters + break-even analysis |
| 07 | Benford's Law | First-digit distribution analysis for fraud detection (p-value test) |
| 08 | Peers | Real NBFC benchmarks (Vivriti, Moneyboxx, Tata Capital) + sector comparison |
| 09 | EWS | Early Warning Signal monitor — 6-month post-disbursement simulation |
| 10 | Pipeline | Processing timeline, architecture diagram, token counter, audit trail |
| 11 | CAM Output | AI-generated CAM, term sheet, RBI compliance, voice narration, download |

---

## Pre-Extracted Companies

Instant analysis (zero latency, deterministic ratios) for organizer-provided annual reports:

| Company | Type | Year | Score | Verdict | Source |
|---------|------|------|-------|---------|--------|
| Vivriti Capital | NBFC-ND SI | FY25 | 74.9 | Conditional | Annual Report |
| Moneyboxx Finance | NBFC-ND-NSI | FY25 | 71.0 | Conditional | Annual Report |
| Tata Capital | NBFC-UL | FY25 | 76.8 | Approve | Annual Report |
| Kinara Capital | NBFC-ND-SI | FY24 | 71.8 | Conditional | Annual Report |

Any other company → analyzed via OpenAI + Tavily web search.

---

## API Routes

| Route | Method | Purpose | Data Source |
|-------|--------|---------|-------------|
| `/api/analyze` | POST | Document analysis | Pre-extracted or OpenAI |
| `/api/research` | POST | Web research (streaming) | Tavily + OpenAI |
| `/api/debate` | POST | Credit committee debate (streaming) | Tavily + OpenAI |
| `/api/generate-cam` | POST | CAM generation (streaming) | OpenAI |
| `/api/sentiment` | POST | Financial sentiment | FinBERT (local) |
| `/api/enrich` | POST | Tab-specific data enrichment | Tavily + OpenAI |

---

## Quick Start

```bash
# Clone
git clone <repo-url>
cd intellicredit

# Install
npm install

# Configure
cp .env.example .env.local
# Add your API keys to .env.local

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Required API Keys

| Key | Get It | Purpose |
|-----|--------|---------|
| `OPENAI_API_KEY` | [platform.openai.com](https://platform.openai.com) | LLM for analysis, debate, CAM generation |
| `TAVILY_API_KEY` | [tavily.com](https://tavily.com) | Real-time web search for research agent |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page + dashboard
│   ├── layout.tsx                  # Root layout with AnalysisProvider
│   └── api/
│       ├── analyze/route.ts        # Document analysis pipeline
│       ├── debate/route.ts         # Multi-agent credit committee
│       ├── research/route.ts       # Tavily web research agent
│       ├── generate-cam/route.ts   # CAM document generation
│       ├── sentiment/route.ts      # FinBERT sentiment analysis
│       └── enrich/route.ts         # Tab-specific data enrichment
├── components/
│   ├── DataEnricher.tsx            # Auto-fetches missing tab data via Tavily
│   ├── ScoreGauge.tsx              # Circular credit score gauge
│   ├── RadarChart.tsx              # Five C radar/spider chart
│   ├── FactorRow.tsx               # Expandable factor display
│   ├── UploadSection.tsx           # Document upload interface
│   ├── BenfordChart.tsx            # Benford's Law chart
│   ├── GSTWaterfallChart.tsx       # GST comparison waterfall
│   └── tabs/                      # 11 analysis tab components
├── data/
│   ├── mockData.ts                 # Rathi Steels sample data
│   ├── realData.ts                 # Real NBFC data + computed ratios
│   └── extracted/companies.ts      # Pre-extracted financial data (4 companies)
└── lib/
    ├── AnalysisContext.tsx          # Global state for analyzed company
    ├── ratioEngine.ts              # Deterministic ratio computation
    ├── scoringModel.ts             # Five C weighted scorecard
    ├── complianceChecker.ts        # RBI compliance rules
    ├── analyzeCompany.ts           # Full analysis pipeline
    ├── tavilySearch.ts             # Tavily web search utility
    └── utils.ts                    # Tailwind merge utility
```

---

## How It Differs From "Just Calling ChatGPT"

| What | Findesk AI | Generic LLM |
|------|-----------|-------------|
| Math | Deterministic ratio engine | LLM guesses numbers |
| Scoring | Rule-based Five C model | Black box |
| GST Forensics | Algorithmic cross-verification | Pattern-matched text |
| Fraud Detection | Benford's Law (statistical) | Hallucinated |
| Sentiment | FinBERT (domain-specific, local) | Generic, API-dependent |
| Compliance | 8-point RBI rule engine | Approximate |
| Explainability | Per-pillar reasoning + dissent notes | "Trust me" |
| Web Data | Real-time Tavily search | Training data cutoff |
| Cost | $0.14/analysis (11/14 components free) | $0.50+/analysis |

---

## Cost Analysis

| Component | Cost |
|-----------|------|
| 11 local components (ratio engine, scoring, compliance, FinBERT, etc.) | $0.00 |
| OpenAI (debate + CAM + research) | ~$0.14 |
| Tavily (web search) | ~$0.01 |
| **Total per analysis** | **~$0.15** |
| **At scale (500 applications/year)** | **$75/year** |
| **vs. manual analyst cost** | **₹60-80L/year** |

---

## Referenced Research

| Paper | Citation | Used For |
|-------|----------|----------|
| FinRobot | Zhou et al., ICAIF 2024 | Financial Chain-of-Thought architecture |
| FinBERT | Araci, 2019 | Domain-specific sentiment analysis |
| FinGPT | Yang et al., 2023 | Data-centric financial AI approach |
| LayoutLMv3 | Microsoft, 2022 | Document structure understanding |
| Golec et al. | 2025 | Interpretable LLMs for credit scoring |
| Ali | 2025 | Agentic AI for loan underwriting |
