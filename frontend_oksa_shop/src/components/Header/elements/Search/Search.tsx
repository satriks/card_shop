import "./Search.scss";
import searchImg from "../../../../assets/header/search.png";

type Props = {};

function Search({}: Props) {
  return (
    <div className="header_search_wrapper">
      <input type="filter" className="header_search" placeholder="поиск" />
      <img src={searchImg} alt="" className="header_search_img" />
    </div>
  );
}

export default Search;
