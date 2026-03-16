import OpenAI from "openai";
import { searchWeb, buildSearchContext } from "@/lib/tavilySearch";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

// Enriches analysis data for specific tabs by searching the web
// Called when a tab doesn't have enough data from the initial analysis

const TAB_QUERIES: Record<string, {
  searches: (name: string) => string[];
  prompt: (name: string, context: string) => string;
}> = {
  gst: {
    searches: (name) => [
      `${name} India GST filing GSTR-3B GSTR-2A revenue mismatch`,
      `${name} India GST compliance tax fraud evasion`,
    ],
    prompt: (name, context) => `You are a GST forensics analyst. Using the web search results, generate a GST analysis for "${name}".

Return ONLY valid JSON (no markdown):
{
  "gstMonthly": [
    {"month": "Apr-24", "b3": 5.8, "a2": 4.9, "flag": false},
    {"month": "May-24", "b3": 6.1, "a2": 5.2, "flag": false}
  ],
  "totalB3": 72.4,
  "totalA2": 58.1,
  "gap": 14.3,
  "gapPercent": 19.7,
  "findings": ["finding 1", "finding 2"],
  "riskLevel": "HIGH/MEDIUM/LOW"
}

Generate 12 months of realistic GST data based on the company's revenue and sector. If actual GST data is found in search results, use it. Otherwise estimate from revenue figures.

WEB RESULTS:\n${context}`,
  },

  reconciliation: {
    searches: (name) => [
      `${name} India annual report revenue bank statement financial data verification`,
    ],
    prompt: (name, context) => `Generate three-way reconciliation data for "${name}".

Return ONLY valid JSON:
{
  "rows": [
    {"metric": "Revenue FY24", "ar": "value", "gst": "value", "bank": "value", "conf": "HIGH/MEDIUM", "note": "note"},
  ],
  "trustNote": "Key finding about data consistency"
}

Base this on actual financial data from search results. Generate 5 reconciliation rows.

WEB RESULTS:\n${context}`,
  },

  benford: {
    searches: (name) => [
      `${name} India financial statements digit analysis fraud detection`,
    ],
    prompt: (name, context) => `Generate Benford's Law analysis data for "${name}".

Return ONLY valid JSON:
{
  "data": [
    {"digit": 1, "expected": 30.1, "actual": 28.5},
    {"digit": 2, "expected": 17.6, "actual": 16.2}
  ],
  "pValue": 0.15,
  "conclusion": "PASS/FAIL",
  "detail": "Explanation"
}

Generate all 9 digits. If the company has any fraud signals from search results, make the actual distribution deviate more from expected. Otherwise keep it close to Benford's expected distribution.

WEB RESULTS:\n${context}`,
  },

  whatif: {
    searches: (name) => [
      `${name} India sector outlook interest rate impact stress test`,
    ],
    prompt: (name, context) => `Generate stress test parameters for "${name}".

Return ONLY valid JSON:
{
  "baseRevenue": 72.4,
  "baseDSCR": 1.08,
  "baseMargin": 4.2,
  "baseCapUtil": 42,
  "sectorOutlook": "NEGATIVE/STABLE/POSITIVE",
  "keyStressFactors": ["factor 1", "factor 2"],
  "breakevenRevenue": 65.2,
  "revenueBuffer": -12.2
}

Use actual financial data from search results to set realistic base values.

WEB RESULTS:\n${context}`,
  },

  ews: {
    searches: (name) => [
      `${name} India credit downgrade NPA warning default risk recent`,
    ],
    prompt: (name, context) => `Generate Early Warning Signal monitoring data for "${name}".

Return ONLY valid JSON:
{
  "currentStatus": "green/yellow/orange/red",
  "signals": [
    {"month": "Month 1", "status": "green", "label": "Normal", "events": ["event1", "event2"]},
  ],
  "riskTrajectory": "STABLE/DETERIORATING/IMPROVING",
  "recommendation": "Recommendation text"
}

Generate 6 months of monitoring data. Use search results to determine if the company shows any deterioration signals. If company is healthy, show a stable green trajectory.

WEB RESULTS:\n${context}`,
  },

  peers: {
    searches: (name) => [
      `${name} India competitors peers comparison financial performance`,
      `${name} India industry benchmark ratios`,
    ],
    prompt: (name, context) => `Generate peer comparison data for "${name}".

Return ONLY valid JSON:
{
  "peers": [
    {"name": "Peer 1", "revenue": "value", "margin": "value", "growth": "value"},
  ],
  "benchmarks": [
    {"metric": "Revenue Growth", "company": -5, "median": 8, "topQuartile": 15, "unit": "%"},
  ],
  "sectorMedian": {"dscr": 1.45, "deRatio": 1.35, "margin": 8.5},
  "assessment": "Assessment text"
}

Use real competitor data from search results. Generate 5 benchmark metrics.

WEB RESULTS:\n${context}`,
  },
};

export async function POST(req: Request) {
  try {
    const { companyName, tabId } = await req.json();

    if (!companyName || !tabId) {
      return Response.json({ error: "companyName and tabId required" }, { status: 400 });
    }

    const tabConfig = TAB_QUERIES[tabId];
    if (!tabConfig) {
      return Response.json({ error: `No enrichment config for tab: ${tabId}` }, { status: 400 });
    }

    // Search web for real data
    let allContext = "";
    for (const query of tabConfig.searches(companyName)) {
      const results = await searchWeb(query, 3);
      allContext += buildSearchContext(results) + "\n";
    }

    // Generate structured data using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: tabConfig.prompt(companyName, allContext) },
      ],
      temperature: 0.3,
    });

    const responseText = completion.choices[0]?.message?.content || "";

    try {
      const cleaned = responseText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      const data = JSON.parse(cleaned);
      return Response.json({ data, source: allContext ? "web-enriched" : "ai-generated" });
    } catch {
      return Response.json({ raw: responseText, error: "Could not parse response" });
    }
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
