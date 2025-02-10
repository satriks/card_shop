import "./Catalog.scss";
import { useAppSelector } from "../../../../models/hooks";
import { useState } from "react";

type Props = {};

export default function Catalog({}: Props) {
  const [value, setValue] = useState("Каталог");
  const catalog = useAppSelector((state) => state.store.category);
  const options = catalog.map((category, index) => (
    <option key={index} value={category}>
      {" "}
      {category}
    </option>
  ));

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
    // dispatch(setCategory(e.target.value));
    // dispatch(fetchProducts(e.target.value));
  }
}
