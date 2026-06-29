import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";

export default function PaymentForm({ total, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError("");

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: "if_required",
    });

    setLoading(false);

    if (result.error) {
      setError(result.error.message || "Payment failed. Please try again.");
      return;
    }

    if (result.paymentIntent) {
      onSuccess(result.paymentIntent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
        <PaymentElement />
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Total</span>
        <span className="font-bold text-gray-900">${total}</span>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
      >
        {loading ? "Processing…" : "Pay now"}
      </button>
    </form>
  );
}
