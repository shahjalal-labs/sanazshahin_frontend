import baseApi from "./baseApi";

const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotificationsOptions: builder.query({
      query: () => ({
        url: `/notification/options`,
        method: "GET",
      }),
      providesTags: ["Notification"],
    }),

    toggleNotificationOption: builder.mutation({
      query: (option) => ({
        url: `/notification/toggle`,
        method: "PUT",
        body: option,
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetNotificationsOptionsQuery,
  useToggleNotificationOptionMutation,
} = notificationApi;
