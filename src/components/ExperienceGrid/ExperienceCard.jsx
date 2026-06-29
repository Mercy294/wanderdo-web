import { Heart, Star, MapPin, Clock } from "lucide-react";

export default function ExperienceCard({
  experience,
  exp,
  onView,
  isFavorite,
  onToggleFavorite,
}) {
  const item = experience || exp;
  if (!item) return null;

  return (
    <div
      className={`group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition duration-200 ${
        onView ? "cursor-pointer hover:-translate-y-1 hover:shadow-xl" : ""
      }`}
      onClick={onView ? () => onView(item) : undefined}
    >
      <div className="relative overflow-hidden">
        <img
          src={item.image_url}
          alt={item.title}
          className="h-64 w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-4 flex items-start justify-between px-4">
          {item.category ? (
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-gray-800 shadow-sm">
              {item.category}
            </span>
          ) : null}
          {onToggleFavorite ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onToggleFavorite(item.id);
              }}
              className="rounded-full bg-white/90 p-2 text-gray-700 shadow-sm transition hover:bg-white"
              aria-label="Toggle favorite"
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite ? "text-rose-500" : "text-gray-400"
                }`}
              />
            </button>
          ) : null}
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {item.location}
            </span>
            <span className="inline-flex items-center gap-1">
              <Star className="h-4 w-4 text-orange-500" />
              {item.rating?.toFixed(1) ?? "—"}
            </span>
            <span>{item.reviews_count ?? 0} reviews</span>
          </div>
          <div className="grid gap-2 text-sm text-slate-500 sm:grid-cols-2">
            <div className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4" /> {item.duration}
            </div>
            <p className="text-sm leading-6 text-slate-500 line-clamp-3 max-h-[4.5rem] overflow-hidden">
              {item.description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
          <div>
            <p className="text-lg font-semibold text-slate-900">
              ${item.price}
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              / person
            </p>
          </div>
          {onView ? (
            <span className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600">
              View
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
