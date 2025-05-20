import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com/' }),
  tagTypes: ['Products'],
  endpoints: (builder) => ({
    // گرفتن همه محصولات
    getProducts: builder.query({
      query: () => 'products?limit=100', // افزایش limit برای صفحه‌بندی سمت کلاینت
      providesTags: ['Products'],
    }),

    // گرفتن یک محصول خاص
    getProduct: builder.query({
      query: (id) => `products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Products', id }],
    }),

    // گرفتن لیست دسته‌بندی‌ها
    getCategories: builder.query({
      query: () => 'products/categories',
    }),

    // افزودن محصول جدید
    addProduct: builder.mutation({
      query: (newProduct) => ({
        url: 'products/add',
        method: 'POST',
        body: newProduct,
      }),
      invalidatesTags: ['Products'],
    }),

    // ویرایش محصول
    updateProduct: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `products/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Products'],
    }),

    // حذف محصول
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetCategoriesQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
