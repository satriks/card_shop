import { useAppDispatch, useAppSelector } from "../../../models/hooks";
import { ChangeUserDto } from "../../../models/models";
import {
  setUserEmail,
  setUserFirstName,
  setUserLastName,
  setUserMiddleName,
  setUserPhone,
} from "../../../redux/MainSlice";
import { updateUserApi } from "../../../utils/api";
import CancelButton from "../../Common/CancelButton/cancelButton";
import ModalAlert from "../../Common/ModalAlert/ModalAlert";
import "./UpdateUser.scss";
import React, { useState } from "react";

type Props = { onClose: () => void };

export default function UpdateUser({ onClose }: Props) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.store.user);

  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [middleName, setMiddleName] = useState(user.middleName || "");
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [password, setPassword] = useState("********");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const setData = () => {
    dispatch(setUserFirstName(firstName));
    dispatch(setUserLastName(lastName));
    dispatch(setUserMiddleName(middleName));
    dispatch(setUserEmail(email));
    dispatch(setUserPhone(phone));
  };
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Создаем объект для отправки
    const body: ChangeUserDto = {
      first_name: firstName,
      last_name: lastName,
      middle_name: middleName,
      email: email,
      phone_number: phone,
      password: password,
    };
    try {
      await updateUserApi(user.access, body); // Отправка запроса на обновление данных
      setSuccess("Данные успешно обновлены!");
      const waitShowMessage = setTimeout(() => {
        onClose();
        setData();
        clearTimeout(waitShowMessage);
      }, 2000);
    } catch (err: any) {
      setError(
        "Ошибка при обновлении данных: " +
          (err.response?.data?.message || err.message)
      );
    }
  };
  return (
    <div className={`update_user_wrapper ${!isVisible ? "hide" : ""}`}>
      <div className="update_user">
        <h2>Изменение данных пользователя</h2>
        <form className="update_user_form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="firstName">Имя:</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="lastName">Фамилия:</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="middleName">Отчество:</label>
            <input
              type="text"
              id="middleName"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="email">Почта:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="phone">Телефон:</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Пароль:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {/* {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>} */}
          <button
            className="update_user_save"
            type="submit"
            onClick={handleSubmit}
          >
            Сохранить изменения
          </button>
        </form>
        <CancelButton
          onClick={() => {
            setIsVisible(false);
            const timer = setTimeout(() => {
              onClose();
              clearTimeout(timer);
            }, 800);
          }}
        />
        {success && (
          <ModalAlert
            addClass="success"
            message={success}
            duration={2000}
            onClose={() => {
              setSuccess("");
            }}
          />
        )}
        {error && (
          <ModalAlert
            addClass=""
            message={error}
            duration={2000}
            onClose={() => {
              setError("");
            }}
          />
        )}
      </div>
    </div>
  );
}
