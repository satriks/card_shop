import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import {
  ChangeUserDto,
  DeliveryDto,
  ReceiverDto,
  UserDataDTO,
  UserTokenDTO,
} from "../models/models";
import { validatePassword } from "./validators";

const connect = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:8000/",
});

//login, get token
export const loginApi = async (email: string, password: string) => {
  try {
    const access = await connect
      .post("api/login/", { email, password })
      .then((response) => {
        const { access, refresh } = response.data;
        Cookies.set("_wp_kcrt", refresh, { expires: 30 });
        return [response.status, access];
      });
    return access;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.message);
    } else {
      // Обработка случая, если ошибка не является AxiosError
      console.error("Неизвестная ошибка:", error);
      throw new Error("Неизвестная ошибка");
    }
  }
};
// refresh token
export const refreshApi = async (refresh: string) => {
  try {
    const response = await connect.post("api/token/refresh/", {
      refresh: refresh,
    });
    if (response.status === 200) {
      const { refresh } = response.data;

      Cookies.set("_wp_kcrt", refresh, { expires: 30 });
      return response; // Возвращаем response
    }
  } catch (error: AxiosError | unknown) {
    if (error instanceof AxiosError) {
      // Если статус 401, удаляем токен
      if (error.response && error.response.status === 401) {
        Cookies.remove("_wp_kcrt");
      }
      console.error("Ошибка при обновлении:", error.message);
    } else {
      console.error("Неизвестная ошибка:", error);
    }
    throw new Error(
      error instanceof Error ? error.message : "Ошибка при обновлении токена"
    );
  }
};

//Registration user
export const registrationApi = async (
  email: string,
  password: string,
  firstName: string = "",
  lastName: string = "",
  middleName: string = "",
  phone: string = ""
): Promise<[number, UserTokenDTO]> => {
  const requestData: ChangeUserDto = {
    email: email,
    first_name: firstName,
    last_name: lastName,
    phone_number: phone,
    middle_name: middleName,
  };
  if (validatePassword(password)) {
    requestData.password = password;
  }

  validatePassword(password);
  try {
    const response = await connect.post("api/register/", requestData);

    Cookies.set("_wp_kcrt", response.data.refresh, { expires: 30 });

    return [response.status, response.data];
  } catch (error) {
    // Обработка ошибок
    if (error instanceof AxiosError) {
      // Проверяем, является ли ошибка экземпляром AxiosError
      console.error("Ошибка ответа:", error.response?.data);
      let mess;
      if (error.response?.data.email) {
        mess = error.response?.data.email;
      } else {
        mess = error.response?.data;
      }

      console.error("Статус:", error.response?.status);
      throw new Error(mess);
    }
    throw new Error("Произошла ошибка при регистрации");
  }
};

//Get user
export const getUserApi = async (token: string): Promise<UserDataDTO> => {
  try {
    const response = await connect.get("api/user/", {
      headers: { Authorization: "Bearer " + token }, // Используйте Bearer для JWT
    });

    return response.data; // Возвращаем данные
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Ошибка при получении пользователей:", error);
      throw new Error(
        error.response?.data?.message || "Ошибка при получении пользователей"
      );
    } else {
      console.error("Неизвестная ошибка:", error);
      throw new Error("Неизвестная ошибка при получении пользователей");
    }
  }
};
//Update user
export const updateUserApi = (token: string, body: ChangeUserDto) => {
  return connect.patch(`api/user/profile/`, body, {
    headers: { Authorization: "Bearer " + token },
  });
};

//Get delivers
export const getDeliversApi = async (token: string) => {
  try {
    const response = await connect.get(`sdek/deliveries/`, {
      headers: { Authorization: "Bearer " + token },
    });

    // Проверяем, успешно ли выполнен запрос
    if (response.status === 200) {
      return response.data; // Возвращаем данные адресов
    } else {
      throw new Error(`Ошибка при получении адресов: ${response.status}`);
    }
  } catch (error) {
    console.error("Ошибка:", error);
    throw error; // Пробрасываем ошибку дальше
  }
};

//Create address
export const createAddress = async (token: string, data: DeliveryDto) => {
  try {
    const response = await connect.post(`sdek/deliveries/`, data, {
      headers: { Authorization: "Bearer " + token },
    });

    // Проверяем, успешно ли выполнен запрос
    if (response.status === 201) {
      return response.data; // Возвращаем данные адресов
    } else {
      throw new Error(`Адрес создан: ${response.status}`);
    }
  } catch (error) {
    console.error("Ошибка:", error);
    throw error; // Пробрасываем ошибку дальше
  }
};

//Delete address
export const deleteAddress = async (token: string, id: number) => {
  try {
    const response = await connect.delete(`sdek/deliveries/${id}/`, {
      headers: { Authorization: "Bearer " + token },
    });
    // Проверяем, успешно ли выполнен запрос
    if (response.status === 204) {
      return response;
    } else {
      throw new Error(`Шибка: ${response.status}`);
    }
  } catch (error) {
    console.error("Ошибка:", error);
    throw error; // Пробрасываем ошибку дальше
  }
};

// Reset password
type PasswordResetResponse = { message: string } | { error: string };
export const resetPasswordApi = async (
  email: string
): Promise<[number, PasswordResetResponse]> => {
  try {
    const response = await connect.post("api/password_reset/", { email });
    return [response.status, response.data];
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Ошибка при сбросе пароля:", error);
      throw new Error(
        error.response?.data?.message || "Ошибка при сбросе пароля"
      );
    } else {
      console.error("Неизвестная ошибка:", error);
      throw new Error("Неизвестная ошибка при сбросе пароля");
    }
  }
};

export const getOrderApi = async (
  token: string = "",
  receiver: ReceiverDto,
  delivery: DeliveryDto,
  cartItems: number[]
): Promise<
  [
    number,
    {
      payment_url: string;
    }
  ]
> => {
  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
  };
  // Если токен предоставлен, добавляем заголовок авторизации
  if (token) {
    headers.Authorization = "Bearer " + token;
  }
  try {
    const response = await connect.post(
      "payments/create/",
      {
        receiver,
        delivery,
        cart: cartItems,
      },
      { headers }
    );
    return [response.status, response.data];
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Ошибка при создании платежа:", error);
      throw new Error(
        error.response?.data?.message || "Ошибка при создании платежа"
      );
    } else {
      console.error("Неизвестная ошибка:", error);
      throw new Error("Неизвестная ошибка при создании платежа");
    }
  }
};
