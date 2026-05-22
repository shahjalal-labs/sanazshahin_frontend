"use client";

import AddToMealPlanFlow from "@/components/Home/AddToMealPlanFlow";
import RecipeVideoCard from "@/components/Home/RecipeVideoCard";
import { BeautifulSpinner } from "@/components/ui/BeautifulSpinner";
import {
  useGetAllScrapedRecipesQuery,
  useRecipeDetailsQuery,
} from "@/redux/api/recipeApi";
import { ArrowLeft, Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

const buttonClass =
  "inline-flex h-11 items-center justify-center rounded-full border border-[#2A4FB8] px-6 text-base font-semibold text-[#143B9F] transition-colors hover:bg-[#EEF3FF]";

const sectionTitleClass = "text-xl font-bold text-[#111111] sm:text-2xl";

const toSingleParam = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

export default function RecipeDetailsPage() {
  const params = useParams<{ name?: string | string[] }>();
  const name = toSingleParam(params.name) ?? "";

  const {
    data: recipeResponse,
    isLoading: isRecipeLoading,
    error: recipeError,
  } = useRecipeDetailsQuery(name, {
    skip: !name,
  });

  const { data: recipesResponse } = useGetAllScrapedRecipesQuery({ page: 1 });

  const recipe = (recipeResponse as ApiResponse | undefined)?.data;
  const relatedRecipes = (
    (recipesResponse as { data?: { recipes?: ScrapedRecipe[] } } | undefined)
      ?.data?.recipes || []
  )
    .filter((item) => item.link !== recipe?.link)
    .slice(0, 4);

  if (isRecipeLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <BeautifulSpinner />
      </div>
    );
  }

  if (recipeError || !recipe) {
    return (
      <div className="flex h-screen items-center justify-center px-4 text-center text-[#143B9F]">
        Unable to load this recipe.
      </div>
    );
  }

  return (
    <section className="w-full pb-10 pt-4 md:pb-12 md:pt-6 lg:pt-28">
      <div className="mx-auto w-full container px-4 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-between gap-4 sm:mb-8">
          <Link href="/" className="text-[#5B616E]" aria-label="Go back">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="flex-1 text-center text-2xl font-bold text-[#111111] sm:text-3xl">
            Meal Details
          </h1>
          <div className="h-11 w-11" aria-hidden="true" />
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(300px,0.9fr)_minmax(420px,1.1fr)] lg:gap-8">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-white shadow-[0_18px_50px_rgba(17,24,39,0.08)] sm:rounded-[34px] lg:aspect-[7/10]">
            <Image
              src={recipe.image}
              alt={recipe.title}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-contain"
              priority
            />
            <div className="absolute right-4 top-4 rounded-full bg-black/20 p-2 text-white backdrop-blur-sm">
              <Bookmark className="h-5 w-5" />
            </div>
          </div>

          <div className="space-y-5 lg:pt-2">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#0F3695]">
                {recipe.category || "Featured meal"}
              </p>
              <h2 className="text-[24px] font-semibold leading-tight text-[#0F3695]">
                {recipe.title}
              </h2>
            </div>

            <p className="text-base font-medium  sm:text-lg text-[#0F3695]">
              {recipe.description}
            </p>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(recipe?.features?.slice(0, 3) || []).map((feature) => (
                <span
                  key={feature}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#3557BF] px-5 text-center text-xs font-semibold text-[#1F3E9F] sm:text-sm"
                >
                  {feature}
                </span>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <h3 className={`${sectionTitleClass} mb-3`}>Ingredients:</h3>
                <ul className="list-disc space-y-2 pl-5 leading-6 text-base text-[#374151] marker:text-[#0F3695]">
                  {(recipe.ingredients || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className={`${sectionTitleClass} mb-3`}>Equipments:</h3>
                <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-[#374151] sm:text-base marker:text-[#0F3695]">
                  {(recipe.equipments || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className={`${sectionTitleClass} mb-3`}>Features:</h3>
                <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-[#374151] sm:text-base marker:text-[#0F3695]">
                  {(recipe.features || []).map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-[28px] p-5">
              <h3 className={`${sectionTitleClass} mb-3`}>Nutrition:</h3>
              <p className="text-sm font-medium leading-6 text-[#2A2A2A] sm:text-base">
                {recipe.nutrition || "Nutrition information is not available."}
              </p>
              <p className="mt-3 text-sm leading-6 text-[#5D6473]">
                *Nutrition info is an estimate and may vary with cooking methods
                and ingredients.
              </p>
            </div>

            <div className="hidden gap-3 sm:grid sm:grid-cols-2">
              <AddToMealPlanFlow
                title={recipe.title}
                image={recipe.image}
                buttonClassName={`${buttonClass} bg-[#11389D] text-white hover:bg-[#0B2F8B] hover:text-black duration-300 ease-in `}
              />
              <button type="button" className={`${buttonClass} bg-white`}>
                Make Now
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:hidden">
          <AddToMealPlanFlow
            title={recipe.title}
            image={recipe.image}
            buttonClassName={`${buttonClass} w-full bg-[#11389D] text-white hover:bg-[#0B2F8B]`}
          />
          <button type="button" className={`${buttonClass} w-full bg-white`}>
            Make Now
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:mt-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(420px,1.15fr)] lg:items-start">
          <div>
            <h3 className={`${sectionTitleClass} mb-4`}>Instructions:</h3>
            <ol className="space-y-4">
              {(recipe.instructions || []).map((step, index) => (
                <li
                  key={`${index}-${step}`}
                  className="text-sm leading-7 text-[#374151] sm:text-base"
                >
                  <span className="font-semibold text-[#0F3695]">
                    {index + 1}. Step
                  </span>
                  <span className="block">{step}</span>
                </li>
              ))}
            </ol>

            {recipe.notes?.length ||
            recipe.tips?.length ||
            recipe.storage?.length ||
            recipe.swaps?.length ? (
              <div className="mt-6 space-y-6 text-sm leading-7 text-[#5D6473] sm:text-base">
                {recipe.notes?.length ? (
                  <div>
                    <p className="font-semibold text-[#111111]">Notes:</p>
                    <ul className="mt-2 space-y-2">
                      {recipe.notes.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {recipe.tips?.length ? (
                  <div>
                    <p className="font-semibold text-[#111111]">Tips:</p>
                    <ul className="mt-2 space-y-2">
                      {recipe.tips.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {recipe.storage?.length ? (
                  <div>
                    <p className="font-semibold text-[#111111]">Storage:</p>
                    <ul className="mt-2 space-y-2">
                      {recipe.storage.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {recipe.swaps?.length ? (
                  <div>
                    <p className="font-semibold text-[#111111]">Swaps:</p>
                    <ul className="mt-2 space-y-2">
                      {recipe.swaps.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="space-y-4">
            <RecipeVideoCard
              title={recipe.title}
              thumbnail={recipe.image}
              videoUrl={recipe.link}
            />
          </div>
        </div>

        {relatedRecipes.length > 0 ? (
          <div className="mt-10 sm:mt-12">
            <div className="mb-5 flex items-center justify-center">
              <h3 className="text-2xl font-bold text-[#111111] sm:text-3xl">
                More Recipes
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
              {relatedRecipes.map((item) => {
                const recipeName = item.link.substring(
                  item.link.lastIndexOf("/") + 1,
                );

                return (
                  <Link key={item.link} href={`/recipe/${recipeName}`}>
                    <div className="group relative aspect-[3/4] overflow-hidden rounded-[24px] border border-[#3557BF] bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(17,56,157,0.12)]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute right-3 top-3 rounded-full bg-black/20 p-1.5 text-white backdrop-blur-sm">
                        <Bookmark className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="px-3 py-4 text-center">
                      <p className="line-clamp-2 text-xl font-medium leading-6 text-[#143B9F]">
                        {item.title}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
