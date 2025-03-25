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
