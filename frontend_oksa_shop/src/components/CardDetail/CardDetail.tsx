import React from "react";
import "./CardDetail.scss";
import CardGallery from "./CardGallery/CardGallery";
import SetDelivery from "../Common/SetDelivery/SetDelivery";
import { useAppDispatch, useAppSelector } from "../../models/hooks";
import { CardDataDto } from "../../models/models";
import { addCard, setActiveCart, setCardDetail } from "../../redux/MainSlice";
import cardImg from "../../assets/testCard/card.png";
import CancelButton from "../Common/CancelButton/cancelButton";

type Props = { card: CardDataDto };

export default function CardDetail({ card }: Props) {
  const cards = useAppSelector((state) => state.store.cards);
  const cart = useAppSelector((state) => state.store.cart.items);
  const cardDetail = useAppSelector((state) => state.store.cardDetail);
  const activeCategory = useAppSelector(
    (state) => state.store.category.isActive
  );
  const deliveryAddress = useAppSelector(
    (state) => state.store.user.deliveryAddress
  );
  const dispatch = useAppDispatch();

  const clearCardDetail = () => {
    dispatch(setCardDetail(null));
  };

  const clearCardDetailWrapper = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    target.classList.contains("card_detail_wrapper") &&
      dispatch(setCardDetail(null));
  };

  let cardsFiltered = activeCategory
    ? activeCategory == "Все"
      ? cards
      : cards.filter((card) => card.tags.includes(activeCategory))
    : cards;
  cardsFiltered = cardsFiltered.filter(
    (card) => !cart.includes(card) && card !== cardDetail
  );
  cardsFiltered.length <= 3 &&
    cardsFiltered.push(
      ...cards.filter((card) => !cart.includes(card) && card !== cardDetail)
    );

  cardsFiltered = [...new Set(cardsFiltered)];

  return (
    <div
      className="card_detail_wrapper"
      onClick={(e: React.MouseEvent) => {
        clearCardDetailWrapper(e);
      }}
    >
      <div className="card_detail">
        <div className="card_detail_gallery">
          <CardGallery />
        </div>
        <div className="card_detail_info">
          <h2>{card.title}</h2>
          <p>{String(card.price) + "P"} </p>
          <div className="card_detail_info_buttons">
            <button
              onClick={() => {
                dispatch(addCard(card));
              }}
            >
              в корзину
            </button>
            <button
              onClick={() => {
                dispatch(addCard(card));
                dispatch(setActiveCart());
              }}
            >
              купить сейчас
            </button>
          </div>
          <div className="card_detail_info_delivery">
            <h3>Доставка</h3>
            {deliveryAddress ? (
              <div className="card_detail_info_delivery_detail">
                <h3>{deliveryAddress}</h3> <p>2000 Р</p>
              </div>
            ) : (
              <SetDelivery />
            )}
          </div>
          <div className="card_detail_info_description">
            <div className="card_detail_info_description_material">
              <h3>Материалы:</h3>
              <div className="card_detail_info_description_material_elements">
                <span>скрапбумага</span>
                <span>блестки</span>
                <span>блестки</span>
                <span>блестки</span>
                <span>клей</span>
                <span>бумага акварельная</span>
              </div>
            </div>

            <div className="card_detail_info_description_size">
              <h3>Размер:</h3>
              <span>длинна -14 см</span>
              <span>высота - 15 см</span>
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
                  <img src={cardImg} alt={card.title} />
                  <h2>{card.title}</h2>
                  <div className="cardItem_price">
                    <p>2000 Р</p>
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
