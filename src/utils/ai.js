// Client utilities to call local AI server
import axios from "axios";
const AI_BASE_URL = import.meta.env.VITE_AI_BASE_URL || "http://localhost:8000";
console.log("AI_BASE_URL:", AI_BASE_URL);
export async function aiParseSearch(query) {
  try {
    const { data } = await axios.post(`${AI_BASE_URL}/ai/parse-search`, {
      query,
    });
    return data; // { mediaType, filters }
  } catch (e) {
    // Fallback client-side default parse if server unavailable
    const q = String(query || "").toLowerCase();
    const isTv = /(series|tv|show)/.test(q);
    const yearMatch = q.match(/\b(19|20)\d{2}\b/);
    const isIndian =
      /\bindia|indian|bollywood|hindi|tollywood|kollywood\b/.test(q);
    const lang = /\bhindi\b/.test(q)
      ? "hi"
      : /\btamil\b/.test(q)
      ? "ta"
      : /\btelugu\b/.test(q)
      ? "te"
      : null;
    // Other countries/languages
    const originMap = [
      { re: /\bkorean?\b|\bkorea\b/, country: "KR", lang: "ko" },
      { re: /\bjapan(?:ese)?\b|\bjapan\b/, country: "JP", lang: "ja" },
      { re: /\bspanish\b|\bspain\b/, country: "ES", lang: "es" },
      { re: /\bfrench\b|\bfrance\b/, country: "FR", lang: "fr" },
      { re: /\bgerman\b|\bgermany\b/, country: "DE", lang: "de" },
      { re: /\bitalian\b|\bitaly\b/, country: "IT", lang: "it" },
      { re: /\b(usa|us|american|united states)\b/, country: "US", lang: null },
      { re: /\buk|british|united kingdom\b/, country: "GB", lang: null },
    ];
    let originCountry = isIndian ? "IN" : null;
    let origLang = lang;
    if (!originCountry) {
      for (const o of originMap) {
        if (o.re.test(q)) {
          originCountry = o.country;
          if (!origLang) origLang = o.lang;
          break;
        }
      }
    }

    // Sort detection
    let sort_by = "popularity.desc";
    if (/top rated|top-rated|rated high|highly rated|vote|rating/.test(q))
      sort_by = "vote_average.desc";
    else if (/latest|new|recent|release date|released/.test(q))
      sort_by = isTv ? "first_air_date.desc" : "release_date.desc";
    else if (/popular|trending|most watched/.test(q))
      sort_by = "popularity.desc";

    // Rating threshold detection
    let vote_average_gte = null;
    const ratingNum = q.match(
      /(rating|rated|score|vote)?\s*(>=|over|above|at least|min)?\s*(\d+(?:\.\d+)?)/
    );
    if (ratingNum) {
      const val = parseFloat(ratingNum[3]);
      if (!isNaN(val)) vote_average_gte = Math.max(0, Math.min(10, val));
    }

    // Date range detection: between X and Y, from X to Y, after, before
    let date_gte = null;
    let date_lte = null;
    const between = q.match(/(between|from)\s+(\d{4})\s+(and|to)\s+(\d{4})/);
    if (between) {
      const y1 = parseInt(between[2], 10);
      const y2 = parseInt(between[4], 10);
      if (y1 && y2) {
        date_gte = `${Math.min(y1, y2)}-01-01`;
        date_lte = `${Math.max(y1, y2)}-12-31`;
      }
    } else {
      const after = q.match(/after\s+(\d{4})/);
      const before = q.match(/before\s+(\d{4})/);
      if (after) {
        const y = parseInt(after[1], 10);
        if (y) date_gte = `${y}-01-01`;
      }
      if (before) {
        const y = parseInt(before[1], 10);
        if (y) date_lte = `${y}-12-31`;
      }
    }
    return {
      mediaType: isTv ? "tv" : "movie",
      filters: {
        with_genres_names: [],
        year: yearMatch ? Number(yearMatch[0]) : null,
        sort_by,
        vote_average_gte,
        include_adult: false,
        language: "en-US",
        with_origin_country: originCountry,
        with_original_language: origLang || null,
        date_gte,
        date_lte,
      },
    };
  }
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
  const byName = new Map(
    Object.values(genresMap).map((g) => [g.name.toLowerCase(), g.id])
  );
  return names
    .map((n) => byName.get(String(n).toLowerCase()))
    .filter((v) => typeof v === "number");
}

// Heuristic to decide if a query is a natural-language filter request vs. a title search
export function isNaturalLanguageQuery(query) {
  const s = String(query || "")
    .toLowerCase()
    .trim();
  if (!s) return false;
  const words = s.split(/\s+/);
  if (words.length <= 2) return false; // short queries are likely titles
  const yearRe = /\b(19|20)\d{2}\b/;
  const hasYear = yearRe.test(s);
  const hasSort = /sort(?:ed)?\s*by|order(?:ed)?\s*by/.test(s);
  const hasComparative = /\b(after|before|between|from)\b/.test(s) && hasYear;
  const hasRating = /\b(rating|rated|score|vote)\b/.test(s);
  const hasThreshold = /\b(above|below|over|under|>=|<=)\b/.test(s);
  const hasMediaWord = /\b(movie|movies|tv|show|shows|series)\b/.test(s);
  const hasQual = /\b(top|best|popular|trending)\b/.test(s);
  const hasGenre =
    /\b(action|comedy|drama|sci[- ]?fi|science fiction|romance|horror|thriller|documentary|family|animation|crime|mystery|adventure|fantasy)\b/.test(
      s
    );
  // Avoid known false positives for titles containing common NL words
  if (/\btop gun\b/.test(s) || /\bafter we\b/.test(s)) return false;
  const signals = [
    hasYear,
    hasSort,
    hasComparative,
    hasRating,
    hasThreshold,
    hasMediaWord,
    hasQual,
    hasGenre,
  ].filter(Boolean).length;
  return signals >= 2 || (hasYear && (hasGenre || hasQual));
}
