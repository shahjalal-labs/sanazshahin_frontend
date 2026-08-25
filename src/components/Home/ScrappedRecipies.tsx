"use client";

import Image from "next/image";
import Link from "next/link";
import { useGetAvailableScrappedRecipesQuery } from "@/redux/api/mealApi";
import Pagination from "@/shared/Pagination";
import { useState } from "react";
import { Search, Utensils, RefreshCw, X } from "lucide-react";

const ScrappedRecipies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useGetAvailableScrappedRecipesQuery({
    page,
    search: searchTerm,
  });

  const recipes = data?.data?.recipes ?? [];

  const handleRetry = () => {
    refetch();
  };

  const handleClearSearch = () => {
    setSearchTerm(""); // This clears the search term state
  };

  // Professional Error/Empty State
  if (isError) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex justify-end mb-4 pt-20">
          <div className="relative w-full sm:w-80">
            <input
              className="w-full border px-4 border-primary py-2 rounded-full pr-10"
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              placeholder="Search recipes..."
              value={searchTerm} // Controlled input
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex min-h-[500px] flex-col items-center justify-center rounded-3xl bg-gradient-to-b from-gray-50 to-white px-6 py-16 text-center shadow-sm border border-gray-100">
          <div className="relative mb-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-orange-50">
              <Utensils className="h-12 w-12 text-orange-400" strokeWidth={1.5} />
            </div>
            <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
              <Search className="h-4 w-4 text-red-500" />
            </div>
          </div>

          <h3 className="mb-2 text-2xl font-bold text-gray-800">
            No Recipes Found
          </h3>
          <p className="mb-2 max-w-md text-gray-500">
            We couldn't find any recipes matching your search.
          </p>
          <p className="mb-6 text-sm text-gray-400">
            Try adjusting your search terms or browse our collection.
          </p>

          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-white transition-all hover:bg-primary/90 hover:shadow-lg"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>

          <button
            onClick={handleClearSearch}
            className="mt-3 text-sm text-primary hover:underline"
          >
            Clear search filters
          </button>
        </div>
      </section>
    );
  }

  // When no recipes found but no error
  if (!isLoading && recipes.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex justify-end mb-4 pt-20">
          <div className="relative w-full sm:w-80">
            <input
              className="w-full border px-4 border-primary py-2 rounded-full pr-10"
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex min-h-[500px] flex-col items-center justify-center rounded-3xl bg-gradient-to-b from-gray-50 to-white px-6 py-16 text-center shadow-sm border border-gray-100">
          <div className="relative mb-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-amber-50">
              <Utensils className="h-12 w-12 text-amber-400" strokeWidth={1.5} />
            </div>
            {searchTerm && (
              <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <Search className="h-4 w-4 text-blue-500" />
              </div>
            )}
          </div>

          <h3 className="mb-2 text-2xl font-bold text-gray-800">
            {searchTerm ? `No results for "${searchTerm}"` : "No Recipes Available"}
          </h3>
          <p className="mb-2 max-w-md text-gray-500">
            {searchTerm
              ? "We couldn't find any recipes matching your search criteria."
              : "There are no recipes available at the moment."}
          </p>
          <p className="mb-6 text-sm text-gray-400">
            {searchTerm
              ? "Try using different keywords or browse all recipes."
              : "Check back later for new recipe additions."}
          </p>

          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-white transition-all hover:bg-primary/90 hover:shadow-lg"
            >
              <RefreshCw className="h-4 w-4" />
              Clear Search
            </button>
          )}

          {!searchTerm && (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
              <span>✨</span>
              <span>New recipes added regularly</span>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex justify-end mb-4 pt-20">
        <div className="relative w-full sm:w-80">
          <input
            className="w-full border px-4 border-primary py-2 rounded-full pr-10"
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm"
              >
                <div className="aspect-square animate-pulse bg-slate-200" />
                <div className="px-4 py-4">
                  <div className="mx-auto h-5 w-4/5 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            ))
          : recipes.map((recipe: any) => (
              <Link
                key={recipe.link}
                href={`/recipe/${recipe.title}`}
              >
                <div className="relative aspect-square bg-slate-100">
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    height={300}
                    width={300}
                    className="border h-80 w-full border-primary rounded-[14px] transition-transform duration-300"
                  />
                </div>

                <div className="px-4 py-3">
                  <h3 className="text-center text-[18px] font-bold leading-snug text-[#1F4FBF]">
                    {recipe.title}
                  </h3>
                </div>
              </Link>
            ))}
      </div>

      <div className="mt-8">
        <Pagination
          setPage={setPage}
          page={page}
          totalPage={data?.data?.totalPages || 1}
        />
      </div>
    </section>
  );
};

export default ScrappedRecipies;