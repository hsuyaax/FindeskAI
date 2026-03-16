// Tavily Search — real-time web search optimized for AI agents
// Returns clean, summarized results that can be fed directly to LLMs

export interface TavilyResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

export interface TavilyResponse {
  answer?: string;
  results: TavilyResult[];
  query: string;
}

export async function searchWeb(query: string, maxResults = 5): Promise<TavilyResponse> {
  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey) {
    // Fallback: return empty results if no Tavily key
    return { results: [], query, answer: undefined };
  }

  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: "advanced",
        include_answer: true,
        max_results: maxResults,
      }),
    });

    if (!response.ok) {
      console.error("Tavily search failed:", response.status);
      return { results: [], query, answer: undefined };
    }

    const data = await response.json();
    return {
      answer: data.answer,
      results: (data.results || []).map((r: { title: string; url: string; content: string; score: number }) => ({
        title: r.title,
        url: r.url,
        content: r.content,
        score: r.score,
      })),
      query,
    };
  } catch (err) {
    console.error("Tavily search error:", err);
    return { results: [], query, answer: undefined };
  }
}

// Build context string from search results for LLM consumption
export function buildSearchContext(results: TavilyResponse): string {
  let context = "";

  if (results.answer) {
    context += `TAVILY AI SUMMARY:\n${results.answer}\n\n`;
  }

  if (results.results.length > 0) {
    context += "WEB SEARCH RESULTS:\n";
    results.results.forEach((r, i) => {
      context += `[${i + 1}] ${r.title}\nURL: ${r.url}\n${r.content}\n\n`;
    });
  }

  return context;
}
