import { useAppSelector } from "../../../models/hooks";
import { OrderDto } from "../../../models/models";
import { useGetOrdersQuery } from "../../../redux/cardAPI";
import { deliveryDate, formatDate } from "../../../utils/utils";
import CancelButton from "../../Common/CancelButton/CancelButton";
import Spinner from "../../Common/Spinner/Spinner";
import "./Orders.scss";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface IconStatus {
  succeeded: string;
  pending: string;
  canceled: string;
}

const iconStatus: IconStatus = {
  succeeded: "icon_success",
  pending: "icon_pending",
  canceled: "icon_cancel",
};

const titleStatus: IconStatus = {
  succeeded: "Оплачено",
  pending: "Ожидает оплаты",
  canceled: "Отменен",
};

type Props = {
  onClose: (value: boolean) => void;
};

export default function Orders({ onClose }: Props) {
  const user = useAppSelector((state) => state.store.user);
  const [isVisible, setIsVisible] = useState(true);
  const { data, error, isLoading, isError } = useGetOrdersQuery(
    user.access ?? ""
  );
  const closeFadeIn = () => {
    setIsVisible(false);
    const timer = setTimeout(() => {
      onClose(false);
      clearTimeout(timer);
    }, 800);
  };
  return (
    <div
      className={`orders_wrapper ${!isVisible ? "hide" : ""}`}
      onClick={(e) => {
        // console.log(e);
        if ((e.target as HTMLElement).classList.contains("orders_wrapper")) {
          closeFadeIn();
        }
      }}
    >
      <div className="orders">
        <h2>Мои заказы</h2>
        {isLoading && <Spinner />}
        {/* {isError && error && <div>{error}</div>} */}
        {isError && error && (
          <div>
            {error && "status" in error && error.status === 500 ? (
              <div>Произошла ошибка сервера. Пожалуйста, попробуйте позже.</div>
            ) : error && "message" in error ? (
              <div>{error.message || "Неизвестная ошибка"}</div>
            ) : (
              <div>Произошла неизвестная ошибка</div>
            )}
          </div>
        )}
        {data &&
          data.map((order) => (
            <OrderItem key={order.id + uuidv4()} order={order} />
          ))}
        <CancelButton
          onClick={() => {
            closeFadeIn();
          }}
        />
      </div>
    </div>
  );
}

type OrderItemProps = {
  order: OrderDto;
};

const OrderItem = ({ order }: OrderItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const toggleDetails = () => {
    if (isOpen == true) {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setIsOpen(false);
        clearTimeout(timer);
      }, 800);
    } else {
      setIsVisible(true);
      setIsOpen(true);
    }
  };

  const iconCurrent: string = iconStatus[order.payment_status] || "";
  let deliveryDateDisplay: string | undefined; // Определяем переменную здесь

  if (order.delivery && order.delivery.delivery_self !== undefined) {
    if (
      order.delivery.delivery_self == false &&
      order.delivery.max_delivery_time != null &&
      order.delivery.min_delivery_time != null
    ) {
      const minDeliveryDate = deliveryDate(
        order.created_at,
        order.delivery.min_delivery_time
      );
      const maxDeliveryDate = deliveryDate(
        order.created_at,
        order.delivery.max_delivery_time
      );

      deliveryDateDisplay =
        minDeliveryDate === maxDeliveryDate
          ? minDeliveryDate // Если даты равны, отображаем одну дату
          : `${minDeliveryDate} - ${maxDeliveryDate}`;
    }
  }

  return (
    <div className="order-item">
      <div className="order-summary" onClick={toggleDetails}>
        <span>Номер заказа: {order.id}</span>
        <span>Сумма: {order.postcards_total}₽</span>
        <div className="icons">
          <div
            className={`icon payment_icon ${iconCurrent}`}
            title={`Статус оплаты: ${titleStatus[order.payment_status]}`}
          >
            💳
          </div>
          <div
            className="icon delivery_icon"
            title={`Статус доставки: ${order.delivery_status}`}
          >
            🚚
          </div>
        </div>
      </div>
      {isOpen && (
        <div className={`order-details ${!isVisible ? "hide" : ""}`}>
          <h3>Подробная информация о заказе:</h3>
          <div>
            Товары:{" "}
            {order.postcards.map((postcard) => {
              return (
                <div className="order_cards" key={order.id}>
                  <img
                    className="order_cards_img"
                    src={import.meta.env.VITE_BASE_URL + postcard.images[0]}
                    alt={postcard.title}
                    // onClick={() => {
                    //   dispatch(setCardDetail(card));
                    // }}
                  />
                  <h4>{postcard.title}</h4>
                  <div className="cardItem_price">
                    <p>{postcard.price} Р</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div>
            <p>Доставка: {order.delivery.delivery_name}</p>
            <p>
              {" "}
              {order.delivery.delivery_self
                ? "Москва. ул. Братиславская д.6"
                : order.delivery.delivery_address
                ? `До двери : ${order.delivery.delivery_address.city} ${order.delivery.delivery_address.address}`
                : order.delivery.delivery_office_detail
                ? `Пункт выдачи: ${order.delivery.delivery_office_detail.location.address_full}`
                : ""}
            </p>
            {!order.delivery.delivery_self && (
              <p>Стоимость доставки: {order.delivery.delivery_cost} руб.</p>
            )}
          </div>
          <p>Дата заказа: {formatDate(order.created_at, true)}</p>
          {!order.delivery.delivery_self && deliveryDateDisplay && (
            <p>Планируемая дата доставки {deliveryDateDisplay}</p>
          )}
        </div>
      )}
    </div>
  );
};
