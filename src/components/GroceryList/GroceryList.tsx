"use client";

import { useGetAllRecipesQuery } from "@/redux/api/recipeApi";
import { Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import RecipeCardSkeleton from "../ui/RecipeCardSkeleton";

function GroceryList() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [savedRecipes, setSavedRecipes] = useState<string[]>([]);

  const { data, isLoading } = useGetAllRecipesQuery({
    page: currentPage,
    limit: 6,
  });
  const recipes = data?.result?.recipes || [];
  const totalPages = data?.result?.meta?.totalPages || 1;

  const toggleSave = (id: string) => {
    setSavedRecipes((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (isLoading) {
    return <RecipeCardSkeleton />;
  }

  return (
    <section className="mx-auto w-full max-w-[1180px] pb-10 pt-[104px]">
      <div className="px-4 sm:px-6">
        <h1 className="text-[32px] font-bold leading-none text-[#131313] md:text-[35px] ">
          Grocery list
        </h1>
        <p className="mt-4 text-xl font-medium leading-tight text-[#FF3A32] ">
          **Choose recipes to make grocery list
        </p>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe: any) => (
            <article
              key={recipe.id}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              onClick={() => router.push(`/grocery-list/${recipe.id}`)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  router.push(`/grocery-list/${recipe.id}`);
                }
              }}
            >
              <div className="relative aspect-[0.9] overflow-hidden rounded-[24px] border border-[#3157BC]">
                <Image
                  src={recipe.recipeImage}
                  alt={recipe.recipeName}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleSave(recipe.id);
                  }}
                  className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/20 text-white"
                  aria-label="Save recipe"
                >
                  <Bookmark
                    className="h-4 w-4"
                    strokeWidth={2.2}
                    fill={
                      savedRecipes.includes(recipe.id) ? "currentColor" : "none"
                    }
                  />
                </button>
              </div>

              <h2 className="whitespace-pre-line px-2 pt-3 text-center font-semibold leading-[1.28] text-[#123996] [font-size:clamp(20px,1.12vw,28px)]">
                {recipe.recipeName}
              </h2>
            </article>
          ))}
        </div>

        <div className="mt-7 flex justify-center lg:justify-end">
          <div className="flex items-center gap-2 rounded-lg bg-[#FBFAFB] px-2.5 py-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="grid h-8 w-8 place-items-center rounded-md text-[#E7A5C6] transition-colors hover:bg-[#F8EEF4] disabled:cursor-not-allowed disabled:opacity-55"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-1.5 text-sm">
              {Array.from(
                { length: Math.min(3, totalPages) },
                (_, i) => i + 1,
              ).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`grid h-8 w-8 place-items-center rounded-md font-semibold transition-colors ${
                    currentPage === pageNumber
                      ? "bg-[#2D56C8] text-white"
                      : "text-[#2A2A2A] hover:bg-slate-100"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              {totalPages > 3 && (
                <>
                  <span className="px-1 text-[#7B8290]">...</span>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(totalPages)}
                    className="px-1 text-sm font-semibold text-[#2A2A2A] transition-colors hover:text-[#2D56C8]"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="grid h-8 w-8 place-items-center rounded-md text-[#E7A5C6] transition-colors hover:bg-[#F8EEF4] disabled:cursor-not-allowed disabled:opacity-55"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GroceryList;
