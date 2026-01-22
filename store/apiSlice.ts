import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include",
  }),
  tagTypes: ["Transactions", "Treasury", "Analytics", "Customers", "Statements", "CustomerRecords"],
  endpoints: (builder) => ({
    getStatement: builder.query<{
      customer: { _id: string; name: string; phone: string };
      statement: Array<{
        id: string;
        date: string;
        type: "INVOICE" | "PAYMENT" | "TRANSACTION";
        title: string;
        description?: string;
        debit: number;
        credit: number;
        balance: number;
        referenceId?: string;
      }>;
      currentBalance: number;
    }, string>({
      query: (id) => `/customers/${id}/statement`,
      providesTags: (result, error, id) => [{ type: "Statements", id }],
    }),
  }),
});

export const { useGetStatementQuery } = apiSlice;

