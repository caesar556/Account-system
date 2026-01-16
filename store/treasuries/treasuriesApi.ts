import { apiSlice } from "../apiSlice";

export const treasuriesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTreasuries: builder.query<any[], void>({
      query: () => "/treasuries",
      providesTags: ["Treasury"],
    }),
    createTreasury: builder.mutation<any, any>({
      query: (body) => ({
        url: "/treasuries",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Treasury"],
    }),
  }),
});

export const { useGetTreasuriesQuery, useCreateTreasuryMutation } = treasuriesApi;
