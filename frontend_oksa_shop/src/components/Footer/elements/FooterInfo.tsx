import React from "react";

type Props = {};

export default function FooterInfo({}: Props) {
  return (
    <div className="footer_info">
      <div className="footer_info_pages">
        <p>Информация:</p>
        <p> Обо мне </p>
        <p>Корзина</p>
        <p> Каталог </p>
        <p>Доставка</p>
        <p>Оплата</p>
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
