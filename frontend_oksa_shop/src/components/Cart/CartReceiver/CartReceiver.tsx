import { useState } from "react";
import "./CartReceiver.scss";
import { useAppSelector } from "../../../models/hooks";

type Props = {};

export default function CartReceiver({}: Props) {
  const user = useAppSelector((state) => state.store.user);
  const [isOtherReceiver, setIsOtherReceiver] = useState(false);
  const [fullName, setFullName] = useState(
    [user.firstName, user.middleName, user.lastName].filter(Boolean).join(" ")
  );
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const handleOtherReceiverClick = () => {
    setIsOtherReceiver(true);
    setFullName("");
    setPhone("");
    setEmail("");
  };
  const handleMyOrderClick = () => {
    setIsOtherReceiver(false);
    // Заполняем поля данными из user
    setFullName(
      [user.firstName, user.middleName, user.lastName].filter(Boolean).join(" ")
    );
    setPhone(user.phone);
    setEmail(user.email);
  };
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
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
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
