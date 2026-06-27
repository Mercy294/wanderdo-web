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
        className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img
            src={exp.image_url}
            alt={exp.title}
            className="w-full h-64 sm:h-80 object-cover rounded-t-2xl"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:scale-105 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            onClick={() => onToggleFavorite(exp.id)}
            className="absolute top-4 right-16 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:scale-105 transition"
          >
            <Heart
              className={`w-5 h-5 ${isFavorite ? "fill-rose-500 text-rose-500" : "text-gray-700"}`}
            />
          </button>
          <span className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-white/90 text-sm font-semibold">
            {exp.category}
          </span>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">
                {exp.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1 text-gray-900 font-semibold">
                  <Star className="w-4 h-4 fill-orange-400 text-orange-400" />{" "}
                  {exp.rating}{" "}
                  <span className="text-gray-400 font-normal">
                    ({exp.reviews_count})
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {exp.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {exp.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" /> up to {exp.max_participants}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-extrabold text-gray-900">
                ${exp.price}
              </div>
              <div className="text-sm text-gray-500">per person</div>
            </div>
          </div>

          <p className="text-gray-600 mt-5 leading-relaxed">
            {exp.description}
          </p>

          <div className="mt-6 grid sm:grid-cols-2 gap-3">
            {[
              "Small group experience",
              "All materials included",
              "Free cancellation up to 24h",
              "Hosted in English",
            ].map((f) => (
              <div
                key={f}
                className="flex items-center gap-2 text-sm text-gray-700"
              >
                <Check className="w-4 h-4 text-emerald-500" /> {f}
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-gray-50 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-rose-400 flex items-center justify-center text-white font-bold text-lg">
              {exp.host_name
                .replace("Chef ", "")
                .replace("Coach ", "")
                .charAt(0)}
            </div>
            <div>
              <div className="font-bold text-gray-900">
                Hosted by {exp.host_name}
              </div>
              <div className="text-sm text-gray-500">{exp.host_bio}</div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-bold text-gray-900 mb-3">
              What guests are saying
            </h3>
            <div className="space-y-3">
              {REVIEWS.map((r) => (
                <div
                  key={r.name}
                  className="p-4 rounded-xl border border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">
                      {r.name}
                    </span>
                    <span className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < r.rating ? "fill-orange-400 text-orange-400" : "text-gray-200"}`}
                        />
                      ))}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1.5">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 flex items-center justify-between">
          <div>
            <span className="text-xl font-extrabold text-gray-900">
              ${exp.price}
            </span>
            <span className="text-sm text-gray-500"> / person</span>
          </div>
          <button
            onClick={onBook}
            className="px-8 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg shadow-orange-500/30 transition"
          >
            Book now
          </button>
        </div>
      </div>
    </div>
  );
}
