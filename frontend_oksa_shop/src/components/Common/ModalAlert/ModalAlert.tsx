import CancelButton from "../CancelButton/cancelButton";
import "./ModalAlert.scss";
import React, { useEffect } from "react";

type Props = {
  addClass?: string;
  message: string;
  duration: number;
  onClose: () => void;
};

export default function ModalAlert({
  addClass = "",
  duration,
  onClose,
  message = "текст",
}: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Закрываем модальное окно по истечении времени
    }, duration);
    return () => clearTimeout(timer); // Очистка таймера при размонтировании
  }, [duration, onClose]);

  return (
    <div className={`modal_wrapper`}>
      <div className={`modal_content ${addClass}`}>
        <h3>{message}</h3>
      </div>
    </div>
  );
}
