export interface CardDataDto {
  id: number;
  categories: string[];
  materials: string[];
  images: string[];
  title: string;
  description: string;
  price: number;
  created_at?: string;
  updated_at?: string;
  available?: boolean;
  length: number;
  width: number;
  weight: number;
}

export interface DeliveryAddressDto {
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

// export interface DeliveryAddressDto {
//   [key: string]: DeliveryDataDto;
// }

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

export interface CityDetailDto {
  code: number;
  city_uuid: string;
  city: string;
  kladr_code: string;
  country_code: string;
  country: string;
  region: string;
  region_code: number;
  sub_region: string;
  longitude: number;
  latitude: number;
  time_zone: string;
  payment_limit: number;
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

export interface DeliveryDto {
  id?: number;
  delivery_self?: boolean | null;
  delivery_address?: DeliveryAddressDto | null;
  delivery_cost?: string | null;
  delivery_office?: string | null;
  delivery_tariff_code?: string | null;
  delivery_name?: string | null;
  delivery_office_detail?: OfficeDto | null;
  min_delivery_time?: number | null;
  max_delivery_time?: number | null;
}

export interface ChangeUserDto {
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  email?: string;
  phone_number?: string;
  password?: string;
}

export interface ReceiverDto {
  name: string | null;
  phone: string | null;
  email: string | null;
}

export interface PaymentDto {
  id: number;
  amount: string;
  created_at: string;
  status: string;
  payment_id: string;
}

export interface OrderDto {
  id: number;
  user: number;
  recipient_name: string;
  recipient_phone: string;
  recipient_email: string;
  delivery_status: string;
  delivery: DeliveryDto;
  payment_status: string;
  payment_id: PaymentDto;
  postcards: CardDataDto[];
  created_at: string;
  postcards_total?: number;
}
export interface UserTokenDTO {
  user: RegistrationData;
  refresh: string;
  access: string;
}

export interface UserDataDTO {
  id?: number;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  is_staff?: boolean;
}

// export interface ChangeUser {
//   first_name?: string;
//   last_name?: string;
//   email?: string;
//   is_staff?: boolean;
//   password?: string;
// }

export interface RegistrationData {
  email: string;
  id: number;
  is_staff: boolean;
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  phone_number?: string;
}
