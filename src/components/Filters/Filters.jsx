import { useState } from "react";
import { Compass, Shield, Award, Headphones } from "lucide-react";
import { CATEGORIES } from "@/data/categories";

export default function Footer({ onHostClick }) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [smsOptIn, setSmsOptIn] = useState(true);
  const [sent, setSent] = useState(false);

  const subscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    fetch("https://famous.ai/api/crm/6a3e43d837d3c1bbffb17e9f/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        phone: phone || undefined,
        sms_opt_in: smsOptIn === true,
        source: "footer-signup",
        tags: ["newsletter"],
      }),
    }).catch(() => {});
    setSent(true);
    setEmail("");
    setPhone("");
  };

  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid sm:grid-cols-3 gap-6 pb-10 border-b border-white/10">
          {[
            {
              icon: <Shield className="w-5 h-5" />,
              t: "Trusted & secure",
              d: "Every booking protected & verified hosts",
            },
            {
              icon: <Award className="w-5 h-5" />,
              t: "Quality guaranteed",
              d: "Only top-rated, hand-picked experiences",
            },
            {
              icon: <Headphones className="w-5 h-5" />,
              t: "24/7 support",
              d: "Real humans ready to help, anytime",
            },
          ].map((b) => (
            <div key={b.t} className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-orange-400">
                {b.icon}
              </span>
              <div>
                <div className="font-bold text-white">{b.t}</div>
                <div className="text-sm text-gray-400">{b.d}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-4 gap-8 py-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center text-white">
                <Compass className="w-5 h-5" />
              </span>
              <span className="font-extrabold text-xl text-white">
                Wander<span className="text-orange-500">do</span>
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Discover and book unforgettable experiences led by passionate
              local hosts around the world.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Categories</h4>
            <ul className="space-y-2 text-sm">
              {CATEGORIES.map((c) => (
                <li key={c.name}>
                  <a
                    href="#explore"
                    className="hover:text-orange-400 transition"
                  >
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Popular cities</h4>
            <ul className="space-y-2 text-sm">
              {[
                "Florence",
                "Tokyo",
                "Lisbon",
                "Bali",
                "New York",
                "Bangkok",
              ].map((c) => (
                <li key={c}>
                  <a
                    href="#explore"
                    className="hover:text-orange-400 transition"
                  >
                    {c}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Stay in the loop</h4>
            {sent ? (
              <p className="text-sm text-emerald-400">
                Thanks! Check your inbox for the best new experiences.
              </p>
            ) : (
              <form onSubmit={subscribe} className="space-y-2">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Your email"
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white placeholder-gray-400 text-sm outline-none focus:border-orange-400"
                />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  placeholder="Phone (optional)"
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white placeholder-gray-400 text-sm outline-none focus:border-orange-400"
                />
                <label className="flex items-start gap-2 text-xs text-gray-400">
                  <input
                    type="checkbox"
                    checked={smsOptIn}
                    onChange={(e) => setSmsOptIn(e.target.checked)}
                    className="mt-0.5"
                  />
                  <span>
                    Text me deals. Msg & data rates may apply. Reply STOP to
                    unsubscribe.
                  </span>
                </label>
                <button className="w-full py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition">
                  Subscribe
                </button>
              </form>
            )}
            <button
              onClick={onHostClick}
              className="mt-4 text-sm font-semibold text-orange-400 hover:underline"
            >
              Become a host →
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 text-sm text-gray-500 flex flex-wrap items-center justify-between gap-3">
          <span>
            © {new Date().getFullYear()} Wanderdo. All rights reserved.
          </span>
          <span className="flex gap-5">
            <a href="#" className="hover:text-gray-300">
              Privacy
            </a>
            <a href="#" className="hover:text-gray-300">
              Terms
            </a>
            <a href="#" className="hover:text-gray-300">
              Help
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
