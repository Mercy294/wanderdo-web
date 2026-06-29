import { useEffect, useState } from "react";
import { X, Sparkles, Globe, Loader2, Check } from "lucide-react";

const CATEGORIES = ["Classes", "Hiking", "Photography", "Sports", "Tours"];

export default function HostModal({ onClose }) {
  const [step, setStep] = useState("form"); // form | success
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({
    host_name: "",
    host_bio: "",
    title: "",
    category: "",
    description: "",
    price: "",
    location: "",
    duration: "",
    max_participants: "",
    image_url: "",
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    if (
      !form.title ||
      !form.category ||
      !form.description ||
      !form.price ||
      !form.location ||
      !form.duration
    ) {
      setErr("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/experiences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          category: form.category,
          description: form.description,
          price: Number(form.price),
          location: form.location,
          duration: form.duration,
          max_participants: Number(form.max_participants) || 10,
          image_url:
            form.image_url ||
            "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400",
          host_id: "1",
          rating: 0,
          reviews_count: 0,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit");
      setStep("success");
    } catch (error) {
      setErr("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 sticky top-0 bg-white">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white">
              <Globe className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Become a host
              </h2>
              <p className="text-sm text-gray-500">
                Share your passion with travelers worldwide.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-8">
          {step === "success" ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900">
                Experience listed!
              </h3>
              <p className="text-gray-500 mt-2">
                Your experience is now live on Wanderdo.
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-3 rounded-2xl bg-orange-500 text-white font-bold hover:bg-orange-600"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="rounded-3xl bg-orange-50 p-5 text-orange-700">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5" />
                  <span className="font-semibold">Fast setup</span>
                </div>
                <p className="mt-3 text-sm text-orange-700/90">
                  Fill in your experience details and go live in minutes.
                </p>
              </div>

              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                About you
              </p>

              <label className="block space-y-1 text-sm text-gray-700">
                <span>
                  Your name <span className="text-rose-500">*</span>
                </span>
                <input
                  value={form.host_name}
                  onChange={set("host_name")}
                  type="text"
                  placeholder="Maria Rossi"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-orange-300"
                />
              </label>

              <label className="block space-y-1 text-sm text-gray-700">
                <span>Short bio</span>
                <input
                  value={form.host_bio}
                  onChange={set("host_bio")}
                  type="text"
                  placeholder="Professional chef with 15 years experience"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-orange-300"
                />
              </label>

              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide pt-2">
                Experience details
              </p>

              <label className="block space-y-1 text-sm text-gray-700">
                <span>
                  Title <span className="text-rose-500">*</span>
                </span>
                <input
                  value={form.title}
                  onChange={set("title")}
                  type="text"
                  placeholder="Cooking Class in Tuscany"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-orange-300"
                />
              </label>

              <label className="block space-y-1 text-sm text-gray-700">
                <span>
                  Category <span className="text-rose-500">*</span>
                </span>
                <select
                  value={form.category}
                  onChange={set("category")}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-orange-300"
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-1 text-sm text-gray-700">
                <span>
                  Description <span className="text-rose-500">*</span>
                </span>
                <textarea
                  value={form.description}
                  onChange={set("description")}
                  rows={3}
                  placeholder="Describe your experience..."
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-orange-300 resize-none"
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block space-y-1 text-sm text-gray-700">
                  <span>
                    Price (USD) <span className="text-rose-500">*</span>
                  </span>
                  <input
                    value={form.price}
                    onChange={set("price")}
                    type="number"
                    min="1"
                    placeholder="89"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-orange-300"
                  />
                </label>
                <label className="block space-y-1 text-sm text-gray-700">
                  <span>Max participants</span>
                  <input
                    value={form.max_participants}
                    onChange={set("max_participants")}
                    type="number"
                    min="1"
                    placeholder="8"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-orange-300"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="block space-y-1 text-sm text-gray-700">
                  <span>
                    Location <span className="text-rose-500">*</span>
                  </span>
                  <input
                    value={form.location}
                    onChange={set("location")}
                    type="text"
                    placeholder="Florence, Italy"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-orange-300"
                  />
                </label>
                <label className="block space-y-1 text-sm text-gray-700">
                  <span>
                    Duration <span className="text-rose-500">*</span>
                  </span>
                  <input
                    value={form.duration}
                    onChange={set("duration")}
                    type="text"
                    placeholder="3 hours"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-orange-300"
                  />
                </label>
              </div>

              <label className="block space-y-1 text-sm text-gray-700">
                <span>Image URL</span>
                <input
                  value={form.image_url}
                  onChange={set("image_url")}
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-orange-300"
                />
              </label>

              {err && <p className="text-sm text-rose-600">{err}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                List my experience
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
