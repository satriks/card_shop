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

export const formatDate = (
  dateString: string,
  minute: boolean = false
): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  if (minute) {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  } else {
    return `${day}.${month}.${year}`;
  }
};

export const deliveryDate = (day: string, shift: number): string => {
  const date = new Date(day);
  date.setDate(date.getDate() + shift);
  return formatDate(date.toDateString());
};
// export const setAddress = (address: DeliveryDto) => {
//   const dispatch = useAppDispatch();
// }
