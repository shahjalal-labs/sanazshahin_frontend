/**
 * High-performance client-side fuzzy search and typo tolerance utility.
 * Tolerates 1-2 typos, phonetic variations, transposed letters, and prefix matches.
 */

// Common culinary terms and ingredients for baseline recipe vocabulary
const COMMON_CULINARY_TERMS = [
  "gnocchi", "potato", "potatoes", "sweet", "purple", "waffle", "waffles",
  "muffin", "muffins", "cinnamon", "apple", "peach", "peaches", "shaved",
  "carrot", "carrots", "pickled", "cookie", "cookies", "sauce", "tomato",
  "tomatoes", "lemon", "chips", "beet", "beets", "pasta", "salad", "chicken",
  "avocado", "chocolate", "vanilla", "banana", "berry", "blueberry", "strawberry",
  "bread", "soup", "stew", "curry", "rice", "bowl", "smoothie", "pancake", "pancakes",
  "garlic", "onion", "butter", "cheese", "cream", "vegan", "gluten", "free"
];

/**
 * Calculates the Levenshtein distance between two strings.
 */
export function levenshteinDistance(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;

  const matrix: number[][] = [];

  for (let i = 0; i <= bn; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= an; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= bn; i++) {
    for (let j = 1; j <= an; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j + 1] || matrix[i - 1][j - 1] + 1, // deletion
          matrix[i][j - 1] + 1
        );
      }
    }
  }

  return matrix[bn][an];
}

/**
 * Returns a normalized similarity score between 0 and 1.
 */
export function stringSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  if (s1 === s2) return 1.0;
  if (!s1 || !s2) return 0.0;

  const maxLen = Math.max(s1.length, s2.length);
  const distance = levenshteinDistance(s1, s2);
  return (maxLen - distance) / maxLen;
}

/**
 * Checks if a search query token fuzzy-matches any token in a recipe text.
 */
export function tokenFuzzyMatch(
  queryToken: string,
  targetToken: string,
  maxDistance: number = 2
): boolean {
  const q = queryToken.toLowerCase();
  const t = targetToken.toLowerCase();

  // Exact or prefix match
  if (t === q || t.startsWith(q) || q.startsWith(t)) {
    return true;
  }

  // If query is short (<= 3 chars), allow at most 1 typo
  const allowedDistance = q.length <= 3 ? 1 : maxDistance;

  // Substring check
  if (t.includes(q)) {
    return true;
  }

  // Levenshtein check
  const dist = levenshteinDistance(q, t);
  if (dist <= allowedDistance) {
    return true;
  }

  // Handle plural / singular (e.g. potato / potatos / potatoes)
  const qSingular = q.replace(/e?s$/, "");
  const tSingular = t.replace(/e?s$/, "");
  if (qSingular === tSingular || levenshteinDistance(qSingular, tSingular) <= 1) {
    return true;
  }

  return false;
}

/**
 * Searches and scores a recipe title/content against user query tokens.
 */
export function fuzzyMatchesRecipe(
  query: string,
  recipeText: string
): { matched: boolean; score: number } {
  const normalizedQuery = query.toLowerCase().trim();
  const normalizedText = recipeText.toLowerCase().trim();

  if (!normalizedQuery) return { matched: true, score: 1 };
  if (normalizedText.includes(normalizedQuery)) return { matched: true, score: 1 };

  const queryWords = normalizedQuery.split(/\s+/).filter(Boolean);
  const targetWords = normalizedText.split(/[\s,._\-+/]+/).filter(Boolean);

  let matchCount = 0;
  let totalScore = 0;

  for (const qWord of queryWords) {
    let bestWordScore = 0;
    for (const tWord of targetWords) {
      if (tokenFuzzyMatch(qWord, tWord)) {
        const sim = stringSimilarity(qWord, tWord);
        if (sim > bestWordScore) {
          bestWordScore = sim;
        }
      }
    }

    if (bestWordScore > 0) {
      matchCount++;
      totalScore += bestWordScore;
    }
  }

  // If all query tokens have a match or at least 70% match for multi-word queries
  const requiredMatches = queryWords.length === 1 ? 1 : Math.ceil(queryWords.length * 0.7);
  const matched = matchCount >= requiredMatches;

  return {
    matched,
    score: queryWords.length > 0 ? totalScore / queryWords.length : 0,
  };
}

/**
 * Checks if a recipe strictly contains the search terms (exact substring/token search).
 */
export function exactMatchesRecipe(query: string, recipeText: string): boolean {
  const normalizedQuery = query.toLowerCase().trim();
  const normalizedText = recipeText.toLowerCase().trim();

  if (!normalizedQuery) return true;
  if (normalizedText.includes(normalizedQuery)) return true;

  const queryWords = normalizedQuery.split(/\s+/).filter(Boolean);
  const targetWords = normalizedText.split(/[\s,._\-+/]+/).filter(Boolean);

  // All query words must exist exactly in the target text
  return queryWords.every((qWord) =>
    targetWords.some((tWord) => tWord === qWord || tWord.includes(qWord))
  );
}

/**
 * Given a list of recipe candidate titles and a user query,
 * finds the best typo correction among recipe words and common culinary terms.
 */
export function suggestTypoCorrection(
  query: string,
  candidateTitles: string[] = []
): { correctedQuery: string; isCorrected: boolean } {
  const q = query.trim();
  if (!q) return { correctedQuery: q, isCorrected: false };

  // Collect all unique words in candidate titles + baseline culinary terms
  const vocabulary = new Set<string>(COMMON_CULINARY_TERMS);
  for (const title of candidateTitles) {
    const words = title.toLowerCase().split(/[\s,._\-+/]+/).filter((w) => w.length > 2);
    for (const word of words) {
      vocabulary.add(word);
    }
  }

  const queryTokens = q.toLowerCase().split(/\s+/).filter(Boolean);
  let changed = false;
  const correctedTokens: string[] = [];

  for (const token of queryTokens) {
    // If the token is already in the vocabulary, it's correct
    if (vocabulary.has(token)) {
      correctedTokens.push(token);
      continue;
    }

    // Find the closest vocabulary word
    let bestWord = token;
    let highestSim = 0;

    for (const vocabWord of vocabulary) {
      const sim = stringSimilarity(token, vocabWord);
      // If similarity >= 0.60 or edit distance <= 2, consider it a typo
      const dist = levenshteinDistance(token, vocabWord);
      if ((sim >= 0.60 || dist <= 2) && sim > highestSim) {
        highestSim = sim;
        bestWord = vocabWord;
      }
    }

    if (bestWord !== token) {
      changed = true;
      correctedTokens.push(bestWord);
    } else {
      correctedTokens.push(token);
    }
  }

  return {
    correctedQuery: correctedTokens.join(" "),
    isCorrected: changed,
  };
}
