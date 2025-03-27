export interface CardDataDto {
  content: string;
  title: string;
  id: number;
  images: string[];
  categories: string[];
  materials: string[];
  price: number;
  width: number;
  length: number;
}

export interface DeliveryDataDto {
  code?: number | undefined;
  city_uuid?: string | undefined;
  city?: string | undefined;
  country_code?: string | undefined;
  country?: string | undefined;
  region?: string | undefined;
  region_code?: number | undefined;
  sub_region?: string | undefined;
  longitude?: number | undefined;
  latitude?: number | undefined;
  time_zone?: string | undefined;
  address?: string | undefined;
  postal_code?: string | undefined;
}

export interface DeliveryAddressDto {
  [key: string]: string | DeliveryDataDto;
}

export interface TariffDto {
  calendar_max: number;
  calendar_min: number;
  delivery_mode: number;
  delivery_sum: number;
  period_max: number;
  period_min: number;
  tariff_code: number;
  tariff_description: string;
  tariff_name: string;
}

export interface CityDataDto {
  city_uuid: string;
  code: number;
  full_name: string;
}

export interface OfficeDto {
  code: string;
  name: string;
  uuid: string;
  address_comment: string;
  work_time: string;
  phones: [
    {
      number: string;
    }
  ];
  email: string;
  note: string;
  type: string;
  owner_code: string;
  take_only: boolean;
  is_handout: boolean;
  is_reception: boolean;
  is_dressing_room: boolean;
  is_ltl: boolean;
  have_cashless: boolean;
  have_cash: boolean;
  have_fast_payment_system: boolean;
  allowed_cod: boolean;
  site: string;
  work_time_list: [
    {
      day: number;
      time: string;
    },
    {
      day: number;
      time: string;
    },
    {
      day: number;
      time: string;
    },
    {
      day: number;
      time: string;
    },
    {
      day: number;
      time: string;
    },
    {
      day: number;
      time: string;
    },
    {
      day: number;
      time: string;
    }
  ];
  work_time_exception_list: [];
  weight_min: number;
  weight_max: number;
  location: {
    country_code: string;
    region_code: number;
    region: string;
    city_code: number;
    city: string;
    postal_code: string;
    longitude: number;
    latitude: number;
    address: string;
    address_full: string;
    city_uuid: string;
  };
  fulfillment: boolean;
}

export interface GeoObjectCollectionDto {
  country_code: string;
  formatted: string;
  postal_code: string;
  Components: [
    {
      kind: "country";
      name: string;
    },
    {
      kind: "province";
      name: string;
    },
    {
      kind: "province";
      name: string;
    },
    {
      kind: "area";
      name: string;
    },
    {
      kind: "locality";
      name: string;
    },
    {
      kind: "street";
      name: string;
    },
    {
      kind: "house";
      name: string;
    }
  ];
}
// export interface User {
//   id: number;
//   username: string;
//   first_name: string;
//   last_name: string;
//   email: string;
//   is_staff: boolean;
//   files: File_data[];
//   date_joined: string;
// }

// export interface ChangeUser {
//   first_name?: string;
//   last_name?: string;
//   email?: string;
//   is_staff?: boolean;
//   password?: string;
// }

// export interface RegistrationData {
//   username: string;
//   password: string;
//   email: string;
//   firstName: string;
//   lastName: string;
// }
