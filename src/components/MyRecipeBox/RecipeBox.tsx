"use client";

import m1 from "@/assets/meal/m1.jpg";
import m2 from "@/assets/meal/m2.jpg";
import m3 from "@/assets/meal/m3.jpg";
import m4 from "@/assets/meal/m4.jpg";
import m5 from "@/assets/meal/m5.jpg";
import m7 from "@/assets/meal/m7.png";
import RecipeAddModal from "@/components/MyRecipeBox/RecipeAddModal";
import RecipeEditModal from "@/components/MyRecipeBox/RecipeEditModal";
import { ChevronDown, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";

type RecipeItem = {
  id: number;
  title: string;
  image: StaticImageData;
  details: {
    duration: string;
    energy: string;
    features: string[];
    needs: string[];
    nutrition: string[];
    howTo: string;
    youtubeLink: string;
  };
};

const baseDetails = {
  duration: "30 min",
  energy: "350",
  features: ["Meal Prep Friendly", "Leftover Friendly"],
  needs: [
    "1 1/2 cups basmati rice, rinsed and soaked for 30 minutes",
    "2 tbsp olive oil or avocado oil",
    "1 small onion, finely chopped",
    "2 cloves garlic, minced",
    "1 1/2 cups green beans, trimmed and cut into 1-inch",
  ],
  nutrition: [
    "Servings 1 Calories 290 Carbohydrates 48g Carbohydrates 48g",
    "Fat 8g Fiber 4g Protein 6g Monounsaturated 5g Polyunsaturated 1g",
    "Saturated 1g Trans 0g Vitamin A 90 IU Vitamin C 8 mg",
    "Vitamin D 0 mg Calcium 40 mg Iron 2 mg Potassium 350 mg",
    "cholesterol 0 mg Sodium 200 mg Sugar 4 g",
  ],
  howTo:
    "Preheat oven to 4000F (2000C). Toss chickpeas with paprika and onion powder. Spread on a baking sheet and bake for about 20 minutes, until crispy.",
  youtubeLink: "https://www.youtube.com/shorts/gkVAApdMAh0",
};

const recipeList: RecipeItem[] = [
  {
    id: 1,
    title: "Green Goddess Dill Salad (with black-eyed peas)",
    image: m1,
    details: baseDetails,
  },
  {
    id: 2,
    title: "Kale Caesar Salad (vegan)",
    image: m2,
    details: baseDetails,
  },
  {
    id: 3,
    title: "Popcorn in a Bag",
    image: m7,
    details: baseDetails,
  },
  {
    id: 4,
    title: "Sprouted Caesar Salad",
    image: m4,
    details: baseDetails,
  },
  {
    id: 5,
    title: "Pistachio Granola Bars",
    image: m3,
    details: baseDetails,
  },
  {
    id: 6,
    title: "Chocolate Chip Oat Muffins (vegan + gluten-free)",
    image: m5,
    details: baseDetails,
  },
];

function RecipeBox() {
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeItem | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<RecipeItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleOpenEditModal = (recipe: RecipeItem) => {
    setSelectedRecipe(null);
    setEditingRecipe(recipe);
  };

  return (
    <>
      <section className="container mx-auto w-full px-4 pb-16">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="text-[32px] font-semibold leading-none text-[#141414] md:text-[42px]">
            My Recipe Box
          </h1>

          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:w-auto lg:grid-cols-[160px_160px_160px_auto]">
            <FilterSelect label="Recipe Types" />
            <FilterSelect label="Ingredients" />
            <FilterSelect label="Features" />

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-[10px] border border-[#D0D5DD] bg-[#F7F8FA] text-[#5F6773] transition hover:bg-[#EEF1F5]"
              aria-label="Add recipe"
            >
              <Plus className="h-5 w-5" strokeWidth={2.25} />
            </button>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
          {recipeList.map((recipe) => (
            <button
              key={recipe.id}
              type="button"
              onClick={() => setSelectedRecipe(recipe)}
              className="group text-left"
            >
              <div className="relative h-[280px] w-full overflow-hidden rounded-[26px] border border-[#4668C8] bg-white">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-[1.02]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
              </div>
              <h2 className="mx-auto mt-3 max-w-[92%] text-center text-lg font-semibold leading-[1.3] text-[#1141B5]">
                {recipe.title}
              </h2>
            </button>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-end gap-3 text-sm font-semibold text-[#5C6470]">
          <button
            type="button"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#FCEBFA] text-[#D36BC0] transition hover:bg-[#F9DDF4]"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            className="inline-flex h-8 min-w-8 items-center justify-center rounded-[8px] bg-[#375BCC] px-2 text-white"
            aria-label="Page 1"
          >
            1
          </button>
          <button type="button" className="px-1" aria-label="Page 2">
            2
          </button>
          <button type="button" className="px-1" aria-label="Page 3">
            3
          </button>
          <span className="px-1">...</span>
          <button type="button" className="px-1" aria-label="Page 440">
            440
          </button>

          <button
            type="button"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#FCEBFA] text-[#D36BC0] transition hover:bg-[#F9DDF4]"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <RecipeDetailsModal
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        onEdit={handleOpenEditModal}
      />

      <RecipeEditModal
        recipe={editingRecipe}
        onClose={() => setEditingRecipe(null)}
      />

      <RecipeAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </>
  );
}

function FilterSelect({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex h-[42px] w-full items-center justify-between rounded-[10px] border border-[#DEE3EA] bg-[#F7F8FA] px-3 text-sm font-medium text-[#9AA1AB]"
    >
      <span>{label}</span>
      <ChevronDown className="h-4 w-4 text-[#969EAA]" />
    </button>
  );
}

function RecipeDetailsModal({
  recipe,
  onClose,
  onEdit,
}: {
  recipe: RecipeItem | null;
  onClose: () => void;
  onEdit: (recipe: RecipeItem) => void;
}) {
  if (!recipe) {
    return null;
  }

  const details = recipe.details;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-3 md:items-center md:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[980px] rounded-[14px] bg-white p-4 shadow-xl md:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="mb-6 text-[28px] font-semibold text-[#121212] md:mb-8 md:text-[42px]">
          Recipe Box Details
        </h3>

        <div className="max-h-[58vh] overflow-y-auto pr-1 md:max-h-[60vh]">
          <DetailRow label="Recipe Name">
            <div className="flex items-center justify-end gap-2 text-right text-[16px] font-medium text-[#212733] md:text-[17px]">
              <div className="relative h-8 w-8 overflow-hidden rounded-full">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                />
              </div>
              <span>{recipe.title.replace(" (vegan)", "")}</span>
            </div>
          </DetailRow>

          <DetailRow label="Duration">
            <span className="text-[16px] font-medium text-[#111111] md:text-[17px]">
              {details.duration}
            </span>
          </DetailRow>

          <DetailRow label="Energy (kcal)">
            <span className="text-[16px] font-medium text-[#111111] md:text-[17px]">
              {details.energy}
            </span>
          </DetailRow>

          <DetailRow label="Features">
            <ul className="space-y-1 text-[16px] font-medium text-[#111111] md:text-[17px]">
              <li>🟡 {details.features[0]}</li>
              <li>🍽️ {details.features[1]}</li>
            </ul>
          </DetailRow>

          <DetailRow label="What You'll Need">
            <ul className="space-y-2 text-[16px] leading-[1.45] text-[#111111] md:text-[17px]">
              <li>🍚 {details.needs[0]}</li>
              <li>🧂 {details.needs[1]}</li>
              <li>🧅 {details.needs[2]}</li>
              <li>🧄 {details.needs[3]}</li>
              <li>🧪 {details.needs[4]}</li>
            </ul>
          </DetailRow>

          <DetailRow label="Nutrition">
            <div className="space-y-1 text-[15px] leading-[1.45] text-[#111111] md:text-[16px]">
              {details.nutrition.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </DetailRow>

          <DetailRow label="How You'll Make It">
            <p className="max-w-[560px] text-[16px] leading-[1.45] text-[#111111] md:text-[17px]">
              {details.howTo}
            </p>
          </DetailRow>

          <DetailRow label="Youtube link" isLast>
            <a
              href={details.youtubeLink}
              target="_blank"
              rel="noreferrer"
              className="break-all text-[16px] text-[#111111] underline-offset-2 hover:underline md:text-[17px]"
            >
              {details.youtubeLink}
            </a>
          </DetailRow>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:mt-7">
          <button
            type="button"
            onClick={onClose}
            className="h-11 min-w-[118px] rounded-full border border-[#4D63E9] px-7 text-[16px] font-medium text-[#3A4BD4]"
          >
            Close
          </button>
          <button
            type="button"
            className="h-11 min-w-[118px] rounded-full border border-[#4D63E9] px-7 text-[16px] font-medium text-[#3A4BD4]"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={() => onEdit(recipe)}
            className="h-11 min-w-[118px] rounded-full bg-[#0F2FA8] px-8 text-[16px] font-medium text-white"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  children,
  isLast = false,
}: {
  label: string;
  children: React.ReactNode;
  isLast?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-1 gap-2 border-t border-[#E6EAF0] py-3 md:grid-cols-[220px_1fr] md:items-center md:gap-8 md:py-4 ${
        isLast ? "border-b" : ""
      }`}
    >
      <p className="text-[15px] font-medium text-[#8A919F] md:text-[16px]">
        {label}
      </p>
      <div className="md:text-right">{children}</div>
    </div>
  );
}

export default RecipeBox;
