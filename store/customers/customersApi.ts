import { apiSlice } from "../apiSlice";

export const customersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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
      ],
    }),
    deleteCustomer: builder.mutation<any, string>({
      query: (id) => ({
        url: `/customers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customers"],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customersApi;
