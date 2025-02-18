import React from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import card from "../../../assets/testCard/card.png";

const images = [
  {
    original: card,
    thumbnail: card,
  },
  {
    original: card,
    thumbnail: card,
  },
  {
    original: card,
    thumbnail: card,
  },
];

type Props = {};

export default function CardGallery({}: Props) {
  return (
    <div>
      <ImageGallery items={images} showThumbnails={true} />
    </div>
  );
}
