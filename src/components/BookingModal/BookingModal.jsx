import { useState, useEffect, useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import {
  X,
  Calendar,
  Clock,
  Users,
  Minus,
  Plus,
  Check,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import PaymentForm from "./PaymentForm";

const STRIPE_ACCOUNT_ID = "acct_1TmVv1Qm1a7e47U2";
const stripePromise = loadStripe(
  "pk_live_51OJhJBHdGQpsHqInIzu7c6PzGPSH0yImD4xfpofvxvFZs0VFhPRXZCyEgYkkhOtBOXFWvssYASs851mflwQvjnrl00T6DbUwWZ",
  { stripeAccount: STRIPE_ACCOUNT_ID },
);

const TIMES = ["09:00 AM", "11:00 AM", "01:00 PM", "03:00 PM", "05:00 PM"];

function nextDates(n) {
  const out = [];
  const d = new Date();
  for (let i = 1; i <= n; i++) {
    const day = new Date(d);
    day.setDate(d.getDate() + i);
    out.push({
      value: day.toISOString().slice(0, 10),
      label: day.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
    });
  }
  return out;
}

export default function BookingModal({ exp, onClose }) {
  const { user } = useAuth();
  const dates = useMemo(() => nextDates(10), []);
  const [step, setStep] = useState("details");
  const [date, setDate] = useState(dates[0].value);
  const [time, setTime] = useState(TIMES[0]);
  const [participants, setParticipants] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [smsOptIn, setSmsOptIn] = useState(true);
  const [clientSecret, setClientSecret] = useState("");
  const [err, setErr] = useState("");
  const [loadingPay, setLoadingPay] = useState(false);

  const total = exp.price * participants;

  const proceed = async () => {
    setErr("");
    if (!name.trim() || !email.trim()) {
      setErr("Please enter your name and email.");
      return;
    }
    setLoadingPay(true);
    const { data, error } = await supabase.functions.invoke(
      "create-payment-intent",
      {
        body: {
          amount: total * 100,
          currency: "usd",
          metadata: { experience: exp.title },
        },
      },
    );
    setLoadingPay(false);
    if (error || !data?.clientSecret) {
      setErr("Unable to start payment. Please try again.");
      return;
    }
    setClientSecret(data.clientSecret);
    setStep("payment");
  };

  const handleSuccess = async (pi) => {
    await supabase.from("experience_bookings").insert({
      experience_id: exp.id,
      experience_title: exp.title,
      customer_name: name,
      customer_email: email,
      customer_phone: phone || null,
      booking_date: date,
      booking_time: time,
      participants,
      total,
      status: "confirmed",
      stripe_payment_intent_id: pi.id,
      user_id: user?.id || null,
    });

    fetch("https://famous.ai/api/crm/6a3e43d837d3c1bbffb17e9f/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name: name || undefined,
        phone: phone || undefined,
        sms_opt_in: smsOptIn === true,
        source: "booking",
        tags: ["booking", exp.category],
      }),
    }).catch(() => {});

    setStep("done");
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white">
          <div>
            <h2 className="font-bold text-lg text-gray-900 leading-tight">
              {exp.title}
            </h2>
            <p className="text-sm text-gray-500">{exp.location}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          {step === "details" && (
            <div className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-gray-800 flex items-center gap-1.5 mb-2">
                  <Calendar className="w-4 h-4" /> Choose a date
                </label>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {dates.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setDate(d.value)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap border transition ${date === d.value ? "bg-orange-500 text-white border-orange-500" : "border-gray-200 text-gray-600 hover:border-orange-300"}`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-800 flex items-center gap-1.5 mb-2">
                  <Clock className="w-4 h-4" /> Time
                </label>
                <div className="flex flex-wrap gap-2">
                  {TIMES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTime(t)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium border transition ${time === t ? "bg-orange-500 text-white border-orange-500" : "border-gray-200 text-gray-600 hover:border-orange-300"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-800 flex items-center gap-1.5 mb-2">
                  <Users className="w-4 h-4" /> Participants
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() =>
                      setParticipants(Math.max(1, participants - 1))
                    }
                    className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-lg w-8 text-center">
                    {participants}
                  </span>
                  <button
                    onClick={() =>
                      setParticipants(
                        Math.min(exp.max_participants, participants + 1),
                      )
                    }
                    className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-gray-400">
                    max {exp.max_participants}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-orange-300 text-sm"
                />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Email"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-orange-300 text-sm"
                />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  placeholder="Phone number (optional)"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-orange-300 text-sm"
                />
                <label className="flex items-start gap-2 text-xs text-gray-500">
                  <input
                    type="checkbox"
                    checked={smsOptIn}
                    onChange={(e) => setSmsOptIn(e.target.checked)}
                    className="mt-0.5"
                  />
                  <span>
                    Text me booking updates. Msg & data rates may apply. Reply
                    STOP to unsubscribe.
                  </span>
                </label>
              </div>

              {err && <p className="text-sm text-rose-600">{err}</p>}

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                  <span className="text-sm text-gray-500">
                    {participants} × ${exp.price}
                  </span>
                  <div className="text-2xl font-extrabold text-gray-900">
                    ${total}
                  </div>
                </div>
                <button
                  onClick={proceed}
                  disabled={loadingPay}
                  className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold flex items-center gap-2 disabled:opacity-60"
                >
                  {loadingPay && <Loader2 className="w-4 h-4 animate-spin" />}{" "}
                  Continue to payment
                </button>
              </div>
            </div>
          )}

          {step === "payment" && clientSecret && (
            <div className="space-y-4">
              <div className="bg-orange-50 rounded-xl p-3 text-sm text-gray-700 flex items-center justify-between">
                <span>
                  {new Date(date).toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  · {time} · {participants}{" "}
                  {participants > 1 ? "guests" : "guest"}
                </span>
                <span className="font-bold">${total}</span>
              </div>
              <Elements
                stripe={stripePromise}
                options={{ clientSecret, appearance: { theme: "stripe" } }}
              >
                <PaymentForm total={total} onSuccess={handleSuccess} />
              </Elements>
              <button
                onClick={() => setStep("details")}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Back
              </button>
            </div>
          )}

          {step === "done" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900">
                Booking confirmed!
              </h3>
              <p className="text-gray-500 mt-2 max-w-xs mx-auto">
                You're all set for <b>{exp.title}</b> on{" "}
                {new Date(date).toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                })}{" "}
                at {time}. A confirmation was sent to {email}.
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
