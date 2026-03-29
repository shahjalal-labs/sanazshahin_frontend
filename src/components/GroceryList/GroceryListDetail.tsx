"use client";

import { Checkbox } from "@/components/ui/Checkbox";
import { getGroceryRecipeById } from "@/lib/grocery";
import { jsPDF } from "jspdf";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

interface GroceryListDetailProps {
  recipeId: number;
}

function GroceryListDetail({ recipeId }: GroceryListDetailProps) {
  const router = useRouter();
  const recipe = getGroceryRecipeById(recipeId);

  const allItemIds = useMemo(() => {
    return (
      recipe?.sections.flatMap((section) =>
        section.items.map((item) => `${section.id}-${item.id}`),
      ) ?? []
    );
  }, [recipe]);

  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  if (!recipe) {
    return null;
  }

  const toggleItem = (itemId: string) => {
    setCheckedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((value) => value !== itemId)
        : [...prev, itemId],
    );
  };

  const markAllDone = () => {
    setCheckedItems((prev) =>
      prev.length === allItemIds.length ? [] : [...allItemIds],
    );
  };

  const exportPdf = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const left = 48;
    const right = 48;
    const contentWidth = pageWidth - left - right;
    let y = 56;

    const ensureSpace = (neededHeight: number) => {
      if (y + neededHeight <= pageHeight - 48) {
        return;
      }

      doc.addPage();
      y = 56;
    };

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Grocery List", left, y);
    y += 28;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.text(`Recipe: ${recipe.title}`, left, y);
    y += 24;

    const completedCount = checkedItems.length;
    const totalCount = allItemIds.length;
    doc.setFontSize(11);
    doc.text(`Completed: ${completedCount}/${totalCount}`, left, y);
    y += 20;

    recipe.sections.forEach((section) => {
      ensureSpace(34);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(`${section.title} (${section.items.length})`, left, y);
      y += 18;

      section.items.forEach((item) => {
        const itemKey = `${section.id}-${item.id}`;
        const isChecked = checkedItems.includes(itemKey);
        const itemText = `[${isChecked ? "x" : " "}] ${item.name} - ${item.quantity}`;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        const lines = doc.splitTextToSize(itemText, contentWidth);
        const blockHeight = lines.length * 14 + 2;
        ensureSpace(blockHeight);
        doc.text(lines, left, y);
        y += blockHeight;
      });

      y += 8;
    });

    const safeTitle = recipe.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    doc.save(`grocery-list-${safeTitle}.pdf`);
  };

  return (
    <section className="mx-auto w-full max-w-[980px] px-4 pb-12 pt-[96px] sm:px-6">
      <header className="relative mb-6 flex items-center justify-center sm:mb-8">
        <button
          type="button"
          onClick={() => router.push("/grocery-list")}
          className="absolute left-0 inline-flex h-10 w-10 items-center justify-center rounded-full text-[#4D5562] transition-colors hover:bg-[#EFEFEF]"
          aria-label="Back to grocery list"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>

        <h1 className="px-10 text-center font-bold leading-tight text-[#171717] [font-size:clamp(24px,2vw,31px)]">
          {recipe.title}
        </h1>
      </header>

      <div className="mb-6 rounded-[18px] border border-[#CDEFD9] bg-[#D8F3E1] px-4 py-5 text-center sm:mb-8">
        <h2 className="font-bold text-[#1D1D1D] [font-size:clamp(24px,1.9vw,34px)]">
          Grocery List ✨
        </h2>
        <p className="mt-1 text-[#4B5A5E] [font-size:clamp(14px,1.1vw,20px)]">
          Auto-generated from your meal plan
        </p>
      </div>

      <div>
        {recipe.sections.map((section) => (
          <div key={section.id} className="mb-8 last:mb-0">
            <h3 className="mb-3 font-bold text-[#102E85] [font-size:clamp(24px,2.2vw,42px)]">
              {section.title} ({section.items.length})
            </h3>

            <ul>
              {section.items.map((item) => {
                const itemKey = `${section.id}-${item.id}`;
                const isChecked = checkedItems.includes(itemKey);

                return (
                  <li
                    key={itemKey}
                    className="flex min-h-[66px] items-center justify-between border-t border-[#E9E9EA] py-3"
                  >
                    <label className="flex items-center gap-2.5 font-medium text-[#191919] [font-size:clamp(18px,1.56vw,30px)]">
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => toggleItem(itemKey)}
                        className="h-5 w-5 rounded-[4px] border-[#153E9B] data-[state=checked]:bg-[#153E9B]"
                      />
                      <span
                        className={isChecked ? "line-through opacity-55" : ""}
                      >
                        {item.name}
                      </span>
                    </label>

                    <span className="font-semibold text-[#102E85] [font-size:clamp(18px,1.56vw,30px)]">
                      {item.quantity}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={markAllDone}
          className="h-[54px] rounded-full border border-[#1A45AC] px-7 font-medium text-[#1A45AC] transition-colors hover:bg-[#EEF3FF] [font-size:clamp(16px,1.24vw,24px)]"
        >
          Mark All Done
        </button>
        <button
          type="button"
          onClick={exportPdf}
          className="h-[54px] rounded-full bg-[#123A9D] px-8 font-medium text-white transition-colors hover:bg-[#0E3188] [font-size:clamp(16px,1.24vw,24px)]"
        >
          Export PDF
        </button>
      </div>
    </section>
  );
}

export default GroceryListDetail;
