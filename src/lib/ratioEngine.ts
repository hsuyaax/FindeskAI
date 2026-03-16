// CRITICAL: The LLM NEVER does math. This file does ALL computation.

export interface FinancialRatios {
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
}

export function computeRatios(financials: {
  pbt: number;
  financeCosts: number;
  depreciation: number;
  borrowings: number;
  netWorth: number;
  totalAssets: number;
  revenueFromOps: number;
  pat: number;
  impairment: number;
  loans: number;
  interestIncome: number;
  totalExpenses: number;
  totalIncome: number;
}): FinancialRatios {
  const ebitda = financials.pbt + financials.financeCosts + financials.depreciation;

  return {
    dscr: +(ebitda / financials.financeCosts).toFixed(2),
    deRatio: +(financials.borrowings / financials.netWorth).toFixed(2),
    currentRatio: +(financials.totalAssets / financials.borrowings).toFixed(2),
    operatingMargin: +((financials.pbt / financials.revenueFromOps) * 100).toFixed(1),
    roa: +((financials.pat / financials.totalAssets) * 100).toFixed(1),
    roe: +((financials.pat / financials.netWorth) * 100).toFixed(1),
    interestCoverage: +(ebitda / financials.financeCosts).toFixed(2),
    creditCost: +((financials.impairment / financials.loans) * 100).toFixed(2),
    nim: +(((financials.interestIncome - financials.financeCosts) / financials.loans) * 100).toFixed(1),
    costToIncome: +((financials.totalExpenses / financials.totalIncome) * 100).toFixed(1),
  };
}

export function computeBreakeven(financials: {
  employeeCosts: number;
  depreciation: number;
  otherExpenses: number;
  financeCosts: number;
  pbt: number;
  revenueFromOps: number;
}): number {
  // At what revenue does DSCR = 1.0x?
  // DSCR = EBITDA / Debt Service = 1.0
  // EBITDA = Revenue * margin - fixed costs = Debt Service
  const fixedCosts = financials.employeeCosts + financials.depreciation + financials.otherExpenses;
  const variableMargin = (financials.pbt + financials.financeCosts + financials.depreciation) / financials.revenueFromOps;
  // Revenue * variableMargin = fixedCosts + debtService
  const breakevenRevenue = (fixedCosts + financials.financeCosts) / variableMargin;
  return +breakevenRevenue.toFixed(1);
}

export function formatLakhs(lakhs: number): string {
  if (lakhs >= 10000) return `₹${(lakhs / 100).toFixed(0)} Cr`;
  if (lakhs >= 100) return `₹${(lakhs / 100).toFixed(1)} Cr`;
  return `₹${lakhs.toFixed(0)} L`;
}
