import "./Header.scss";
import logo from "../../assets/header/ava.png";
import burger from "../../assets/header/burger.png";
import Search from "./elements/Search/Search";
import Catalog from "./elements/Catalog/Catalog";
import {
  setActiveCart,
  setCardDetail,
  setDelivery,
  setUserInfo,
} from "../../redux/MainSlice";
import { useAppDispatch, useAppSelector } from "../../models/hooks";
import { useState } from "react";
import AuthForm from "./elements/AuthForm/AuthForm";

export function Header() {
  const [auth, setAuth] = useState(false);
  const cartCount = useAppSelector((state) => state.store.cart.items.length);
  const user = useAppSelector((state) => state.store.user);
  const dispatch = useAppDispatch();
  const goToMain = () => {
    dispatch(setCardDetail(null));
    dispatch(setUserInfo(false));
    dispatch(setDelivery(false));
    dispatch(setActiveCart(false));
  };

  return (
    <div className="header_wrapper">
      <div className="header_main">
        <img
          src={logo}
          alt="логотип магазина открыток"
          className="logo"
          onClick={goToMain}
        />
        <p onClick={goToMain} className="header_title">
          Kailin_cards
        </p>
        <div>
          <h1 className="header_main_title">Магазин авторских открыток</h1>
        </div>
        {/* <Search /> */}
        <Catalog />
        {auth && <AuthForm onClose={setAuth} />}
        <div className="header_cart">
          <button
            className="header_cart_button"
            onClick={() => {
              dispatch(setActiveCart(true));
            }}
          ></button>
          {Boolean(cartCount) && (
            <div className="header_cart_counter">{cartCount}</div>
          )}
        </div>
        <div
          className="header_user"
          onClick={() => {
            if (user.isActive) {
              dispatch(setUserInfo(true));
            } else {
              setAuth(!auth);
            }
          }}
        >
          <button
            className={
              user.isActive
                ? "header_user_button header_user_button_online"
                : "header_user_button"
            }
          ></button>
          <img
            className="header_user_button_burger"
            src={burger}
            alt="пользователь"
          />
        </div>
      </div>
    </div>
  );
}
