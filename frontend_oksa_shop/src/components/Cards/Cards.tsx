import { useGetCardQuery } from "../../redux/cardAPI";
import cardImg from "../../assets/testCard/card.png";
import "./Cards.scss";
type Props = {};

export default function Cards({}: Props) {
  // const data = useGetCardQuery("");
  const { data = [], isLoading, isError } = useGetCardQuery("");

  if (isLoading) return <p>Loading...</p>;
  console.log(data, "ins data");

  return (
    <div className="cards_wrapper">
      <h2>Открытки темы Title :</h2>
      <div className="cards">
        {data.map((card) => (
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
