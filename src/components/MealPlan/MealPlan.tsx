"use client";

import m1 from "@/assets/meal/m1.jpg";
import m2 from "@/assets/meal/m2.jpg";
import m3 from "@/assets/meal/m3.jpg";
import m4 from "@/assets/meal/m4.jpg";
import m5 from "@/assets/meal/m5.jpg";
import m6 from "@/assets/meal/m6.jpg";
import m7 from "@/assets/meal/m7.png";
import {
  useCreateMealRecipeMutation,
  useGetAvailableRecipesQuery,
  useGetUserMealPlansQuery,
} from "@/redux/api/mealApi";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { useMemo, useState } from "react";
import { RxCross2 } from "react-icons/rx";

type MealKey =
  | "kale-salad"
  | "bbq-tofu"
  | "quinoa"
  | "tortilla"
  | "oatmeal"
  | "oat-milk"
  | "popcorn"
  | "barley"
  | "pistachio";

type MealCatalogItem = {
  title: string;
  image: StaticImageData;
  nutrition: {
    fiber: number;
    fat: number;
    carb: number;
    iron: number;
    protein: number;
    calorie: number;
    duration: string;
  };
};

type MealPlanEntry = {
  date: string;
  dayNumber: number;
  mealKey: MealKey;
};

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MEAL_TABLE_GRID_CLASS =
  "grid min-w-[920px] grid-cols-[260px_repeat(6,minmax(74px,1fr))_130px] items-center gap-x-2";

const NUTRITION_COLUMN_HEADERS = [
  "Name",
  "Fiber",
  "Fat",
  "Carb",
  "Iron",
  "Protein",
  "Calorie",
  "Duration",
];

const mealCatalog: Record<MealKey, MealCatalogItem> = {
  "kale-salad": {
    title: "Kale Caesar Salad",
    image: m1,
    nutrition: {
      fiber: 30,
      fat: 30,
      carb: 30,
      iron: 120,
      protein: 180,
      calorie: 1000,
      duration: "2 days",
    },
  },
  "bbq-tofu": {
    title: "BBQ Tofu",
    image: m2,
    nutrition: {
      fiber: 20,
      fat: 20,
      carb: 20,
      iron: 100,
      protein: 160,
      calorie: 920,
      duration: "2 days",
    },
  },
  quinoa: {
    title: "Quinoa Vegetable",
    image: m3,
    nutrition: {
      fiber: 24,
      fat: 18,
      carb: 26,
      iron: 110,
      protein: 145,
      calorie: 860,
      duration: "2 days",
    },
  },
  tortilla: {
    title: "Tortilla",
    image: m4,
    nutrition: {
      fiber: 20,
      fat: 20,
      carb: 20,
      iron: 100,
      protein: 160,
      calorie: 920,
      duration: "2 days",
    },
  },
  oatmeal: {
    title: "Orange Oatmeal",
    image: m5,
    nutrition: {
      fiber: 18,
      fat: 15,
      carb: 22,
      iron: 90,
      protein: 120,
      calorie: 780,
      duration: "2 days",
    },
  },
  "oat-milk": {
    title: "Oat Milk",
    image: m6,
    nutrition: {
      fiber: 12,
      fat: 10,
      carb: 16,
      iron: 84,
      protein: 92,
      calorie: 510,
      duration: "2 days",
    },
  },
  popcorn: {
    title: "Popcorn in a Bag",
    image: m7,
    nutrition: {
      fiber: 20,
      fat: 30,
      carb: 20,
      iron: 120,
      protein: 160,
      calorie: 950,
      duration: "2 days",
    },
  },
  barley: {
    title: "Barley Soup",
    image: m7,
    nutrition: {
      fiber: 21,
      fat: 17,
      carb: 23,
      iron: 96,
      protein: 130,
      calorie: 810,
      duration: "2 days",
    },
  },
  pistachio: {
    title: "Pistachio Granola..",
    image: m3,
    nutrition: {
      fiber: 22,
      fat: 19,
      carb: 24,
      iron: 98,
      protein: 138,
      calorie: 840,
      duration: "2 days",
    },
  },
};

const planSequence: MealKey[] = [
  "kale-salad",
  "bbq-tofu",
  "quinoa",
  "tortilla",
  "oatmeal",
  "oat-milk",
  "popcorn",
  "kale-salad",
  "barley",
  "pistachio",
  "tortilla",
  "oatmeal",
  "tortilla",
  "kale-salad",
  "oatmeal",
  "kale-salad",
  "tortilla",
  "kale-salad",
  "oat-milk",
  "oatmeal",
  "barley",
  "kale-salad",
  "oat-milk",
  "oatmeal",
  "kale-salad",
  "tortilla",
  "oat-milk",
  "barley",
];

const createInitialEntries = (): MealPlanEntry[] => {
  const startDate = new Date(2026, 0, 3);

  return planSequence.map((mealKey, index) => {
    const current = new Date(startDate);
    current.setDate(startDate.getDate() + index);

    return {
      date: current.toISOString().split("T")[0],
      dayNumber: index + 1,
      mealKey,
    };
  });
};

const formatISODate = (date: Date) => date.toISOString().split("T")[0];

const formatDisplayDate = (isoDate: string) => {
  const date = new Date(`${isoDate}T00:00:00`);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const truncateMealName = (name: string, maxChars = 10) => {
  if (name.length <= maxChars) {
    return name;
  }

  return `${name.slice(0, maxChars)}...`;
};

function MealPlan() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0, 1));
  const [selectedDate, setSelectedDate] = useState("2026-01-04");

  const { data: availableRecipesData } = useGetAvailableRecipesQuery({});
  const { data: userMealPlansData, refetch: refetchUserMealPlans } =
    useGetUserMealPlansQuery({});
  const [createMealRecipe] = useCreateMealRecipeMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateForModal, setSelectedDateForModal] = useState<
    string | null
  >(null);

  const availableRecipes = availableRecipesData?.result || [];
  console.log(availableRecipes);

  const entryByDate = useMemo(() => {
    const userMealPlans: any[] = Array.isArray(userMealPlansData?.result)
      ? userMealPlansData.result
      : Array.isArray(userMealPlansData?.data)
        ? userMealPlansData.data
        : Array.isArray(userMealPlansData)
          ? userMealPlansData
          : [];

    return userMealPlans.reduce<Record<string, any>>((acc: any, plan: any) => {
      const dateStr = (plan.selectedDate || plan.date)?.split("T")[0];
      if (dateStr) {
        acc[dateStr] = plan;
      }
      return acc;
    }, {});
  }, [userMealPlansData]);

  const handleCreateMealRecipe = async (recipe: any) => {
    if (!selectedDateForModal) return;
    try {
      await createMealRecipe({
        recipeId: recipe._id || recipe.id,
        selectedDate: new Date(selectedDateForModal).toISOString(),
      }).unwrap();
      setIsModalOpen(false);
      refetchUserMealPlans();
    } catch (error) {
      console.error("Failed to create meal plan:", error);
    }
  };

  const calendarDays = useMemo(() => {
    const monthStart = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1,
    );
    const monthEnd = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0,
    );

    const firstGridDay = new Date(monthStart);
    firstGridDay.setDate(monthStart.getDate() - monthStart.getDay());

    const lastGridDay = new Date(monthEnd);
    lastGridDay.setDate(monthEnd.getDate() + (6 - monthEnd.getDay()));

    const days: Date[] = [];
    const cursor = new Date(firstGridDay);

    while (cursor <= lastGridDay) {
      days.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }

    return days;
  }, [currentMonth]);

  const currentMonthLabel = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const previousMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  };

  const selectedEntry = entryByDate[selectedDate];

  return (
    <section className="mx-auto container w-full px-3 pb-12 sm:px-4">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h1 className="text-[28px] font-bold text-[#111111] leading-[1.1] sm:text-[34px] md:text-[42px] md:leading-[1.1]">
          {currentMonthLabel}
        </h1>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={previousMonth}
            aria-label="Previous month"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#0FB58A] transition hover:bg-[#E6FAF4]"
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={2.25} />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            aria-label="Next month"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#0FB58A] transition hover:bg-[#E6FAF4]"
          >
            <ChevronRight className="h-6 w-6" strokeWidth={2.25} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-sm">
        <div className="min-w-[980px]">
          <div className="grid grid-cols-7 ">
            {WEEK_DAYS.map((day) => (
              <div
                key={day}
                className="py-3 text-center text-[18px] font-semibold text-[#3E434B] sm:text-[20px] lg:text-[22px]"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7  bg-white">
            {calendarDays.map((dayDate) => {
              const isoDate = formatISODate(dayDate);
              const planEntry = entryByDate[isoDate];
              const isSelected = selectedDate === isoDate;
              const isOutsideCurrentMonth =
                dayDate.getMonth() !== currentMonth.getMonth();

              const recipeImage =
                planEntry?.recipe?.recipeImage || planEntry?.recipeImage;
              const recipeName =
                planEntry?.recipe?.recipeName ||
                planEntry?.recipeName ||
                "Unnamed Recipe";

              return (
                <button
                  key={isoDate}
                  type="button"
                  onClick={() => {
                    setSelectedDate(isoDate);
                    if (!planEntry) {
                      setSelectedDateForModal(isoDate);
                      setIsModalOpen(true);
                    }
                  }}
                  className={`flex min-h-[195px] flex-col border-t border-b border-l border-[#EDEEF1] bg-white p-3 text-left transition shadow-md ${
                    isSelected
                      ? "relative z-[1] border border-[#0A2D9E] ring-2 ring-[#0A2D9E]/25"
                      : ""
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span
                      className={`text-[30px] font-semibold leading-none sm:text-[34px] ${
                        isOutsideCurrentMonth
                          ? "text-[#C2C7D1]"
                          : "text-[#202329]"
                      }`}
                    >
                      {dayDate.getDate().toString().padStart(2, "0")}
                    </span>
                  </div>

                  {planEntry ? (
                    <>
                      <div className="relative h-[102px] w-full overflow-hidden rounded-[14px] bg-[#F3F4F6]">
                        {recipeImage ? (
                          <Image
                            src={recipeImage}
                            alt={recipeName}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 220px, 180px"
                          />
                        ) : null}
                      </div>
                      <p className="mt-3 line-clamp-2 text-[15px] font-semibold leading-[1.25] text-[#3B3F45] sm:text-[16px]">
                        {recipeName}
                      </p>
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center rounded-[14px] border border-dashed border-[#E4E7EC] bg-[#FCFCFD]">
                      <span className="text-[15px] font-medium text-[#A5ACB8]">
                        No meal planned
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {selectedEntry ? (
        <div className="mt-12 rounded-[12px]">
          <h2 className="text-xl font-semibold leading-none text-[#141414]">
            Meal Plan
            <span className="ml-1 text-xl font-medium text-[#79808E]">
              ({formatDisplayDate(selectedDate)})
            </span>
          </h2>

          <div className="mt-5 rounded-2xl border border-[#E7E8EC] bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[#D7DCE5] bg-[#F2F4F8]">
                  {selectedEntry.recipe?.recipeImage ||
                  selectedEntry.recipeImage ? (
                    <Image
                      src={
                        selectedEntry.recipe?.recipeImage ||
                        selectedEntry.recipeImage
                      }
                      alt={
                        selectedEntry.recipe?.recipeName ||
                        selectedEntry.recipeName ||
                        "Recipe"
                      }
                      fill
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold text-[#202329] sm:text-xl">
                    {selectedEntry.recipe?.recipeName ||
                      selectedEntry.recipeName ||
                      "Unnamed Recipe"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 className="text-2xl font-semibold">Select a Recipe</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <RxCross2 size={25} />
              </button>
            </div>
            <div className="p-5 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-4">
              {availableRecipes.map((recipe: any) => (
                <button
                  key={recipe._id || recipe.id}
                  onClick={() => handleCreateMealRecipe(recipe)}
                  className="flex flex-col items-center p-2 border border-transparent rounded-lg hover:border-[#0A2D9E] hover:bg-gray-50 transition text-left"
                >
                  <div className="relative w-full aspect-square mb-2 overflow-hidden rounded-md bg-gray-100">
                    {recipe.recipeImage || recipe.image ? (
                      <Image
                        src={recipe.recipeImage || recipe.image}
                        alt={recipe.recipeName || recipe.name || "Recipe"}
                        fill
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <p className="font-medium text-sm line-clamp-2 w-full text-center">
                    {recipe.recipeName || recipe.name || "Unnamed Recipe"}
                  </p>
                </button>
              ))}
              {availableRecipes.length === 0 && (
                <p className="col-span-full text-center text-gray-500 py-4 text-2xl">
                  No recipes available.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// function MealCategoryHeader({
//   title,
//   icon: Icon,
// }: {
//   title: string;
//   icon: ComponentType<{ className?: string }>;
// }) {
//   return (
//     <div className="mt-4 overflow-x-auto rounded-[10px] bg-[#E9EAED]">
//       <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
//         <div className="flex items-center gap-2 text-lg font-semibold text-[#434851] sm:text-xl">
//           <Icon className="h-6 w-6" />
//           <span>{title}</span>
//         </div>
//         <button
//           type="button"
//           className="inline-flex items-center gap-2 rounded-full bg-[#0A2D9E] px-4 py-2 text-sm font-semibold text-white sm:text-base"
//         >
//           <RefreshCw className="h-4 w-4" />
//           Regenerate
//         </button>
//       </div>

//       <MealTableColumnHeader />
//     </div>
//   );
// }

// function MealCategoryBlock({
//   title,
//   icon: Icon,
//   children,
// }: {
//   title: string;
//   icon: ComponentType<{ className?: string }>;
//   children: ReactNode;
// }) {
//   return (
//     <div className="mt-4 overflow-x-auto rounded-[10px] bg-[#E9EAED]">
//       <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
//         <div className="flex items-center gap-2 text-lg font-semibold text-[#434851] sm:text-xl">
//           <Icon className="h-6 w-6" />
//           <span>{title}</span>
//         </div>
//         <button
//           type="button"
//           className="inline-flex items-center gap-2 rounded-full bg-[#0A2D9E] px-4 py-2 text-sm font-semibold text-white sm:text-base"
//         >
//           <RefreshCw className="h-4 w-4" />
//           Regenerate
//         </button>
//       </div>

//       <MealTableColumnHeader />

//       <div className="min-w-[920px] border-t border-[#D6DAE0] bg-[#F2F3F5]">
//         {children}
//       </div>
//     </div>
//   );
// }

// function MealTableColumnHeader() {
//   return (
//     <div className="min-w-[920px] border-t border-[#D6DAE0] bg-[#E1E4EA] px-4 py-2.5">
//       <div
//         className={`${MEAL_TABLE_GRID_CLASS} text-base font-semibold text-[#677081] sm:text-lg`}
//       >
//         {NUTRITION_COLUMN_HEADERS.map((label, index) => (
//           <p key={label} className={index === 0 ? "text-left" : "text-center"}>
//             {label}
//           </p>
//         ))}
//       </div>
//     </div>
//   );
// }

// function MealListRow({
//   meal,
//   checked = false,
//   highlighted = false,
//   onSelect,
// }: {
//   meal: MealCatalogItem;
//   checked?: boolean;
//   highlighted?: boolean;
//   onSelect?: () => void;
// }) {
//   return (
//     <button
//       type="button"
//       onClick={onSelect}
//       className={`${MEAL_TABLE_GRID_CLASS} w-full border-b border-[#D8DCE3] px-4 py-3 text-base font-semibold text-[#4D525D] sm:text-lg ${
//         highlighted
//           ? "relative z-[1] bg-[#E6E8EC] ring-2 ring-inset ring-[#0A2D9E]"
//           : "hover:bg-[#ECEEF2]"
//       }`}
//     >
//       <div className="flex min-w-0 items-center gap-3">
//         <input
//           type="checkbox"
//           checked={checked}
//           readOnly
//           className="h-5 w-5 rounded border-[#59606B]"
//         />
//         <div className="relative h-9 w-9 overflow-hidden rounded-[6px] border border-[#B3BEDA]">
//           <Image
//             src={meal.image}
//             alt={meal.title}
//             fill
//             className="object-cover"
//           />
//         </div>
//         <p className="truncate whitespace-nowrap text-left" title={meal.title}>
//           {truncateMealName(meal.title)}
//         </p>
//       </div>
//       <p className="text-center tabular-nums">{meal.nutrition.fiber}</p>
//       <p className="text-center tabular-nums">{meal.nutrition.fat}</p>
//       <p className="text-center tabular-nums">{meal.nutrition.carb}</p>
//       <p className="text-center tabular-nums">{meal.nutrition.iron}</p>
//       <p className="text-center tabular-nums">{meal.nutrition.protein}</p>
//       <p className="text-center tabular-nums">{meal.nutrition.calorie}</p>
//       <div className="flex items-center justify-center gap-2">
//         <span>{meal.nutrition.duration}</span>
//         <CalendarDays className="h-5 w-5 text-[#545B67]" />
//       </div>
//     </button>
//   );
// }

export default MealPlan;
