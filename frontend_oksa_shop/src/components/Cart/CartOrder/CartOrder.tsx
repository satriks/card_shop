import React from "react";
import "./CartOrder.scss";

import CartOrderCard from "./CartOrderCard/CartOrderCard";
import { useAppSelector } from "../../../models/hooks";
import { getOrderApi } from "../../../utils/api";
import { DeliveryDto } from "../../../models/models";

type Props = {};

export default function CartOrder({}: Props) {
  const order = useAppSelector((state) => state.store.cart.items);
  const user = useAppSelector((state) => state.store.user);
  const receiver = useAppSelector((state) => state.store.receiver);
  const delivery = useAppSelector((state) => state.store.delivery);
  const cart = useAppSelector((state) => state.store.cart);

  const getOrder = async () => {
    const cardData = cart.items.map((card) => {
      return card.id;
    });

    const deliveryData: DeliveryDto = {
      delivery_self: delivery.deliverySelf,
      delivery_address: delivery.deliveryAddress,
      delivery_cost: String(delivery.deliveryCost),
      delivery_office: delivery.deliveryOffice,
      delivery_tariff_code: delivery.deliveryTariffCode,
      delivery_name: delivery.deliveryName,
      delivery_office_detail: delivery.deliveryOfficeDetail,
      min_delivery_time: delivery.deliveryTime.minDeliveryTime,
      max_delivery_time: delivery.deliveryTime.maxDeliveryTime,
    };

    const [responseStatus, response] = await getOrderApi(
      user.access || undefined,
      receiver,
      deliveryData,
      cardData
    );
    if (responseStatus === 200) {
      const data = await response.json();
      if (data.payment_url) {
        window.location.href = data.payment_url; // Перенаправление на страницу оплаты
      }
    }
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
          <p>{delivery.deliveryCost} руб.</p>
        </div>
      </div>
      <hr />
      <div className="cart_order_total">
        <h3>Итого</h3>
        <p>
          {order.reduce((summ, card) => {
            return summ + card.price;
          }, delivery.deliveryCost)}{" "}
          руб.
        </p>
      </div>
      <button onClick={getOrder}>Заказать</button>
    </div>
  );
}
