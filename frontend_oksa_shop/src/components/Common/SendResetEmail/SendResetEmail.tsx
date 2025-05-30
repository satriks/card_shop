import "./SendResetEmail.scss";
import React, { useState } from "react";
import ModalAlert from "../ModalAlert/ModalAlert";
import { resetPasswordApi } from "../../../utils/api";
import { useAppDispatch } from "../../../models/hooks";
import { setSendReset, setUserInfo } from "../../../redux/MainSlice";
import CancelButton from "../CancelButton/cancelButton";

const SendResetEmail: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const dispatch = useAppDispatch();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Проверка на корректность email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Введите корректный адрес электронной почты");
      return;
    }
    try {
      const [status, data] = await resetPasswordApi(email);

      if (status == 200) {
        setSuccess("Ссылка для восстановления пароля отправлена на ваш email!");
        setError("");
        const timer = setTimeout(() => {
          dispatch(setUserInfo(false));
          dispatch(setSendReset(false));
          clearTimeout(timer);
        }, 2000);
      } else {
        console.log(data);

        setError("Произошла ошибка. Попробуйте еще раз.");
      }
    } catch (error) {
      console.error("Ошибка при отправке email:", error);
      setError("Произошла ошибка. Попробуйте еще раз.");
    }
  };

  return (
    <div className="forgot_password_wrapper">
      <div className="forgot_password">
        <div className="forgot_password_title">
          <h2>Восстановление пароля</h2>
        </div>
        <p>
          Введите ваш адрес электронной почты, чтобы получить ссылку для
          восстановления пароля.
        </p>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {error && (
            <ModalAlert
              message={error}
              duration={2000}
              onClose={() => {
                setError("");
              }}
            />
          )}
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
          <button type="submit">
            Отправить ссылку для восстановления пароля
          </button>
        </form>
        <CancelButton
          className="forgot_password_cancel"
          onClick={() => dispatch(setSendReset(false))}
        />
      </div>
    </div>
  );
};
export default SendResetEmail;
