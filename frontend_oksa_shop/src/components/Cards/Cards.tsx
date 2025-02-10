import cardImg from "../../assets/testCard/card.png";
import "./Cards.scss";
import Spinner from "../Common/Spiner/Spinner";
import { CardDataDto } from "../../models/models";
import { useAppSelector } from "../../models/hooks";
type Props = {};

export default function Cards({}: Props) {
  const cartActive = useAppSelector((state) => state.store.cart.isActive);
  const cards = useAppSelector((state) => state.store.cards);

  return (
    <div className="cards_wrapper">
      <h2>Открытки темы Title :</h2>

      <div className="cards">
        {cards.map((card: CardDataDto) => (
          <div key={card.id} className="cardItem">
            <img src={cardImg} alt={card.title} />
            <h2>{card.title}</h2>
            <div className="cardItem_price">
              <button>В корзину</button>
              <p>2000 Р</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
