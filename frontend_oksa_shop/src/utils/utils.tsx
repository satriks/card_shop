import Cookies from "js-cookie";
import { setUserActiveState } from "../redux/MainSlice";
import { useAppDispatch } from "../models/hooks";

export const useRememberUser = () => {
  const dispatch = useAppDispatch();
  const token = Cookies.get("_wp_kcrt");
  const remmemberUser = () => {
    if (token) {
      // Получение данных от сервера
      dispatch(setUserActiveState(true));
    }
    console.log(token);
  };
  return { remmemberUser, token };
};
