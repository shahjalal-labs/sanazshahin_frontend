import GroceryListDetail from "@/components/GroceryList/GroceryListDetail";
interface GroceryDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function GroceryDetailPage({
  params,
}: GroceryDetailPageProps) {
  const { id } = await params;

  return <GroceryListDetail recipeId={id} />;
}
