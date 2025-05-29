import { useEffect, useState } from "react";
import "./CartReceiver.scss";
import { useAppDispatch, useAppSelector } from "../../../models/hooks";
import {
  setReceiverEmail,
  setReceiverName,
  setReceiverPhone,
} from "../../../redux/MainSlice";
import { ReceiverDto } from "../../../models/models";

type Props = {};

export default function CartReceiver({}: Props) {
  const user = useAppSelector((state) => state.store.user);
  const [isOtherReceiver, setIsOtherReceiver] = useState(false);
  const dispatch = useAppDispatch();
  const [name, setName] = useState(
    [user.firstName, user.middleName, user.lastName].filter(Boolean).join(" ")
  );
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const handleOtherReceiverClick = () => {
    setIsOtherReceiver(true);
    setName("");
    setPhone("");
    setEmail("");
  };
  const handleMyOrderClick = () => {
    setIsOtherReceiver(false);
    // Заполняем поля данными из user
    setName(
      [user.firstName, user.middleName, user.lastName].filter(Boolean).join(" ")
    );
    setPhone(user.phone);
    setEmail(user.email);
  };

  useEffect(() => {
    dispatch(setReceiverName(name));
    dispatch(setReceiverPhone(phone));
    dispatch(setReceiverEmail(email));
  }, [name, phone, email, dispatch]);

  return (
    <div className="cart_receiver">
      <h2>Получатель</h2>
      <div className="cart_receiver_people">
        <button
          className={!isOtherReceiver ? "active" : ""}
          onClick={handleMyOrderClick}
        >
          я получу заказ
        </button>
        <button
          className={isOtherReceiver ? "active" : ""}
          onClick={handleOtherReceiverClick}
        >
          другой получатель
        </button>
      </div>
      <div className="cart_receiver_form">
        <label>
          <p>
            ФИО<span>*</span>
          </p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          <p>
            Телефон<span>*</span>
          </p>
          <input
            type="text"
            value={phone || "+7"}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+71231233232"
          />
        </label>
        <label>
          <p>
            Адрес электронной почты<span>*</span>
          </p>
          <input
            type="text"
            value={email || ""}
            onChange={(e) => setEmail(e.target.value)}
          />
          <span>На данный адрес будет отправлен электронный кассовый чек </span>
        </label>
      </div>
    </div>
  );
}
