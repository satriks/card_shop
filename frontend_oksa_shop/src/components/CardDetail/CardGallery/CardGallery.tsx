import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import "./CardGallery.scss";

type Props = { images: string[] };

export default function CardGallery({ images }: Props) {
  const url = import.meta.env.VITE_BASE_URL;
  const data = images.map((image) => ({
    original: url + image,
    thumbnail: url + image,
  }));

  return (
    <div>
      <ImageGallery items={data} showThumbnails={true} />
    </div>
  );
}
