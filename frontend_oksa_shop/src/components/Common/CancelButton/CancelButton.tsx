import React from "react";
import "./CancelButton.scss";
import cancel from "../../../assets/common/cancel.png";

type Props = { onClick: () => void; className?: string };

export default function CancelButton({ onClick, className = "cancel" }: Props) {
  return (
    <img
      className={className}
      src={cancel}
      alt="cancel-button"
      onClick={onClick}
    />
  );
}
