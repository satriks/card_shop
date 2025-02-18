import React from "react";
import "./CartDelivery.scss";

type Props = {};

export default function CartDelivery({}: Props) {
  return (
    <div className="cart_delivery_active">
      <h2>Детали доставки</h2>
      <button>изменить способ доставки</button>
      <div className="cart_delivery_address">
        <h3>адрес</h3>
        <p className="cart_delivery_main">ул.Доставочная. д 20 </p>
        <p className="cart_delivery_address_additional">
          5 под 15 этаж кв 657б домофон 1748
        </p>
      </div>
      <div className="cart_delivery_price">2000 Р</div>
      <div className="cart_delivery_time_label">Срок доставки</div>
      <div className="cart_delivery_time">1 -3 дня</div>
    </div>
  );
}
