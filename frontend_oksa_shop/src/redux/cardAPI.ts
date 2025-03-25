import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CardDataDto } from "../models/models";

export const cardApi = createApi({
  reducerPath: "cardApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
  endpoints: (build) => ({
    getCard: build.query({
      query: () => "cards/postcards/",
    }),
    getCity: build.query({
      query: (params) => `sdek/city/?city_name=${params}`,
    }),
    getCityDetail: build.query({
      query: (params) => `sdek/city/detail/?city_code=${params}`,
    }),
    getOffices: build.query({
      query: (params) => `sdek/offices/?city_code=${params}`,
    }),
    getTariffs: build.query({
      query: (params) => `sdek/tariff/?city_code=${params}`,
    }),
  }),
});

export const {
  useGetCardQuery,
  useGetCityQuery,
  useLazyGetCityQuery,
  useLazyGetCityDetailQuery,
  useLazyGetOfficesQuery,
  useLazyGetTariffsQuery,
} = cardApi;
