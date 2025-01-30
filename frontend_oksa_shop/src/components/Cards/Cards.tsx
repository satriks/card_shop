import React from "react";
import { useGetCardQuery } from "../../redux/cardAPI";

type Props = {};

export default function Cards({}: Props) {
  const { data = [], isLoading, isError } = useGetCardQuery();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="cards">
      {data.map((card) => (
        <div key={card.id} className="cardItem">
          <h2>{card.title}</h2>
          <img src={card.imageUrl} alt={card.title} />
          <p>{card.content}</p>
        </div>
      ))}
    </div>
  );
}
