import "./Header.scss";
import logo from "../../assets/header/ava.png";
import burger from "../../assets/header/burger.png";
import Search from "./elements/Search/Search";
import Catalog from "./elements/Catalog/Catalog";

export interface IAppProps {}

export function Header(props: IAppProps) {
  return (
    <div className="header_wrapper">
      <div className="header_main">
        <img src={logo} alt="логотип магазина открыток" className="logo" />
        <p className="header_title">Kailin card</p>
        <Search />
        <Catalog />
        <div className="header_cart">
          <button className="header_cart_button"></button>
          <div className="header_cart_counter">3</div>
        </div>
        <div className="header_user">
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
