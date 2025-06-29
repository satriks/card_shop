import React, { useState } from "react";
import "./CardDetail.scss";
import CardGallery from "./CardGallery/CardGallery";
import SetDelivery from "../Common/SetDelivery/SetDelivery";
import { useAppDispatch, useAppSelector } from "../../models/hooks";
import { CardDataDto } from "../../models/models";
import { addCard, setActiveCart, setCardDetail } from "../../redux/MainSlice";
import CancelButton from "../Common/CancelButton/CancelButton";
import DeliveryDetail from "./DeliveryDetail/DeliveryDetail";

type Props = { card: CardDataDto };

export default function CardDetail({ card }: Props) {
  const cards = useAppSelector((state) => state.store.cards);
  const cart = useAppSelector((state) => state.store.cart.items);
  const cardDetail = useAppSelector((state) => state.store.cardDetail);
  const delivery = useAppSelector((state) => state.store.delivery);
  const [isVisible, setIsVisible] = useState(true);
  const activeCategory = useAppSelector(
    (state) => state.store.category.isActive
  );
  const dispatch = useAppDispatch();

  const closeFadeOut = () => {
    setIsVisible(false);
    const timer = setTimeout(() => {
      dispatch(setCardDetail(null));
      clearTimeout(timer);
    }, 800);
  };

  const clearCardDetail = () => {
    closeFadeOut();
  };

  const clearCardDetailWrapper = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("card_detail_wrapper")) {
      closeFadeOut();
    }
  };

  let cardsFiltered = activeCategory
    ? activeCategory == "Все"
      ? cards
      : cards.filter((card) => card.categories.includes(activeCategory))
    : cards;
  cardsFiltered = cardsFiltered.filter(
    (card) => !cart.includes(card) && card !== cardDetail
  );
  if (cardsFiltered.length <= 3) {
    cardsFiltered.push(
      ...cards.filter((card) => !cart.includes(card) && card !== cardDetail)
    );
  }

  cardsFiltered = [...new Set(cardsFiltered)];

  return (
    <div
      className={`card_detail_wrapper ${!isVisible ? "hide" : ""}`}
      onClick={(e: React.MouseEvent) => {
        clearCardDetailWrapper(e);
      }}
    >
      <div className={`card_detail ${!isVisible ? "hide" : ""}`}>
        <div className="card_detail_gallery">
          <CardGallery images={card.images} />
        </div>
        <div className="card_detail_info">
          <h2>{card.title}</h2>
          <p>{String(card.price) + "P"} </p>
          <div className="card_detail_info_buttons">
            <button
              onClick={() => {
                dispatch(addCard(card));
                dispatch(setCardDetail(null));
              }}
            >
              в корзину
            </button>
            <button
              onClick={() => {
                dispatch(addCard(card));
                dispatch(setActiveCart(true));
                dispatch(setCardDetail(null));
              }}
            >
              купить сейчас
            </button>
          </div>
          <div className="card_detail_info_delivery">
            <h3>Доставка: </h3>
            {delivery.deliverySelf ||
            delivery.deliveryAddress ||
            delivery.deliveryOffice ? (
              <DeliveryDetail />
            ) : (
              <SetDelivery />
            )}
          </div>
          <div className="card_detail_info_description">
            <div className="card_detail_info_description_material">
              <h3>Материалы:</h3>
              <div className="card_detail_info_description_material_elements">
                {card.materials.map((material) => (
                  <span key={material}>{material}</span>
                ))}
              </div>
            </div>

            <div className="card_detail_info_description_size">
              <h3>Размер:</h3>
              <span>длинна -{card.width} см</span>
              <span>высота -{card.length} см</span>
            </div>
          </div>
          <div className="card_detail_info_similar">
            <h3>Что то еще ?</h3>
            <div className="card_detail_info_similar_cards">
              {cardsFiltered.slice(0, 3).map((card: CardDataDto) => (
                <div
                  key={card.id}
                  className="card_detail_info_similar_cardItem"
                >
                  <img
                    src={import.meta.env.VITE_BASE_URL + card.images[0]}
                    alt={card.title}
                    onClick={() => {
                      dispatch(setCardDetail(card));
                    }}
                  />
                  <h2>{card.title}</h2>
                  <div className="cardItem_price">
                    <p>{card.price} Р</p>
                    <button
                      onClick={() => {
                        dispatch(addCard(card));
                      }}
                    >
                      В корзину
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <CancelButton
          className={"card_detail_cancel"}
          onClick={clearCardDetail}
        />
      </div>
    </div>
  );
}
