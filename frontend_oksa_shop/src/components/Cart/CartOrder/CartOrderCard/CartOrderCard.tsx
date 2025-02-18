import React from "react";
import "./CartOrderCard.scss";
import cardImg from "../../../../assets/testCard/card.png";
import { CardDataDto } from "../../../../models/models";
import { useAppDispatch } from "../../../../models/hooks";
import { delCard } from "../../../../redux/MainSlice";
import CancelButton from "../../../Common/CancelButton/cancelButton";

type Props = { card: CardDataDto };

export default function CartOrderCard({ card }: Props) {
  const dispatch = useAppDispatch();

  return (
    <div className="cart_order_card">
      <img src={cardImg} alt="" />
      <p>{card.title}</p>
      <p>{String(card.price) + " Р"}</p>
      <CancelButton onClick={() => dispatch(delCard(card))} />
    </div>
  );
}
