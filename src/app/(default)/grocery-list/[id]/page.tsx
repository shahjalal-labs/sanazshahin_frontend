import GroceryListDetail from "@/components/GroceryList/GroceryListDetail";
import { getGroceryRecipeById } from "@/lib/grocery";
import { notFound } from "next/navigation";

interface GroceryDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function GroceryDetailPage({
  params,
}: GroceryDetailPageProps) {
  const { id } = await params;
  const recipeId = Number(id);
  const recipe = Number.isNaN(recipeId)
    ? undefined
    : getGroceryRecipeById(recipeId);

  if (!recipe) {
    notFound();
  }

  return <GroceryListDetail recipeId={recipeId} />;
}
