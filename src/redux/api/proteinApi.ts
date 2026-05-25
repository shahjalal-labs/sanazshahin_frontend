import baseApi from "./baseApi";

const proteinApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProteinCalculation: builder.mutation({
      query: (body) => ({
        url: `/calculate-protein`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Protein"],
    }),
  }),
});

export const { useGetProteinCalculationMutation } = proteinApi;
