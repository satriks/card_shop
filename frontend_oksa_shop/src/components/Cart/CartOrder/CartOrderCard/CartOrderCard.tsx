import "./CartOrderCard.scss";
import { CardDataDto } from "../../../../models/models";
import { useAppDispatch } from "../../../../models/hooks";
import { delCard, setCardDetail } from "../../../../redux/MainSlice";
import CancelButton from "../../../Common/CancelButton/cancelButton";

type Props = { card: CardDataDto };

export default function CartOrderCard({ card }: Props) {
  const dispatch = useAppDispatch();

  return (
    <div className="cart_order_card">
      <img
        src={import.meta.env.VITE_BASE_URL + card.images[0]}
        alt=""
        onClick={() => dispatch(setCardDetail(card))}
      />
      <p>{card.title}</p>
      <p>{String(card.price) + " руб."}</p>
      <CancelButton onClick={() => dispatch(delCard(card))} />
    </div>
  );
}
