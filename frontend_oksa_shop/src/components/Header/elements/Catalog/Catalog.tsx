import burger from "../../../../assets/header/burger.png";
import "./Catalog.scss";

type Props = {};

export default function Catalog({}: Props) {
  return (
    <div className="header_catalog">
      <img src={burger} alt="" />
      <p className="header_catalog_title">Каталог</p>
    </div>
  );
}
