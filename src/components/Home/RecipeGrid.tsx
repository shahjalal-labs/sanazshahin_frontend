"use client";

import { recipes } from "@/lib/recipes";
import { Bookmark, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RecipeGrid() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [savedRecipes, setSavedRecipes] = useState<number[]>([]);
  const [recipeType, setRecipeType] = useState("all");
  const [ingredient, setIngredient] = useState("all");
  const [feature, setFeature] = useState("all");
  const recipesPerPage = 6;

  const totalPages = Math.ceil(recipes.length / recipesPerPage);
  const startIndex = (currentPage - 1) * recipesPerPage;
  const displayedRecipes = recipes.slice(
    startIndex,
    startIndex + recipesPerPage,
  );

  const toggleSave = (id: number) => {
    setSavedRecipes((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
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
            {displayedRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="cursor-pointer"
                onClick={() => router.push(`/recipe/${recipe.id}`)}
                role="link"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    router.push(`/recipe/${recipe.id}`);
                  }
                }}
              >
                {/* Recipe Image */}
                <div className="relative aspect-square overflow-hidden rounded-[18px] border border-[#2649BF] bg-slate-200">
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
                    className="object-cover transition-transform duration-300 hover:scale-[1.03]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.8)_100%)]" />
                  {/* Save Button */}
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleSave(recipe.id);
                    }}
                    className="absolute right-3 top-3 z-10 text-white/95 transition-opacity hover:opacity-80"
                    aria-label="Save recipe"
                  >
                    <Bookmark
                      className="h-5 w-5"
                      fill={
                        savedRecipes.includes(recipe.id)
                          ? "currentColor"
                          : "none"
                      }
                      stroke="currentColor"
                      strokeWidth={2.2}
                    />
                  </button>
                </div>

                {/* Recipe Title */}
                <div className="px-2 pt-2">
                  <h3 className="whitespace-pre-line text-center font-semibold leading-[1.35] text-[#0D3692] [font-size:clamp(18px,1.14vw,29px)]">
                    {recipe.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="px-4 py-8 sm:px-5 lg:px-6">
        <div className="mx-auto flex max-w-[1040px] justify-center sm:justify-end">
          <div className="flex items-center gap-1.5 rounded-lg bg-[#FBFAFB] px-2 py-1.5">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
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
                      currentPage === pageNum
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
              disabled={currentPage === totalPages}
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
