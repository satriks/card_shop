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
  code?: number;
  city_uuid?: string;
  city?: "string";
  country_code?: "string";
  country?: "string";
  region?: "string";
  region_code?: number;
  sub_region?: "string";
  longitude?: number;
  latitude?: number;
  time_zone?: "string";
  address?: "string";
  postal_code?: "string";
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
