import React from "react";
import "./CartReceiver.scss";

type Props = {};

export default function CartReceiver({}: Props) {
  return (
    <div className="cart_receiver">
      <h2>Получатель</h2>
      <div className="cart_receiver_people">
        <button className="active">я получу заказ</button>
        <button>другой получатель</button>
      </div>
      <div className="cart_receiver_form">
        <label>
          <p>
            Имя<span>*</span>
          </p>
          <input type="text" placeholder="Имя" />
        </label>
        <label>
          <p>
            Телефон<span>*</span>
          </p>
          <input type="text" placeholder="Телефон" />
        </label>
        <label>
          <p>
            Адрес электронной почты<span>*</span>
          </p>
          <input type="text" placeholder="Адрес электронной почты" />
          <span>На данный адрес будет отправлен электронный кассовый чек </span>
        </label>
      </div>
    </div>
  );
}
