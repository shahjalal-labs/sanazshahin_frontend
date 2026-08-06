import baseApi from "./baseApi";

const mealApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAvailableRecipes: builder.query({
      query: () => ({
        url: `/meal-plan/available/recipes`,
        method: "GET",
      }),
      providesTags: ["meal"],
    }),
    getAvailableScrappedRecipes: builder.query({
      query: ({page,search}) => ({
        url: `/recipe/scraped-recipes?page=${page}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["meal"],
    }),
    getScrappedRecipeDetails: builder.query({
      query: (name) => ({
        url: `/recipe/scraped-recipes/details/${name}`,
        method: "GET",
      }),
      providesTags: ["meal"],
    }),

    getUserMealPlans: builder.query({
      query: () => ({
        url: `/meal-plan/my/meal-plans`,
        method: "GET",
      }),
      providesTags: ["meal"],
    }),

    createMealRecipe: builder.mutation({
      query: (payload) => ({
        url: `/meal-plan/create`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["meal"],
    }),

    mealPlanGenerate: builder.mutation({
      query: (recipeId) => ({
        url: `/meal-plan/generate/${recipeId}`,
        method: "POST",
      }),
      invalidatesTags: ["meal"],
    }),
  }),
});

export const {
  useGetAvailableRecipesQuery,
  useGetUserMealPlansQuery,
  useCreateMealRecipeMutation,
  useMealPlanGenerateMutation,
  useGetAvailableScrappedRecipesQuery,
  useGetScrappedRecipeDetailsQuery,
} = mealApi;
