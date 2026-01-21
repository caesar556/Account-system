import { AnalyticsResponse } from "@/lib/types/analytics";
import { apiSlice } from "./apiSlice";

export const analyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAnalytics: builder.query<
      AnalyticsResponse,
      { from?: string; to?: string; treasuryId?: string }
    >({
      query: (params) => ({
        url: "/analytics",
        params,
      }),
      providesTags: ["Analytics"],
    }),
  }),
});

export const { useGetAnalyticsQuery } = analyticsApi;
