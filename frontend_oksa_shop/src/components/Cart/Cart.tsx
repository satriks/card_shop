import React from "react";
import "./Cart.scss";
import payment from "../../assets/cart/payment.png";
import SetDelivery from "../Common/SetDelivery/SetDelivery";
import CartDelivery from "./CartDelivery/CartDelivery";
import CartReceiver from "./CartReceiver/CartReceiver";
import CartOrder from "./CartOrder/CartOrder";
import CancelButton from "../Common/CancelButton/cancelButton";
import { useAppDispatch } from "../../models/hooks";
import { setActiveCart } from "../../redux/MainSlice";

type Props = {};

export default function Cart({}: Props) {
  const dispatch = useAppDispatch();

  return (
    <div className="cart_wrapper">
      <h2 className="cart_title">Заказ №4355</h2>
      <div className="cart">
        <div className="cart_detail">
          <div className="cart_delivery">
            {false ? (
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
          dispatch(setActiveCart());
        }}
      />
    </div>
  );
}
