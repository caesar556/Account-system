import { apiSlice } from "../apiSlice";

export const transactionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.query<any[], void>({
      query: () => "/transactions",
      providesTags: ["Transactions"],
    }),

    createTransaction: builder.mutation<any, any>({
      query: (body) => ({
        url: "/transactions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Transactions", "Treasury", "Analytics"],
    }),

    
  }),
});

export const {
  useGetTransactionsQuery,
  useCreateTransactionMutation,
} = transactionsApi;
