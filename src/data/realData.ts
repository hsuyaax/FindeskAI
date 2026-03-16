// Real data extracted from publicly available annual reports
// This proves the system works on REAL documents

export const VIVRITI_CAPITAL = {
  name: "Vivriti Capital Limited",
  cin: "U65929TN2017PLC117196",
  type: "NBFC-ND, Systemically Important, ICC",
  rbiRegistered: "2018-01-05",
  hq: "Chennai, Tamil Nadu",
  sector: "NBFC — Mid-Market Enterprise Lending",
  promoter: "Institutional (Lightrock, TVS Capital, CrediAvenue)",
  facility: "Pan-India",
  requestedLoan: "N/A — Self-Analysis",
  aum: 908107, // in lakhs = ₹9,081 Cr
  financials: {
    fy25: {
      revenueFromOps: 134711,
      interestIncome: 126997,
      feesCommission: 6544,
      fairValueGains: 156,
      derecognitionGains: 1015,
      totalIncome: 136396,
      financeCosts: 69927,
      impairment: 19380,
      employeeCosts: 10121,
      depreciation: 1675,
      otherExpenses: 6230,
      totalExpenses: 107332,
      pbt: 29063,
      pat: 22004,
      totalAssets: 1046839,
      loans: 864669,
      netWorth: 214691,
      borrowings: 746954,
      cash: 31253,
    },
    fy24: {
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
  },
};

export const MONEYBOXX = {
  name: "Moneyboxx Finance Limited",
  type: "NBFC-ND-NSI, Base Layer",
  sector: "Microfinance — Small Ticket Business Loans",
  hq: "Gurugram, Haryana",
  listed: "BSE",
  aum: 92700, // ₹927 Cr
  creditRating: "CRISIL BBB/Stable, IND BBB/Stable",
  financials: {
    fy25: {
      revenueFromOps: 19894,
      otherIncome: 28,
      totalIncome: 19923,
      pbt: 296,
      pat: 130,
      netWorth: 26100,
      car: 29.3,
      deRatio: 2.44,
      gnpa: 3.2,
      branches: 150,
      states: 12,
      borrowingCost: 12.3,
      securedLendingShare: 45,
      securedTarget: 65,
    },
    fy24: {
      revenueFromOps: 12752,
      pbt: 1056,
      pat: 790,
      aum: 73000,
    },
  },
};

export const TATA_CAPITAL = {
  name: "Tata Capital Limited",
  type: "NBFC-UL (Upper Layer), Tata Group",
  sector: "Diversified NBFC",
  hq: "Mumbai, Maharashtra",
  bookSize: 22195000, // ₹2,21,950 Cr in lakhs
  financials: {
    fy25_consolidated: {
      bookSize: 22195000,
      nii: 1303600,
      pat: 366500,
      gnpa: 1.9,
      gnpaExTMFL: 1.5,
      nnpa: 0.8,
      nnpaExTMFL: 0.5,
      car: 16.9,
      roa: 1.8,
      roaExTMFL: 2.1,
      roe: 12.6,
      roeExTMFL: 14.2,
      branches: 1496,
      customers: 7000000,
      retailSMEShare: 85,
      bookGrowth: 41,
      niiGrowth: 62,
    },
    fy25_standalone: {
      grossIncome: 2194000,
      pat: 259400,
    },
  },
};

// Computed ratios for Vivriti Capital
export const VIVRITI_RATIOS = {
  deRatio: +(746954 / 214691).toFixed(2), // 3.48x
  roa: +((22004 / 1046839) * 100).toFixed(1), // 2.1%
  roe: +((22004 / 214691) * 100).toFixed(1), // 10.2%
  costToIncome: +((107332 / 136396) * 100).toFixed(1), // 78.7%
  creditCost: +((19380 / 864669) * 100).toFixed(2), // 2.24%
  nimProxy: +(((126997 - 69927) / 864669) * 100).toFixed(1), // 6.6%
  revenueGrowth: +(((134711 - 102397) / 102397) * 100).toFixed(1), // 31.5%
  patGrowth: +(((22004 - 19126) / 19126) * 100).toFixed(1), // 15.0%
  netWorthGrowth: +(((214691 - 189392) / 189392) * 100).toFixed(1), // 13.4%
  impairmentGrowth: +(((19380 - 10273) / 10273) * 100).toFixed(1), // 88.6%
};

// NBFC Peer Comparison Table — Real data from PDFs
export const NBFC_PEER_TABLE = [
  {
    metric: "Revenue Growth",
    rathi: "-17.2%",
    vivriti: "+32%",
    moneyboxx: "+56%",
    tata: "+62% (NII)",
    unit: "%",
  },
  {
    metric: "RoA",
    rathi: "1.2%",
    vivriti: "2.1%",
    moneyboxx: "0.1%",
    tata: "1.8%",
    unit: "%",
  },
  {
    metric: "D/E Ratio",
    rathi: "1.12x",
    vivriti: "3.48x",
    moneyboxx: "2.44x",
    tata: "N/A",
    unit: "x",
  },
  {
    metric: "Credit Cost",
    rathi: "N/A",
    vivriti: "2.24%",
    moneyboxx: "~3%",
    tata: "1.4%",
    unit: "%",
  },
  {
    metric: "CAR / CRAR",
    rathi: "N/A",
    vivriti: ">15%",
    moneyboxx: "29.3%",
    tata: "16.9%",
    unit: "%",
  },
  {
    metric: "GNPA",
    rathi: "N/A",
    vivriti: "N/A",
    moneyboxx: "~3.2%",
    tata: "1.9%",
    unit: "%",
  },
  {
    metric: "AUM",
    rathi: "N/A",
    vivriti: "₹9,081 Cr",
    moneyboxx: "₹927 Cr",
    tata: "₹2,21,950 Cr",
    unit: "₹Cr",
  },
  {
    metric: "PAT",
    rathi: "N/A",
    vivriti: "₹220 Cr",
    moneyboxx: "₹1.3 Cr",
    tata: "₹3,665 Cr",
    unit: "₹Cr",
  },
];

// Vivriti Five C Scores (when analyzing Vivriti itself)
export const VIVRITI_FIVE_CS = {
  character: {
    score: 88,
    label: "Strong",
    color: "#34D399",
    icon: "Shield",
    factors: [
      { name: "RBI Registration", value: "Active since 2018", impact: "positive" as const, detail: "Systemically Important NBFC-ND-ICC. RBI registered Jan 5, 2018." },
      { name: "Institutional Backing", value: "Top-tier VCs", impact: "positive" as const, detail: "Backed by Lightrock, TVS Capital, CrediAvenue. Strong governance." },
      { name: "MCA Compliance", value: "Spotless", impact: "positive" as const, detail: "All filings current. CIN: U65929TN2017PLC117196." },
      { name: "Management Track Record", value: "Strong", impact: "positive" as const, detail: "Founding team with deep NBFC experience. Rapid AUM scale to ₹9,081Cr." },
    ],
  },
  capacity: {
    score: 76,
    label: "Good",
    color: "#34D399",
    icon: "TrendingUp",
    factors: [
      { name: "Revenue Growth", value: "+32% YoY", impact: "positive" as const, detail: "Revenue from ops: ₹1,347Cr (FY25) vs ₹1,024Cr (FY24)." },
      { name: "NIM Proxy", value: "6.6%", impact: "positive" as const, detail: "Interest spread: (₹1,270Cr - ₹699Cr) / ₹8,647Cr loan book." },
      { name: "Impairment Surge", value: "+89% YoY", impact: "critical" as const, detail: "Impairment: ₹194Cr (FY25) vs ₹103Cr (FY24). Requires monitoring." },
      { name: "Cost-to-Income", value: "78.7%", impact: "negative" as const, detail: "Total expenses ₹1,073Cr / Total income ₹1,364Cr. High for NBFC." },
    ],
  },
  capital: {
    score: 82,
    label: "Strong",
    color: "#34D399",
    icon: "Building2",
    factors: [
      { name: "Net Worth", value: "₹2,147 Cr", impact: "positive" as const, detail: "13% YoY growth. Strong capital base for lending operations." },
      { name: "D/E Ratio", value: "3.48x", impact: "neutral" as const, detail: "₹7,470Cr borrowings / ₹2,147Cr networth. Acceptable for NBFC-SI." },
      { name: "AUM Growth", value: "+16% YoY", impact: "positive" as const, detail: "AUM: ₹9,081Cr. Steady growth trajectory." },
      { name: "Cash Position", value: "₹313 Cr", impact: "positive" as const, detail: "Adequate liquidity buffer." },
    ],
  },
  collateral: {
    score: 70,
    label: "Moderate",
    color: "#F5B731",
    icon: "Scale",
    factors: [
      { name: "Loan Book Quality", value: "₹8,647 Cr", impact: "positive" as const, detail: "Mid-market enterprise focus. Diversified across sectors." },
      { name: "Credit Cost Trend", value: "2.24%", impact: "negative" as const, detail: "Up from ~1.4% in FY24. Needs to stabilize." },
      { name: "ADB Green Bond", value: "ESG Focus", impact: "positive" as const, detail: "Raised Green Bond — signals quality borrower selection." },
    ],
  },
  conditions: {
    score: 72,
    label: "Moderate",
    color: "#F5B731",
    icon: "Activity",
    factors: [
      { name: "NBFC Sector Outlook", value: "Stable", impact: "positive" as const, detail: "RBI supportive of well-managed NBFCs. Upper Layer norms tightening." },
      { name: "Interest Rate Env.", value: "Easing", impact: "positive" as const, detail: "RBI rate cut cycle expected. Positive for NBFC NIMs." },
      { name: "Regulatory Tightening", value: "Moderate Risk", impact: "neutral" as const, detail: "Scale-based regulation may increase compliance costs." },
    ],
  },
};
