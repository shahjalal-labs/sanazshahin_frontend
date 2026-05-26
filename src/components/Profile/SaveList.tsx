"use client";

import { useGetRecipeBookmarksQuery } from "@/redux/api/recipeApi";
import { Bookmark } from "lucide-react";
import Image from "next/image";

function SaveList() {
  const {
    data: bookmarkedRecipes,
    isLoading,
    error,
  } = useGetRecipeBookmarksQuery();

  const recipes =
    (
      bookmarkedRecipes as
        | Array<{
            recipe?: {
              id: string;
              recipeName: string;
              recipeImage: string;
            };
          }>
        | undefined
    )
      ?.map((item) => item.recipe)
      .filter(
        (
          recipe,
        ): recipe is {
          id: string;
          recipeName: string;
          recipeImage: string;
        } => Boolean(recipe),
      ) ?? [];

  if (isLoading) {
    return (
      <section className="w-full pt-[104px]">
        <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6">
          <div className="flex h-[300px] items-center justify-center text-[#1B1B1B]">
            Loading bookmarks...
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full pt-[104px]">
        <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6">
          <div className="flex h-[300px] items-center justify-center text-red-500">
            Error loading bookmarks. Please try again later.
          </div>
        </div>
      </section>
    );
  }

  if (recipes.length === 0) {
    return (
      <section className="w-full pt-[104px]">
        <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6">
          <div className="flex h-[300px] flex-col items-center justify-center gap-2 text-center text-[#1B1B1B]">
            <h2 className="text-[24px] font-semibold sm:text-[28px]">
              No bookmarked recipes yet
            </h2>
            <p className="text-sm text-[#6B7280] sm:text-base">
              Save recipes from the grid to see them here.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full pt-[104px]">
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6">
        <div className="mb-8 flex items-center justify-center">
          <h1 className="text-[28px] font-semibold text-[#1B1B1B] sm:text-[32px]">
            Saved List
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <article key={recipe.id} className="text-center">
              <div className="relative aspect-square overflow-hidden rounded-[22px] border border-[#3157BC] bg-slate-200">
                <Image
                  src={recipe.recipeImage}
                  alt={recipe.recipeName}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 340px"
                  className="object-cover"
                />

                <button
                  type="button"
                  className="absolute right-3 top-3 text-white/90 transition-opacity hover:opacity-75"
                  aria-label="Save recipe"
                >
                  <Bookmark
                    className="h-5 w-5"
                    strokeWidth={2.2}
                    fill="currentColor"
                  />
                </button>
              </div>

              <h2 className="mt-3 whitespace-pre-line px-2 font-semibold leading-[1.3] text-[#123996] [font-size:clamp(18px,1.1vw,26px)]">
                {recipe.recipeName}
              </h2>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SaveList;
