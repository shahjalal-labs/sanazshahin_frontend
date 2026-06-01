"use client";

export default function RecipeCardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="w-full pt-[104px]">
      <div className="px-4 pb-8">
        <div className="container mx-auto ">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="relative aspect-square overflow-hidden rounded-[18px] bg-gray-200" />
                <div className="px-2 pt-2">
                  <div className="mx-auto h-4 w-3/4 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
