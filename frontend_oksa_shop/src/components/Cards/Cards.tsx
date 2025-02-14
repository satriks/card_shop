import cardImg from "../../assets/testCard/card.png";
import "./Cards.scss";
import { CardDataDto } from "../../models/models";
import { useAppDispatch, useAppSelector } from "../../models/hooks";
import { addCard, setCardDetail } from "../../redux/MainSlice";
type Props = {};

export default function Cards({}: Props) {
  // const cartActive = useAppSelector((state) => state.store.cart.isActive);
  const cards = useAppSelector((state) => state.store.cards);
  const activeCategory = useAppSelector(
    (state) => state.store.category.isActive
  );
  const dispatch = useAppDispatch();

  let cardsFiltered = activeCategory
    ? activeCategory == "Все"
      ? cards
      : cards.filter((card) => card.tags.includes(activeCategory))
    : cards;

  return (
    <div className="cards_wrapper">
      <h2>Открытки темы Title :</h2>

      <div className="cards">
        {cardsFiltered.map((card: CardDataDto) => (
          <div
            key={card.id}
            className="cardItem"
            onClick={(e) => setActiveCard(e, card)}
          >
            <img src={cardImg} alt={card.title} />
            <h2>{card.title}</h2>
            <div className="cardItem_price">
              <button
                className="cardItem_button"
                onClick={() => {
                  dispatch(addCard(card));
                }}
              >
                В корзину
              </button>
              <p>2000 Р</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  function setActiveCard(e: React.MouseEvent, card: CardDataDto) {
    const target = e.target as HTMLElement;
    if (!target.classList.contains("cardItem_button")) {
      dispatch(setCardDetail(card));
    }
  }
}
