import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

export async function POST(req: Request) {
  try {
    const { companyData, scores, debate } = await req.json();

    const prompt = `You are an expert Indian NBFC credit analyst. Generate a professional Credit Appraisal Memorandum (CAM) based on the following data.

COMPANY DATA:
${companyData}

FIVE C SCORES:
${scores}

CREDIT COMMITTEE DEBATE SUMMARY:
${debate}

Generate a comprehensive CAM document with these sections:
1. EXECUTIVE SUMMARY (2 paragraphs)
2. COMPANY BACKGROUND & PROMOTER PROFILE
3. FINANCIAL ANALYSIS (with specific numbers)
4. FIVE C ASSESSMENT (brief paragraph for each C with score)
5. KEY RISK FLAGS (numbered list with severity: Critical/High/Medium)
6. CREDIT COMMITTEE OUTCOME (summarize the 3-agent debate)
7. RECOMMENDATION & CONDITIONS (specific terms: amount, rate, tenure, covenants)
8. TERM SHEET (structured format)

Use professional banking language. Include specific numbers. Reference RBI norms where applicable. Make it sound like a real Indian bank CAM document.

Format as clean text with clear section headers. About 800-1000 words.`;

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            stream: true,
          });

          for await (const chunk of completion) {
            const text = chunk.choices[0]?.delta?.content || "";
            if (text) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
              );
            }
          }

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
          );
        } catch (err) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: String(err) })}\n\n`
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
    return Response.json(
      { error: "Failed to generate CAM" },
      { status: 500 }
    );
  }
}
