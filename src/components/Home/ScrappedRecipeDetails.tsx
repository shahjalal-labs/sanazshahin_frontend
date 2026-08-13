"use client";

import { useGetScrappedRecipeDetailsQuery } from "@/redux/api/mealApi";
import {
  ArrowLeft,
  ChevronDown,
  ExternalLink,  
  Play,
  Share2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaFacebookF, FaPinterestP, FaXTwitter } from "react-icons/fa6";
import { FiDownload } from "react-icons/fi";
import { LuPrinter } from "react-icons/lu";


const chipClass =
  "inline-flex items-center justify-center rounded-full border border-[#1B3B8A] bg-white px-4 py-2 text-sm font-medium text-[#1B3B8A]";

const sectionHeaderClass =
  "mb-4 flex items-center justify-between rounded-t-xl bg-[#0B2E7A] px-5 py-3 text-lg font-bold text-white";

const ScrappedRecipeDetails = ({ name }: { name: string }) => {
  const { data, isLoading, isError } = useGetScrappedRecipeDetailsQuery(name);
  const recipe = data?.data;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [openSections, setOpenSections] = useState({
    prep: true,
    instructions: true,
    notes: true,
    ingredients: true,
  });
  console.log("recipe", recipe);

  const youtubeEmbedUrl = recipe?.videoUrl
    ? (() => {
        try {
          const url = new URL(recipe.videoUrl);
          const videoId =
            url.searchParams.get("v") ??
            url.pathname.split("/").filter(Boolean).at(-1);

          return videoId
            ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
            : recipe.videoUrl;
        } catch {
          return recipe.videoUrl;
        }
      })()
    : null;

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-5 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="overflow-hidden rounded-[34px] bg-slate-200 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
            <div className="aspect-[1.1] animate-pulse bg-slate-300" />
          </div>

          <div className="space-y-5 pt-2">
            <div className="h-12 w-2/3 animate-pulse rounded-full bg-slate-200" />
            <div className="h-6 w-1/3 animate-pulse rounded-full bg-slate-200" />
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-10 w-24 animate-pulse rounded-full bg-slate-200"
                />
              ))}
            </div>
            <div className="h-5 w-full animate-pulse rounded-full bg-slate-200" />
            <div className="h-5 w-5/6 animate-pulse rounded-full bg-slate-200" />
            <div className="grid gap-10 md:grid-cols-2">
              <div className="space-y-3">
                <div className="h-7 w-1/2 animate-pulse rounded-full bg-slate-200" />
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-4 w-full animate-pulse rounded-full bg-slate-200"
                  />
                ))}
              </div>
              <div className="space-y-3">
                <div className="h-7 w-1/2 animate-pulse rounded-full bg-slate-200" />
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-4 w-full animate-pulse rounded-full bg-slate-200"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="h-12 w-full animate-pulse bg-slate-200" />
              <div className="space-y-3 px-5 py-5">
                <div className="h-4 w-full animate-pulse rounded-full bg-slate-200" />
                <div className="h-4 w-4/5 animate-pulse rounded-full bg-slate-200" />
                <div className="h-4 w-3/4 animate-pulse rounded-full bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !recipe) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center text-red-600">
        Unable to load the recipe details.
      </div>
    );
  }

  const galleryImages: string[] = Array.isArray(recipe.images)
    ? recipe.images.filter((item: string | null | undefined) => Boolean(item))
    : recipe.image
      ? [recipe.image]
      : [];

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) =>
      galleryImages.length === 0
        ? 0
        : (prev - 1 + galleryImages.length) % galleryImages.length,
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      galleryImages.length === 0 ? 0 : (prev + 1) % galleryImages.length,
    );
  };
  const ingredients: string[] = Array.isArray(recipe.ingredients)
    ? recipe.ingredients.filter((item: string | null | undefined) =>
        Boolean(item),
      )
    : [];
  const equipments: string[] = Array.isArray(recipe.equipments)
    ? recipe.equipments.filter(
        (item: string | null | undefined) =>
          Boolean(item) && item !== "No items found.",
      )
    : [];
  const instructions: string[] = Array.isArray(recipe.instructions)
    ? recipe.instructions.filter((item: string | null | undefined) =>
        Boolean(item),
      )
    : [];
  const tips: string[] = Array.isArray(recipe.tips)
    ? recipe.tips.filter((item: string | null | undefined) => Boolean(item))
    : [];
  const swaps: string[] = Array.isArray(recipe.swaps)
    ? recipe.swaps.filter((item: string | null | undefined) => Boolean(item))
    : [];
  const storage: string[] = Array.isArray(recipe.storage)
    ? recipe.storage.filter((item: string | null | undefined) => Boolean(item))
    : [];
  const notes: string[] = Array.isArray(recipe.notes)
    ? recipe.notes.filter((item: string | null | undefined) => Boolean(item))
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 pt-5 text-[#0B2E7A] sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="overflow-hidden rounded-[34px] bg-[#d8eaf7] shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
          <div className="relative aspect-[1.1] overflow-hidden">
            <Image
              src={galleryImages[currentImageIndex] || "/placeholder-food.jpg"}
              alt={recipe.title || "Recipe image"}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 56vw"
            />
            <button
              type="button"
              onClick={handlePreviousImage}
              className="absolute left-5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-[#0B2E7A]/90 text-white shadow-lg"
              aria-label="Previous image"
            >
              <ArrowLeft className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-[#0B2E7A] text-white shadow-lg"
              aria-label="Next image"
            >
              <ArrowLeft className="h-3 w-3 rotate-180" />
            </button>
          </div>
        </div>

        <div className="pt-2">
          <h1 className="text-4xl font-bold leading-tight text-[#0B2E7A] lg:text-[3rem]">
            {recipe.title || "Recipe"}
          </h1>
          <p className="mt-2 text-xl italic text-[#334155]">
            {recipe.category || "Recipe"}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className={chipClass}>4 Servings</span>
            <span className={chipClass}>Prep 10 min</span>
            <span className={chipClass}>Cook 35 min</span>
            <span className={chipClass}>Total 45 min</span>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#334155]">
            <span className="font-semibold">Scale:</span>
            <span>Have</span>
            <span>Double</span>
            <span>Triple</span>
            <span>Cooking Mode:</span>
            <span>Oops</span>
          </div>

          <div className="mt-8 grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="mb-3 text-xl font-bold text-[#0B2E7A]">
                Ingredients:
              </h2>
              <ul className="space-y-2 text-base leading-7 text-slate-700">
                {ingredients.map((item, index) => (
                  <li key={`${item}-${index}`} className="flex gap-2">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#0B2E7A]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="mb-3 text-xl font-bold text-[#0B2E7A]">
                Equipments:
              </h2>
              <ul className="space-y-2 text-base leading-7 text-slate-700">
                {equipments.length ? (
                  equipments.map((item, index) => (
                    <li key={`${item}-${index}`} className="flex gap-2">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#0B2E7A]" />
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500">No equipment listed.</li>
                )}
              </ul>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="mb-3 text-xl font-bold text-[#0B2E7A]">
              Nutrition:
            </h2>
            <p className="text-base leading-7 text-slate-700">
              {recipe.nutrition || "Nutrition information is not available."}
            </p>
          </div>

          <div className="mt-8">
            <button
              type="button"
              className="w-full rounded-xl bg-[#0B2E7A] px-6 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-[#0a2767]"
            >
              Make Now
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4 text-[#0B2E7A]">
            <div className="bg-primary px-3 py-1 rounded-[7px]">
              <FaFacebookF size={16} className="text-white" />
            </div>
            <div className="bg-primary px-3 py-1 rounded-[7px]">
              <FaPinterestP size={16} className="text-white" />
            </div>
            <div className="bg-primary px-3 py-1 rounded-[7px]">
              <FaXTwitter   size={16} className="text-white" />
            </div>
            <div className="bg-primary px-3 py-1 rounded-[7px]">
              <FiDownload    size={16} className="text-white" />
            </div>
            <div className="bg-primary px-3 py-1 rounded-[7px]">
              <LuPrinter    size={16} className="text-white" />
            </div>          
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-8">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => toggleSection("prep")}
            className={`${sectionHeaderClass} w-full text-left`}
          >
            <span>Prep</span>
            <ChevronDown
              className={`h-5 w-5 text-white transition-transform ${
                openSections.prep ? "rotate-180" : ""
              }`}
            />
          </button>
          {openSections.prep ? (
            <div className="space-y-4 px-5 py-5 text-base leading-8 text-[#0F172A]">
              <p>
                Soak the cashews if using a regular blender — soaking raw
                cashews in hot water for 15–20 minutes first helps a standard
                blender achieve a silky-smooth sauce.
              </p>
              <p>
                Reserve pasta water before draining — set aside at least a cup,
                since the starchy water is what loosens the sauce to the right
                consistency.
              </p>
            </div>
          ) : null}
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => toggleSection("instructions")}
            className={`${sectionHeaderClass} w-full text-left`}
          >
            <span>Instructions:</span>
            <ChevronDown
              className={`h-5 w-5 text-white transition-transform ${
                openSections.instructions ? "rotate-180" : ""
              }`}
            />
          </button>
          {openSections.instructions ? (
            <div className="px-5 py-5 text-base leading-8 text-[#0F172A]">
              <ol className="space-y-5">
                {instructions.map((step, index) => (
                  <li key={`${step}-${index}`} className="flex gap-3">
                    <span className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0B2E7A] text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => toggleSection("notes")}
            className={`${sectionHeaderClass} w-full text-left`}
          >
            <span>Common Mistakes, Notes, Storage, Swaps &amp; Tips</span>
            <ChevronDown
              className={`h-5 w-5 text-white transition-transform ${
                openSections.notes ? "rotate-180" : ""
              }`}
            />
          </button>
          {openSections.notes ? (
            <div className="space-y-5 px-5 py-5 text-base leading-8 text-[#0F172A]">
              {notes.length
                ? notes.map((item, index) => (
                    <p key={`${item}-${index}`}>{item}</p>
                  ))
                : null}

              {tips.length
                ? tips.map((item, index) => (
                    <p key={`${item}-${index}`}>{item}</p>
                  ))
                : null}

              {swaps.length
                ? swaps.map((item, index) => (
                    <p key={`${item}-${index}`}>{item}</p>
                  ))
                : null}

              {storage.length
                ? storage.map((item, index) => (
                    <p key={`${item}-${index}`}>{item}</p>
                  ))
                : null}
            </div>
          ) : null}
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => toggleSection("ingredients")}
            className={`${sectionHeaderClass} w-full text-left`}
          >
            <span>Why these ingredients</span>
            <ChevronDown
              className={`h-5 w-5 text-white transition-transform ${
                openSections.ingredients ? "rotate-180" : ""
              }`}
            />
          </button>
          {openSections.ingredients ? (
            <div className="space-y-4 px-5 py-5 text-base leading-8 text-[#0F172A]">
              {recipe.description ? (
                <p>
                  <span className="font-bold text-[#0B2E7A]">
                    Cherry tomatoes
                  </span>{" "}
                  — {recipe.description}
                </p>
              ) : null}
              <p>
                <span className="font-bold text-[#0B2E7A]">Raw cashews</span> —
                blend into a rich, creamy base that replaces dairy or cheese
                entirely.
              </p>
              <p>
                <span className="font-bold text-[#0B2E7A]">Garlic</span> —
                roasting mellows its sharpness into a sweet, caramelized flavor
                that deepens the sauce.
              </p>
              <p>
                <span className="font-bold text-[#0B2E7A]">Olive oil</span> —
                helps the tomatoes and garlic roast and caramelize, and adds
                richness to the final blended sauce.
              </p>
              <p>
                <span className="font-bold text-[#0B2E7A]">Fresh basil</span> —
                adds a bright, herbaceous finish that balances the rich, creamy
                sauce.
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {recipe.videoUrl ? (
        <div className="mt-8 w-full max-w-[500px] overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-lg">
          {showVideo && youtubeEmbedUrl ? (
            <div className="relative aspect-[4/5] overflow-hidden bg-black">
              <iframe
                src={youtubeEmbedUrl}
                title={recipe.title || "Recipe video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          ) : (
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={
                  galleryImages[currentImageIndex] || "/placeholder-food.jpg"
                }
                alt={recipe.title || "Recipe video preview"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 380px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B2E7A]/75 via-[#0B2E7A]/20 to-transparent" />

              <div className="absolute left-4 top-4 flex items-center gap-2 text-sm text-white/90">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#0B2E7A]/80 font-bold">
                  T
                </span>
                <div>
                  <div className="font-semibold">
                    {recipe.title || "Quick dinner idea"}
                  </div>
                  <div className="text-xs text-white/80">
                    Tomatoes With Lemon
                  </div>
                </div>
              </div>

              <button
                type="button"
                aria-label="Play video"
                onClick={() => setShowVideo(true)}
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e23a3a] shadow-[0_0_0_12px_rgba(226,58,58,0.2)]">
                  <Play className="ml-1 h-9 w-9 fill-white text-white" />
                </span>
              </button>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 text-white">
                <div className="text-2xl font-extrabold leading-none drop-shadow-lg">
                  {recipe.title || "Recipe"}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="rounded-full border border-white/50 bg-white/10 p-2 backdrop-blur-sm"
                    aria-label="Share"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                  <Link
                    href={recipe.videoUrl || recipe.link || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/50 bg-white/10 p-2 backdrop-blur-sm"
                    aria-label="Open video link"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default ScrappedRecipeDetails;
