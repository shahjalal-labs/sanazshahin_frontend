export const RecipeSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-square rounded-[18px] bg-gray-200" />

      {/* Title skeleton */}
      <div className="mt-3 flex flex-col items-center gap-2">
        <div className="h-4 w-3/4 rounded bg-gray-200" />
      </div>
    </div>
  );
};
