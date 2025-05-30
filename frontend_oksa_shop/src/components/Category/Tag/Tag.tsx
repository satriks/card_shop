import { useAppDispatch, useAppSelector } from "../../../models/hooks";
import { setActiveCategory } from "../../../redux/MainSlice";
import "./Tag.scss";

type Props = {
  title: string;
};

export default function Tag({ title = "Все" }: Props) {
  const isActive = useAppSelector((state) => state.store.category.isActive);
  const dispatch = useAppDispatch();

  return (
    <button
      className={`category_tag ${
        isActive == title ? "category_tag_active" : ""
      }`}
      onClick={(e) => {
        const text: string | null = (e.target as HTMLElement).textContent;
        if (text) {
          dispatch(setActiveCategory(text));
        }
      }}
    >
      {title}
    </button>
  );
}
