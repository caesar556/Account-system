import { CreateObligationInput, Obligation } from "@/lib/types/obligation";
import { apiSlice } from "../apiSlice";

const obligationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getObligations: builder.query<
      Obligation[],
      { status?: "OPEN" | "DONE"; overdue?: boolean } | void
    >({
      query: (params) => {
        if (!params) return "/obligations";

        const query = new URLSearchParams();

        if (params.status) query.append("status", params.status);
        if (params.overdue) query.append("overdue", "true");

        return `/obligations?${query.toString()}`;
      },
      providesTags: ["Obligation"],
    }),

    createObligation: builder.mutation<Obligation, CreateObligationInput>({
      query: (body) => ({
        url: "/obligations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Obligation"],
    }),

    markObligationDone: builder.mutation<Obligation, string>({
      query: (id) => ({
        url: `/obligations/${id}/done`,
        method: "POST",
      }),
      invalidatesTags: ["Obligation"],
    }),

    reopenObligation: builder.mutation<Obligation, string>({
      query: (id) => ({
        url: `/obligations/${id}/reopen`,
        method: "POST",
      }),
      invalidatesTags: ["Obligation"],
    }),

    deleteObligation: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/obligations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Obligation"],
    }),
  }),
});

export const {
  useGetObligationsQuery,
  useCreateObligationMutation,
  useMarkObligationDoneMutation,
  useReopenObligationMutation,
  useDeleteObligationMutation,
} = obligationsApi;
