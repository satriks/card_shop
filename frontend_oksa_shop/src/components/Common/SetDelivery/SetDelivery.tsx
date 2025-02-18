import React from "react";
import "./SetDelivery.scss";

type Props = {};

export default function SetDelivery({}: Props) {
  return (
    <div className="set_delivery">
      <h2>Для расчета стоимости доставки укажите адрес </h2>
      <button>Добавить адрес </button>
    </div>
  );
}
