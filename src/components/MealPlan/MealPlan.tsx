"use client";

import m1 from "@/assets/meal/m1.jpg";
import m2 from "@/assets/meal/m2.jpg";
import m3 from "@/assets/meal/m3.jpg";
import m4 from "@/assets/meal/m4.jpg";
import m5 from "@/assets/meal/m5.jpg";
import m6 from "@/assets/meal/m6.jpg";
import m7 from "@/assets/meal/m7.png";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { useMemo, useState } from "react";

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
};

type MealPlanEntry = {
  date: string;
  dayNumber: number;
  mealKey: MealKey;
};

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const mealCatalog: Record<MealKey, MealCatalogItem> = {
  "kale-salad": { title: "Kale Caesar Salad", image: m1 },
  "bbq-tofu": { title: "BBQ Tofu", image: m2 },
  quinoa: { title: "Quinoa Vegetable", image: m3 },
  tortilla: { title: "Tortilla", image: m4 },
  oatmeal: { title: "Orange Oatmeal", image: m5 },
  "oat-milk": { title: "Oat Milk", image: m6 },
  popcorn: { title: "Popcorn in a Bag", image: m7 },
  barley: { title: "Barley Soup", image: m7 },
  pistachio: { title: "Pistachio Granola..", image: m3 },
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

function MealPlan() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0, 1));
  const [selectedDate, setSelectedDate] = useState("2026-01-04");

  const planEntries = useMemo(() => createInitialEntries(), []);

  const entryByDate = useMemo(() => {
    return planEntries.reduce<Record<string, MealPlanEntry>>((acc, entry) => {
      acc[entry.date] = entry;
      return acc;
    }, {});
  }, [planEntries]);

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

  return (
    <section className="mx-auto w-full container px-4 pb-12 ">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#111111] md:text-[42px] md:leading-[1.1]">
          {currentMonthLabel}
        </h1>

        <div className="flex items-center gap-3">
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

      <div className="overflow-x-auto rounded-sm ">
        <div className="">
          <div className="grid grid-cols-7 ">
            {WEEK_DAYS.map((day) => (
              <div
                key={day}
                className="py-3 text-center text-[22px] font-semibold text-[#3E434B]"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7  bg-white">
            {calendarDays.map((dayDate) => {
              const isoDate = formatISODate(dayDate);
              const planEntry = entryByDate[isoDate];
              const meal = planEntry ? mealCatalog[planEntry.mealKey] : null;
              const isSelected = selectedDate === isoDate;
              const isOutsideCurrentMonth =
                dayDate.getMonth() !== currentMonth.getMonth();

              return (
                <button
                  key={isoDate}
                  type="button"
                  onClick={() => setSelectedDate(isoDate)}
                  className={`flex min-h-[195px] flex-col border-t border-b border-l border-[#EDEEF1] bg-white p-3 text-left transition shadow-md ${
                    isSelected
                      ? "relative z-[1] border border-[#5072C7] shadow-[inset_0_0_0_1px_#5072C7]"
                      : ""
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span
                      className={`text-[34px] font-semibold leading-none ${
                        isOutsideCurrentMonth
                          ? "text-[#C2C7D1]"
                          : "text-[#202329]"
                      }`}
                    >
                      {dayDate.getDate().toString().padStart(2, "0")}
                    </span>

                    {planEntry ? (
                      <span className="rounded-full bg-[#EEF1F7] px-3 py-[2px] text-[14px] font-semibold text-[#6A7280]">
                        Day {planEntry.dayNumber.toString().padStart(2, "0")}
                      </span>
                    ) : null}
                  </div>

                  {meal ? (
                    <>
                      <div className="relative h-[102px] w-full overflow-hidden rounded-[14px] bg-[#F3F4F6]">
                        <Image
                          src={meal.image}
                          alt={meal.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 220px, 180px"
                        />
                      </div>
                      <p className="mt-3 line-clamp-2 text-[16px] font-semibold leading-[1.25] text-[#3B3F45]">
                        {meal.title}
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
    </section>
  );
}

export default MealPlan;
