import cardImg from "../../assets/testCard/card.png";
import "./Cards.scss";
import { CardDataDto } from "../../models/models";
import { useAppDispatch, useAppSelector } from "../../models/hooks";
import { addCard, setCardDetail } from "../../redux/MainSlice";
type Props = {};

export default function Cards({}: Props) {
  // const cartActive = useAppSelector((state) => state.store.cart.isActive);
  const cards = useAppSelector((state) => state.store.cards);
  const cart = useAppSelector((state) => state.store.cart.items);
  const activeCards = cards.filter((card) => card.available === true);
  const activeCategory = useAppSelector(
    (state) => state.store.category.isActive
  );
  const dispatch = useAppDispatch();

  let cardsFiltered = activeCategory
    ? activeCategory == "Все"
      ? activeCards
      : activeCards.filter((card) => card.categories.includes(activeCategory))
    : activeCards;
  cardsFiltered = cardsFiltered.filter((card) => !cart.includes(card));
  return (
    <div className="cards_wrapper">
      {activeCategory ? (
        <h2>Открытки категории " {activeCategory} " :</h2>
      ) : (
        <h2>Открытки :</h2>
      )}

      <div className="cards">
        {cardsFiltered.length > 0 ? (
          cardsFiltered.map((card: CardDataDto) => (
            <div
              key={card.id}
              className="cardItem"
              onClick={(e) => setActiveCard(e, card)}
            >
              <img
                src={import.meta.env.VITE_BASE_URL + card.images[0]}
                alt={card.title}
              />
              <h2 className="cardItem_title">{card.title}</h2>
              <div className="cardItem_price">
                <button
                  className="cardItem_button"
                  onClick={() => {
                    dispatch(addCard(card));
                  }}
                >
                  В корзину
                </button>
                <p>{card.price} Р</p>
              </div>
            </div>
          ))
        ) : (
          <p>
            К сожалению сейчас нет доступных открыток данной категории,
            попробуйте посмотреть другие категории
          </p>
        )}
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
