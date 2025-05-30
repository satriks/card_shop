import { useAppDispatch, useAppSelector } from "../../../models/hooks";
import { setUserReset } from "../../../redux/MainSlice";
import { updateUserApi } from "../../../utils/api";
import ModalAlert from "../ModalAlert/ModalAlert";
import "./ResetPassword.scss";
import React, { useState } from "react";
const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.store.user);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError("Пароль должен содержать не менее 6 символов");
      return; // Прекращаем выполнение функции, если длина пароля недостаточна
    }
    // Проверка на совпадение паролей
    if (newPassword !== confirmPassword) {
      setError("Пароли не совпадают");
    }
    if (newPassword == confirmPassword) {
      console.log("запрос сервера");

      try {
        if (user.access) {
          updateUserApi(user.access, { password: newPassword }).then((resp) => {
            if (resp.status === 200) {
              setSuccess("Пароль успешно обновлен!"); // Успешное обновление пароля
              setError("");
              const timer = setTimeout(() => {
                dispatch(setUserReset(false));
                localStorage.removeItem("hasReloaded");
                clearTimeout(timer);
              }, 2000);
            }
          });
        }
        // Сброс сообщения об ошибке
      } catch (error) {
        console.error("Ошибка при обновлении пароля:", error);
        setError(
          "Произошла ошибка при обновлении пароля. Пожалуйста, попробуйте еще раз."
        );
      }
    }
  };
  return (
    <div className="reset_password_wrapper">
      <div className="reset_password">
        <div className="reset_password_title">
          <h2>Восстановление пароля</h2>
        </div>
        <p>Вы перешли по ссылке изменения пароля. Установите новый пароль. </p>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="newPassword">Новый пароль:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword">Подтвердите новый пароль:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <ModalAlert
              message={error}
              duration={2000}
              onClose={() => {
                setSuccess("");
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
                setError("");
              }}
            />
          )}
          <button type="submit">Сохранить новый пароль</button>
        </form>
      </div>
    </div>
  );
};
export default ResetPassword;
