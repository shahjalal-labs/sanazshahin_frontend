import baseApi from "./baseApi";

const recipeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllScrapedRecipes: builder.query({
      query: ({ page = 1 }) => ({
        url: `/recipe/scraped-recipes?page=${page}`,
        method: "GET",
      }),
      providesTags: ["Recipe"],
    }),

    recipeDetails: builder.query({
      query: (name) => ({
        url: `/recipe/scraped-recipes/details/${name}`,
        method: "GET",
      }),
      providesTags: ["Recipe"],
    }),
  }),
});

export const { useGetAllScrapedRecipesQuery, useRecipeDetailsQuery } =
  recipeApi;
