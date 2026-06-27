import { useState, useEffect } from "react";
import { X, Loader2, Compass } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthModal({ onClose }) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setInfo("");
    if (!email || !password || (mode === "signup" && !name)) {
      setErr("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    if (mode === "signup") {
      const { error } = await signUp(email, password, name);
      setLoading(false);
      if (error) {
        setErr(error);
        return;
      }
      onClose();
    } else {
      const { error } = await signIn(email, password);
      setLoading(false);
      if (error) {
        setErr(error);
        return;
      }
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-gradient-to-br from-orange-500 to-rose-500 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </span>
            <span className="font-extrabold text-xl">Wanderdo</span>
          </div>
          <h2 className="text-2xl font-extrabold">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-white/90 text-sm mt-1">
            {mode === "login"
              ? "Log in to see your bookings & saved experiences."
              : "Sign up to sync your bookings and favorites across devices."}
          </p>
        </div>

        <form onSubmit={submit} className="p-6 space-y-3">
          {mode === "signup" && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-orange-300 text-sm"
            />
          )}
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-orange-300 text-sm"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-orange-300 text-sm"
          />

          {err && <p className="text-sm text-rose-600">{err}</p>}
          {info && <p className="text-sm text-emerald-600">{info}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {mode === "login" ? "Log in" : "Sign up"}
          </button>

          <p className="text-center text-sm text-gray-500">
            {mode === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setErr("");
              }}
              className="font-semibold text-orange-600 hover:underline"
            >
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
