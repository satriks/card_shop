import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  CityDataDto,
  CityDetailDto,
  DeliveryDto,
  OfficeDto,
  OrderDto,
  TariffDto,
} from "../models/models";

export const cardApi = createApi({
  reducerPath: "cardApi",

  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
  endpoints: (build) => ({
    getCard: build.query({
      query: () => "cards/postcards/",
    }),
    getCity: build.query<CityDataDto[], string>({
      query: (params) => `sdek/city/?city_name=${params}`,
    }),
    getCityDetail: build.query<CityDetailDto[], number>({
      query: (params) => `sdek/city/detail/?city_code=${params}`,
    }),
    getOffices: build.query<OfficeDto[], number>({
      query: (params) => `sdek/offices/?city_code=${params}`,
    }),
    getTariffs: build.query<TariffDto[], number>({
      query: (params) => `sdek/tariff/?city_code=${params}`,
    }),
    getAddresses: build.query<DeliveryDto, void>({
      query: () => "sdek/deliveries/",
    }),
    getOrders: build.query<OrderDto[], void>({
      query: (token) => ({
        url: "orders/get/",
        headers: {
          Authorization: `Bearer ${token}`, // Замените yourToken на ваш токен
        },
      }),
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
  useGetOrdersQuery,
} = cardApi;
