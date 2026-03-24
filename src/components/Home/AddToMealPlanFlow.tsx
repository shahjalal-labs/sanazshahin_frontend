"use client";

import image1 from "@/assets/r1.jpg";
import image2 from "@/assets/r2.jpg";
import image3 from "@/assets/r3.png";
import image4 from "@/assets/r4.png";
import { ChevronLeft, ChevronRight, Clock3, Flame } from "lucide-react";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

interface AddToMealPlanFlowProps {
  title: string;
  image: string | StaticImageData;
  buttonClassName: string;
}

type PlanName = "Breakfast" | "Lunch" | "Dinner" | "Snacks";

const planChoices: { name: PlanName; icon: StaticImageData }[] = [
  { name: "Breakfast", icon: image1 },
  { name: "Lunch", icon: image2 },
  { name: "Dinner", icon: image3 },
  { name: "Snacks", icon: image4 },
];

const weekdayHeader = ["SAT", "SUN", "MON", "TUE", "WED", "RHU", "FRI"];
const monthLabelFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

const getCalendarDates = (monthDate: Date) => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const startOffset = (firstDayOfMonth.getDay() + 1) % 7;
  const gridStart = new Date(year, month, 1 - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return date;
  });
};

const isSameDate = (first: Date, second: Date) => {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
};

export default function AddToMealPlanFlow({
  title,
  image,
  buttonClassName,
}: AddToMealPlanFlowProps) {
  const today = useMemo(() => new Date(), []);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isGeneratedOpen, setIsGeneratedOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanName>("Breakfast");
  const [selectedDates, setSelectedDates] = useState<Date[]>([today]);
  const [currentMonth, setCurrentMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const generatedMeals = useMemo(
    () => [
      { id: "current", title, image },
      { id: "quinoa", title: "Quinoa Vegetable Bowl", image: image2 },
      { id: "tortilla", title: "Tortilla", image: image1 },
    ],
    [image, title],
  );

  const hasOpenModal = isSelectOpen || isGeneratedOpen;
  const calendarDates = useMemo(
    () => getCalendarDates(currentMonth),
    [currentMonth],
  );

  useEffect(() => {
    if (!hasOpenModal) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [hasOpenModal]);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      setIsSelectOpen(false);
      setIsGeneratedOpen(false);
    };

    if (hasOpenModal) {
      window.addEventListener("keydown", onEscape);
    }

    return () => {
      window.removeEventListener("keydown", onEscape);
    };
  }, [hasOpenModal]);

  return (
    <>
      <button
        type="button"
        className={buttonClassName}
        onClick={() => setIsSelectOpen(true)}
      >
        Add to Meal Plan
      </button>

      {isSelectOpen ? (
        <div className="fixed inset-0 z-50 bg-black/45 px-4 py-5 sm:grid sm:place-items-center backdrop-blur-sm">
          <div className="mx-auto w-full max-w-[760px] rounded-[34px] bg-white p-6 shadow-xl sm:p-7">
            <h3 className="mb-6 text-2xl font-bold text-[#111111]">
              Which plan do you want to add this to?
            </h3>

            <div className="space-y-3">
              {planChoices.map((plan) => {
                const isActive = selectedPlan === plan.name;

                return (
                  <button
                    key={plan.name}
                    type="button"
                    onClick={() => setSelectedPlan(plan.name)}
                    className="flex w-full items-center gap-3 rounded-3xl border border-[#D5D9E1] px-4 py-3 text-left transition-colors hover:bg-[#F8FAFF]"
                  >
                    <span className="relative h-12 w-12 overflow-hidden rounded-full border border-[#D4D9E3]">
                      <Image
                        src={plan.icon}
                        alt={plan.name}
                        fill
                        className="object-cover"
                      />
                    </span>
                    <span className="text-xl leading-none text-[#677183] sm:text-[34px]">
                      {plan.name}
                    </span>
                    <span
                      className={`ml-auto inline-flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                        isActive
                          ? "border-[#11389D] bg-[#11389D] text-white"
                          : "border-[#11389D] text-transparent"
                      }`}
                      aria-hidden="true"
                    >
                      <span className="text-lg">✓</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsSelectOpen(false)}
                className="inline-flex h-14 items-center justify-center rounded-full border border-[#6758FF] text-xl leading-none text-[#4D43D6] sm:text-[34px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSelectOpen(false);
                  setIsGeneratedOpen(true);
                  const latestSelected =
                    selectedDates[selectedDates.length - 1];
                  if (latestSelected) {
                    setCurrentMonth(
                      new Date(
                        latestSelected.getFullYear(),
                        latestSelected.getMonth(),
                        1,
                      ),
                    );
                  }
                }}
                className="inline-flex h-14 items-center justify-center rounded-full bg-[#11389D] text-xl leading-none text-white sm:text-[34px]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isGeneratedOpen ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/45 px-4 py-5 sm:grid sm:place-items-center backdrop-blur-sm">
          <div className="mx-auto w-full max-w-[760px] rounded-[34px] bg-white p-6 shadow-xl sm:p-7">
            <h3 className="mb-5 text-2xl font-bold text-[#121212]">
              Your generated meal plans
            </h3>

            <div className="space-y-3">
              {generatedMeals.map((meal) => (
                <div
                  key={meal.id}
                  className="flex items-center gap-4 rounded-2xl"
                >
                  <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-[#1F4DB3]">
                    <Image
                      src={meal.image}
                      alt={meal.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xl font-semibold leading-tight text-[#1F1F1F] sm:text-[34px]">
                      {meal.title}
                    </p>
                    <p className="mt-1 flex flex-wrap items-center gap-3 text-base text-[#6A7284] sm:text-[30px]">
                      <span className="inline-flex items-center gap-1">
                        <Clock3 className="h-4 w-4" />
                        30 min
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Flame className="h-4 w-4 text-[#F97316]" />
                        350 kcal
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <h4 className="mt-5 text-2xl font-bold text-[#121212]">
              Choose time to create meal:
            </h4>

            <div className="mt-3 rounded-2xl bg-[#F8F8FA] px-4 py-4">
              <div className="mb-4 flex items-center justify-between">
                <button
                  type="button"
                  className="text-[#111111]"
                  aria-label="Previous month"
                  onClick={() =>
                    setCurrentMonth(
                      (prev) =>
                        new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
                    )
                  }
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <p className="text-base font-medium text-[#1B1B1B] sm:text-[30px]">
                  {monthLabelFormatter.format(currentMonth)}
                </p>
                <button
                  type="button"
                  className="text-[#111111]"
                  aria-label="Next month"
                  onClick={() =>
                    setCurrentMonth(
                      (prev) =>
                        new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
                    )
                  }
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-y-3 text-center">
                {weekdayHeader.map((weekday) => (
                  <span
                    key={weekday}
                    className="text-[10px] font-medium tracking-wide text-[#3D3D3D] sm:text-[20px]"
                  >
                    {weekday}
                  </span>
                ))}

                {calendarDates.map((date) => {
                  const isCurrentMonth =
                    date.getMonth() === currentMonth.getMonth();
                  const isSelected = selectedDates.some((selectedDate) =>
                    isSameDate(date, selectedDate),
                  );

                  return (
                    <button
                      key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
                      type="button"
                      onClick={() => {
                        setSelectedDates((prev) => {
                          const exists = prev.some((selectedDate) =>
                            isSameDate(selectedDate, date),
                          );

                          if (exists) {
                            return prev.filter(
                              (selectedDate) => !isSameDate(selectedDate, date),
                            );
                          }

                          return [...prev, new Date(date)];
                        });
                      }}
                      className={`mx-auto inline-flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors sm:text-[30px] ${
                        isSelected
                          ? "bg-[#11389D] text-white"
                          : isCurrentMonth
                            ? "text-[#1A1A1A] hover:bg-[#E8EEFF]"
                            : "text-[#A8AFBC] hover:bg-[#EEF2F8]"
                      }`}
                      aria-label={`Select ${date.toDateString()}`}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsGeneratedOpen(false)}
                className="inline-flex h-14 items-center justify-center rounded-full border border-[#6758FF] text-xl leading-none text-[#4D43D6] sm:text-[34px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setIsGeneratedOpen(false)}
                className="inline-flex h-14 items-center justify-center rounded-full bg-[#11389D] px-4 text-base leading-none text-white sm:text-[34px]"
              >
                Select & Confirm
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
