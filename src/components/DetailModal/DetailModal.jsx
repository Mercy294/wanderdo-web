import { useEffect } from "react";
import { X, Star, Clock, MapPin, Users, Heart, Check } from "lucide-react";

const REVIEWS = [
  {
    name: "Olivia M.",
    text: "Absolutely magical experience. The host was warm, knowledgeable and made everyone feel welcome.",
    rating: 5,
  },
  {
    name: "Daniel K.",
    text: "Best thing we did on our whole trip. Highly recommend booking early!",
    rating: 5,
  },
  {
    name: "Priya S.",
    text: "Great value and so much fun. Came away having learned a real skill.",
    rating: 4,
  },
];

export default function DetailModal({
  exp,
  onClose,
  onBook,
  isFavorite,
  onToggleFavorite,
}) {
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
        className="bg-white rounded-2xl w-full max-w-3xl h-[92vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-full flex-col">
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="relative">
              <img
                src={exp.image_url}
                alt={exp.title}
                className="w-full h-64 sm:h-80 object-cover"
              />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-sm transition hover:bg-white"
              >
                <X className="h-5 w-5" />
              </button>
              <button
                onClick={() => onToggleFavorite(exp.id)}
                className="absolute top-4 right-16 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-sm transition hover:bg-white"
              >
                <Heart
                  className={`h-5 w-5 ${isFavorite ? "text-rose-500" : "text-slate-400"}`}
                />
              </button>
              <span className="absolute left-5 top-5 z-10 rounded-full bg-white/90 px-3 py-1.5 text-sm font-semibold text-slate-900 shadow-sm">
                {exp.category}
              </span>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-4">
                  <h2 className="text-3xl font-extrabold tracking-tight text-slate-950">
                    {exp.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-2 text-slate-900 font-semibold">
                      <Star className="h-4 w-4 text-orange-500" />
                      {exp.rating?.toFixed(1) ?? "-"}
                      <span className="text-slate-400">
                        ({exp.reviews_count ?? 0})
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> {exp.location}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Clock className="h-4 w-4" /> {exp.duration}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Users className="h-4 w-4" /> up to {exp.max_participants}
                    </span>
                  </div>
                </div>
                <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 px-5 py-4 text-right shadow-sm">
                  <p className="text-3xl font-extrabold text-slate-950">
                    ${exp.price}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">per person</p>
                </div>
              </div>

              <p className="text-slate-600 leading-7">{exp.description}</p>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  "Small group experience",
                  "All materials included",
                  "Free cancellation up to 24h",
                  "Hosted in English",
                ].map((f) => (
                  <div
                    key={f}
                    className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-700"
                  >
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span>{f}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-3xl bg-slate-50 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white text-lg font-bold">
                    {exp.host_name
                      .replace("Chef ", "")
                      .replace("Coach ", "")
                      .charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-950">
                      Hosted by {exp.host_name}
                    </p>
                    <p className="text-sm text-slate-500">{exp.host_bio}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-950">
                  What guests are saying
                </h3>
                <div className="mt-4 space-y-3">
                  {REVIEWS.map((r) => (
                    <div
                      key={r.name}
                      className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-semibold text-slate-950">{r.name}</p>
                        <span className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < r.rating ? "text-orange-500" : "text-slate-300"
                              }`}
                            />
                          ))}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-slate-600">{r.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-white p-4">
            <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-sm text-slate-500">
                  <span className="text-2xl font-extrabold text-slate-950">
                    ${exp.price}
                  </span>
                  <span className="ml-1">/ person</span>
                </div>
              </div>
              <button
                onClick={onBook}
                className="inline-flex h-12 items-center justify-center rounded-full bg-orange-500 px-8 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
              >
                Book now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
