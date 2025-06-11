import "./CartOrder.scss";

import CartOrderCard from "./CartOrderCard/CartOrderCard";
import { useAppSelector } from "../../../models/hooks";
import { getOrderApi } from "../../../utils/api";
import { DeliveryDto } from "../../../models/models";
import ModalAlert from "../../Common/ModalAlert/ModalAlert";
import { useState } from "react";

export default function CartOrder() {
  const order = useAppSelector((state) => state.store.cart.items);
  const user = useAppSelector((state) => state.store.user);
  const receiver = useAppSelector((state) => state.store.receiver);
  const delivery = useAppSelector((state) => state.store.delivery);
  const cart = useAppSelector((state) => state.store.cart);
  const [alert, setAlert] = useState<string>();

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

    // проверка есть ли в корзине открытки
    if (cardData.length == 0) {
      setAlert("Нет ни одной открытки");
      return;
    }

    // проверка выбрана ли доставка
    if (!delivery.deliveryName) {
      setAlert("Не выбрана доставка");
      return;
    }
    //проверка выбран ли получатель
    const check_reciver = Object.values(receiver).every(
      (value) => value !== "" && value !== null
    );
    if (!check_reciver) {
      setAlert("Не выбран получатель ");
      return;
    }

    const [responseStatus, response] = await getOrderApi(
      user.access || undefined,
      receiver,
      deliveryData,
      cardData
    );

    if (responseStatus === 201) {
      if (response.payment_url) {
        window.location.href = response.payment_url; // Перенаправление на страницу оплаты
      }
    } else {
      console.error("Ошибка при создании заказа, статус:", responseStatus);
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
          <p>{delivery.deliveryName || "-"}</p>
          <p>{delivery.deliveryCost} руб.</p>
        </div>
      </div>
      <hr />
      <div className="cart_order_total">
        <h3>Итого</h3>
        <p>
          {order.reduce((summ, card) => {
            return summ + card.price;
          }, delivery.deliveryCost ?? 0)}{" "}
          руб.
        </p>
      </div>
      <button onClick={getOrder}>Заказать</button>
      {alert && (
        <ModalAlert
          duration={2000}
          onClose={() => {
            setAlert("");
          }}
          message={alert}
        />
      )}
    </div>
  );
}
