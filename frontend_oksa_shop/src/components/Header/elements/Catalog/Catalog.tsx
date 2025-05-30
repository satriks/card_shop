import "./Catalog.scss";
import { useAppDispatch, useAppSelector } from "../../../../models/hooks";
import { useEffect, useState } from "react";
import { setActiveCategory } from "../../../../redux/MainSlice";
export default function Catalog() {
  const catalog = useAppSelector((state) => state.store.category);
  const dispatch = useAppDispatch();
  const [value, setValue] = useState("каталог");
  const options = catalog.all.map((category, index) => (
    <option key={index} value={category}>
      {category}
    </option>
  ));
  useEffect(() => {
    if (catalog.isActive) {
      setValue(catalog.isActive);
    }
  }, [catalog]);
  const chooseCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const element = e.target;
    setValue(element.value);
    console.log(element.value);
    dispatch(setActiveCategory(element.value));
    // dispatch(fetchProducts(e.target.value));
  };
  return (
    <select className="header_catalog" value={value} onChange={chooseCategory}>
      <option value="" hidden>
        каталог
      </option>
      {options}
    </select>
  );
}
