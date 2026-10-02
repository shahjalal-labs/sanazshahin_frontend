"use client";

import Image from "next/image";
import Link from "next/link";
import { useGetAvailableScrappedRecipesQuery } from "@/redux/api/mealApi";
import Pagination from "@/shared/Pagination";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  Search,
  Utensils,
  RefreshCw,
  Sparkles,
  CornerDownLeft,
} from "lucide-react";
import AiSearchBar from "./AiSearchBar";
import { fuzzyMatchesRecipe, exactMatchesRecipe } from "@/lib/fuzzySearch";

interface ScrapedRecipe {
  title: string;
  image: string;
  link: string;
  category?: string;
  features?: string[];
}

const ScrappedRecipies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [correctedQuery, setCorrectedQuery] = useState("");
  const [isCorrected, setIsCorrected] = useState(false);
  const [useOriginal, setUseOriginal] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [page, setPage] = useState(1);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const { data, isLoading, isError, refetch } =
    useGetAvailableScrappedRecipesQuery({
      page,
      search: "",
    });

  const recipes: ScrapedRecipe[] = data?.data?.recipes ?? [];

  // Function to call the AI correction API
  const performAiCorrection = useCallback(
    async (rawQuery: string) => {
      const q = rawQuery.trim();
      if (!q || q.length < 2) {
        setIsCorrected(false);
        setCorrectedQuery("");
        setIsAiLoading(false);
        return;
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setIsAiLoading(true);

      try {
        const recipeTitles = recipes.map((r) => r.title);
        const res = await fetch("/api/ai/correct-query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: q,
            contextTitles: recipeTitles,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!res.ok) {
          throw new Error("AI request failed");
        }

        const result = await res.json();
        if (result.isCorrected && result.correctedQuery) {
          setCorrectedQuery(result.correctedQuery);
          setIsCorrected(true);
        } else {
          setIsCorrected(false);
          setCorrectedQuery("");
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setIsCorrected(false);
        }
      } finally {
        setIsAiLoading(false);
      }
    },
    [recipes],
  );

  // Handle user typing with debounce
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setUseOriginal(false);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!value.trim()) {
      setIsCorrected(false);
      setCorrectedQuery("");
      setIsAiLoading(false);
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      performAiCorrection(value);
    }, 450);
  };

  // Immediate AI correction on Enter submit
  const handleSubmit = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    performAiCorrection(searchTerm);
  };

  // Apply the corrected word directly into the input box
  const handleApplyCorrection = () => {
    if (correctedQuery) {
      setSearchTerm(correctedQuery);
      setIsCorrected(false);
      setUseOriginal(false);
    }
  };

  const handleClearSearch = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setSearchTerm("");
    setCorrectedQuery("");
    setIsCorrected(false);
    setUseOriginal(false);
    setIsAiLoading(false);
  };

  const handleUseOriginal = () => {
    setUseOriginal(true);
  };

  const handleUseCorrected = () => {
    setUseOriginal(false);
  };

  const handleRetry = () => {
    refetch();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Filter recipes:
  // - If useOriginal is true: strictly checks for exact match (so searching for exact typo returns 0)
  // - If useOriginal is false: searches using correctedQuery (or fuzzy matching on raw)
  const filteredRecipes = useMemo(() => {
    const raw = searchTerm.trim();
    if (!raw) return recipes;

    // Strict exact matching when user explicitly opts out of AI correction
    if (useOriginal) {
      return recipes.filter((recipe) => exactMatchesRecipe(raw, recipe.title));
    }

    // Normal mode: search with AI corrected query if available, otherwise raw with fuzzy match
    const activeQuery = isCorrected && correctedQuery ? correctedQuery : raw;
    const matches: { recipe: ScrapedRecipe; score: number }[] = [];

    for (const recipe of recipes) {
      const matchResult = fuzzyMatchesRecipe(activeQuery, recipe.title);
      if (matchResult.matched) {
        matches.push({ recipe, score: matchResult.score });
      }
    }

    matches.sort((a, b) => b.score - a.score);
    return matches.map((m) => m.recipe);
  }, [recipes, searchTerm, correctedQuery, isCorrected, useOriginal]);

  // Professional Error State
  if (isError) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 ">
        <div className="flex justify-end mb-4 pt-16 md:pt-20">
          <AiSearchBar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onClear={handleClearSearch}
            isAiLoading={isAiLoading}
            isCorrected={isCorrected}
            correctedQuery={correctedQuery}
            useOriginal={useOriginal}
            onUseOriginal={handleUseOriginal}
            onUseCorrected={handleUseCorrected}
            onApplyCorrection={handleApplyCorrection}
            onSubmit={handleSubmit}
          />
        </div>

        <div className="flex min-h-[500px] flex-col items-center justify-center rounded-3xl bg-gradient-to-b from-gray-50 to-white px-6 py-16 text-center shadow-sm border border-gray-100">
          <div className="relative mb-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-orange-50">
              <Utensils
                className="h-12 w-12 text-orange-400"
                strokeWidth={1.5}
              />
            </div>
            <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
              <Search className="h-4 w-4 text-red-500" />
            </div>
          </div>

          <h3 className="mb-2 text-2xl font-bold text-gray-800">
            Error Loading Recipes
          </h3>
          <p className="mb-2 max-w-md text-gray-500">
            We encountered a problem fetching the recipes from the server.
          </p>

          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-white transition-all hover:bg-primary/90 hover:shadow-lg mt-4 cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </section>
    );
  }

  // When search yields 0 results
  const showNoResults =
    !isLoading && searchTerm.trim() && filteredRecipes.length === 0;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Top Search Area */}
      <div className="flex justify-end mb-6 pt-16 md:pt-20">
        <AiSearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onClear={handleClearSearch}
          isAiLoading={isAiLoading}
          isCorrected={isCorrected}
          correctedQuery={correctedQuery}
          useOriginal={useOriginal}
          onUseOriginal={handleUseOriginal}
          onUseCorrected={handleUseCorrected}
          onApplyCorrection={handleApplyCorrection}
          onSubmit={handleSubmit}
          resultCount={searchTerm.trim() ? filteredRecipes.length : undefined}
        />
      </div>

      {/* No Results Empty State */}
      {showNoResults ? (
        <div className="flex min-h-[460px] flex-col items-center justify-center rounded-3xl bg-gradient-to-b from-gray-50 to-white px-6 py-16 text-center shadow-sm border border-gray-100">
          <div className="relative mb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
              <Sparkles className="h-10 w-10 text-primary" strokeWidth={1.5} />
            </div>
          </div>

          <h3 className="mb-2 text-2xl font-bold text-gray-800">
            {useOriginal
              ? `No exact matches found for "${searchTerm}"`
              : `No recipes found for "${searchTerm}"`}
          </h3>

          {useOriginal && isCorrected && correctedQuery && (
            <div className="mb-6 flex flex-col items-center gap-3">
              <p className="text-sm text-gray-500">
                The exact text "{searchTerm}" does not exist in any recipe.
              </p>
              <button
                type="button"
                onClick={handleUseCorrected}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-semibold text-sm rounded-xl cursor-pointer transition-colors"
              >
                <CornerDownLeft className="w-4 h-4" />
                Did you mean "{correctedQuery}"?
              </button>
            </div>
          )}

          {!useOriginal && (
            <p className="mb-6 max-w-md text-sm text-gray-400">
              Try searching by ingredients (e.g. potato, cinnamon, waffle,
              muffin) or check for another dish.
            </p>
          )}

          <button
            onClick={handleClearSearch}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary/90 hover:shadow-md cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            Clear Search & View All
          </button>
        </div>
      ) : (
        /* Recipe Cards Grid */
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-sm"
                >
                  <div className="aspect-[3/4] animate-pulse bg-slate-200" />
                  <div className="px-4 py-4">
                    <div className="mx-auto h-5 w-4/5 animate-pulse rounded bg-slate-200" />
                  </div>
                </div>
              ))
            : filteredRecipes.map((recipe) => (
                <Link
                  key={recipe.link}
                  href={`/recipe/${encodeURIComponent(recipe.title)}`}
                  className="group block"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[20px] border border-[#02248C] bg-slate-100 transition-all duration-300 hover:shadow-lg">
                    <Image
                      src={recipe.image}
                      alt={recipe.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  <div className="px-2 pt-3 pb-2 text-center">
                    <h3 className="text-center text-[18px] font-bold leading-snug text-[#02248C] group-hover:text-primary transition-colors">
                      {recipe.title}
                    </h3>
                  </div>
                </Link>
              ))}
        </div>
      )}

      {/* Pagination - only shown when not actively searching */}
      {!searchTerm.trim() && (
        <div className="mt-8">
          <Pagination
            setPage={setPage}
            page={page}
            totalPage={data?.data?.totalPages || 1}
          />
        </div>
      )}
    </section>
  );
};

export default ScrappedRecipies;

