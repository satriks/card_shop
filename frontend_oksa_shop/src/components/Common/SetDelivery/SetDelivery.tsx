import React from "react";
import "./SetDelivery.scss";
import { useAppDispatch, useAppSelector } from "../../../models/hooks";
import { setDelivery } from "../../../redux/MainSlice";

type Props = {};

export default function SetDelivery({}: Props) {
  const dispatch = useAppDispatch();
  // const onDelivery = useAppSelector((state) => state.store.delivery);

  return (
    <div className="set_delivery">
      <h2>Для расчета стоимости доставки укажите адрес </h2>
      <button onClick={() => dispatch(setDelivery(true))}>
        Добавить адрес{" "}
      </button>
    </div>
  );
}
