import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../models/hooks";
import "./Category.scss";
import Tag from "./Tag/Tag";
import { setScrollTo } from "../../redux/MainSlice";

// const testCategory = ["Все", "Новый Год", "8 марта", "Свадьба"];

type Props = {};

export default function Category({}: Props) {
  const category = useAppSelector((state) => state.store.category.all);
  const myRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setScrollTo(myRef.current));
  }, []);

  return (
    <div className="category" ref={myRef}>
      <h2>Категории:</h2>
      <div className="category_tags">
        {category.map((tag) => (
          <Tag title={tag} key={tag + "1"} />
        ))}
      </div>
    </div>
  );
}
