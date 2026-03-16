import OpenAI from "openai";
import { searchWeb, buildSearchContext } from "@/lib/tavilySearch";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

// FinRobot-style Financial Chain-of-Thought (CoT) Architecture
// Reference: Zhou et al., ICAIF 2024 — "FinRobot: An Open-Source AI Agent Platform"
// Pattern: Data-CoT → Concept-CoT → Thesis-CoT

const DATA_COT_TEMPLATE = (data: string) => `
You are a Data-CoT Agent in a Financial Chain-of-Thought pipeline.
Your role: Aggregate and structure the raw financial data. Do NOT analyze or recommend.
Simply organize the data into clear categories.

RAW DATA:
${data}

Organize into:
1. FINANCIAL METRICS (revenue, margins, ratios — numbers only)
2. RISK SIGNALS (any red flags or concerns)
3. POSITIVE SIGNALS (strengths and mitigants)
4. EXTERNAL FACTORS (sector, regulatory, market conditions)

Be precise. Use exact numbers from the data. No opinions.`;

const CONCEPT_COT_HAWK = `You are the HAWK AGENT performing Concept-CoT analysis — the analytical reasoning stage in a Financial Chain-of-Thought pipeline (FinRobot architecture, Zhou et al. ICAIF 2024).

Your mandate: Apply CONSERVATIVE risk reasoning to the structured data. You are extremely skeptical and always lean toward REJECT.

Given the structured financial data below, write a REJECT argument (150-200 words):
- Apply ratio analysis reasoning (DSCR, D/E thresholds)
- Apply cross-verification logic (GST 3B vs 2A discrepancy implications)
- Apply statistical anomaly reasoning (Benford's law violations)
- Cite specific numbers. Be aggressive in risk assessment.
- Format with numbered points. Start with "REJECT this application."`;

const CONCEPT_COT_DOVE = `You are the DOVE AGENT performing Concept-CoT analysis — the relationship-focused evaluation stage in a Financial Chain-of-Thought pipeline.

Your mandate: Apply GROWTH-ORIENTED reasoning to identify approval pathways. Find mitigating factors and argue for conditional approval.

Given the structured financial data below, write a CONDITIONAL APPROVE argument (150-200 words):
- Apply collateral adequacy reasoning
- Apply promoter quality assessment
- Apply turnaround potential analysis
- Cite specific numbers. Highlight strengths.
- Format with numbered points. Start with "APPROVE with conditions."`;

const THESIS_COT_OWL = `You are the OWL AGENT performing Thesis-CoT synthesis — the final decision stage in a Financial Chain-of-Thought pipeline (FinRobot architecture).

Your mandate: Synthesize the Hawk (risk) and Dove (growth) Concept-CoT analyses into a coherent credit thesis. You are the Chief Credit Officer.

Given BOTH arguments below, write your SYNTHESIS and FINAL DECISION (200-250 words):
- Reference specific points from both agents
- State which analytical reasoning you found more compelling and why
- Include specific conditions: amount, pricing (MCLR + spread decomposition), tenure
- Include monitoring covenants tailored to identified risks
- Start with "CONDITIONAL APPROVAL at [amount]."

This follows the FinRobot Thesis-CoT pattern: the LLM synthesizes from pre-computed structured analysis, never from raw documents.`;

export async function POST(req: Request) {
  try {
    const { companyData, hawkArg, doveArg } = await req.json();

    // Real-time web search for latest sector/company data
    let realTimeContext = "";
    if (process.env.TAVILY_API_KEY) {
      try {
        const searchResults = await searchWeb(
          `${companyData.slice(0, 100)} India credit risk sector outlook latest news 2025`,
          3
        );
        realTimeContext = buildSearchContext(searchResults);
      } catch {
        // Continue without real-time data
      }
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        async function streamAgent(
          agent: "hawk" | "dove" | "owl",
          systemPrompt: string,
          extraContext: string = ""
        ) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ agent, type: "start" })}\n\n`
            )
          );

          const prompt = `${systemPrompt}\n\nSTRUCTURED FINANCIAL DATA:\n${companyData}\n${realTimeContext ? `\nREAL-TIME WEB DATA:\n${realTimeContext}` : ""}\n${extraContext}`;

          const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            stream: true,
          });

          let fullText = "";
          for await (const chunk of completion) {
            const text = chunk.choices[0]?.delta?.content || "";
            if (text) {
              fullText += text;
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ agent, type: "chunk", text })}\n\n`
                )
              );
            }
          }

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ agent, type: "end", text: fullText })}\n\n`
            )
          );

          return fullText;
        }

        try {
          // Stage 1: Hawk Concept-CoT (conservative risk reasoning)
          const hawkText = await streamAgent("hawk", CONCEPT_COT_HAWK);

          // Stage 2: Dove Concept-CoT (growth-oriented reasoning)
          const doveText = await streamAgent("dove", CONCEPT_COT_DOVE);

          // Stage 3: Owl Thesis-CoT (synthesis from both Concept-CoT outputs)
          await streamAgent(
            "owl",
            THESIS_COT_OWL,
            `\n\nHAWK CONCEPT-COT ANALYSIS:\n${hawkArg || hawkText}\n\nDOVE CONCEPT-COT ANALYSIS:\n${doveArg || doveText}`
          );

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
          );
        } catch (err) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "error", message: String(err) })}\n\n`
            )
          );
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch {
    return Response.json({ error: "Failed to start debate" }, { status: 500 });
  }
}
