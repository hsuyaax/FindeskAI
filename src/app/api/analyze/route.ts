import OpenAI from "openai";
import { matchCompany } from "@/data/extracted/companies";
import { analyzeCompany } from "@/lib/analyzeCompany";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

const ANALYSIS_PROMPT = `You are an expert Indian credit analyst at an NBFC. Analyze the uploaded financial document(s) and extract a comprehensive credit assessment.

Return ONLY valid JSON (no markdown, no backticks) with this exact structure:
{
  "company": {
    "name": "Company Name",
    "cin": "CIN number if found",
    "sector": "Industry sector",
    "promoter": "Promoter names and shareholding",
    "facility": "Location",
    "requestedLoan": "Loan amount if mentioned",
    "revenue": "Latest revenue figure",
    "ebitdaMargin": "EBITDA margin %",
    "netWorth": "Net worth",
    "debtEquity": "D/E ratio",
    "dscr": "DSCR",
    "currentRatio": "Current ratio"
  },
  "fiveCScores": {
    "character": { "score": 72, "label": "Moderate/Strong/Weak", "reasoning": "Brief reasoning" },
    "capacity": { "score": 61, "label": "...", "reasoning": "..." },
    "capital": { "score": 78, "label": "...", "reasoning": "..." },
    "collateral": { "score": 82, "label": "...", "reasoning": "..." },
    "conditions": { "score": 55, "label": "...", "reasoning": "..." }
  },
  "compositeScore": 68.2,
  "recommendation": "APPROVE / CONDITIONAL_APPROVE / REJECT",
  "recommendedAmount": "Amount in Cr",
  "keyRisks": [
    { "factor": "Risk name", "pillar": "Which C", "impact": -8.5, "detail": "Explanation" }
  ],
  "keyStrengths": [
    { "factor": "Strength name", "detail": "Explanation" }
  ],
  "executiveSummary": "2-3 paragraph executive summary of the credit assessment"
}

Be thorough. If data is not available in the document, make reasonable estimates based on the industry and available information. Always provide all fields.`;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const textData = formData.get("text") as string | null;

    let documentText = "";

    if (file) {
      const bytes = await file.arrayBuffer();
      documentText = Buffer.from(bytes).toString("utf-8");

      // Also check filename for known companies
      const fileName = file.name.toLowerCase();
      if (fileName.includes("vivriti") || fileName.includes("vcl")) {
        const matched = matchCompany("vivriti");
        if (matched) {
          const analysis = analyzeCompany(matched);
          return Response.json({
            analysis,
            source: "pre-extracted",
            note: "Analyzed using pre-extracted data from Vivriti Capital annual report. All ratios computed deterministically.",
          });
        }
      }
      if (fileName.includes("moneyboxx")) {
        const matched = matchCompany("moneyboxx");
        if (matched) {
          const analysis = analyzeCompany(matched);
          return Response.json({ analysis, source: "pre-extracted" });
        }
      }
      if (fileName.includes("tata") && fileName.includes("capital")) {
        const matched = matchCompany("tata capital");
        if (matched) {
          const analysis = analyzeCompany(matched);
          return Response.json({ analysis, source: "pre-extracted" });
        }
      }
      if (fileName.includes("kinara")) {
        const matched = matchCompany("kinara");
        if (matched) {
          const analysis = analyzeCompany(matched);
          return Response.json({ analysis, source: "pre-extracted" });
        }
      }
    } else if (textData) {
      documentText = textData;
    } else {
      return Response.json(
        { error: "No file or text provided" },
        { status: 400 }
      );
    }

    // Try to match from document content
    const matched = matchCompany(documentText.slice(0, 5000));
    if (matched) {
      const analysis = analyzeCompany(matched);
      return Response.json({
        analysis,
        source: "pre-extracted",
        note: `Matched to ${matched.meta.name}. All ratios computed by deterministic engine.`,
      });
    }

    // Unknown company — use OpenAI for analysis
    const prompt = `${ANALYSIS_PROMPT}\n\nDOCUMENT CONTENT:\n${documentText.slice(0, 50000)}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const responseText = completion.choices[0]?.message?.content || "";

    let analysis;
    try {
      const cleaned = responseText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      analysis = JSON.parse(cleaned);
    } catch {
      return Response.json({
        raw: responseText,
        error: "Could not parse structured response",
      });
    }

    return Response.json({
      analysis,
      source: "ai-generated",
      note: "Analyzed using OpenAI. For known companies (Vivriti, Moneyboxx, Tata Capital, Kinara), pre-extracted data with deterministic ratios is used.",
    });
  } catch (err) {
    return Response.json(
      { error: `Analysis failed: ${String(err)}` },
      { status: 500 }
    );
  }
}
