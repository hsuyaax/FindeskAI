export const COMPANY = {
  name: "Rathi Steels Pvt. Ltd.",
  cin: "U27100MH2011PTC219876",
  sector: "Steel Manufacturing — Long Products",
  promoter: "Rajesh Rathi (62%), Sunita Rathi (18%)",
  incorporated: "2011",
  facility: "Bhiwandi, Maharashtra",
  requestedLoan: "₹18.50 Cr.",
  purpose: "Working Capital + Capacity Expansion",
  existingExposure: "₹6.20 Cr. (SBI — CC limit)",
};

export interface Factor {
  name: string;
  value: string;
  impact: "positive" | "negative" | "neutral" | "critical";
  detail: string;
}

export interface PillarData {
  score: number;
  label: string;
  color: string;
  icon: string;
  factors: Factor[];
}

export const FIVE_CS: Record<string, PillarData> = {
  character: {
    score: 72,
    label: "Moderate",
    color: "#F5B731",
    icon: "Shield",
    factors: [
      { name: "CIBIL Commercial Score", value: "682 / 900", impact: "negative", detail: "Below bank threshold of 700. Two overdue instances in FY23 (SBI CC — 32 days DPD)." },
      { name: "Promoter Litigation", value: "2 Active Cases", impact: "negative", detail: "1 civil dispute (₹1.2Cr supplier claim, Bhiwandi Court). 1 NCLT proceeding (minority shareholder — dismissed, under appeal)." },
      { name: "MCA Filing Compliance", value: "Timely", impact: "positive", detail: "All annual returns (AOC-4, MGT-7) filed within due dates for past 5 years. No penalties." },
      { name: "Promoter Track Record", value: "15 yrs", impact: "positive", detail: "Rajesh Rathi — 2nd generation steel trader. Previously operated Rathi Trading Co. (clean exit, no defaults)." },
      { name: "News Sentiment", value: "Neutral", impact: "neutral", detail: "No adverse media. One mention in Business Standard re: Bhiwandi industrial zone expansion (positive context)." },
    ],
  },
  capacity: {
    score: 61,
    label: "Weak",
    color: "#F06050",
    icon: "TrendingUp",
    factors: [
      { name: "Revenue Trend", value: "₹87Cr → ₹72Cr", impact: "negative", detail: "17.2% decline FY23→FY24. Driven by steel price correction (HRC down 22%) and loss of 2 key clients." },
      { name: "DSCR (Debt Service Coverage)", value: "1.08x", impact: "negative", detail: "Barely above 1.0x threshold. Leaves no margin for rate hikes or revenue shocks. Industry median: 1.45x." },
      { name: "GST Cross-Verification", value: "⚠ Mismatch", impact: "critical", detail: "GSTR-3B self-reported: ₹72.4Cr. GSTR-2A (supplier-confirmed): ₹58.1Cr. Gap: ₹14.3Cr (19.7%). Indicates possible circular trading or inflated purchases." },
      { name: "Bank Statement Turnover", value: "₹69.8 Cr.", impact: "neutral", detail: "Broadly consistent with GSTR-2A reported figures. Variance vs 3B remains unexplained." },
      { name: "Operating Margin", value: "4.2%", impact: "negative", detail: "Industry average: 8.5%. Compression from raw material costs and inability to pass through price increases." },
    ],
  },
  capital: {
    score: 78,
    label: "Adequate",
    color: "#34D399",
    icon: "Building2",
    factors: [
      { name: "Net Worth", value: "₹24.6 Cr.", impact: "positive", detail: "Adequate for requested exposure. Tangible net worth after intangible deduction: ₹23.1Cr." },
      { name: "Debt/Equity Ratio", value: "1.12x", impact: "neutral", detail: "Within acceptable range (<2.0x). Post-sanction projected D/E: 1.87x — approaching upper limit." },
      { name: "Capital Adequacy", value: "Promoter infusion", impact: "positive", detail: "Promoters committed ₹3.5Cr additional equity infusion by Q2 FY25 (board resolution dated 14-Jan-2025)." },
      { name: "Reserves & Surplus", value: "₹8.9 Cr.", impact: "positive", detail: "Healthy retained earnings. No dividend payouts in last 3 years — reinvested in operations." },
    ],
  },
  collateral: {
    score: 82,
    label: "Strong",
    color: "#34D399",
    icon: "Scale",
    factors: [
      { name: "Primary Security", value: "Hypothecation", impact: "positive", detail: "First charge on entire current assets (stock + receivables). Estimated value: ₹31.2Cr." },
      { name: "Collateral Security", value: "Industrial Land", impact: "positive", detail: "3.5 acres industrial plot, Bhiwandi MIDC. Registered valuation: ₹12.8Cr. Mortgage coverage: 1.69x." },
      { name: "Personal Guarantee", value: "Both Promoters", impact: "positive", detail: "Rajesh Rathi (NW ₹18Cr) + Sunita Rathi (NW ₹6.2Cr). Combined PG coverage: 1.31x." },
      { name: "Insurance Coverage", value: "Adequate", impact: "positive", detail: "All-risk industrial policy (₹45Cr sum insured). Key-man insurance on Rajesh Rathi: ₹5Cr." },
    ],
  },
  conditions: {
    score: 55,
    label: "Challenging",
    color: "#F06050",
    icon: "Activity",
    factors: [
      { name: "Sector Outlook", value: "Negative", impact: "negative", detail: "Steel sector under pressure: China dumping, BIS compliance costs up 12%. Domestic demand flat. ICRA outlook: Negative for SME steel." },
      { name: "RBI Regulatory Risk", value: "Moderate", impact: "neutral", detail: "New RBI circular on project finance provisioning (Apr 2024) increases capital requirements. NPA norms tightening for MSME." },
      { name: "Client Concentration", value: "High Risk", impact: "negative", detail: "Top 3 clients = 68% of revenue. Loss of Tata Projects order (₹12Cr) in FY24 not yet replaced." },
      { name: "Capacity Utilization", value: "42%", impact: "critical", detail: "Plant operating well below breakeven (estimated 65%). Credit officer site visit confirms: 'Only 1 of 3 furnaces operational.'" },
    ],
  },
};

export const COMPOSITE_SCORE = 68.2;
export const RECOMMENDATION = "CONDITIONAL_APPROVE";

export const AI_EXPLANATIONS: Record<string, string> = {
  capacity: "Capacity is rated WEAK primarily due to a critical GST mismatch (₹14.3Cr gap between 3B and 2A returns), which the system flags as a strong indicator of circular trading. The declining revenue trend (17.2% drop) is corroborated by both GSTR-2A supplier data and bank statement analysis, confirming the lower figure as the true revenue baseline. DSCR at 1.08x is dangerously thin.",
  character: "Character is rated MODERATE. The promoter has strong industry experience (15 years, 2nd generation) and clean MCA compliance. However, CIBIL score of 682 is below threshold, with two overdue instances in FY23. Two active litigations exist but neither appears materially threatening — the NCLT case was already dismissed at first instance.",
  capital: "Capital adequacy is ADEQUATE. Tangible net worth of ₹23.1Cr supports current exposure, and the committed equity infusion of ₹3.5Cr (board-approved) strengthens the position. However, post-sanction D/E at 1.87x is approaching the 2.0x threshold — a key reason for recommending reduced exposure.",
  collateral: "Collateral is the STRONGEST pillar. Industrial land in Bhiwandi MIDC provides 1.69x mortgage coverage, and combined personal guarantees offer 1.31x coverage. Primary security (stock + receivables hypothecation) adds another layer. All insurance coverages are current and adequate.",
  conditions: "External conditions are CHALLENGING. The steel sector faces a confluence of negative factors: Chinese dumping pressure, rising BIS compliance costs, and flat domestic demand. The borrower's 42% capacity utilization (verified by credit officer site visit) and 68% client concentration significantly amplify these sector risks.",
};

export const AGENT_DEBATE = {
  hawk: {
    name: "Hawk Agent",
    role: "Risk Assessor",
    emoji: "🦅",
    color: "#F06050",
    verdict: "REJECT",
    argument: `REJECT this application. Three critical red flags demand immediate decline:

1. GST FRAUD SIGNAL: A ₹14.3Cr gap (19.7%) between 3B and 2A is not a minor discrepancy — it's a textbook circular trading pattern. Quarter-end spikes (Jun: 35.9%, Sep: 46.5%) confirm accommodation entries.

2. INSOLVENT ON TRUE NUMBERS: DSCR on 2A-verified revenue drops to 0.91x. This borrower CANNOT service ₹18.5Cr debt at true revenue levels.

3. STRUCTURAL DECLINE: 17.2% revenue decline + 42% capacity utilization + 68% client concentration = a company in distress, not growth. The capacity expansion request is premature.`,
  },
  dove: {
    name: "Dove Agent",
    role: "Relationship Manager",
    emoji: "🕊️",
    color: "#34D399",
    verdict: "CONDITIONAL APPROVE",
    argument: `APPROVE with conditions. The risk profile is manageable:

1. STRONG COLLATERAL: 1.69x mortgage coverage on industrial land + 1.31x combined PG. Even in default, recovery probability is high.

2. PROMOTER QUALITY: 15 years experience, 2nd generation, clean exit from prior business. MCA compliance is spotless. Character fundamentals are sound.

3. THE GST GAP IS ADDRESSABLE: Mandate quarterly GST reconciliation as a covenant. Reduce exposure to working capital only. The 2A-verified revenue of ₹58Cr still supports a ₹12Cr CC facility.

4. TURNAROUND POTENTIAL: Steel prices are cyclical. When HRC recovers (consensus: H2 FY26), margins will expand. Reducing now means losing the relationship.`,
  },
  owl: {
    name: "Owl Agent",
    role: "Chief Credit Officer",
    emoji: "🦉",
    color: "#4B8BF5",
    verdict: "CONDITIONAL APPROVE @ ₹12Cr",
    argument: `CONDITIONAL APPROVAL at ₹12.00 Crores (reduced from ₹18.50 Cr).

I agree with Hawk's GST concern — the 19.7% mismatch is serious and non-negotiable as a risk factor. However, Dove correctly identifies that the collateral position (1.69x) provides adequate protection.

MY SYNTHESIS:
• Defer capacity expansion (Hawk wins on this — 42% utilization doesn't justify capex)
• Approve WC at ₹12Cr (Dove wins — 2A-verified revenue supports this level)
• MCLR + 2.75% (risk premium for GST mismatch: 0.75% + sector: 0.50%)
• 6-month accelerated review (not standard 12 months)
• Mandatory quarterly GST reconciliation as covenant
• Additional collateral: promoter's personal property

The key insight: Hawk is right about the fraud signal, but Dove is right that the fundamentals support a reduced facility. Credit is about structuring around risk, not just saying no.`,
  },
};

export const RECONCILIATION_DATA = [
  { metric: "Revenue FY24", ar: "₹72.4 Cr", gst: "₹72.4 Cr (3B)", bank: "₹69.8 Cr", conf: "MEDIUM", note: "3B inflated — trust Bank+2A" },
  { metric: "Verified Revenue", ar: "N/A", gst: "₹58.1 Cr (2A)", bank: "₹69.8 Cr", conf: "HIGH", note: "2A + Bank align" },
  { metric: "Trade Payables", ar: "₹14.2 Cr", gst: "₹12.8 Cr (2A)", bank: "N/A", conf: "MEDIUM", note: "₹1.4Cr variance" },
  { metric: "Monthly Avg", ar: "₹6.03 Cr", gst: "₹6.03 Cr", bank: "₹5.82 Cr", conf: "HIGH", note: "Consistent" },
  { metric: "Peak Month", ar: "N/A", gst: "Sep: ₹7.1Cr", bank: "Sep: ₹6.9Cr", conf: "HIGH", note: "Consistent" },
];

export const BENFORD_DATA = [
  { digit: 1, expected: 30.1, actual: 24.3 },
  { digit: 2, expected: 17.6, actual: 15.8 },
  { digit: 3, expected: 12.5, actual: 14.2 },
  { digit: 4, expected: 9.7, actual: 11.9 },
  { digit: 5, expected: 7.9, actual: 9.1 },
  { digit: 6, expected: 6.7, actual: 7.8 },
  { digit: 7, expected: 5.8, actual: 6.2 },
  { digit: 8, expected: 5.1, actual: 5.9 },
  { digit: 9, expected: 4.6, actual: 4.8 },
];

export const GST_MONTHLY = [
  { month: "Apr-23", b3: 5.8, a2: 4.9, flag: false },
  { month: "May-23", b3: 6.1, a2: 5.2, flag: false },
  { month: "Jun-23", b3: 6.4, a2: 4.1, flag: true },
  { month: "Jul-23", b3: 5.9, a2: 4.8, flag: false },
  { month: "Aug-23", b3: 6.2, a2: 5.0, flag: false },
  { month: "Sep-23", b3: 7.1, a2: 3.8, flag: true },
  { month: "Oct-23", b3: 5.7, a2: 4.9, flag: false },
  { month: "Nov-23", b3: 6.3, a2: 5.1, flag: false },
  { month: "Dec-23", b3: 5.5, a2: 4.7, flag: false },
  { month: "Jan-24", b3: 6.8, a2: 3.9, flag: true },
  { month: "Feb-24", b3: 5.4, a2: 4.6, flag: false },
  { month: "Mar-24", b3: 5.2, a2: 7.1, flag: false },
];

export const TIMELINE = [
  { time: "0:00", step: "PDF Upload & OCR", status: "done", detail: "3 Annual Reports + GST Returns + Bank Statements ingested" },
  { time: "0:03", step: "Data Extraction", status: "done", detail: "847 financial line items extracted via LayoutLMv3" },
  { time: "0:06", step: "Three-Way Reconciliation", status: "alert", detail: "⚠ Revenue mismatch across AR / GST / Bank" },
  { time: "0:09", step: "GST Forensics", status: "alert", detail: "⚠ ₹14.3Cr gap + quarter-end spike pattern" },
  { time: "0:12", step: "External Research", status: "done", detail: "MCA, CIBIL, e-Courts, News — 23 data points" },
  { time: "0:15", step: "Benford's Law Analysis", status: "alert", detail: "⚠ p=0.003 — First-digit anomaly detected" },
  { time: "0:19", step: "Credit Committee Debate", status: "done", detail: "Hawk: REJECT | Dove: APPROVE | Owl: CONDITIONAL" },
  { time: "0:24", step: "Compliance Check", status: "done", detail: "8/8 RBI norms passed" },
  { time: "0:27", step: "CAM + Term Sheet Generated", status: "done", detail: "22-page CAM + structured term sheet ready" },
];

export const COMPLIANCE_CHECKS = [
  { rule: "MSME Classification", status: "PASS", detail: "Medium Enterprise (Inv: ₹12Cr, TO: ₹72Cr). Meets Udyam criteria." },
  { rule: "Exposure Norms (Single Borrower)", status: "PASS", detail: "₹12Cr < 15% of bank capital. Within RBI single borrower limit." },
  { rule: "Priority Sector Classification", status: "PASS", detail: "Qualifies under MSME manufacturing. PSL credit eligible." },
  { rule: "NPA Classification Risk", status: "NOTE", detail: "SMA-0 history (3 days). Monitor for SMA-1 trigger (31-60 DPD)." },
  { rule: "LTV Ratio (Collateral)", status: "PASS", detail: "LTV: 59% (₹12Cr / ₹20.3Cr total collateral). Below 75% threshold." },
  { rule: "Provisioning Requirement", status: "PASS", detail: "Standard asset: 0.40% provisioning = ₹4.8L. Within norms." },
  { rule: "KYC/AML Compliance", status: "PASS", detail: "All promoters KYC verified. No PEP/sanctions match." },
  { rule: "Environmental Clearance", status: "PASS", detail: "Valid CTE/CTO from MPCB. No environmental violations." },
];

export const TERM_SHEET = [
  ["Facility Type", "Cash Credit (Working Capital)"],
  ["Sanctioned Amount", "₹12.00 Crores"],
  ["Interest Rate", "MCLR + 2.75% (base 1.5% + GST risk 0.75% + sector 0.50%)"],
  ["Tenure", "12 months (renewable)"],
  ["Review Period", "6 months (accelerated)"],
  ["Drawing Power", "75% stock + 60% receivables <90 days"],
  ["Primary Security", "First charge on current assets"],
  ["Collateral", "EM industrial land (₹12.8Cr) + promoter personal property (₹4.2Cr)"],
  ["Personal Guarantee", "Rajesh Rathi + Sunita Rathi"],
  ["Key Covenants", "Quarterly GST recon | DSCR > 1.2x | No dividends | Quarterly stock audit"],
  ["Processing Fee", "0.50% of sanctioned limit = ₹6.00 Lakhs"],
  ["Penal Interest", "2% p.a. on irregular portion"],
];

// ========== PEER COMPARISON DATA ==========
export const PEER_BENCHMARKS = [
  { metric: "Revenue Growth", company: -17.2, median: 4.5, topQuartile: 12.8, unit: "%" },
  { metric: "EBITDA Margin", company: 4.2, median: 8.5, topQuartile: 14.2, unit: "%" },
  { metric: "DSCR", company: 1.08, median: 1.45, topQuartile: 2.1, unit: "x" },
  { metric: "D/E Ratio", company: 1.12, median: 1.35, topQuartile: 0.7, unit: "x" },
  { metric: "Current Ratio", company: 1.15, median: 1.40, topQuartile: 1.85, unit: "x" },
  { metric: "Capacity Util.", company: 42, median: 68, topQuartile: 82, unit: "%" },
  { metric: "Collateral Cover", company: 1.69, median: 1.25, topQuartile: 1.80, unit: "x" },
  { metric: "Net Worth (₹Cr)", company: 24.6, median: 18.0, topQuartile: 42.0, unit: "" },
];

// ========== EWS MONITORING DATA ==========
export const EWS_DATA = [
  { month: "Month 1 (Post-Disbursement)", status: "green", label: "Normal", events: [
    "All covenants met", "Interest serviced on time", "GST filings current",
  ]},
  { month: "Month 2", status: "yellow", label: "Watch", events: [
    "GST mismatch increased to 22.1% (from 19.7%)", "Two new related-party transactions detected (₹1.8Cr)",
  ]},
  { month: "Month 3", status: "yellow", label: "Watch", events: [
    "SMA-0 flagged — 3 days overdue on interest payment", "Drawing power utilization at 94% (threshold: 90%)",
  ]},
  { month: "Month 4", status: "orange", label: "Alert", events: [
    "New litigation filed by supplier — ₹2.1Cr recovery suit", "CIBIL score dropped to 658 (from 682)", "Client concentration worsened — top 3 now 74%",
  ]},
  { month: "Month 5", status: "red", label: "Critical", events: [
    "DSCR projected at 0.78x based on latest GST data", "Promoter Rajesh Rathi named in cheque bounce case (NI Act 138)", "Capacity utilization dropped to 35%",
  ]},
  { month: "Month 6", status: "red", label: "Action Required", events: [
    "Automated alert: Recommend pre-NPA resolution", "Initiate restructuring discussion with promoter", "Classify as SMA-1 — escalate to Credit Committee",
  ]},
];

// ========== SECTOR INTELLIGENCE ==========
export const SECTOR_INTELLIGENCE = [
  { title: "Sector Outlook", icon: "TrendingDown", color: "#F06050", content: "Steel manufacturing — ICRA rating: Negative. Key drivers: Chinese overcapacity (export up 28% YoY), BIS compliance costs (+12%), domestic demand moderation. Long products segment particularly vulnerable." },
  { title: "Peer Performance", icon: "Users", color: "#F5B731", content: "Top 5 comparable companies by revenue band: Shree Steel (stable), Kamdhenu Ltd (upgraded to BBB+), Gallantt Ispat (downgraded to BBB-), Surya Roshni (stable), APL Apollo (outperformer). Average NPA rate in segment: 6.2%." },
  { title: "Regulatory Changes", icon: "Shield", color: "#4B8BF5", content: "RBI/2024/45: Revised MSME classification limits effective Apr 2024. RBI/2024/62: Project finance provisioning increased to 5% (from 0.4%). BIS notification: Mandatory quality certification for long steel products from Jan 2025." },
  { title: "Commodity Trends", icon: "BarChart3", color: "#7C6BF0", content: "HRC steel price: ₹52,400/MT (down 22% from peak of ₹67,200). Rebar prices: ₹48,500/MT. Iron ore: ₹4,800/MT (stable). Coking coal: $220/MT (imported). Consensus forecast: Flat to -5% for H1 FY26, potential recovery H2 FY26." },
  { title: "Sub-Segment Risk", icon: "AlertTriangle", color: "#F06050", content: "Long products segment has 3-4% lower margins than flat products. More exposed to construction sector slowdown. Infrastructure spending (govt) partially offsets but concentrated in large-cap players. SME segment faces margin squeeze from both input costs and pricing power." },
];

// ========== AUDIT TRAIL ==========
export const AUDIT_TRAIL = [
  { timestamp: "2025-03-14 10:22:00", event: "Document Upload", agent: "System", detail: "3 Annual Reports, GSTR-3B, GSTR-2A, 12-month bank statement received", severity: "info" },
  { timestamp: "2025-03-14 10:22:01", event: "Document Classification", agent: "LayoutLMv3", detail: "Documents classified: Annual Report (3), GST Return (2), Bank Statement (1)", severity: "info" },
  { timestamp: "2025-03-14 10:22:04", event: "Data Extraction", agent: "LayoutLMv3 + Parser", detail: "847 line items extracted. Avg confidence: 94.2%. 12 items flagged for manual review.", severity: "info" },
  { timestamp: "2025-03-14 10:22:07", event: "Revenue Mismatch Detected", agent: "Reconciliation Engine", detail: "AR Revenue (₹72.4Cr) vs Bank Credits (₹69.8Cr) — ₹2.6Cr variance flagged", severity: "warning" },
  { timestamp: "2025-03-14 10:22:10", event: "GST Fraud Alert", agent: "GST Forensics", detail: "GSTR-3B vs 2A gap: ₹14.3Cr (19.7%). Quarter-end spike pattern confirmed.", severity: "critical" },
  { timestamp: "2025-03-14 10:22:13", event: "External Research Complete", agent: "Research Agent", detail: "MCA: 2 charges, compliance OK. CIBIL: 682. e-Courts: 2 cases. News: Neutral.", severity: "info" },
  { timestamp: "2025-03-14 10:22:16", event: "Benford Anomaly", agent: "Statistical Engine", detail: "Chi² test p=0.003. First-digit distribution deviates significantly from expected.", severity: "warning" },
  { timestamp: "2025-03-14 10:22:20", event: "Credit Committee Debate", agent: "Multi-Agent CoT", detail: "Hawk: REJECT (GST fraud). Dove: APPROVE (collateral). Owl: CONDITIONAL @ ₹12Cr.", severity: "info" },
  { timestamp: "2025-03-14 10:22:25", event: "Compliance Check", agent: "Rule Engine", detail: "8/8 RBI norms passed. NPA Classification flagged as NOTE (SMA-0 history).", severity: "info" },
  { timestamp: "2025-03-14 10:22:27", event: "CAM Generated", agent: "AI + Template", detail: "22-page Credit Appraisal Memo generated. Term sheet with MCLR+2.75% computed.", severity: "info" },
  { timestamp: "2025-03-14 10:22:27", event: "Final Decision", agent: "Owl Agent (CCO)", detail: "CONDITIONAL APPROVAL @ ₹12.00Cr. Rationale: GST risk mitigated by collateral + covenants.", severity: "info" },
];

// ========== RISK DECOMPOSITION ==========
export const RISK_WEIGHTS: Record<string, number> = {
  character: 0.20,
  capacity: 0.25,
  capital: 0.20,
  collateral: 0.15,
  conditions: 0.20,
};

export const KEY_RISK_DRIVERS = [
  { factor: "GST Revenue Inflation", pillar: "Capacity", impact: -12.4, detail: "₹14.3Cr mismatch (19.7%) between GSTR-3B and 2A. Bank statement confirms lower figure." },
  { factor: "Capacity Utilization at 42%", pillar: "Conditions", impact: -9.8, detail: "Only 1 of 3 furnaces operational. Well below breakeven (65%). Site visit confirmed." },
  { factor: "Client Concentration (68%)", pillar: "Conditions", impact: -6.5, detail: "Top 3 clients = 68% revenue. Loss of Tata Projects (₹12Cr) not replaced." },
];

export const EXPLANATION_TEXT = `RECOMMENDATION: CONDITIONAL APPROVAL — ₹12.00 Cr. (reduced from ₹18.50 Cr. requested)

The applicant demonstrates adequate collateral coverage (1.69x mortgage) and a promoter with 15 years of industry experience. However, three critical risks warrant a reduced sanction:

1. GST REVENUE INFLATION (Critical): A ₹14.3 Cr. gap (19.7%) between self-reported GSTR-3B and supplier-verified GSTR-2A strongly suggests circular trading or purchase inflation. Bank statement turnover (₹69.8 Cr.) aligns with 2A, not 3B — confirming true revenues are lower than reported.

2. WEAK DEBT SERVICING: DSCR of 1.08x provides virtually no safety margin. Combined with declining revenues (17.2% YoY) and 42% capacity utilization, the borrower's ability to service ₹18.5Cr is doubtful.

3. SECTOR HEADWINDS: ICRA's negative outlook on SME steel, Chinese dumping pressure, and 68% client concentration create compounding external risks.

CONDITIONS FOR APPROVAL:
• Reduce sanction to ₹12.00 Cr. (Working Capital only; defer capacity expansion)
• Mandate additional collateral: personal property of Rajesh Rathi (est. ₹4.2 Cr.)
• Quarterly GST reconciliation submission as covenant
• Interest Rate: MCLR + 2.75% (risk premium for GST mismatch + sector headwinds)
• Review period: 6 months (not standard 12 months)`;
