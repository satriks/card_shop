import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CardDataDto } from "../models/models";

export const cardApi = createApi({
  reducerPath: "cardApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
  endpoints: (build) => ({
    getCard: build.query({
      query: () => "cards/postcards/",
    }),
  }),
});

export const { useGetCardQuery } = cardApi;
