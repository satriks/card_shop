import { useAppSelector } from "../../models/hooks";
import "./Category.scss";
import Tag from "./Tag/Tag";

// const testCategory = ["Все", "Новый Год", "8 марта", "Свадьба"];

type Props = {};

export default function Category({}: Props) {
  const category = useAppSelector((state) => state.store.category);

  return (
    <div className="category">
      <h2>Категории:</h2>
      <div className="category_tags">
        {category.map((tag) => (
          <Tag title={tag} key={tag + "1"} />
        ))}
      </div>
    </div>
  );
}
