import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { ChangeUserDto, DeliveryDto, ReceiverDto } from "../models/models";
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
  } catch (error: AxiosError) {
    if (error.response) {
      throw new Error(Object.values(error.response.data).flat()[0]);
    }
  }
};
// refresh token
export const refreshApi = async (refresh) => {
  try {
    const response = await connect.post("api/token/refresh/", {
      refresh: refresh,
    });
    if (response.status === 200) {
      const { access, refresh } = response.data;
      Cookies.set("_wp_kcrt", refresh, { expires: 30 });
      return response; // Возвращаем response
    }
  } catch (error) {
    // Проверяем статус ошибки, если он 401, удаляем токен
    if (error.response && error.response.status === 401) {
      Cookies.remove("_wp_kcrt");
    }
    console.error("Ошибка при обновлении:", error);
    throw new Error(error.message || "Ошибка при обновлении токена");
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
): Promise<[number, any]> => {
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
      console.error("Статус:", error.response?.status);
      throw new Error(error.response?.data.email);

      // } else if (error instanceof Error) {
      //   // Обработка других ошибок
      //   console.error("Ошибка:", error.message);
      //   throw new Error(`Ошибка регистрации: ${error.message}`);
      // } else {
      //   // Произошла ошибка, но она не является экземпляром Error
      //   console.error("Неизвестная ошибка:", error);
      //   throw new Error("Ошибка регистрации: Неизвестная ошибка");
      // }
    }
  }
};

//Get user
export const getUserApi = async (token: string): Promise<any> => {
  try {
    const response = await connect.get("api/user/", {
      headers: { Authorization: "Bearer " + token }, // Используйте Bearer для JWT
    });
    return response.data; // Возвращаем данные
  } catch (error) {
    console.error("Ошибка при получении пользователей:", error);
    throw new Error(
      error.response?.data?.message || "Ошибка при получении пользователей"
    );
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

// Create payment
// export const createPaymentApi = async (
//   receiver: string,
//   delivery: string,
//   cartItems: Array<{ id: number }>
// ): Promise<[number, any]> => {
//   try {
//     const response = await fetch("http://localhost:8000/payments/create/", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json; charset=utf-8",
//       },
//       body: JSON.stringify({
//         receiver,
//         delivery,
//         cart: cartItems.map((card) => card.id),
//       }),
//     });
//     // Проверяем, успешно ли выполнен запрос
//     if (!response.ok) {
//       throw new Error(`Ошибка при создании платежа: ${response.status}`);
//     }
//     const data = await response.json();
//     return [response.status, data];
//   } catch (error) {
//     console.error("Ошибка при создании платежа:", error);
//     throw new Error(error.message || "Ошибка при создании платежа");
//   }
// };

// Get Order

// export const getOrderApi = async (
//   token: string = "",
//   receiver: ReceiverDto,
//   delivery: DeliveryDto,
//   cartItems: number[]
// ): Promise<[number, any]> => {
//   const headers: { [key: string]: string } = {
//     "Content-Type": "application/json",
//   };
//   // Если токен предоставлен, добавляем заголовок авторизации
//   if (token) {
//     headers.Authorization = "Bearer " + token;
//   }
//   try {
//     const response = await fetch("http://localhost:8000/payments/create/", {
//       method: "POST",
//       headers: headers,
//       body: JSON.stringify({
//         receiver,
//         delivery,
//         cart: cartItems,
//       }),
//     });
//     if (!response.ok) {
//       throw new Error(`Ошибка при создании платежа: ${response.status}`);
//     }
//     const data = await response.json();
//     return [response.status, data];
//   } catch (error) {
//     console.error("Ошибка при создании платежа:", error);
//     throw new Error(error.message || "Ошибка при создании платежа");
//   }
// };

export const getOrderApi = async (
  token: string = "",
  receiver: ReceiverDto,
  delivery: DeliveryDto,
  cartItems: number[]
): Promise<[number, any]> => {
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
  } catch (error) {
    console.error("Ошибка при создании платежа:", error);
    throw new Error(
      error.response?.data?.message || "Ошибка при создании платежа"
    );
  }
};
