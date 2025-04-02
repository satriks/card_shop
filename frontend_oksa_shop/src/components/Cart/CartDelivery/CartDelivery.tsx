import "./CartDelivery.scss";
import { useAppDispatch, useAppSelector } from "../../../models/hooks";
import { setDelivery } from "../../../redux/MainSlice";

type DeliveryInfo = [
  string | undefined, // Адрес
  string | undefined, // Дополнительная информация
  number | null | undefined, // Стоимость доставки
  { minDeliveryTime: number | null; maxDeliveryTime: number | null } // Время доставки
];

type Props = {};

export default function CartDelivery({}: Props) {
  const dispatch = useAppDispatch();
  const delivery = useAppSelector((state) => state.store.delivery);
  const getDeliveryInfo = (): DeliveryInfo => {
    if (delivery.deliverySelf) {
      return [
        "ул. Братиславская д.6",
        "",
        0,
        { minDeliveryTime: null, maxDeliveryTime: null },
      ];
    }
    if (delivery.deliveryOffice) {
      return [
        delivery.deliveryOfficeDetail?.name,
        delivery.deliveryOfficeDetail?.note,
        delivery.deliveryCost,
        delivery.deliveryTime,
      ];
    }
    if (delivery.deliveryAddress) {
      const address = delivery.deliveryAddress.address?.split(",");
      if (address) {
        return [
          `${address[0]}, ${address[1]}`,
          address.slice(2).join(", "),
          delivery.deliveryCost,
          delivery.deliveryTime,
        ];
      }
    }
    return ["", "", 0, { minDeliveryTime: null, maxDeliveryTime: null }];
  };
  const deliveryInfo = getDeliveryInfo();
  return (
    <div className="cart_delivery_active">
      <div>
        <h2>Детали доставки</h2>
        <p className="cart_delivery_name">{delivery.deliveryName}</p>
      </div>
      <button
        onClick={() => {
          dispatch(setDelivery(true));
        }}
      >
        выбрать способ доставки
      </button>
      <div className="cart_delivery_address">
        <h3>адрес</h3>
        <p className="cart_delivery_main">{deliveryInfo[0]}</p>
        {deliveryInfo[1] && (
          <p className="cart_delivery_address_additional">{deliveryInfo[1]}</p>
        )}
      </div>
      <div className="cart_delivery_price">{deliveryInfo[2]} Руб</div>{" "}
      <div className="cart_delivery_time_label">Срок доставки</div>
      <div className="cart_delivery_time">
        {deliveryInfo[3].minDeliveryTime} - {deliveryInfo[3].maxDeliveryTime}{" "}
        дня{" "}
      </div>
    </div>
  );
}
