// PaymentComponent.js
import React, { useState } from "react";
const PaymentComponent = () => {
  const [amount, setAmount] = useState("");
  const handlePayment = async () => {
    const response = await fetch("http://localhost:8000/payments/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    });
    const data = await response.json();
    if (data.payment_url) {
      window.location.href = data.payment_url; // Перенаправление на страницу оплаты
    }
  };
  return (
    <div>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Введите сумму"
      />
      <button onClick={handlePayment}>Оплатить</button>
    </div>
  );
};
export default PaymentComponent;
