import { apiSlice } from "@/store/apiSlice";

export const customersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query({
      query: () => "/customers",
      providesTags: ["Customers"],
    }),
    createCustomer: builder.mutation({
      query: (data) => ({
        url: "/customers",
        method: "POST",
        body: data,
      }),
    }),
    getCustomerStatement: builder.query({
      query: (customerId) => `/customers/${customerId}/statement`,
      providesTags: ["Statements"],
    }),
    payCustomerRecord: builder.mutation({
      query: ({ customerId, ...data }) => ({
        url: `/customers/${customerId}/pay`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Statements", "Customers"],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useCreateCustomerMutation,
  useGetCustomerStatementQuery,
  usePayCustomerRecordMutation,
} = customersApi;
