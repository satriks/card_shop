import "./Catalog.scss";
import { useAppDispatch, useAppSelector } from "../../../../models/hooks";
import { useEffect, useState } from "react";
import { setActiveCategory } from "../../../../redux/MainSlice";

type Props = {};

export default function Catalog({}: Props) {
  const catalog = useAppSelector((state) => state.store.category);
  const dispatch = useAppDispatch();

  const [value, setValue] = useState("каталог");
  const options = catalog.all.map((category, index) => (
    <option key={index} value={category}>
      {" "}
      {category}
    </option>
  ));

  useEffect(() => {
    catalog.isActive && setValue(catalog.isActive);
    // dispatch(setActiveCategory("Каталог"));
    // dispatch(fetchProducts("Каталог")); // fetch products on initial render and on category change
  }, [catalog]);

  return (
    <select className="header_catalog" value={value} onChange={chooseCategory}>
      <option defaultValue={"каталог"} hidden>
        каталог
      </option>
      {options}
    </select>
  );

  function chooseCategory(e: React.ChangeEvent) {
    const element = e.target as HTMLSelectElement;
    setValue(element.value);
    console.log(element.value);
    dispatch(setActiveCategory(element.value));
    // dispatch(fetchProducts(e.target.value));
  }
}
