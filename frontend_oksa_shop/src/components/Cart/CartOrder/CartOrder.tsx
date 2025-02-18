import React from "react";
import "./CartOrder.scss";

import CartOrderCard from "./CartOrderCard/CartOrderCard";
import { useAppSelector } from "../../../models/hooks";

type Props = {};

export default function CartOrder({}: Props) {
  const order = useAppSelector((state) => state.store.cart.items);

  return (
    <div className="cart_order">
      <h2>Ваш заказ</h2>
      <div>
        <h3>Открытки</h3>
        {order.map((item) => (
          <CartOrderCard key={item.id} card={item} />
        ))}
      </div>
      <div className="cart_order_delivery">
        <h3>Доставка</h3>
        <div className="cart_order_delivery_detail">
          <p>Способ доставки</p>
          <p>2000 Р</p>
        </div>
      </div>
      <hr />
      <div className="cart_order_total">
        <h3>Итого</h3>
        <p>4000 Р</p>
      </div>
    </div>
  );
}
