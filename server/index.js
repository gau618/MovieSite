/* Minimal AI server using Gemini for MovieSite (ESM) */
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn("[AI Server] Missing GEMINI_API_KEY. Set it in a .env file at project root.");
}

const app = express();
app.use(cors());
app.use(express.json());

let model;
try {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || "");
  model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
} catch (e) {
  console.error("[AI Server] Failed to initialize Gemini:", e.message);
}

app.get("/health", (req, res) => res.json({ ok: true }));

// Helpers to parse loose LLM output into JSON safely
function extractJson(text) {
  if (!text) return null;
  // strip code fences
  const stripped = text.replace(/```[a-z]*\n?|```/gi, "").trim();
  try {
    return JSON.parse(stripped);
  } catch {}
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) {
    const sliced = text.slice(start, end + 1);
    try { return JSON.parse(sliced); } catch {}
  }
  return null;
}

app.post("/ai/parse-search", async (req, res) => {
  try {
    const { query } = req.body || {};
    if (!query) return res.status(400).json({ error: "Missing query" });
    if (!model) return res.status(500).json({ error: "Model not initialized" });

    const prompt = `You convert a natural language movie/TV search into TMDB discover filters.
Return a compact JSON object with:
{
  "mediaType": "movie" | "tv",
  "filters": {
    "with_genres_names": string[],
    "year": number | null,
    "sort_by": "popularity.desc" | "vote_average.desc" | "release_date.desc" | "first_air_date.desc",
    "vote_average_gte": number | null,
    "include_adult": false,
    "language": "en-US"
  }
}
Only return JSON. Infer mediaType from the request if specified, else choose what fits.
Request: ${query}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
    const parsed = extractJson(text);
    if (parsed && typeof parsed === 'object') {
      return res.json(parsed);
    }
    // Fallback default if parsing fails
    return res.json({
      mediaType: "movie",
      filters: {
        with_genres_names: [],
        year: null,
        sort_by: "popularity.desc",
        vote_average_gte: null,
        include_adult: false,
        language: "en-US",
      },
    });
  } catch (err) {
    console.error("/ai/parse-search error:", err.message);
    return res.status(500).json({ error: "parse-search failed" });
  }
});

app.post("/ai/summarize", async (req, res) => {
  try {
    const { title, overview, genresNames = [], rating } = req.body || {};
    if (!overview && !title) return res.status(400).json({ error: "Missing content" });
    if (!model) return res.status(500).json({ error: "Model not initialized" });

    const prompt = `Create:
1) A one-sentence engaging summary of this title.
2) A short line "Why you might like this" based on genres and rating.
Keep it under 40 words total. Output JSON as {"summary":"...","why_like":"..."}.
Title: ${title || "Unknown"}
Genres: ${genresNames.join(", ")}
Rating: ${rating ?? "N/A"}
Overview: ${overview || ""}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
    const parsed = extractJson(text);
    if (parsed && typeof parsed === 'object') {
      const summary = typeof parsed.summary === 'string' ? parsed.summary : null;
      const why_like = typeof parsed.why_like === 'string' ? parsed.why_like : null;
      if (summary || why_like) return res.json({ summary: summary || "", why_like: why_like || "" });
    }
    // Try to salvage lines from plain text
    let summaryLine = "";
    let whyLine = "";
    const lines = (text || "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    for (const l of lines) {
      if (!summaryLine && /summary/i.test(l)) summaryLine = l.replace(/summary\s*[:\-]\s*/i, "");
      if (!whyLine && /(why|you might like)/i.test(l)) whyLine = l.replace(/(why( you might like)?)[\s:,-]*/i, "");
    }
    if (!summaryLine && text) summaryLine = text.slice(0, 220);
    return res.json({ summary: summaryLine || "", why_like: whyLine || "" });
  } catch (err) {
    console.error("/ai/summarize error:", err.message);
    return res.status(500).json({ error: "summarize failed" });
  }
});

app.listen(PORT, () => {
  console.log(`[AI Server] listening on http://localhost:${PORT}`);
});
