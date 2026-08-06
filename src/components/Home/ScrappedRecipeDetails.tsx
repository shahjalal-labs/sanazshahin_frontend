"use client";

import { useGetScrappedRecipeDetailsQuery } from "@/redux/api/mealApi";

const ScrappedRecipeDetails = ({ name }: { name: string }) => {
  const { data, isLoading, isError } = useGetScrappedRecipeDetailsQuery(name);
  console.log(data);
  return <div>sdfsdfsdfsf</div>;
};

export default ScrappedRecipeDetails;
