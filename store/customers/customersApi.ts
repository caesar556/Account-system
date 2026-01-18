import { apiSlice } from "../apiSlice";

export const customersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // =========================
    // Customers (CRUD)
    // =========================
    getCustomers: builder.query<any[], void>({
      query: () => "/customers",
      providesTags: ["Customers"],
    }),

    getCustomer: builder.query<any, string>({
      query: (id) => `/customers/${id}`,
      providesTags: (result, error, id) => [{ type: "Customers", id }],
    }),

    createCustomer: builder.mutation<any, any>({
      query: (body) => ({
        url: "/customers",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Customers"],
    }),

    updateCustomer: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/customers/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Customers", id },
        "Customers",
        "Statements",
      ],
    }),

    deleteCustomer: builder.mutation<any, string>({
      query: (id) => ({
        url: `/customers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customers", "Statements", "Transactions", "CustomerRecords"],
    }),


    getCustomerStatement: builder.query<any, string>({
      query: (id) => `/customers/${id}/statement`,
      providesTags: (result, error, id) => [
        { type: "Statements", id },
        "Customers",
        "Transactions",
        "CustomerRecords",
      ],
    }),



    getCustomerTransactions: builder.query<any[], string>({
      query: (id) => `/customers/${id}/transactions`,
      providesTags: (result, error, id) => [
        { type: "Transactions", id },
      ],
    }),



    
    getCustomerRecords: builder.query<any[], string>({
      query: (customerId) => `/customer-records?customerId=${customerId}`,
      providesTags: (result, error, id) => [
        { type: "CustomerRecords", id },
      ],
    }),

    createCustomerRecord: builder.mutation<any, any>({
      query: (body) => ({
        url: "/customer-records",
        method: "POST",
        body,
      }),
      invalidatesTags: ["CustomerRecords", "Statements", "Transactions", "Customers"],
    }),

    updateCustomerRecord: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/customer-records/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "CustomerRecords", id },
        "CustomerRecords",
        "Statements",
      ],
    }),

    deleteCustomerRecord: builder.mutation<any, string>({
      query: (id) => ({
        url: `/customer-records/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CustomerRecords", "Statements", "Transactions"],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useGetCustomerStatementQuery,
  useGetCustomerTransactionsQuery,
  useGetCustomerRecordsQuery,
  useCreateCustomerRecordMutation,
  useUpdateCustomerRecordMutation,
  useDeleteCustomerRecordMutation,
} = customersApi;