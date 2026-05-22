"use client";

import { useGetAllScrapedRecipesQuery } from "@/redux/api/recipeApi";
import { Bookmark } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

function SaveList() {
  const { data: recipes } = useGetAllScrapedRecipesQuery({ page: 1 });
  const [savedRecipes, setSavedRecipes] = useState<number[]>([
    1, 2, 3, 4, 5, 6,
  ]);

  const toggleSave = (id: number) => {
    setSavedRecipes((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <section className="w-full pt-[104px]">
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6">
        <div className="mb-8 flex items-center justify-center">
          <h1 className="text-[28px] font-semibold text-[#1B1B1B] sm:text-[32px]">
            Saved List
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {recipes?.slice(0, 6).map((recipe: Recipe) => (
            <article key={recipe.id} className="text-center">
              <div className="relative aspect-square overflow-hidden rounded-[22px] border border-[#3157BC] bg-slate-200">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 340px"
                  className="object-cover"
                />

                <button
                  type="button"
                  onClick={() => toggleSave(recipe.id)}
                  className="absolute right-3 top-3 text-white/90 transition-opacity hover:opacity-75"
                  aria-label="Save recipe"
                >
                  <Bookmark
                    className="h-5 w-5"
                    strokeWidth={2.2}
                    fill={
                      savedRecipes.includes(recipe.id) ? "currentColor" : "none"
                    }
                  />
                </button>
              </div>

              <h2 className="mt-3 whitespace-pre-line px-2 font-semibold leading-[1.3] text-[#123996] [font-size:clamp(18px,1.1vw,26px)]">
                {recipe.title}
              </h2>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SaveList;
