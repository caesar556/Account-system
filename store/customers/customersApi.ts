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

    getCustomerRecords: builder.query<any[], string>({
      query: (customerId) => `/customers/${customerId}/records`,
      providesTags: (result, error, id) => [{ type: "CustomerRecords", id }],
    }),

    getCustomersGlobalSummary: builder.query<{ totalCustomers: number; totalBalance: number }, void>({
      query: () => "/customers/summary",
      providesTags: ["Customers"],
    }),

    payRecord: builder.mutation<any, { customerId: string; recordId: string; amount: number; treasuryId: string; paymentMethod: string; description?: string }>({
      query: ({ customerId, ...body }) => ({
        url: `/customers/${customerId}/pay`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { customerId }) => [
        { type: "CustomerRecords", id: customerId },
        "Transactions",
        "Treasury",
        "Statements",
        "Customers"
      ],
    }),

    createCustomerRecord: builder.mutation<any, { customerId: string; title: string; totalAmount: number; description?: string; dueDate?: string }>({
      query: ({ customerId, ...body }) => ({
        url: `/customers/${customerId}/records`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { customerId }) => [
        { type: "CustomerRecords", id: customerId },
        "Statements",
        "Customers"
      ],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useCreateCustomerMutation,
  useGetCustomerStatementQuery,
  useGetCustomerSummaryQuery,
  useGetCustomersGlobalSummaryQuery,
  useGetCustomerRecordsQuery,
  usePayRecordMutation,
  useCreateCustomerRecordMutation,
} = customersApi;
