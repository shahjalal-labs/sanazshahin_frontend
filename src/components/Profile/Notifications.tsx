"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const initialSettings = [
  { id: "meal", label: "Meal Reminder", enabled: true },
  { id: "grocery", label: "Grocery Reminder", enabled: true },
  { id: "new", label: "New Recipes", enabled: true },
  { id: "weekly", label: "Weekly Summary", enabled: true },
];

function Notifications() {
  const router = useRouter();
  const [settings, setSettings] = useState(initialSettings);

  const toggleSetting = (id: string) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting,
      ),
    );
  };

  return (
    <section className="w-full pt-[104px]">
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6">
        <div className="relative mb-6 flex items-center justify-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="absolute left-0 inline-flex h-9 w-9 items-center justify-center rounded-full text-[#5C6270] transition-colors hover:bg-[#F3F5F7]"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <h1 className="text-[22px] font-semibold text-[#1B1B1B] sm:text-[24px]">
            Notification
          </h1>
        </div>

        <div className="border-t border-[#E6E9EE]">
          {settings.map((setting) => (
            <div
              key={setting.id}
              className="flex items-center justify-between border-b border-[#E6E9EE] py-5 sm:py-6"
            >
              <span className="text-[18px] font-medium text-[#4B4F5C] sm:text-[20px]">
                {setting.label}
              </span>

              <button
                type="button"
                onClick={() => toggleSetting(setting.id)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors sm:h-8 sm:w-14 ${
                  setting.enabled ? "bg-[#05249C]" : "bg-[#CBD5E1]"
                }`}
                role="switch"
                aria-checked={setting.enabled}
                aria-label={`${setting.label} toggle`}
              >
                <span
                  className={`inline-block h-5 w-5 rounded-full bg-white transition-transform sm:h-6 sm:w-6 ${
                    setting.enabled
                      ? "translate-x-6 sm:translate-x-7"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Notifications;
