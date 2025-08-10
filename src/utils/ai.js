// Client utilities to call local AI server
import axios from "axios";
const AI_BASE_URL = import.meta.env.VITE_AI_BASE_URL || "http://localhost:3001";

export async function aiParseSearch(query) {
  const { data } = await axios.post(`${AI_BASE_URL}/ai/parse-search`, { query });
  return data; // { mediaType, filters }
}

export async function aiSummarize({ title, overview, genresNames, rating }) {
  const { data } = await axios.post(`${AI_BASE_URL}/ai/summarize`, {
    title,
    overview,
    genresNames,
    rating,
  });
  return data; // { summary, why_like }
}

// Map genre names -> TMDB genre IDs using Redux state map
export function mapGenreNamesToIds(genresMap, names = []) {
  if (!genresMap || !names?.length) return [];
  const byName = new Map(Object.values(genresMap).map((g) => [g.name.toLowerCase(), g.id]));
  return names
    .map((n) => byName.get(String(n).toLowerCase()))
    .filter((v) => typeof v === "number");
}
