import React from "react";
import { useAppDispatch, useAppSelector } from "../../../models/hooks";
import { setActiveCart, setDelivery } from "../../../redux/MainSlice";

type Props = {};

export default function FooterInfo({}: Props) {
  const dispatch = useAppDispatch();
  const adoutMeElement = useAppSelector((state) => state.store.aboutMe);
  const categoryElement = useAppSelector((state) => state.store.scrollTo);

  const scrollToAbout = () => {
    if (adoutMeElement.current) {
      const top =
        adoutMeElement.current.getBoundingClientRect().top + window.scrollY; // Получаем позицию элемента
      window.scrollTo({ top, behavior: "smooth" }); // Прокручиваем к элементу
    }
  };
  const scrollToCatrgory = () => {
    if (categoryElement) {
      const top = categoryElement.getBoundingClientRect().top + window.scrollY; // Получаем позицию элемента
      window.scrollTo({ top, behavior: "smooth" }); // Прокручиваем к элементу
    }
  };

  return (
    <div className="footer_info">
      <div className="footer_info_pages">
        <p>Информация:</p>
        <p onClick={scrollToCatrgory}> Каталог </p>
        <p onClick={scrollToAbout}> Обо мне </p>
        <p
          onClick={() => {
            dispatch(setDelivery(true));
          }}
        >
          Доставка
        </p>
        <p
          onClick={() => {
            dispatch(setActiveCart(true));
          }}
        >
          Корзина
        </p>

        {/* <p>Оплата</p> */}
      </div>
      <div className="footer_info_contacts">
        <p>Контакты:</p>
        <p>почта - email@email.ru </p>
        <p>тел - +7(910)105-31-32</p>
        <div>socials</div>
      </div>
    </div>
  );
}
