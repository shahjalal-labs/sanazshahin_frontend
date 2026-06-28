"use client";

import {
  useDeleteMyRecipeMutation,
  useMyRecipeDetailsQuery,
  useMyRecipesQuery,
} from "@/redux/api/recipeApi";
import { ChevronDown, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import RecipeCardSkeleton from "../ui/RecipeCardSkeleton";
import RecipeAddModal from "./RecipeAddModal";
import RecipeEditModal from "./RecipeEditModal";

const ITEMS_PER_PAGE = 9;

function RecipeBox() {
  const [selectedRecipe, setSelectedRecipe] = useState<MyRecipe | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<MyRecipe | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: myRecipes, isLoading } = useMyRecipesQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });
  const recipeList = myRecipes?.result;
  const recipes = recipeList?.recipes as MyRecipe[] | undefined;
  const totalPages =
    recipeList?.totalPages ??
    recipeList?.pagination?.totalPages ??
    Math.max(
      1,
      Math.ceil(
        (recipeList?.totalItems ?? recipeList?.totalCount ?? 0) /
          ITEMS_PER_PAGE,
      ),
    );

  const { data: recipeDetailsResponse } = useMyRecipeDetailsQuery(
    selectedRecipe?.id ?? "",
    {
      skip: !selectedRecipe?.id,
    },
  );
  const recipeDetails = (
    recipeDetailsResponse as MyRecipeDetailsResponse | undefined
  )?.result;
  const [deleteMyRecipe] = useDeleteMyRecipeMutation();

  const handleOpenEditModal = (recipe: MyRecipe) => {
    setSelectedRecipe(null);
    setEditingRecipe(recipe);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getVisiblePages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages: Array<number | "..."> = [1];
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    if (startPage > 2) {
      pages.push("...");
    }

    for (let page = startPage; page <= endPage; page += 1) {
      pages.push(page);
    }

    if (endPage < totalPages - 1) {
      pages.push("...");
    }

    pages.push(totalPages);
    return pages;
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    const result = await Swal.fire({
      icon: "question",
      iconColor: "#0B2E9C",
      title: "Delete recipe?",
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      buttonsStyling: false,
      customClass: {
        popup: "sanaz-swal-popup",
        title: "sanaz-swal-title",
        htmlContainer: "sanaz-swal-html",
        actions: "sanaz-swal-actions",
        confirmButton: "sanaz-swal-confirm",
        cancelButton: "sanaz-swal-cancel",
        icon: "sanaz-swal-icon",
      },
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await deleteMyRecipe(recipeId).unwrap();
      setSelectedRecipe(null);
      toast.success("Recipe deleted successfully.");
    } catch (error) {
      toast.error(
        "An error occurred while deleting the recipe. Please try again.",
      );
    }
  };

  if (isLoading) {
    return <RecipeCardSkeleton />;
  }

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
          {recipes?.map((recipe) => (
            <button
              key={recipe?.id}
              type="button"
              onClick={() => setSelectedRecipe(recipe)}
              className="group text-left"
            >
              <div className="relative h-[280px] w-full overflow-hidden rounded-[26px] border border-[#4668C8] bg-white">
                <Image
                  src={recipe?.recipeImage}
                  alt={recipe?.recipeName}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-[1.02]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
              </div>
              <h2 className="mx-auto mt-3 max-w-[92%] text-center text-lg font-semibold leading-[1.3] text-[#1141B5]">
                {recipe?.recipeName}
              </h2>
            </button>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-end gap-3 text-sm font-semibold text-[#5C6470]">
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#FCEBFA] text-[#D36BC0] transition hover:bg-[#F9DDF4]"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1 px-1">
            {getVisiblePages().map((page, index) =>
              page === "..." ? (
                <span key={`ellipsis-${index}`} className="px-1">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  onClick={() => handlePageChange(page)}
                  className={`inline-flex min-w-8 items-center justify-center rounded-[8px] px-2 py-1 transition ${
                    currentPage === page
                      ? "bg-[#375BCC] text-white"
                      : "text-[#5C6470] hover:bg-[#EEF2FA]"
                  }`}
                  aria-label={`Page ${page}`}
                >
                  {page}
                </button>
              ),
            )}
          </div>

          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#FCEBFA] text-[#D36BC0] transition hover:bg-[#F9DDF4]"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <RecipeDetailsModal
        recipe={selectedRecipe}
        recipeDetails={recipeDetails}
        onClose={() => setSelectedRecipe(null)}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteRecipe}
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
  recipeDetails,
  onClose,
  onEdit,
  onDelete,
}: {
  recipe: MyRecipe | null;
  recipeDetails?: MyRecipeDetailsResponse["result"];
  onClose: () => void;
  onEdit: (recipe: MyRecipe) => void;
  onDelete: (recipeId: string) => void | Promise<void>;
}) {
  if (!recipe) {
    return null;
  }

  const details = recipeDetails;
  const recipeImage = details?.recipeImage || recipe.recipeImage;
  const recipeName = details?.recipeName || recipe.recipeName;
  const features = details?.features || [];
  const aboutRecipe = details?.wyn || "";
  const nutrition = details?.nutrition || "";
  const howTo = details?.hymi || "";
  const duration = details?.duration ?? "";
  const energy = details?.energy ?? "";
  const youtubeLink = details?.youtubeLink || "";

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
                  src={recipeImage}
                  alt={recipeName}
                  fill
                  className="object-cover"
                />
              </div>
              <span>{recipeName}</span>
            </div>
          </DetailRow>

          <DetailRow label="Duration">
            <span className="text-[16px] font-medium text-[#111111] md:text-[17px]">
              {duration}
            </span>
          </DetailRow>

          <DetailRow label="Energy (kcal)">
            <span className="text-[16px] font-medium text-[#111111] md:text-[17px]">
              {energy}
            </span>
          </DetailRow>

          <DetailRow label="Features">
            <ul className="space-y-1 text-[16px] font-medium text-[#111111] md:text-[17px]">
              {features.map((feature, index) => (
                <li key={feature}>
                  {index === 0 ? "🟡" : index === 1 ? "🍽️" : "•"} {feature}
                </li>
              ))}
            </ul>
          </DetailRow>

          <DetailRow label="What You'll Need">
            <HtmlContent className="max-w-[560px] text-[16px] leading-[1.45] text-[#111111] md:text-[17px]">
              {aboutRecipe}
            </HtmlContent>
          </DetailRow>

          <DetailRow label="Nutrition">
            <HtmlContent className="max-w-[560px] text-[15px] leading-[1.45] text-default md:text-[16px]">
              {nutrition}
            </HtmlContent>
          </DetailRow>

          <DetailRow label="How You'll Make It">
            <HtmlContent className="max-w-[560px] text-[16px] leading-[1.45] text-default md:text-[17px]">
              {howTo}
            </HtmlContent>
          </DetailRow>

          <DetailRow label="Youtube link" isLast>
            <a
              href={youtubeLink}
              target="_blank"
              rel="noreferrer"
              className="break-all text-[16px] text-[#111111] underline-offset-2 hover:underline md:text-[17px]"
            >
              {youtubeLink}
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
            onClick={() => onDelete(recipe.id)}
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
      <div className="flex w-full justify-start md:justify-end md:text-right">
        {children}
      </div>
    </div>
  );
}

function HtmlContent({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: children }} />
  );
}

export default RecipeBox;
