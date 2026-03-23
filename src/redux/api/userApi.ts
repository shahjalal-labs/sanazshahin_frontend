import baseApi from "./baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyProfile: builder.query({
      query: () => ({
        url: `/auth/profile`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: `/auth/set-profile`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    sendContact: builder.mutation({
      query: (data) => ({
        url: `/contact`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    resetPasswordSentOtp: builder.mutation({
      query: (data) => ({
        url: `/auth/send-otp`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    resetPasswordVerifyOtp: builder.mutation({
      query: (data) => ({
        url: `/auth/verify-otp`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    resetPassword: builder.mutation({
      query: ({ newPassword, forgetToken }) => ({
        url: `/auth/reset-password`,
        method: "PATCH",
        body: {newPassword},
        headers: {
          Authorization: `${forgetToken}`, 
        },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetMyProfileQuery,
  useUpdateProfileMutation,
  useSendContactMutation,
  useResetPasswordSentOtpMutation,
  useResetPasswordVerifyOtpMutation,
  useResetPasswordMutation,
} = userApi;
