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
  }),
});

export const {
  useGetAvailableRecipesQuery,
  useGetUserMealPlansQuery,
  useCreateMealRecipeMutation,
} = mealApi;
