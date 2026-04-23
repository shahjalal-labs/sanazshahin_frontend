import AddToMealPlanFlow from "@/components/Home/AddToMealPlanFlow";
import RecipeVideoCard from "@/components/Home/RecipeVideoCard";
import { getRecipeById, recipes } from "@/lib/recipes";
import { ArrowLeft, Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface RecipeDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

const buttonClass =
  "inline-flex h-11 items-center justify-center rounded-full border border-[#2A4FB8] px-6 text-base font-semibold text-[#143B9F] transition-colors hover:bg-[#EEF3FF]";

const sectionTitleClass = "text-xl font-bold text-[#111111] sm:text-2xl";

export default async function RecipeDetailsPage({
  params,
}: RecipeDetailsPageProps) {
  const { id } = await params;
  const recipeId = Number(id);
  const recipe = Number.isNaN(recipeId) ? undefined : getRecipeById(recipeId);

  if (!recipe) {
    notFound();
  }

  const relatedRecipes = recipes
    .filter((item) => item.id !== recipe.id)
    .slice(0, 4);

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
              alt={recipe.detailTitle}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
              priority
            />
            <div className="absolute right-4 top-4 rounded-full bg-black/20 p-2 text-white backdrop-blur-sm">
              <Bookmark className="h-5 w-5" />
            </div>
          </div>

          <div className="space-y-5 lg:pt-2">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#0F3695]">
                Featured meal
              </p>
              <h2 className="text-xl font-semibold leading-tight text-[#0F3695] text-[24px]">
                {recipe.detailTitle}
              </h2>
            </div>

            <p className="text-base font-medium text-[#0F3695] sm:text-lg">
              Recipe details, ingredients, and steps laid out for a quick scan
              on desktop and mobile.
            </p>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <span className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#3557BF] px-5 text-center text-sm font-semibold text-[#1F3E9F] sm:text-base">
                {recipe.serves}
              </span>
              <span className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#3557BF] px-5 text-center text-sm font-semibold text-[#1F3E9F] sm:text-base">
                {recipe.prepTime}
              </span>
              <span className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#3557BF] px-5 text-center text-sm font-semibold text-[#1F3E9F] sm:col-span-2 sm:text-base lg:col-span-1">
                {recipe.extraTime}
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <h3 className={`${sectionTitleClass} mb-3`}>Ingredients:</h3>
                <ul className="list-disc space-y-2 pl-5 leading-6 text-base text-[#374151] marker:text-[#0F3695]">
                  {recipe.needs.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className={`${sectionTitleClass} mb-3`}>Equipments:</h3>
                <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-[#374151] sm:text-base marker:text-[#0F3695]">
                  <li>Knife and cutting board</li>
                  <li>High-speed blender</li>
                  <li>2 glasses for serving</li>
                </ul>
              </div>

              <div>
                <h3 className={`${sectionTitleClass} mb-3`}>Features:</h3>
                <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-[#374151] sm:text-base marker:text-[#0F3695]">
                  {recipe.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-[28px]  p-5 ">
              <h3 className={`${sectionTitleClass} mb-3`}>Nutrition:</h3>
              <p className="flex flex-wrap gap-x-3 gap-y-1 text-sm font-medium leading-6 text-[#2A2A2A] sm:text-base">
                {recipe.nutrition.map((value) => (
                  <span key={value}>{value}</span>
                ))}
              </p>
              <p className="mt-3 text-sm leading-6 text-[#5D6473]">
                *Nutrition info is an estimate and may vary with cooking methods
                and ingredients.
              </p>
            </div>

            <div className="hidden gap-3 sm:grid sm:grid-cols-2">
              <AddToMealPlanFlow
                title={recipe.detailTitle}
                image={recipe.image}
                buttonClassName={`${buttonClass} bg-[#11389D] text-white hover:bg-[#0B2F8B]`}
              />
              <button type="button" className={`${buttonClass} bg-white`}>
                Make Now
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:hidden">
          <AddToMealPlanFlow
            title={recipe.detailTitle}
            image={recipe.image}
            buttonClassName={`${buttonClass} w-full bg-[#11389D] text-white hover:bg-[#0B2F8B]`}
          />
          <button type="button" className={`${buttonClass} w-full bg-white`}>
            Make Now
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:mt-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(420px,1.15fr)] lg:items-start">
          <div className="">
            <h3 className={`${sectionTitleClass} mb-4`}>Instructions:</h3>
            <ol className="space-y-4">
              {recipe.steps.map((step, index) => {
                const splitIndex = step.indexOf(":");
                const heading =
                  splitIndex > -1 ? step.slice(0, splitIndex) : step;
                const body =
                  splitIndex > -1 ? step.slice(splitIndex + 1).trim() : "";

                return (
                  <li
                    key={step}
                    className="text-sm leading-7 text-[#374151] sm:text-base"
                  >
                    <span className="font-semibold text-[#0F3695]">
                      {index + 1}. {heading}
                    </span>
                    {body ? <span className="block">{body}</span> : null}
                  </li>
                );
              })}
            </ol>

            <div className="mt-6   text-sm leading-7 text-[#5D6473] sm:text-base">
              <p className="font-semibold text-[#111111]">Storage:</p>
              <ul className="mt-2 space-y-2">
                <li>
                  • Best consumed immediately as the cooler melts quickly.
                </li>
                <li>
                  • Freeze leftovers briefly if needed, then re-blend before
                  serving.
                </li>
                <li>
                  • Do not refrigerate for long since the texture softens fast.
                </li>
              </ul>
            </div>
            <div className="mt-6">
              <h3 className={`${sectionTitleClass} mb-3`}>Swaps:</h3>
              <ul className="space-y-2 text-sm leading-7 text-[#374151] sm:text-base">
                <li>• Swap cantaloupe for honeydew, watermelon, or mango.</li>
                <li>• Use frozen fruit for a thicker, colder drink.</li>
                <li>
                  • Replace water with coconut water for a lighter tropical
                  note.
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <RecipeVideoCard
              title={recipe.detailTitle}
              thumbnail={recipe.videoThumbnail}
              videoUrl={recipe.videoUrl}
            />
          </div>
        </div>

        <div className="mt-10 sm:mt-12">
          <div className="mb-5 flex items-center justify-center">
            <h3 className="text-2xl font-bold text-[#111111] sm:text-3xl">
              More Recipes
            </h3>
          </div>

          <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {relatedRecipes.map((item) => (
              <Link key={item.id} href={`/recipe/${item.id}`} className="">
                <div className="relative aspect-[3/4] group overflow-hidden rounded-[24px] border border-[#3557BF] bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(17,56,157,0.12)]">
                  <Image
                    src={item.image}
                    alt={item.detailTitle}
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
                    {item.detailTitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
