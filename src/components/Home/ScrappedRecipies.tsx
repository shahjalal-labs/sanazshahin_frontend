"use client";

import Image from "next/image";
import Link from "next/link";
import { useGetAvailableScrappedRecipesQuery } from "@/redux/api/mealApi";
import Pagination from "@/shared/Pagination";
import { useState } from "react";

const ScrappedRecipies = () => {
    const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } =
    useGetAvailableScrappedRecipesQuery({page, search: searchTerm});

  const recipes = data?.data?.recipes ?? [];

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {isError ? (
        <div className="rounded-2xl pt-20 border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">
          Unable to load recipes right now.
        </div>
      ) : null}
      <div className="flex justify-end mb-4 pt-20">
        <input className="border px-4  border-primary py-2 rounded-full" onChange={(e)=> setSearchTerm(e.target.value)} type="text" placeholder="Search recipes..." />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
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
          : recipes.map((recipe:any) => (
              <Link
                key={recipe.link}
                href={`/`}
                // target="_blank"
                // rel="noreferrer"
                className="group overflow-hidden rounded-[24px] border border-blue-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="relative aspect-square overflow-hidden bg-slate-100">
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
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
