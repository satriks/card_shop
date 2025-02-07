import { useGetCardQuery } from "../../redux/cardAPI";
import cardImg from "../../assets/testCard/card.png";
import "./Cards.scss";
import Spinner from "../Common/Spiner/Spinner";
import { CardData } from "../../models/models";
import { useAppSelector } from "../../models/hooks";
type Props = {};

export default function Cards({}: Props) {
  const { data = [], isLoading, isError } = useGetCardQuery("");
  const cartActive = useAppSelector((state) => state.store.cart.isActive);

  return (
    <div className="cards_wrapper">
      <h2>Открытки темы Title :</h2>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="cards">
          {data.map((card: CardData) => (
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
      )}
    </div>
  );
}
