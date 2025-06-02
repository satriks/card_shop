import { AxiosError } from "axios";
import { useAppDispatch } from "../../../../models/hooks";
import {
  setSendReset,
  setUserAccess,
  setUserActiveState,
  setUserEmail,
  setUserFirstName,
  setUserInfo,
  setUserLastName,
  setUserMiddleName,
  setUserPhone,
} from "../../../../redux/MainSlice";
import { loginApi, registrationApi } from "../../../../utils/api";
import CancelButton from "../../../Common/CancelButton/CancelButton";
import ModalAlert from "../../../Common/ModalAlert/ModalAlert";
import "./AuthForm.scss";
import React, { useState } from "react";
type Props = { onClose: () => void };
export default function AuthForm({ onClose }: Props) {
  const dispatch = useAppDispatch();
  const [successModal, setSuccessModal] = useState<string | null>(null);
  const [errorModal, setErrorModal] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [phone, setPhone] = useState("");
  const registerUser = async () => {
    try {
      setErrorModal(null);
      setSuccessModal(null);

      const [status, data] = await registrationApi(
        email,
        password,
        firstName,
        lastName,
        middleName,
        phone
      );
      if (status === 201) {
        dispatch(setUserActiveState(true));
        dispatch(setUserAccess(data.access));
        dispatch(setUserFirstName(data.user.first_name));
        dispatch(setUserLastName(data.user.last_name));
        dispatch(setUserMiddleName(data.user.middle_name));
        dispatch(setUserPhone(data.user.phone_number));
        dispatch(setUserEmail(data.user.email));
        dispatch(setUserInfo(false));
        setSuccessModal("Вы успешно зарегестрировались");
        const waitShowMessage = setTimeout(() => {
          onClose();
          clearTimeout(waitShowMessage);
        }, 2000);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Ошибка при выполнении запроса";
        setErrorModal(errorMessage);
      } else {
        console.error("Неизвестная ошибка:", error);
        const unknownErrorMessage =
          (error as Error).message || "Неизвестная ошибка";
        setErrorModal(unknownErrorMessage);
      }
    }
  };
  const loginUser = async () => {
    try {
      const resp = await loginApi(email, password);
      dispatch(setUserAccess(resp[1]));
      const status = resp[0];
      if (status === 200) {
        dispatch(setUserActiveState(true));
        dispatch(setUserInfo(false));
        onClose();
        // логика получения данных с юзера с сервера
      }
    } catch (error) {
      setErrorModal(error.message);
    }
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLogin) {
      loginUser();
    } else {
      registerUser();
    }
  };

  return (
    <div className="auth_form_wrapper">
      <div className={isLogin ? "auth_form" : "auth_form registration"}>
        {successModal && (
          <ModalAlert
            addClass="success"
            message={successModal}
            duration={2000}
            onClose={() => setSuccessModal(null)}
          />
        )}
        {errorModal && (
          <ModalAlert
            addClass=""
            message={errorModal}
            duration={2000}
            onClose={() => setErrorModal(null)}
          />
        )}
        <h2>{isLogin ? "Вход" : "Регистрация"}</h2>

        <form onSubmit={handleSubmit}>
          {isLogin ? (
            <>
              <div>
                <label htmlFor="email">Электронная почта</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="password">Пароль</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </>
          ) : (
            <div className="auth_form_registration">
              <div>
                <label htmlFor="firstName">Имя</label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="lastName">Фамилия</label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="middleName">Отчество</label>
                <input
                  type="text"
                  id="middleName"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="phone">Телефон</label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="email">
                  Электронная почта<span>*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="password">
                  Пароль<span>*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          )}
          <button type="submit">
            {isLogin ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>
        <p
          className="auth_form_reset_password"
          onClick={() => {
            console.log(42);
            dispatch(setSendReset(true));
            dispatch(setUserInfo(false));
          }}
        >
          {" "}
          Забыли пароль ?
        </p>

        <p>
          {isLogin ? "Нет аккаунта?" : "Уже есть аккаунт?"}
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Зарегистрироваться" : "Войти"}
          </button>
        </p>
        <CancelButton onClick={() => onClose()} />
      </div>
    </div>
  );
}
