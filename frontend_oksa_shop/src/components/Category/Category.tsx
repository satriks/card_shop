import { useAppSelector } from "../../models/hooks";
import "./Category.scss";
import Tag from "./Tag/Tag";

export default function Category() {
  const category = useAppSelector((state) => state.store.category.all);

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
