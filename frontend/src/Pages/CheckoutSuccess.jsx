import { useEffect, useState } from "react";

export default function CheckoutSuccess() {
  const [status, setStatus] = useState("Verifying payment...");
  const params = new URLSearchParams(window.location.search);
  const checkoutId = params.get("checkout_id");
  const orderId = params.get("order_id");
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function verifyPayment() {
      try {
        const res = await fetch(`${url}/api/payments/verify/${orderId}`);
        const data = await res.json();
        if (data.status === "paid") {
          setStatus("✅ Payment successful! Order confirmed.");
        } else {
          setStatus("❌ Payment not confirmed.");
        }
      } catch (err) {
        setStatus("⚠️ Error verifying payment.");
      }
    }
    verifyPayment();
  }, [checkoutId, orderId]);

  return <h1>{status}</h1>;
}
