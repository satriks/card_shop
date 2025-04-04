import React, { useState } from "react";
import "./DeliveryModal.scss";
import CancelButton from "../CancelButton/cancelButton";
import { useAppSelector } from "../../../models/hooks";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (deliveryName: string) => void;
};

export default function DeliveryModal({ isOpen, onClose, onSave }: Props) {
  const [deliveryName, setDeliveryName] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false);
  const addresses = useAppSelector((state) => state.store.addresses);
  const handleSave = () => {
    if (deliveryName) {
      onSave(deliveryName);
      setDeliveryName("");
      onClose();
    } else {
      setHasError(true);
      setTimeout(() => {
        setHasError(false);
      }, 1500);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="modal_overlay">
      <div className="modal_content">
        <h2>Введите название доставки</h2>
        <div className="modal_content_button">
          <input
            type="text"
            value={deliveryName}
            onChange={(e) => setDeliveryName(e.target.value)}
            placeholder="Название доставки"
            className={hasError ? "error" : ""}
          />
          <button onClick={handleSave}>Сохранить</button>
        </div>
      </div>
      <CancelButton
        onClick={() => {
          onClose();
        }}
      />
    </div>
  );
}
