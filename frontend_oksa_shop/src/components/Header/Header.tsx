import "./Header.scss";
import logo from "../../assets/header/ava.png";
import burger from "../../assets/header/burger.png";
import Search from "./elements/Search/Search";
import Catalog from "./elements/Catalog/Catalog";
import { setUserInfo } from "../../redux/MainSlice";
import { useAppDispatch, useAppSelector } from "../../models/hooks";

export interface IAppProps {}

export function Header(props: IAppProps) {
  const cartCount = useAppSelector((state) => state.store.cart.items.length);
  const dispatch = useAppDispatch();

  return (
    <div className="header_wrapper">
      <div className="header_main">
        <img src={logo} alt="логотип магазина открыток" className="logo" />
        <p className="header_title">Kailin card</p>
        <Search />
        <Catalog />
        <div className="header_cart">
          <button className="header_cart_button"></button>
          {Boolean(cartCount) && (
            <div className="header_cart_counter">{cartCount}</div>
          )}
        </div>
        <div className="header_user" onClick={() => dispatch(setUserInfo())}>
          <button className="header_user_button"></button>
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
