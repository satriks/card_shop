import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CardDataDto } from "../models/models";

export const cardApi = createApi({
  reducerPath: "cardApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3001/" }),
  endpoints: (build) => ({
    getCard: build.query({
      query: () => "cards",
    }),
  }),
});

export const { useGetCardQuery } = cardApi;
