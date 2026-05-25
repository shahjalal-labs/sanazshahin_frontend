import baseApi from "./baseApi";

const recipeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createRecipe: builder.mutation({
      query: (data) => ({
        url: "/recipe/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Recipe"],
    }),

    updateMyRecipe: builder.mutation({
      query: (data) => ({
        url: "/recipe/update",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Recipe"],
    }),

    myRecipes: builder.query({
      query: ({ page, limit }) => ({
        url: `/recipe/my-recipes`,
        method: "GET",
      }),
      providesTags: ["Recipe"],
    }),

    myRecipeDetails: builder.query({
      query: (recipeId) => ({
        url: `/recipe/details/${recipeId}`,
        method: "GET",
      }),
      providesTags: ["Recipe"],
    }),

    deleteMyRecipe: builder.mutation({
      query: (recipeId) => ({
        url: `/recipe/${recipeId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Recipe"],
    }),

    getAllRecipes: builder.query({
      query: ({ page, limit }) => ({
        url: `/recipe/all`,
        method: "GET",
      }),
      providesTags: ["Recipe"],
    }),

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

export const {
  useCreateRecipeMutation,
  useUpdateMyRecipeMutation,
  useMyRecipesQuery,
  useMyRecipeDetailsQuery,
  useDeleteMyRecipeMutation,
  useGetAllRecipesQuery,
  useGetAllScrapedRecipesQuery,
  useRecipeDetailsQuery,
} = recipeApi;
