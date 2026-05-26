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
        params: { page, limit },
      }),

      providesTags: ["Recipe"],
    }),

    toggleRecipeBookmark: builder.mutation({
      query: (recipeId) => ({
        url: `/recipe/toggle-bookmark/${recipeId}`,
        method: "POST",
      }),
      invalidatesTags: ["Recipe"],
    }),

    getRecipeBookmarks: builder.query<unknown, void>({
      query: () => ({
        url: `/recipe/user-bookmarks`,
        method: "GET",
      }),
      transformResponse: (response: { result?: unknown }) =>
        response?.result ?? response,
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
  useToggleRecipeBookmarkMutation,
  useGetRecipeBookmarksQuery,
} = recipeApi;
