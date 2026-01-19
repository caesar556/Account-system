import { apiSlice } from "@/store/apiSlice";

export const customersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // =========================
    // Get All Customers
    // =========================
    getCustomers: builder.query<any[], void>({
      query: () => "/customers",
      providesTags: (result) =>
        result
          ? [
              ...result.map((c) => ({
                type: "Customers" as const,
                id: c._id,
              })),
              { type: "Customers", id: "LIST" },
            ]
          : [{ type: "Customers", id: "LIST" }],
    }),

    // =========================
    // Get One Customer
    // =========================
    getCustomerById: builder.query<any, string>({
      query: (customerId) => `/customers/${customerId}`,
      providesTags: (result, error, id) => [{ type: "Customers", id }],
    }),

    // =========================
    // Create Customer
    // =========================
    createCustomer: builder.mutation<any, Partial<any>>({
      query: (body) => ({
        url: "/customers",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Customers", id: "LIST" }],
    }),

    // =========================
    // Update Customer
    // =========================
    updateCustomer: builder.mutation<any, { id: string; body: Partial<any> }>({
      query: ({ id, body }) => ({
        url: `/customers/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Customers", id },
        { type: "Customers", id: "LIST" },
      ],
    }),

    // =========================
    // Delete Customer
    // =========================
    deleteCustomer: builder.mutation<any, string>({
      query: (id) => ({
        url: `/customers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Customers", id },
        { type: "Customers", id: "LIST" },
      ],
    }),

    // =========================
    // Customer Statement
    // =========================
    getCustomerStatement: builder.query<
      {
        currentBalance: number;
        statement: any[];
      },
      string
    >({
      query: (customerId) => `/customers/${customerId}`,
      providesTags: (result, error, customerId) => [
        { type: "Statements", id: customerId },
      ],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useGetCustomerStatementQuery,
} = customersApi;
