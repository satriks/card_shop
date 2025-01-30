import "./Header.scss";
import logo from "../../assets/header/ava.png";
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
        <button className="header_cart_button"></button>
        <button className="header_user_button"></button>
      </div>
    </div>
  );
}
