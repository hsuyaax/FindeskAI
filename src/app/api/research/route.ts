import OpenAI from "openai";
import { searchWeb, buildSearchContext } from "@/lib/tavilySearch";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

const RESEARCH_SECTIONS = [
  {
    id: "company",
    title: "Company Profile & MCA Data",
    searchQuery: (name: string) => `${name} India company CIN incorporation directors MCA filings`,
    prompt: (name: string) =>
      `Using the web search results below, extract company profile data for "${name}". Find: CIN number, date of incorporation, registered address, directors/promoters, authorized and paid-up capital, MCA filing status, any charges registered. If data is not found in search results, say "Not found in search results". Format as bullet points. Cite sources.`,
  },
  {
    id: "financial",
    title: "Financial Health & Credit Signals",
    searchQuery: (name: string) => `${name} India financial results revenue profit net worth credit rating 2024 2025`,
    prompt: (name: string) =>
      `Using the web search results below, extract financial data for "${name}". Find: latest revenue/turnover, profit/loss, net worth, debt-equity ratio, EBITDA margin, credit ratings (CRISIL/ICRA/CARE), banking relationships. Check if they appear in any RBI defaulter lists. Format as bullet points with sources.`,
  },
  {
    id: "litigation",
    title: "Litigation & Legal Risk",
    searchQuery: (name: string) => `${name} India litigation legal cases NCLT court disputes regulatory action`,
    prompt: (name: string) =>
      `Using the web search results below, find any legal cases, litigation, NCLT proceedings, or regulatory actions involving "${name}". Check for: civil suits, criminal cases, consumer complaints, tax disputes, environmental violations. Format as bullet points. If nothing found, state "No litigation records found in search results."`,
  },
  {
    id: "news",
    title: "News Sentiment & Media Coverage",
    searchQuery: (name: string) => `${name} India latest news 2025 2024`,
    prompt: (name: string) =>
      `Using the web search results below, summarize recent news about "${name}". Classify each item as POSITIVE, NEGATIVE, or NEUTRAL. Look for: expansion plans, financial distress, management changes, regulatory issues, order wins, defaults. Format as: [SENTIMENT] headline — source. Cite the actual URLs from search results.`,
  },
  {
    id: "sector",
    title: "Sector Intelligence & Peer Analysis",
    searchQuery: (name: string) => `${name} India industry sector outlook peers competitors 2025`,
    prompt: (name: string) =>
      `Using the web search results below, analyze the sector/industry for "${name}". Find: sector outlook, key risks, regulatory changes, top comparable companies, average financial ratios. Check for RBI circulars affecting this sector. Format as bullet points.`,
  },
  {
    id: "gst",
    title: "GST & Tax Compliance",
    searchQuery: (name: string) => `${name} India GST registration GSTIN tax compliance penalties`,
    prompt: (name: string) =>
      `Using the web search results below, find GST and tax information for "${name}". Find: GSTIN, registration status, any GST evasion cases, tax disputes. Format as bullet points. If nothing specific found, state what general compliance status can be inferred.`,
  },
];

export async function POST(req: Request) {
  try {
    const { companyName } = await req.json();

    if (!companyName) {
      return Response.json(
        { error: "Company name is required" },
        { status: 400 }
      );
    }

    const hasTavily = !!process.env.TAVILY_API_KEY;
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        for (const section of RESEARCH_SECTIONS) {
          // Signal section start
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "section_start",
                id: section.id,
                title: section.title,
              })}\n\n`
            )
          );

          try {
            let searchContext = "";

            // Step 1: Real-time web search via Tavily
            if (hasTavily) {
              const searchResults = await searchWeb(
                section.searchQuery(companyName),
                5
              );
              searchContext = buildSearchContext(searchResults);

              // Send search sources to frontend
              if (searchResults.results.length > 0) {
                const sourcesText = `\n📡 Sources found: ${searchResults.results.length} web results\n`;
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({
                      type: "chunk",
                      id: section.id,
                      text: sourcesText,
                    })}\n\n`
                  )
                );
              }
            }

            // Step 2: Send search results + prompt to OpenAI for analysis
            const systemPrompt = hasTavily
              ? "You are a credit research analyst. Analyze the REAL web search results provided and extract relevant information. Always cite the source URLs. Be factual — only report what the search results actually contain."
              : "You are a credit research analyst. Provide your best analysis based on your training data. Note that this is not based on real-time data.";

            const userPrompt = hasTavily
              ? `${section.prompt(companyName)}\n\nWEB SEARCH RESULTS:\n${searchContext}`
              : section.prompt(companyName);

            const completion = await openai.chat.completions.create({
              model: "gpt-4o-mini",
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
              ],
              temperature: 0.3,
              stream: true,
            });

            for await (const chunk of completion) {
              const text = chunk.choices[0]?.delta?.content || "";
              if (text) {
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({
                      type: "chunk",
                      id: section.id,
                      text,
                    })}\n\n`
                  )
                );
              }
            }

            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: "section_end",
                  id: section.id,
                })}\n\n`
              )
            );
          } catch (err) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: "section_error",
                  id: section.id,
                  message: String(err),
                })}\n\n`
              )
            );
          }
        }

        // Generate risk summary using ALL search data
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "section_start",
              id: "risk_summary",
              title: "AI Risk Summary",
            })}\n\n`
          )
        );

        try {
          // One final comprehensive search
          let finalContext = "";
          if (hasTavily) {
            const finalSearch = await searchWeb(
              `${companyName} India credit risk financial health assessment`,
              3
            );
            finalContext = buildSearchContext(finalSearch);
          }

          const summaryCompletion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: hasTavily
                  ? "You are a senior credit analyst at an Indian NBFC. Provide a risk summary based on the web search results. Be specific and cite sources."
                  : "You are a senior credit analyst. Provide a risk summary based on your knowledge.",
              },
              {
                role: "user",
                content: `${hasTavily ? `WEB SEARCH RESULTS:\n${finalContext}\n\n` : ""}Based on all available information about "${companyName}" India, provide a credit risk summary:

OVERALL RISK RATING: [LOW / MODERATE / HIGH / VERY HIGH]

KEY POSITIVES:
• (3-5 positives with specific data points)

KEY RISKS:
• (3-5 risks with specific data points)

CREDIT RECOMMENDATION:
One paragraph with specific conditions.

SUGGESTED MONITORING:
• (3-4 covenants)

${hasTavily ? "Cite specific data from the search results." : ""}`,
              },
            ],
            stream: true,
          });

          for await (const chunk of summaryCompletion) {
            const text = chunk.choices[0]?.delta?.content || "";
            if (text) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    type: "chunk",
                    id: "risk_summary",
                    text,
                  })}\n\n`
                )
              );
            }
          }
        } catch (err) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "section_error",
                id: "risk_summary",
                message: String(err),
              })}\n\n`
            )
          );
        }

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
        );

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
    return Response.json(
      { error: "Research agent failed" },
      { status: 500 }
    );
  }
}
