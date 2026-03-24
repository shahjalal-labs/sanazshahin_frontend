import AddToMealPlanFlow from "@/components/Home/AddToMealPlanFlow";
import RecipeVideoCard from "@/components/Home/RecipeVideoCard";
import { getRecipeById } from "@/lib/recipes";
import { ArrowLeft } from "lucide-react";
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

export default async function RecipeDetailsPage({
  params,
}: RecipeDetailsPageProps) {
  const { id } = await params;
  const recipeId = Number(id);
  const recipe = Number.isNaN(recipeId) ? undefined : getRecipeById(recipeId);

  if (!recipe) {
    notFound();
  }

  return (
    <section className="w-full  pb-12">
      <div className="mx-auto w-full container px-4">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[#5C6370] transition-colors hover:bg-black/5"
            aria-label="Go back"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-bold text-[#141414]">Meal Details</h1>
          <div className="w-10" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(320px,560px)_1fr]">
          <div className="relative overflow-hidden rounded-[32px]">
            <Image
              src={recipe.image}
              alt={recipe.detailTitle}
              width={900}
              height={1200}
              className="h-full min-h-[420px] w-full object-cover"
              priority
            />
          </div>

          <div>
            <h2 className="mb-5 text-4xl font-bold leading-tight text-[#0F3695]">
              {recipe.detailTitle}
            </h2>

            <div className="mb-7 grid gap-3 sm:grid-cols-2">
              <span className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#3557BF] px-5 py-2 text-center font-medium text-[#1F3E9F] [font-size:clamp(14px,1.12vw,25px)]">
                {recipe.serves}
              </span>
              <span className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#3557BF] px-5 py-2 text-center font-medium text-[#1F3E9F] [font-size:clamp(14px,1.12vw,25px)]">
                {recipe.prepTime}
              </span>
              <span className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#3557BF] px-5 py-2 text-center font-medium text-[#1F3E9F] [font-size:clamp(14px,1.12vw,25px)] sm:col-span-2 sm:max-w-[260px]">
                {recipe.extraTime}
              </span>
            </div>

            <div className="mb-7">
              <h3 className="mb-2 font-bold text-[#111111] text-xl">
                Features:
              </h3>
              <ul className="space-y-1.5 text-[#727A86] text-lg">
                {recipe.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span>🧆</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="mb-2 font-bold text-[#111111] text-xl">
                What You'll Need:
              </h3>
              <ul className="space-y-2.5 text-[#727A86] text-lg">
                {recipe.needs.map((item, index) => (
                  <li key={item} className="leading-snug">
                    <span className="mr-2 text-base">
                      {index % 2 === 0 ? "⚪" : "🧂"}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <AddToMealPlanFlow
                title={recipe.detailTitle}
                image={recipe.image}
                buttonClassName={`${buttonClass} bg-[#11389D] text-white hover:bg-primary`}
              />
              <button type="button" className={buttonClass}>
                Make Now
              </button>
              <button type="button" className={`${buttonClass} sm:col-span-2`}>
                Save for Later
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="mb-3 font-bold text-[#111111] text-xl">Pieces</h3>
            <ul className="space-y-2 leading-tight text-[#707885] text-lg">
              {recipe.pieces.map((piece) => (
                <li key={piece}>🧂 {piece}</li>
              ))}
            </ul>

            <div className="mt-8">
              <h3 className="mb-3 font-bold text-[#111111] text-xl">
                Nutrition:
              </h3>
              <p className="flex flex-wrap gap-x-3 gap-y-1 font-semibold leading-tight text-[#202020] text-lg">
                {recipe.nutrition.map((value) => (
                  <span key={value}>{value}</span>
                ))}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-4 leading-tight text-[#585858] text-lg">
              *Nutrition information provided is an estimate. It will vary based
              on cooking method and specific ingredients used.
            </p>
            <h3 className="mb-3 font-bold text-[#11389D] text-xl">
              How You'll Make It
            </h3>
            <ol className="space-y-3">
              {recipe.steps.map((step, idx) => {
                const splitIndex = step.indexOf(":");
                const heading =
                  splitIndex > -1 ? step.slice(0, splitIndex) : step;
                const body =
                  splitIndex > -1 ? step.slice(splitIndex + 1).trim() : "";

                return (
                  <li key={step} className="leading-snug text-lg">
                    <p className="font-bold text-[#11389D]">
                      {idx + 1}. {heading}
                    </p>
                    {body ? <p className="text-[#727A86]">{body}</p> : null}
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        <div className="mt-10 lg:ml-auto lg:max-w-[560px]">
          <RecipeVideoCard
            title={recipe.detailTitle}
            thumbnail={recipe.videoThumbnail}
            videoUrl={recipe.videoUrl}
          />
        </div>
      </div>
    </section>
  );
}
