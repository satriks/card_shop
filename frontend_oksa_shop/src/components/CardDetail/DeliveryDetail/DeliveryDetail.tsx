import { useAppDispatch, useAppSelector } from "../../../models/hooks";
import { setDelivery } from "../../../redux/MainSlice";
import "./DeliveryDetail.scss";

import React from "react";

type Props = {};

export default function DeliveryDetail({}: Props) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.store.delivery);

  return (
    <div className="delivery_detail">
      {user.deliverySelf && <h3>Самовывоз</h3>}
      {(user.deliveryOffice || user.deliveryAddress) && user.deliveryName && (
        <h3>{user.deliveryName}</h3>
      )}
      <p>{user.deliveryCost} руб.</p>
      <button onClick={() => dispatch(setDelivery(true))}>изменить</button>
    </div>
  );
}
