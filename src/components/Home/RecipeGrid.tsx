"use client";

import { useGetAllRecipesQuery } from "@/redux/api/recipeApi";
import { Bookmark, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BeautifulSpinner } from "../ui/BeautifulSpinner";

type RecipeItem = {
  id: string;
  recipeName: string;
  recipeImage: string;
  isBookmarked?: boolean;
};

type RecipeListResponse = {
  result?: {
    meta?: {
      totalPages?: number;
      currentPage?: number;
    };
    recipes?: RecipeItem[];
  };
};

const toRecipeSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function RecipeGrid() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [savedRecipes, setSavedRecipes] = useState<string[]>([]);
  const [recipeType, setRecipeType] = useState("all");
  const [ingredient, setIngredient] = useState("all");
  const [feature, setFeature] = useState("all");

  const { data, isLoading, error } = useGetAllRecipesQuery({
    page: currentPage,
    limit: 9,
  });

  const recipeData = data as RecipeListResponse | undefined;
  const recipes = recipeData?.result?.recipes ?? [];
  const totalPages = recipeData?.result?.meta?.totalPages ?? 1;
  const activePage = recipeData?.result?.meta?.currentPage ?? currentPage;

  const toggleSave = (recipeId: string) => {
    setSavedRecipes((prev) =>
      prev.includes(recipeId)
        ? prev.filter((r) => r !== recipeId)
        : [...prev, recipeId],
    );
  };

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const filters = [
    {
      value: recipeType,
      onChange: setRecipeType,
      options: [
        { value: "all", label: "Recipe Types" },
        { value: "salad", label: "Salad" },
        { value: "snack", label: "Snack" },
        { value: "dessert", label: "Dessert" },
      ],
    },
    {
      value: ingredient,
      onChange: setIngredient,
      options: [
        { value: "all", label: "Ingredients" },
        { value: "vegan", label: "Vegan" },
        { value: "glutenfree", label: "Gluten-free" },
      ],
    },
    {
      value: feature,
      onChange: setFeature,
      options: [
        { value: "all", label: "Features" },
        { value: "quick", label: "Quick" },
        { value: "healthy", label: "Healthy" },
      ],
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <BeautifulSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Error loading recipes. Please try again later.
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="w-full pt-[104px]">
        <div className="mx-auto container px-4 py-20 text-center">
          <h2 className="text-2xl font-semibold text-[#121212]">
            No recipes found
          </h2>
          <p className="mt-2 text-sm text-[#6B7280]">
            Try a different filter or check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pt-[104px]">
      {/* Header Section */}
      <div>
        <div className="mx-auto container px-4">
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <h1 className="text-[36px] font-bold leading-none tracking-[-0.02em] text-[#121212] sm:text-[42px]">
              Our Recipe
            </h1>

            {/* Filter Dropdowns */}
            <div className="grid w-full grid-cols-1 gap-3 sm:w-auto sm:grid-cols-3">
              {filters.map((filter, index) => (
                <div key={index} className="relative min-w-[150px]">
                  <select
                    value={filter.value}
                    onChange={(event) => filter.onChange(event.target.value)}
                    className="h-10 w-full appearance-none rounded-md border border-[#E4E7EC] bg-[#F8FAFC] px-3 pr-9 text-sm font-medium text-[#94A3B8] outline-none transition-colors focus:border-[#B6C5F7] focus:bg-white"
                    aria-label={filter.options[0].label}
                  >
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="px-4 pb-8">
        <div className="container mx-auto ">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => {
              const recipeSlug = toRecipeSlug(recipe.recipeName || recipe.id);
              const isSaved =
                recipe.isBookmarked || savedRecipes.includes(recipe.id);
              return (
                <div
                  key={recipe.id}
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(`/recipe/${encodeURIComponent(recipeSlug)}`)
                  }
                  role="link"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      router.push(`/recipe/${encodeURIComponent(recipeSlug)}`);
                    }
                  }}
                >
                  {/* Recipe Image */}
                  <div className="relative aspect-square overflow-hidden rounded-[18px] border border-[#2649BF] bg-slate-200">
                    <Image
                      src={recipe.recipeImage}
                      alt={recipe.recipeName}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
                      className="object-cover transition-transform duration-300 hover:scale-[1.03]"
                    />
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleSave(recipe.id);
                      }}
                      className="absolute right-3 top-3 z-10 text-white/95 transition-opacity hover:opacity-80"
                      aria-label={isSaved ? "Unsave recipe" : "Save recipe"}
                    >
                      <Bookmark
                        className="h-5 w-5"
                        fill={isSaved ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth={2.2}
                      />
                    </button>
                  </div>

                  {/* Recipe Title */}
                  <div className="px-2 pt-2">
                    <h3 className="whitespace-pre-line text-center font-semibold leading-[1.35] text-[#0D3692] [font-size:clamp(18px,1.14vw,29px)]">
                      {recipe.recipeName}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="px-4 py-8 sm:px-5 lg:px-6">
        <div className="mx-auto flex max-w-[1040px] justify-center sm:justify-end">
          <div className="flex items-center gap-1.5 rounded-lg bg-[#FBFAFB] px-2 py-1.5">
            <button
              onClick={handlePrev}
              disabled={activePage === 1}
              className="grid h-7 w-7 place-items-center rounded-md text-[#E7A5C6] transition-colors hover:bg-[#F9EEF3] disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-1 text-xs text-[#2A2A2A]">
              {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`grid h-7 w-7 place-items-center rounded-md font-semibold transition-colors ${
                      activePage === pageNum
                        ? "bg-[#2B56C8] text-white"
                        : "text-[#2A2A2A] hover:bg-slate-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <span className="px-1 text-[#6F7787]">...</span>

              <button
                onClick={() => setCurrentPage(totalPages)}
                className="grid h-7 min-w-7 place-items-center rounded-md px-1 font-semibold text-[#2A2A2A] transition-colors hover:bg-slate-100"
              >
                {totalPages}
              </button>
            </div>

            <button
              onClick={handleNext}
              disabled={activePage === totalPages}
              className="grid h-7 w-7 place-items-center rounded-md text-[#E7A5C6] transition-colors hover:bg-[#F9EEF3] disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
