import { apiSlice } from "@/store/apiSlice";

export const customersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<any, void>({
      query: () => "/customers",
      providesTags: ["Customers"],
    }),

    createCustomer: builder.mutation<any, any>({
      query: (data) => ({
        url: "/customers",
        method: "POST",
        body: data,
      }),
    }),

    getCustomerStatement: builder.query<any, string>({
      query: (customerId) => `/customers/${customerId}/statement`,
      providesTags: ["Statements"],
    }),

    getCustomerSummary: builder.query<any, string>({
      query: (customerId) => `/customers/${customerId}/summary`,
      providesTags: ["Statements"],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useCreateCustomerMutation,
  useGetCustomerStatementQuery,
  useGetCustomerSummaryQuery,
} = customersApi;
