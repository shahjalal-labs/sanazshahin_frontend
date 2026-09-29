import { NextRequest, NextResponse } from "next/server";
import { suggestTypoCorrection } from "@/lib/fuzzySearch";

interface RequestBody {
  query: string;
  contextTitles?: string[];
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const query = body.query?.trim();
    const contextTitles = body.contextTitles || [];

    if (!query) {
      return NextResponse.json({
        correctedQuery: "",
        isCorrected: false,
        keywords: [],
        source: "empty",
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    // Fallback helper using local fuzzy / culinary NLP engine
    const getLocalFallback = () => {
      const fallback = suggestTypoCorrection(query, contextTitles);
      return NextResponse.json({
        correctedQuery: fallback.correctedQuery,
        isCorrected: fallback.isCorrected,
        keywords: fallback.correctedQuery.split(/\s+/).filter(Boolean),
        source: "fuzzy-nlp",
      });
    };

    // If no OpenAI API key configured, use local engine immediately
    if (!apiKey) {
      return getLocalFallback();
    }

    // Call OpenAI API for typo correction
    const systemPrompt = `You are a culinary search assistant for a recipe website.
Your task is to fix spelling mistakes, typos, or phonetic errors in the recipe search query.
Examples:
- "gnocccy" / "gnoci" -> "gnocchi"
- "potatos" -> "potato"
- "swet potato" -> "sweet potato"
- "wafles" -> "waffles"
- "cinamon mufins" -> "cinnamon muffins"
- "pech" -> "peach"

Guidelines:
1. If the user query has a typo, correct it to standard culinary spelling.
2. If it is already correct, keep it as is.
3. Return strictly valid JSON in this format:
{
  "correctedQuery": "string",
  "isCorrected": boolean,
  "keywords": ["array", "of", "keywords"]
}`;

    const contextSnippet = contextTitles.length > 0
      ? `\nAvailable recipe titles: ${contextTitles.slice(0, 30).join(", ")}`
      : "";

    const userPrompt = `User search query: "${query}"${contextSnippet}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model.includes("gpt-4") ? model : "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: { type: "json_object" },
          temperature: 0.1,
          max_tokens: 120,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // If OpenAI key is invalid (401), quota exceeded (429), or server error
      if (!response.ok) {
        // Silently and gracefully use the local typo-correction engine (no server crash or alarming error log)
        return getLocalFallback();
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        return getLocalFallback();
      }

      const parsed = JSON.parse(content);
      const corrected = (parsed.correctedQuery || query).trim();
      const isCorrected = Boolean(
        parsed.isCorrected ??
        corrected.toLowerCase() !== query.toLowerCase()
      );

      return NextResponse.json({
        correctedQuery: corrected,
        isCorrected,
        keywords: Array.isArray(parsed.keywords) ? parsed.keywords : corrected.split(/\s+/),
        source: "openai",
      });
    } catch {
      clearTimeout(timeoutId);
      // On network timeout or abort, fall back cleanly
      return getLocalFallback();
    }
  } catch {
    // Top-level fallback
    return NextResponse.json(
      {
        correctedQuery: "",
        isCorrected: false,
        keywords: [],
        source: "fallback",
      },
      { status: 200 }
    );
  }
}
