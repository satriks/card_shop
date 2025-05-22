import React from "react";
import "./PageNotFound.scss";
import pageImage from "../../assets/PageNotFound/404.png";
import { useAppDispatch } from "../../models/hooks";
import { setPageNotFound } from "../../redux/MainSlice";

type Props = {};

export default function PageNotFound({}: Props) {
  const dispatch = useAppDispatch();
  return (
    <div className="page_not_found_wrapper">
      <div className="page_not_found">
        <div className="page_not_found_img">
          <img src={pageImage} alt="девочка в центре а в округ суматоха" />
        </div>
        <div className="page_not_found_info">
          <h1>404</h1>
          <p>К сожалению такой страницы не существует </p>
          <button
            onClick={() => {
              dispatch(setPageNotFound(false));
              window.location.replace("/");
            }}
          >
            вернуться на главную страницу
          </button>
        </div>
      </div>
    </div>
  );
}
