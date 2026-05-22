import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL_LOCAL,
    // baseUrl: "https://api.reviewlift.net/api/v1",
    // base api
    prepareHeaders: (headers) => {
      const token = Cookies.get("token") || Cookies.get("accessToken");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      } else {
      }
      // hello
      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: ["testdata", "User", "Recipe"],
});

export default baseApi;
