import "./SetDelivery.scss";
import { useAppDispatch } from "../../../models/hooks";
import { setDelivery } from "../../../redux/MainSlice";

export default function SetDelivery() {
  const dispatch = useAppDispatch();

  return (
    <div className="set_delivery">
      <h2>Для расчета стоимости доставки укажите адрес </h2>
      <button onClick={() => dispatch(setDelivery(true))}>
        Добавить адрес{" "}
      </button>
    </div>
  );
}
