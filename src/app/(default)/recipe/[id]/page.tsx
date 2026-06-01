"use client";

import AddToMealPlanFlow from "@/components/Home/AddToMealPlanFlow";
import RecipeVideoCard from "@/components/Home/RecipeVideoCard";
import RecipeDetailsSkeleton from "@/components/ui/RecipeDetailsSkeleton";
import {
  useGetAllRecipesQuery,
  useGetRecipeBookmarksQuery,
  useMyRecipeDetailsQuery,
} from "@/redux/api/recipeApi";

import { ArrowLeft, Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

type RecipeItem = {
  id: string;
  recipeName: string;
  recipeImage: string;
};

type RecipeDetailsItem = {
  id?: string;
  title?: string;
  recipeName?: string;
  isBookmarked?: boolean;
  duration?: number;
  energy?: number;
  features?: string[];
  equipments?: string[];
  ingredients?: string[];
  instructions?: string[];
  wyn?: string;
  description?: string;
  nutrition?: string;
  hymi?: string;
  recipeImage?: string;
  image?: string;
  youtubeLink?: string;
  link?: string;
  category?: string;
};

type RecipeDetailsResponse = {
  result?: RecipeDetailsItem;
} & RecipeDetailsItem;

const buttonClass =
  "inline-flex h-11 items-center justify-center rounded-full border border-[#2A4FB8] px-6 text-base font-semibold text-[#143B9F] transition-colors hover:bg-[#EEF3FF]";

const sectionTitleClass = "text-xl font-bold text-[#111111] sm:text-2xl";

export default function RecipeDetailsPage() {
  const params = useParams();
  const recipeId = params.id
    ? Array.isArray(params.id)
      ? params.id[0]
      : params.id
    : "";

  // Fetching the first page of recipes only for showing related items.
  const { data: recipesResponse } = useGetAllRecipesQuery({ page: 1 });
  const { data: bookmarksResponse } = useGetRecipeBookmarksQuery();

  const recipes = (recipesResponse?.result?.recipes ||
    recipesResponse?.recipes ||
    []) as RecipeItem[];

  const {
    data: recipeResponse,
    isLoading: isRecipeLoading,
    error: recipeError,
  } = useMyRecipeDetailsQuery(recipeId, {
    skip: !recipeId,
  });

  const recipeData = recipeResponse as RecipeDetailsResponse | undefined;
  const recipe = recipeData?.result ?? recipeData ?? null;
  const bookmarkedRecipes = Array.isArray(bookmarksResponse)
    ? bookmarksResponse
    : Array.isArray((bookmarksResponse as { result?: unknown })?.result)
      ? ((bookmarksResponse as { result: unknown[] }).result ?? [])
      : [];
  const isBookmarked =
    recipe?.isBookmarked ||
    bookmarkedRecipes.some((item) => {
      const bookmarkRecipe = item as { recipe?: { id?: string } };
      return bookmarkRecipe.recipe?.id === recipeId;
    });
  const recipeTitle = recipe?.title || recipe?.recipeName || "Recipe details";
  const recipeImage = recipe?.image || recipe?.recipeImage || "";
  const recipeVideo = recipe?.youtubeLink || recipe?.link || "";
  const recipeDescription = recipe?.description || recipe?.wyn || "";
  const recipeIntro = recipe?.wyn || "";
  const recipeNote = recipe?.hymi || "";
  const relatedRecipes = recipes
    .filter((item) => item.id !== recipeId)
    .slice(0, 4);

  if (isRecipeLoading) {
    return <RecipeDetailsSkeleton />;
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
              src={recipeImage}
              alt={recipeTitle}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-contain"
              priority
            />
            <div
              className={`absolute right-4 top-4 rounded-full p-2 backdrop-blur-sm transition-colors ${
                isBookmarked
                  ? "bg-black/20 text-white shadow-lg"
                  : "bg-black/20 text-white"
              }`}
            >
              <Bookmark
                className="h-5 w-5"
                fill={isBookmarked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth={2.2}
              />
            </div>
          </div>

          <div className="space-y-5 lg:pt-2">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#0F3695]">
                {recipe.category || "Featured meal"}
              </p>
              <h2 className="text-[24px] font-semibold leading-tight text-[#0F3695]">
                {recipeTitle}
              </h2>
            </div>

            <p className="text-base font-medium  sm:text-lg text-[#0F3695]">
              {recipeDescription}
            </p>

            {(recipe.duration != null || recipe.energy != null) && (
              <div className="flex flex-wrap gap-3 text-sm font-semibold text-[#143B9F]">
                {recipe.duration != null ? (
                  <span className="rounded-full bg-[#EEF3FF] px-4 py-2">
                    Duration: {recipe.duration} mins
                  </span>
                ) : null}
                {recipe.energy != null ? (
                  <span className="rounded-full bg-[#EEF3FF] px-4 py-2">
                    Energy: {recipe.energy} kcal
                  </span>
                ) : null}
              </div>
            )}

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
              {recipeNote ? (
                <p className="mt-3 text-sm leading-6 text-[#0F3695]">
                  {recipeNote}
                </p>
              ) : null}
              <p className="mt-3 text-sm leading-6 text-[#5D6473]">
                *Nutrition info is an estimate and may vary with cooking methods
                and ingredients.
              </p>
            </div>

            <div className="hidden gap-3 sm:grid sm:grid-cols-2">
              <AddToMealPlanFlow
                title={recipeTitle}
                image={recipeImage}
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
            title={recipeTitle}
            image={recipeImage}
            buttonClassName={`${buttonClass} w-full bg-[#11389D] text-white hover:bg-[#0B2F8B]`}
          />
          <button type="button" className={`${buttonClass} w-full bg-white`}>
            Make Now
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:mt-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(420px,1.15fr)] lg:items-start">
          <div className="space-y-3 text-lg">
            <h3 className={`${sectionTitleClass} mb-4`}>Instructions:</h3>

            <div className="space-y-3 ">
              <h4 className="font-semibold text-[#0F3695]">What You'll Need</h4>
              <p className="text-[#374151]">{recipe.wyn}</p>
            </div>

            <div className="space-y-3 ">
              <h4 className="font-semibold text-[#0F3695]">
                How You'll Make It
              </h4>
              <p className="text-[#374151]">{recipe.hymi}</p>
            </div>
          </div>

          <div className="space-y-4">
            <RecipeVideoCard
              title={recipeTitle}
              thumbnail={recipeImage}
              videoUrl={recipeVideo}
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
                return (
                  <Link
                    key={item.id}
                    href={`/recipe/${encodeURIComponent(item.id)}`}
                  >
                    <div className="group relative aspect-[3/4] overflow-hidden rounded-[24px] border border-[#3557BF] bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(17,56,157,0.12)]">
                      <Image
                        src={item.recipeImage}
                        alt={item.recipeName}
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
                        {item.recipeName}
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
