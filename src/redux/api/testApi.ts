import baseApi from "./baseApi";

const testApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTestData: builder.query({
      query: () => ({
        url: `/testdata`,
        method: "GET",

      }),
      providesTags: ["testdata"],
    }),
  }),
});

export const { useGetAllTestDataQuery } = testApi;