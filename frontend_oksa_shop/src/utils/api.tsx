import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { ChangeUserDto, DeliveryDto } from "../models/models";
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

// //Get user detail
// export const getUserDetailApi = (token: string) => {
//   return connect
//     .get("api/users/detail", { headers: { Authorization: "token " + token } })
//     .then((response) => response.data);
// };

// //Get user
// export const getUserApi = (token: string, id: number | string) => {
//   return connect
//     .get(`api/users/${id}/`, {
//       headers: { Authorization: "token " + token },
//     })
//     .then((response) => response.data);
// };

// //Del user
// export const delUserApi = (token: string, id: number) => {
//   return connect.delete(`api/users/${id}/`, {
//     headers: { Authorization: "token " + token },
//   });
// };

// //Get files
// export const getFilesApi = (token: string) => {
//   return connect
//     .get("api/files/", { headers: { Authorization: "token " + token } })
//     .then((response) => response.data);
// };
// //Add file
// export const addFileApi = (
//   token: string,
//   body: { name: string; description?: string; file: File }
// ) => {
//   const formData = new FormData();
//   formData.append("name", body.name);
//   body.description && formData.append("description", body.description);
//   formData.append("file", body.file);

//   return connect.post(`api/files/`, formData, {
//     headers: {
//       Authorization: "token " + token,
//       "content-type": "multipart/form-data",
//     },
//   });
// };
// //Delete file
// export const deleteFileApi = (token: string, fileId: string | number) => {
//   return connect.delete(`api/files/${fileId}/`, {
//     headers: { Authorization: "token " + token },
//   });
// };
// //Update file
// export const updateFileApi = (
//   token: string,
//   fileId: string | number,
//   body: { name?: string; description?: string }
// ) => {
//   return connect.patch(`api/files/${fileId}/`, body, {
//     headers: { Authorization: "token " + token },
//   });
// };
