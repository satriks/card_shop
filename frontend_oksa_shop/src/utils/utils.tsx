import Cookies from "js-cookie";
import { setUserAccess, setUserActiveState } from "../redux/MainSlice";
import { useAppDispatch } from "../models/hooks";
import { refreshApi } from "./api";
// import { DeliveryDto } from "../models/models";

export const useRememberUser = () => {
  const dispatch = useAppDispatch();
  const token = Cookies.get("_wp_kcrt");
  const rememberUser = async () => {
    if (token) {
      try {
        const response = await refreshApi(token);
        // Проверка на успешность ответа
        if (response?.status == 200) {
          dispatch(setUserActiveState(true));
          dispatch(setUserAccess(response.data.access));
        } else {
          console.error("Ошибка обновления токена:", response?.message);
        }
      } catch (error) {
        console.error("Произошла ошибка при обновлении токена:", error);
      }
    } else {
      console.log("Токен отсутствует");
    }
  };
  return { rememberUser, token };
};

// export const setAddress = (address: DeliveryDto) => {
//   const dispatch = useAppDispatch();
// }
