export interface Factor {
  name: string;
  value: string;
  impact: "positive" | "negative" | "neutral" | "critical";
  detail: string;
}

export interface FiveCScores {
  character: { score: number; factors: Factor[] };
  capacity: { score: number; factors: Factor[] };
  capital: { score: number; factors: Factor[] };
  collateral: { score: number; factors: Factor[] };
  conditions: { score: number; factors: Factor[] };
}

export interface Weights {
  character: number;
  capacity: number;
  capital: number;
  collateral: number;
  conditions: number;
}

export const DEFAULT_WEIGHTS: Weights = {
  character: 0.20,
  capacity: 0.25,
  capital: 0.20,
  collateral: 0.15,
  conditions: 0.20,
};

export function computeComposite(
  scores: Record<string, { score: number }>,
  weights: Weights
): number {
  return +(
    (scores.character?.score || 0) * weights.character +
    (scores.capacity?.score || 0) * weights.capacity +
    (scores.capital?.score || 0) * weights.capital +
    (scores.collateral?.score || 0) * weights.collateral +
    (scores.conditions?.score || 0) * weights.conditions
  ).toFixed(1);
}

export function getDecision(composite: number, requestedAmount: number) {
  if (composite >= 75)
    return {
      decision: "APPROVE" as const,
      amount: requestedAmount,
      rate: "MCLR + 1.50%",
    };
  if (composite >= 60)
    return {
      decision: "CONDITIONAL" as const,
      amount: +(requestedAmount * 0.65).toFixed(2),
      rate: "MCLR + 2.75%",
    };
  return {
    decision: "REJECT" as const,
    amount: 0,
    rate: "N/A",
  };
}
