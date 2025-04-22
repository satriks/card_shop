import { useAppDispatch, useAppSelector } from "../../models/hooks";
import {
  setActiveCart,
  setDelivery,
  setUserAccess,
  setUserActiveState,
  setUserEmail,
  setUserFirstName,
  setUserInfo,
  setUserLastName,
  setUserMiddleName,
  setUserPhone,
} from "../../redux/MainSlice";
import "./UserPanel.scss";
import CancelButton from "../Common/CancelButton/cancelButton";
import UpdateUser from "./UpdateUser/UpdateUser";
import { useState } from "react";
import Cookies from "js-cookie";
import Orders from "./Orders/Orders";

type Props = {};

export default function UserPanel({}: Props) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.store.user);
  const delivery = useAppSelector((state) => state.store.delivery);
  const [updateUser, setUpdateUser] = useState(false);
  const [isOrders, setIsOrders] = useState(false);
  const isChange = () => {
    setUpdateUser(true);
  };
  const closeUserInfo = (e: React.MouseEvent) => {
    e.preventDefault();
    if ((e.target as HTMLElement).className == "userPanel_wrapper") {
      dispatch(setUserInfo(false));
    }
  };
  const clearUserData = () => {
    dispatch(setUserActiveState(false));
    dispatch(setUserAccess(null));
    dispatch(setUserFirstName(null));
    dispatch(setUserLastName(null));
    dispatch(setUserMiddleName(null));
    dispatch(setUserEmail(null));
    dispatch(setUserPhone(null));
    dispatch(setUserInfo(false));
    dispatch(setDelivery(false));
    dispatch(setActiveCart(false));
  };
  const logout = () => {
    Cookies.remove("_wp_kcrt");
    Cookies.remove("_da");
    clearUserData();
    dispatch(setUserInfo(false));
  };
  return (
    <div className="user_panel_wrapper" onClick={closeUserInfo}>
      <div className="user_panel">
        <h2>Личный кабинет </h2>
        <div className="userPanel_button_wrapper">
          <label>ФИО</label>
        </div>
        <button onClick={isChange}>
          {user.firstName || user.middleName || user.lastName
            ? `${user.firstName} ${user.middleName} ${user.lastName}`
            : "ФИО"}
        </button>

        <div className="userPanel_button_wrapper">
          <label>Телефон</label>
        </div>
        <button onClick={isChange}>{user.phone || "Телефон не указан"}</button>
        <div className="userPanel_button_wrapper">
          <label>Email</label>
        </div>
        <button onClick={isChange}>
          {user.email || "Электронный адрес не указан"}
        </button>
        <div className="userPanel_button_wrapper">
          <label>доставка</label>
        </div>

        <button
          onClick={() => {
            dispatch(setDelivery(true));
          }}
        >
          {delivery.deliveryName ? delivery.deliveryName : "Доставка"}
        </button>
        <button onClick={isChange}>Изменить пароль</button>
        <button onClick={() => setIsOrders(!isOrders)}>Мои заказы</button>
        <button onClick={logout}>Выход</button>
        <CancelButton
          onClick={() => {
            dispatch(setUserInfo(false));
          }}
        />
        {updateUser && <UpdateUser onClose={() => setUpdateUser(false)} />}
        {isOrders && <Orders onClose={setIsOrders} />}
      </div>
    </div>
  );
}
