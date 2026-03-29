"use client";

import {
  ArrowLeft,
  Check,
  ChevronRight,
  ShieldCheck,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";

type Step = 1 | 2 | 3 | 4;
type Gender = "male" | "female";
type Unit = "kg" | "lb";

const MIN_KG = 35;
const MAX_KG = 120;
const MIN_LB = Math.round(MIN_KG * 2.20462);
const MAX_LB = Math.round(MAX_KG * 2.20462);

const RING_BUTTON_CLASS =
  "relative grid h-[86px] w-[86px] place-items-center rounded-full bg-[#0E2F97] text-white transition-transform hover:scale-[1.03]";

const RING_OUTER_CLASS =
  "relative grid h-[112px] w-[112px] place-items-center rounded-full border-[4px] border-[#C4CDE4]";

function ProgressButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`${RING_OUTER_CLASS} before:absolute before:inset-[-4px] before:rounded-full before:border-[6px] before:border-transparent before:border-r-[#0E2F97] before:border-t-[#0E2F97]`}
    >
      <span className={RING_BUTTON_CLASS}>
        <ChevronRight className="h-8 w-8" strokeWidth={2.1} />
      </span>
    </button>
  );
}

function GenderCard({
  label,
  selected,
  onSelect,
}: {
  label: "Male" | "Female";
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex min-h-[205px] w-full flex-col items-center justify-center rounded-[26px] border px-4 py-6 text-center transition-colors ${
        selected
          ? "border-[#CBD6F1] bg-[#DDE4F9] text-[#1C2438]"
          : "border-transparent bg-[#F1F1F5] text-[#798193]"
      }`}
    >
      <div className="mb-4 grid h-[84px] w-[84px] place-items-center rounded-full bg-white/80 text-[#4D5670] shadow-sm">
        <User className="h-11 w-11" strokeWidth={2.1} />
      </div>
      <span
        className={`text-[30px] font-semibold  ${selected ? "text-[#252C3C]" : "text-[#848C9A]"}`}
      >
        {label}
      </span>
    </button>
  );
}

function ProteinCalculator() {
  const [step, setStep] = useState<Step>(1);
  const [gender, setGender] = useState<Gender>("female");
  const [unit, setUnit] = useState<Unit>("kg");
  const [weightKg, setWeightKg] = useState(60);

  const displayWeight = useMemo(() => {
    if (unit === "kg") {
      return weightKg;
    }

    return Math.round(weightKg * 2.20462);
  }, [unit, weightKg]);

  const proteinValue = useMemo(() => {
    const baseKg = unit === "kg" ? displayWeight : displayWeight * 0.453592;
    return Math.round(baseKg * 1.18);
  }, [displayWeight, unit]);

  const sliderMin = unit === "kg" ? MIN_KG : MIN_LB;
  const sliderMax = unit === "kg" ? MAX_KG : MAX_LB;
  const sliderValue =
    unit === "kg" ? Math.round(weightKg) : Math.round(weightKg * 2.20462);
  const dialLabels =
    unit === "kg"
      ? [
          Math.max(sliderMin, 50),
          Math.round((sliderMin + sliderMax) / 2),
          Math.min(sliderMax, 70),
        ]
      : [
          Math.max(sliderMin, 110),
          Math.round((sliderMin + sliderMax) / 2),
          Math.min(sliderMax, 155),
        ];

  const nextStep = () => {
    setStep((prev) => (prev < 4 ? ((prev + 1) as Step) : prev));
  };

  const previousStep = () => {
    setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev));
  };

  return (
    <section className="container mx-auto px-4 pb-12 pt-[104px]">
      {step !== 4 ? (
        <div className="mx-auto w-full max-w-[980px] rounded-[40px] bg-[#F8F8FB] px-4 py-6 shadow-[0_18px_48px_rgba(18,31,74,0.08)] sm:px-8 sm:py-8 md:px-12 md:py-10">
          {step > 1 ? (
            <button
              type="button"
              onClick={previousStep}
              aria-label="Go back"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#687083] transition-colors hover:bg-[#ECEEF5]"
            >
              <ArrowLeft className="h-7 w-7" />
            </button>
          ) : null}

          {step === 1 ? (
            <div className="mx-auto flex min-h-[660px] w-full max-w-[840px] flex-col">
              <div className="pt-3 text-center">
                <h1 className="text-[32px] font-bold leading-tight text-[#121212] ">
                  What is your gender?
                </h1>
                <p className="mx-auto mt-3 max-w-[440px] text-[24px] leading-[1.4] text-[#8B93A2]">
                  We will use this data to give you a better diet type for you
                </p>
              </div>

              <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                <GenderCard
                  label="Male"
                  selected={gender === "male"}
                  onSelect={() => setGender("male")}
                />
                <GenderCard
                  label="Female"
                  selected={gender === "female"}
                  onSelect={() => setGender("female")}
                />
              </div>

              <div className="mt-auto flex justify-center pb-1 pt-14">
                <ProgressButton onClick={nextStep} label="Continue to weight" />
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="mx-auto w-full max-w-[760px]">
              <div className="pt-2 text-center">
                <h2 className="text-[32px] font-bold leading-tight text-[#121212] ">
                  Your current weight
                </h2>
                <p className="mx-auto mt-3 max-w-[420px] text-[24px] leading-[1.4] text-[#8B93A2]">
                  We will use this data to give you a better diet type for you
                </p>

                <div className="mt-5 inline-flex rounded-full bg-[#F0F0F4] p-1">
                  <button
                    type="button"
                    onClick={() => setUnit("kg")}
                    className={`h-12 min-w-[82px] rounded-full px-4 text-[24px] font-semibold transition-colors  ${
                      unit === "kg"
                        ? "bg-[#0E2F97] text-white"
                        : "text-[#8B93A2]"
                    }`}
                  >
                    kg
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnit("lb")}
                    className={`h-12 min-w-[82px] rounded-full px-4 text-[24px] font-semibold transition-colors  ${
                      unit === "lb"
                        ? "bg-[#0E2F97] text-white"
                        : "text-[#8B93A2]"
                    }`}
                  >
                    lb
                  </button>
                </div>
              </div>

              <div className="relative mt-5 flex flex-col items-center">
                <div className="mb-4 h-0 w-0 border-l-[10px] border-r-[10px] border-t-[16px] border-l-transparent border-r-transparent border-t-[#0E2F97]" />

                <div className="grid h-[128px] w-[128px] place-items-center rounded-[24px] bg-[#D6DEF4]">
                  <span className="text-[70px] font-semibold leading-none text-[#3E425D] [font-size:clamp(40px,3.6vw,70px)]">
                    {displayWeight}
                  </span>
                </div>

                <div className="relative mt-3 h-[280px] w-[560px] max-w-full overflow-hidden">
                  <div className="absolute left-1/2 top-[16px] h-[540px] w-[540px] -translate-x-1/2 rounded-full">
                    {Array.from({ length: 36 }).map((_, index) => {
                      const angle = -90 + (index * 180) / 35;
                      const activeIndex = Math.round(
                        ((sliderValue - sliderMin) / (sliderMax - sliderMin)) *
                          35,
                      );
                      const isActive = index <= activeIndex;

                      return (
                        <span
                          key={index}
                          className={`absolute left-1/2 top-1/2 block origin-bottom ${isActive ? "bg-[#0E2F97]" : "bg-[#E9ECF2]"}`}
                          style={{
                            width: "2px",
                            height: index % 5 === 0 ? "26px" : "18px",
                            transform: `translate(-50%, -100%) rotate(${angle}deg) translateY(-250px)`,
                          }}
                        />
                      );
                    })}

                    {dialLabels.map((value, index) => {
                      const positions = [
                        "left-[37%]",
                        "left-1/2",
                        "left-[63%]",
                      ];
                      return (
                        <span
                          key={value}
                          className={`absolute top-[138px] -translate-x-1/2 text-[20px] font-semibold text-[#21313C] [font-size:clamp(12px,1vw,20px)] ${positions[index]}`}
                        >
                          {value}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const nextValue = Math.max(sliderMin, sliderValue - 1);
                      if (unit === "kg") {
                        setWeightKg(nextValue);
                        return;
                      }
                      setWeightKg(Math.round(nextValue * 0.453592 * 10) / 10);
                    }}
                    className="h-10 w-10 rounded-full border border-[#C5D0EB] bg-white text-xl font-semibold text-[#0E2F97]"
                    aria-label="Decrease weight"
                  >
                    -
                  </button>
                  <input
                    type="range"
                    min={sliderMin}
                    max={sliderMax}
                    value={sliderValue}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      if (unit === "kg") {
                        setWeightKg(value);
                        return;
                      }

                      setWeightKg(Math.round(value * 0.453592 * 10) / 10);
                    }}
                    className="h-2 w-[300px] max-w-[58vw] cursor-pointer appearance-none rounded-full bg-[#D7DFEF] accent-[#0E2F97]"
                    aria-label="Set weight"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const nextValue = Math.min(sliderMax, sliderValue + 1);
                      if (unit === "kg") {
                        setWeightKg(nextValue);
                        return;
                      }
                      setWeightKg(Math.round(nextValue * 0.453592 * 10) / 10);
                    }}
                    className="h-10 w-10 rounded-full border border-[#C5D0EB] bg-white text-xl font-semibold text-[#0E2F97]"
                    aria-label="Increase weight"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-3 flex justify-center pb-2 sm:mt-6">
                <ProgressButton
                  onClick={nextStep}
                  label="Continue to summary"
                />
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="mx-auto flex min-h-[507px] w-full max-w-[780px] flex-col items-center text-center ">
              <div className="mt-8 grid h-[236px] w-[236px] place-items-center rounded-full bg-[#9AB3FA]">
                <div className="grid h-[192px] w-[192px] place-items-center rounded-full bg-[#7490E4]">
                  <div className="grid h-[152px] w-[152px] place-items-center rounded-full bg-[#0E2F97] text-white">
                    <ShieldCheck className="h-16 w-16" strokeWidth={2.1} />
                  </div>
                </div>
              </div>

              <h2 className="mt-11 text-2xl font-bold leading-none text-[#101010] ">
                Thanks!
              </h2>

              <p className="mt-5 max-w-[320px] text-base leading-[1.3] text-[#6D7687] ">
                We&apos;re analyzing your results and creating your personalized
                recommendations.
              </p>

              <div className="mt-auto pb-3 pt-16">
                <ProgressButton onClick={nextStep} label="Continue to result" />
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
      {step === 4 ? (
        <div className="mx-auto w-full max-w-[900px] rounded-[32px] bg-[#061E68] px-4 py-8 text-center text-white sm:px-10 sm:py-12 md:px-14 md:py-14 mt-10">
          <h2 className="text-[24px] font-bold leading-tight ">
            Azizur&apos;s Protein Calculation
          </h2>
          <p className="mt-4 text-base text-[#C8D3F6] ">
            To hit your goals we recommend you need:
          </p>

          <div className="mx-auto mt-9 flex  max-w-fit items-center justify-center rounded-[24px] bg-[#F4F5F8] px-[150px] py-4 text-[#0E2F97]">
            <span className="text-2xl font-bold ">{proteinValue}g</span>
          </div>

          <p className="mt-4 text-2xl leading-tight text-[#C8D3F6] ">
            of Protein Per Day
          </p>

          <p className="mx-auto mt-16 max-w-[460px] text-base leading-[1.38] text-[#BBC6E9] ">
            These results are intended as a guide only and should not replace
            personal dietary advice. For more information on the methodology,
            check out the "Understanding your results" section below and consult
            a healthcare provider or nutritionist for more personalized
            recommendations.
          </p>

          <button
            type="button"
            onClick={() => {
              setStep(1);
              setGender("female");
              setUnit("kg");
              setWeightKg(60);
            }}
            className="mx-auto mt-10 inline-flex  items-center justify-center rounded-full bg-[#F4F5F8] px-[104px] py-4 text-lg font-semibold text-[#143A9D] transition-colors hover:bg-white "
          >
            Go to Home
          </button>

          <div className="mt-5 flex items-center justify-center gap-2 text-[#AFC0F4]">
            <Check className="h-5 w-5" />
            <span className="text-sm">
              Gender: {gender === "female" ? "Female" : "Male"}
            </span>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default ProteinCalculator;
