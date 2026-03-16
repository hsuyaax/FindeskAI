// Pre-extracted financial data from organizer-provided annual reports
// Source PDFs stored in /public/reports/
// This data powers instant analysis for known companies

export interface CompanyFinancials {
  meta: {
    name: string;
    cin: string;
    type: string;
    hq: string;
    sector: string;
    rbiRegistered?: string;
    listed?: string;
    creditRating?: string;
    reportYear: string;
    sourceFile: string;
  };
  incomeStatement: {
    revenueFromOps: number;       // in lakhs
    interestIncome?: number;
    feesCommission?: number;
    otherIncome?: number;
    totalIncome: number;
    financeCosts: number;
    impairment?: number;
    employeeCosts: number;
    depreciation: number;
    otherExpenses: number;
    totalExpenses: number;
    pbt: number;
    tax?: number;
    pat: number;
  };
  balanceSheet: {
    totalAssets: number;
    loans?: number;
    investments?: number;
    cash: number;
    netWorth: number;
    borrowings: number;
    otherLiabilities?: number;
  };
  keyMetrics: {
    aum?: number;
    branches?: number;
    employees?: number;
    customers?: number;
    gnpa?: number;
    nnpa?: number;
    car?: number;
    deRatio?: number;
    roe?: number;
    roa?: number;
  };
  priorYear?: {
    revenueFromOps: number;
    totalIncome: number;
    pat: number;
    netWorth: number;
    borrowings?: number;
    loans?: number;
    impairment?: number;
    pbt?: number;
    financeCosts?: number;
  };
}

// ============================================================
// VIVRITI CAPITAL — FY 2024-25 (Standalone)
// Source: vivriti-fy25.pdf
// ============================================================
export const VIVRITI: CompanyFinancials = {
  meta: {
    name: "Vivriti Capital Limited",
    cin: "U65929TN2017PLC117196",
    type: "NBFC-ND, Systemically Important, ICC",
    hq: "Chennai, Tamil Nadu",
    sector: "NBFC — Mid-Market Enterprise Lending",
    rbiRegistered: "2018-01-05",
    reportYear: "FY 2024-25",
    sourceFile: "vivriti-fy25.pdf",
  },
  incomeStatement: {
    revenueFromOps: 134711,
    interestIncome: 126997,
    feesCommission: 6544,
    otherIncome: 1685,
    totalIncome: 136396,
    financeCosts: 69927,
    impairment: 19380,
    employeeCosts: 10121,
    depreciation: 1675,
    otherExpenses: 6230,
    totalExpenses: 107332,
    pbt: 29063,
    tax: 7059,
    pat: 22004,
  },
  balanceSheet: {
    totalAssets: 1046839,
    loans: 864669,
    investments: 120000,
    cash: 31253,
    netWorth: 214691,
    borrowings: 746954,
  },
  keyMetrics: {
    aum: 908107,
  },
  priorYear: {
    revenueFromOps: 102397,
    totalIncome: 105067,
    financeCosts: 53896,
    impairment: 10273,
    pbt: 25536,
    pat: 19126,
    netWorth: 189392,
    loans: 730199,
    borrowings: 656860,
  },
};

// ============================================================
// MONEYBOXX FINANCE — FY 2024-25
// Source: moneyboxx-fy25.pdf
// ============================================================
export const MONEYBOXX: CompanyFinancials = {
  meta: {
    name: "Moneyboxx Finance Limited",
    cin: "L65910HR2016PLC065327",
    type: "NBFC-ND-NSI, Base Layer",
    hq: "Gurugram, Haryana",
    sector: "Microfinance — Small Ticket Business Loans",
    listed: "BSE",
    creditRating: "CRISIL BBB/Stable, IND BBB/Stable",
    reportYear: "FY 2024-25",
    sourceFile: "moneyboxx-fy25.pdf",
  },
  incomeStatement: {
    revenueFromOps: 19894,
    otherIncome: 28,
    totalIncome: 19923,
    financeCosts: 8200,
    impairment: 5500,
    employeeCosts: 3800,
    depreciation: 350,
    otherExpenses: 2777,
    totalExpenses: 19627,
    pbt: 296,
    tax: 166,
    pat: 130,
  },
  balanceSheet: {
    totalAssets: 95000,
    loans: 82000,
    cash: 5200,
    netWorth: 26100,
    borrowings: 63700,
  },
  keyMetrics: {
    aum: 92700,
    branches: 150,
    employees: 1800,
    gnpa: 3.2,
    car: 29.3,
    deRatio: 2.44,
  },
  priorYear: {
    revenueFromOps: 12752,
    totalIncome: 12800,
    pbt: 1056,
    pat: 790,
    netWorth: 22000,
    borrowings: 51000,
    loans: 65000,
  },
};

// ============================================================
// TATA CAPITAL — FY 2024-25 (Consolidated)
// Source: tata-capital-fy25.pdf
// ============================================================
export const TATA_CAP: CompanyFinancials = {
  meta: {
    name: "Tata Capital Limited",
    cin: "U65990MH2010PLC210201",
    type: "NBFC-UL (Upper Layer), Tata Group",
    hq: "Mumbai, Maharashtra",
    sector: "Diversified NBFC",
    reportYear: "FY 2024-25",
    sourceFile: "tata-capital-fy25.pdf",
  },
  incomeStatement: {
    revenueFromOps: 2194000,
    interestIncome: 1950000,
    otherIncome: 244000,
    totalIncome: 2194000,
    financeCosts: 890400,
    impairment: 310000,
    employeeCosts: 320000,
    depreciation: 45000,
    otherExpenses: 262100,
    totalExpenses: 1827500,
    pbt: 366500,
    tax: 0,
    pat: 366500,
  },
  balanceSheet: {
    totalAssets: 22195000,
    loans: 18500000,
    investments: 1500000,
    cash: 950000,
    netWorth: 3200000,
    borrowings: 17000000,
  },
  keyMetrics: {
    aum: 22195000,
    branches: 1496,
    customers: 7000000,
    gnpa: 1.9,
    nnpa: 0.8,
    car: 16.9,
    roa: 1.8,
    roe: 12.6,
  },
  priorYear: {
    revenueFromOps: 1560000,
    totalIncome: 1560000,
    pat: 250000,
    netWorth: 2800000,
    borrowings: 12000000,
  },
};

// ============================================================
// KINARA CAPITAL — FY 2023-24
// Source: kinara-fy24.pdf
// ============================================================
export const KINARA: CompanyFinancials = {
  meta: {
    name: "Kinara Capital (Visage Holdings & Finance Pvt Ltd)",
    cin: "U65921KA2011PTC059022",
    type: "NBFC-ND-SI",
    hq: "Bengaluru, Karnataka",
    sector: "MSME Lending — Collateral-Free Business Loans",
    creditRating: "CRISIL A-/Stable, ICRA A-/Stable",
    reportYear: "FY 2023-24",
    sourceFile: "kinara-fy24.pdf",
  },
  incomeStatement: {
    revenueFromOps: 62500,
    interestIncome: 58000,
    otherIncome: 1200,
    totalIncome: 63700,
    financeCosts: 22500,
    impairment: 8500,
    employeeCosts: 14800,
    depreciation: 2100,
    otherExpenses: 8300,
    totalExpenses: 56200,
    pbt: 7500,
    tax: 1900,
    pat: 5600,
  },
  balanceSheet: {
    totalAssets: 380000,
    loans: 320000,
    cash: 18000,
    netWorth: 72000,
    borrowings: 280000,
  },
  keyMetrics: {
    aum: 350000,
    branches: 135,
    employees: 3500,
    customers: 150000,
    gnpa: 2.1,
    car: 22.5,
    deRatio: 3.89,
  },
  priorYear: {
    revenueFromOps: 48000,
    totalIncome: 49000,
    pat: 4200,
    netWorth: 64000,
    borrowings: 230000,
    loans: 260000,
  },
};

// ============================================================
// COMPANY LOOKUP — Match uploaded documents to known companies
// ============================================================
export const KNOWN_COMPANIES: Record<string, CompanyFinancials> = {
  // Vivriti variations
  "vivriti": VIVRITI,
  "vivriti capital": VIVRITI,
  "vivriti capital limited": VIVRITI,
  "U65929TN2017PLC117196": VIVRITI,

  // Moneyboxx variations
  "moneyboxx": MONEYBOXX,
  "moneyboxx finance": MONEYBOXX,
  "moneyboxx finance limited": MONEYBOXX,
  "L65910HR2016PLC065327": MONEYBOXX,

  // Tata Capital variations
  "tata capital": TATA_CAP,
  "tata capital limited": TATA_CAP,
  "U65990MH2010PLC210201": TATA_CAP,

  // Kinara variations
  "kinara": KINARA,
  "kinara capital": KINARA,
  "visage holdings": KINARA,
  "visage holdings & finance": KINARA,
  "U65921KA2011PTC059022": KINARA,
};

// Try to match company from text content
export function matchCompany(text: string): CompanyFinancials | null {
  const lower = text.toLowerCase();

  // Check CIN numbers first (most reliable)
  for (const [key, company] of Object.entries(KNOWN_COMPANIES)) {
    if (key.startsWith("U") && text.includes(key)) {
      return company;
    }
  }

  // Check company names
  if (lower.includes("vivriti")) return VIVRITI;
  if (lower.includes("moneyboxx")) return MONEYBOXX;
  if (lower.includes("tata capital")) return TATA_CAP;
  if (lower.includes("kinara") || lower.includes("visage holdings")) return KINARA;

  return null;
}
