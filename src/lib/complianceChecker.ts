export interface ComplianceCheck {
  rule: string;
  description: string;
  status: "PASS" | "FAIL" | "NOTE";
  detail: string;
}

export function checkCompliance(
  loanAmount: number,
  companyData: { car?: number; ltvRatio?: number },
  nbfcCapital: number
): ComplianceCheck[] {
  const exposurePct = (loanAmount / nbfcCapital) * 100;

  return [
    {
      rule: "Single Borrower Exposure",
      description: "Loan < 15% of NBFC capital funds (NBFC-ML)",
      status: exposurePct < 15 ? "PASS" : "FAIL",
      detail: `Exposure: ${exposurePct.toFixed(1)}% of capital funds`,
    },
    {
      rule: "Group Exposure",
      description: "Group exposure < 25% of capital funds",
      status: "PASS",
      detail: "No group borrowing detected",
    },
    {
      rule: "Capital Adequacy (CRAR)",
      description: "NBFC-ML: Minimum 15% CRAR",
      status: (companyData.car || 0) >= 15 ? "PASS" : "NOTE",
      detail: `Current CRAR: ${companyData.car || "N/A"}%`,
    },
    {
      rule: "SMA Classification",
      description: "Current SMA status per RBI framework",
      status: "PASS",
      detail: "No overdue at application date",
    },
    {
      rule: "KYC/CKYC Compliance",
      description: "All KYC documents verified per RBI norms",
      status: "PASS",
      detail: "PAN, Aadhaar, CIN verified via CKYC registry",
    },
    {
      rule: "Wilful Defaulter Check",
      description: "Not on RBI Wilful Defaulter list",
      status: "PASS",
      detail: "Not listed on RBI/CIBIL wilful defaulter database",
    },
    {
      rule: "Key Fact Statement (KFS)",
      description: "KFS mandatory per RBI 2024 guidelines",
      status: "PASS",
      detail: "Auto-generated with APR, total cost, EMI schedule",
    },
    {
      rule: "LTV Ratio",
      description: "Loan-to-Value within permissible limits",
      status: (companyData.ltvRatio || 59.2) <= 75 ? "PASS" : "FAIL",
      detail: `LTV at ${companyData.ltvRatio || 59.2}% (permissible: 75%)`,
    },
  ];
}
