import "./ModalAlert.scss";
import { useEffect } from "react";

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
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`modal_wrapper`}>
      <div className={`modal_content ${addClass}`}>
        <h3>{message}</h3>
      </div>
    </div>
  );
}
