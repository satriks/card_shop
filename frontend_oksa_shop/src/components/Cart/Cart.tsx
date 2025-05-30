import { useState } from "react";
import "./Cart.scss";
import payment from "../../assets/cart/payment.png";
import SetDelivery from "../Common/SetDelivery/SetDelivery";
import CartDelivery from "./CartDelivery/CartDelivery";
import CartReceiver from "./CartReceiver/CartReceiver";
import CartOrder from "./CartOrder/CartOrder";
import CancelButton from "../Common/CancelButton/cancelButton";
import { useAppDispatch, useAppSelector } from "../../models/hooks";
import { setActiveCart } from "../../redux/MainSlice";

export default function Cart() {
  const dispatch = useAppDispatch();
  const [isVisible, setIsVisible] = useState(true);
  const activeDelivery = useAppSelector(
    (state) => state.store.delivery.deliveryName
  );

  return (
    <div className={`cart_wrapper ${!isVisible ? "hide" : ""}`}>
      <div className="cart">
        <div className="cart_detail">
          <div className="cart_delivery">
            {activeDelivery == null ? (
              <div className="cart_delivery_not_active">
                <h2>Детали доставки</h2>
                <SetDelivery />
              </div>
            ) : (
              <CartDelivery />
            )}
          </div>
          <div className="cart_receiver">
            <CartReceiver />
          </div>
          <div className="cart_payment">
            <p>Оплатить с помощью</p>
            <img src={payment} alt="способы оплаты" />
          </div>
        </div>
        <CartOrder />
      </div>
      <CancelButton
        className="cart_cancel"
        onClick={() => {
          setIsVisible(false);
          const timer = setTimeout(() => {
            dispatch(setActiveCart(false));
            clearTimeout(timer);
          }, 800);
        }}
      />
    </div>
  );
}
