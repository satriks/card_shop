import React from "react";
import "./CartOrder.scss";

import CartOrderCard from "./CartOrderCard/CartOrderCard";
import { useAppSelector } from "../../../models/hooks";

type Props = {};

export default function CartOrder({}: Props) {
  const order = useAppSelector((state) => state.store.cart.items);
  const user = useAppSelector((state) => state.store.delivery);
  const receiver = useAppSelector((state) => state.store.receiver);
  const getOrder = () => {
    console.log(42);
    console.log(receiver, " resiver");
  };

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
          <p>Доставка</p>
          <p>{user.deliveryCost} руб.</p>
        </div>
      </div>
      <hr />
      <div className="cart_order_total">
        <h3>Итого</h3>
        <p>
          {order.reduce((summ, card) => {
            return summ + card.price;
          }, user.deliveryCost)}{" "}
          руб.
        </p>
      </div>
      <button onClick={getOrder}>Заказать</button>
    </div>
  );
}
