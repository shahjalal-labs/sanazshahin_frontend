"use client";

export default function RecipeDetailsSkeleton() {
  return (
    <section className="w-full pb-10 pt-4 md:pb-12 md:pt-6 lg:pt-28">
      <div className="mx-auto w-full container px-4 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-between gap-4 sm:mb-8">
          <div className="h-5 w-5 rounded bg-gray-200" />
          <div className="flex-1 text-center">
            <div className="mx-auto h-8 w-48 rounded bg-gray-200" />
          </div>
          <div className="h-11 w-11" aria-hidden="true" />
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(300px,0.9fr)_minmax(420px,1.1fr)] lg:gap-8">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-gray-200 shadow-sm sm:rounded-[34px] lg:aspect-[7/10] animate-pulse" />

          <div className="space-y-5">
            <div className="space-y-3">
              <div className="h-4 w-40 rounded bg-gray-200" />
              <div className="h-6 w-72 rounded bg-gray-200" />
            </div>

            <div className="h-4 w-full rounded bg-gray-200" />

            <div className="flex flex-wrap gap-3">
              <div className="h-8 w-24 rounded bg-gray-200" />
              <div className="h-8 w-24 rounded bg-gray-200" />
              <div className="h-8 w-24 rounded bg-gray-200" />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <div className="h-5 w-32 rounded bg-gray-200 mb-3" />
                <ul className="space-y-2">
                  <li className="h-3 w-3/4 rounded bg-gray-200" />
                  <li className="h-3 w-2/3 rounded bg-gray-200" />
                  <li className="h-3 w-1/2 rounded bg-gray-200" />
                </ul>
              </div>

              <div>
                <div className="h-5 w-32 rounded bg-gray-200 mb-3" />
                <ul className="space-y-2">
                  <li className="h-3 w-3/4 rounded bg-gray-200" />
                  <li className="h-3 w-2/3 rounded bg-gray-200" />
                  <li className="h-3 w-1/2 rounded bg-gray-200" />
                </ul>
              </div>

              <div>
                <div className="h-5 w-32 rounded bg-gray-200 mb-3" />
                <ul className="space-y-2">
                  <li className="h-3 w-3/4 rounded bg-gray-200" />
                  <li className="h-3 w-2/3 rounded bg-gray-200" />
                  <li className="h-3 w-1/2 rounded bg-gray-200" />
                </ul>
              </div>
            </div>

            <div className="rounded-[28px] p-5">
              <div className="h-5 w-36 rounded bg-gray-200 mb-3" />
              <div className="h-3 w-full rounded bg-gray-200 mb-2" />
              <div className="h-3 w-5/6 rounded bg-gray-200" />
            </div>

            <div className="hidden gap-3 sm:grid sm:grid-cols-2">
              <div className="h-11 w-full rounded bg-gray-200" />
              <div className="h-11 w-full rounded bg-gray-200" />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-3 lg:mt-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(420px,1.15fr)] lg:items-start">
          <div className="space-y-3 text-lg">
            <div className="h-5 w-40 rounded bg-gray-200 mb-4" />
            <div className="space-y-3">
              <div className="h-4 w-56 rounded bg-gray-200" />
              <div className="h-3 w-full rounded bg-gray-200" />
            </div>

            <div className="space-y-3">
              <div className="h-4 w-56 rounded bg-gray-200" />
              <div className="h-3 w-full rounded bg-gray-200" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="aspect-video w-full rounded bg-gray-200 animate-pulse" />
          </div>
        </div>

        <div className="mt-10 sm:mt-12">
          <div className="mb-5 flex items-center justify-center">
            <div className="h-8 w-48 rounded bg-gray-200" />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="group relative aspect-[3/4] overflow-hidden rounded-[24px] border bg-gray-200" />
                <div className="h-4 w-full rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
