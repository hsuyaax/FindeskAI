// Full analysis pipeline — takes CompanyFinancials, returns complete credit assessment
// This is the core engine: ALL math is deterministic, ZERO LLM involvement

import type { CompanyFinancials } from "@/data/extracted/companies";

export interface CreditAnalysis {
  company: {
    name: string;
    cin: string;
    sector: string;
    type: string;
    hq: string;
    reportYear: string;
  };
  ratios: {
    dscr: number;
    deRatio: number;
    currentRatio: number;
    operatingMargin: number;
    roa: number;
    roe: number;
    interestCoverage: number;
    creditCost: number;
    nim: number;
    costToIncome: number;
    revenueGrowth: number | null;
    patGrowth: number | null;
    netWorthGrowth: number | null;
  };
  fiveCScores: {
    character: { score: number; label: string; reasoning: string };
    capacity: { score: number; label: string; reasoning: string };
    capital: { score: number; label: string; reasoning: string };
    collateral: { score: number; label: string; reasoning: string };
    conditions: { score: number; label: string; reasoning: string };
  };
  compositeScore: number;
  recommendation: "APPROVE" | "CONDITIONAL_APPROVE" | "REJECT";
  recommendedAmount: string;
  keyRisks: { factor: string; pillar: string; impact: number; detail: string }[];
  keyStrengths: { factor: string; detail: string }[];
  executiveSummary: string;
}

function r(val: number, decimals = 2): number {
  return +(val.toFixed(decimals));
}

function label(score: number): string {
  if (score >= 80) return "Strong";
  if (score >= 70) return "Good";
  if (score >= 60) return "Moderate";
  if (score >= 50) return "Weak";
  return "Critical";
}

function growth(current: number, prior: number): number | null {
  if (!prior || prior === 0) return null;
  return r(((current - prior) / prior) * 100, 1);
}

export function analyzeCompany(data: CompanyFinancials): CreditAnalysis {
  const is = data.incomeStatement;
  const bs = data.balanceSheet;
  const km = data.keyMetrics;
  const py = data.priorYear;

  // === RATIO COMPUTATION (deterministic) ===
  const ebitda = is.pbt + is.financeCosts + is.depreciation;
  const ratios = {
    dscr: r(ebitda / is.financeCosts),
    deRatio: r(bs.borrowings / bs.netWorth),
    currentRatio: r(bs.totalAssets / bs.borrowings),
    operatingMargin: r((is.pbt / is.revenueFromOps) * 100, 1),
    roa: r((is.pat / bs.totalAssets) * 100, 1),
    roe: r((is.pat / bs.netWorth) * 100, 1),
    interestCoverage: r(ebitda / is.financeCosts),
    creditCost: is.impairment && bs.loans ? r((is.impairment / bs.loans) * 100) : 0,
    nim: is.interestIncome ? r(((is.interestIncome - is.financeCosts) / (bs.loans || bs.totalAssets)) * 100, 1) : 0,
    costToIncome: r((is.totalExpenses / is.totalIncome) * 100, 1),
    revenueGrowth: py ? growth(is.revenueFromOps, py.revenueFromOps) : null,
    patGrowth: py ? growth(is.pat, py.pat) : null,
    netWorthGrowth: py ? growth(bs.netWorth, py.netWorth) : null,
  };

  // === FIVE C SCORING (rule-based) ===

  // CHARACTER (20%)
  let charScore = 70; // base
  if (data.meta.rbiRegistered) charScore += 8;
  if (data.meta.creditRating) charScore += 5;
  if (data.meta.type.includes("Systemically Important") || data.meta.type.includes("Upper Layer")) charScore += 5;
  if (data.meta.listed) charScore += 3;
  charScore = Math.min(95, Math.max(30, charScore));

  // CAPACITY (25%)
  let capScore = 60;
  if (ratios.dscr >= 2.0) capScore += 15;
  else if (ratios.dscr >= 1.5) capScore += 10;
  else if (ratios.dscr >= 1.2) capScore += 5;
  else if (ratios.dscr < 1.0) capScore -= 15;
  if (ratios.revenueGrowth && ratios.revenueGrowth > 20) capScore += 8;
  else if (ratios.revenueGrowth && ratios.revenueGrowth > 10) capScore += 5;
  else if (ratios.revenueGrowth && ratios.revenueGrowth < 0) capScore -= 10;
  if (ratios.costToIncome > 85) capScore -= 8;
  else if (ratios.costToIncome < 70) capScore += 5;
  if (ratios.creditCost > 3) capScore -= 10;
  else if (ratios.creditCost > 2) capScore -= 5;
  capScore = Math.min(95, Math.max(25, capScore));

  // CAPITAL (20%)
  let capitalScore = 65;
  if (ratios.deRatio < 2) capitalScore += 12;
  else if (ratios.deRatio < 4) capitalScore += 5;
  else if (ratios.deRatio > 6) capitalScore -= 15;
  if (ratios.roe > 15) capitalScore += 8;
  else if (ratios.roe > 10) capitalScore += 4;
  if (km?.car && km.car > 20) capitalScore += 8;
  else if (km?.car && km.car > 15) capitalScore += 4;
  if (ratios.netWorthGrowth && ratios.netWorthGrowth > 10) capitalScore += 5;
  capitalScore = Math.min(95, Math.max(25, capitalScore));

  // COLLATERAL (15%)
  let collScore = 65;
  if (bs.loans && bs.loans / bs.totalAssets > 0.7) collScore += 5; // well-deployed
  if (bs.cash / bs.totalAssets > 0.05) collScore += 5; // liquidity buffer
  if (km?.gnpa && km.gnpa < 2) collScore += 10;
  else if (km?.gnpa && km.gnpa < 3) collScore += 5;
  else if (km?.gnpa && km.gnpa > 5) collScore -= 10;
  collScore = Math.min(95, Math.max(25, collScore));

  // CONDITIONS (20%)
  let condScore = 65;
  if (data.meta.sector.includes("NBFC") || data.meta.sector.includes("Microfinance")) condScore += 5;
  if (km?.branches && km.branches > 100) condScore += 5;
  if (ratios.revenueGrowth && ratios.revenueGrowth > 25) condScore += 5;
  if (ratios.creditCost > 2.5) condScore -= 5; // deteriorating asset quality
  condScore = Math.min(95, Math.max(25, condScore));

  const fiveCScores = {
    character: { score: charScore, label: label(charScore), reasoning: `RBI registered, ${data.meta.type}. ${data.meta.creditRating || "No external rating available"}.` },
    capacity: { score: capScore, label: label(capScore), reasoning: `DSCR ${ratios.dscr}x, revenue growth ${ratios.revenueGrowth ?? "N/A"}%, cost-to-income ${ratios.costToIncome}%.` },
    capital: { score: capitalScore, label: label(capitalScore), reasoning: `D/E ${ratios.deRatio}x, RoE ${ratios.roe}%, CAR ${km?.car || "N/A"}%.` },
    collateral: { score: collScore, label: label(collScore), reasoning: `GNPA ${km?.gnpa || "N/A"}%, loan book ${bs.loans ? (bs.loans / 100).toFixed(0) + "Cr" : "N/A"}.` },
    conditions: { score: condScore, label: label(condScore), reasoning: `Sector: ${data.meta.sector}. ${km?.branches ? km.branches + " branches" : ""}.` },
  };

  const composite = r(
    charScore * 0.20 + capScore * 0.25 + capitalScore * 0.20 + collScore * 0.15 + condScore * 0.20,
    1
  );

  const recommendation = composite >= 75 ? "APPROVE" as const : composite >= 60 ? "CONDITIONAL_APPROVE" as const : "REJECT" as const;

  // Key risks
  const keyRisks: CreditAnalysis["keyRisks"] = [];
  if (ratios.creditCost > 2) keyRisks.push({ factor: "High Credit Cost", pillar: "Capacity", impact: -8, detail: `Credit cost at ${ratios.creditCost}% indicates asset quality stress.` });
  if (ratios.deRatio > 4) keyRisks.push({ factor: "High Leverage", pillar: "Capital", impact: -6, detail: `D/E ratio at ${ratios.deRatio}x is elevated.` });
  if (ratios.costToIncome > 80) keyRisks.push({ factor: "Operational Inefficiency", pillar: "Capacity", impact: -5, detail: `Cost-to-income at ${ratios.costToIncome}% is high.` });
  if (ratios.dscr < 1.2) keyRisks.push({ factor: "Weak Debt Servicing", pillar: "Capacity", impact: -10, detail: `DSCR at ${ratios.dscr}x leaves minimal safety margin.` });

  const keyStrengths: CreditAnalysis["keyStrengths"] = [];
  if (ratios.revenueGrowth && ratios.revenueGrowth > 20) keyStrengths.push({ factor: "Strong Revenue Growth", detail: `Revenue grew ${ratios.revenueGrowth}% YoY.` });
  if (ratios.roa > 1.5) keyStrengths.push({ factor: "Healthy Returns", detail: `RoA at ${ratios.roa}% indicates efficient asset utilization.` });
  if (km?.car && km.car > 20) keyStrengths.push({ factor: "Strong Capital Adequacy", detail: `CAR at ${km.car}% well above regulatory minimum.` });

  const revStr = is.revenueFromOps >= 10000 ? `₹${(is.revenueFromOps / 100).toFixed(0)}Cr` : `₹${is.revenueFromOps}L`;
  const patStr = is.pat >= 10000 ? `₹${(is.pat / 100).toFixed(0)}Cr` : `₹${(is.pat / 100).toFixed(1)}Cr`;

  const executiveSummary = `${data.meta.name} (${data.meta.type}) reported revenue of ${revStr} and PAT of ${patStr} in ${data.meta.reportYear}. ` +
    `Key ratios: DSCR ${ratios.dscr}x, D/E ${ratios.deRatio}x, RoA ${ratios.roa}%, Credit Cost ${ratios.creditCost}%. ` +
    `The Five C composite score is ${composite}/100 (${label(composite)}). ` +
    `Recommendation: ${recommendation.replace("_", " ")}.`;

  return {
    company: {
      name: data.meta.name,
      cin: data.meta.cin,
      sector: data.meta.sector,
      type: data.meta.type,
      hq: data.meta.hq,
      reportYear: data.meta.reportYear,
    },
    ratios,
    fiveCScores,
    compositeScore: composite,
    recommendation,
    recommendedAmount: recommendation === "APPROVE" ? "Full facility" : recommendation === "CONDITIONAL_APPROVE" ? "65% of requested" : "Nil",
    keyRisks,
    keyStrengths,
    executiveSummary,
  };
}
