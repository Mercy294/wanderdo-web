import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, Star, Clock, Users, Check, X, Heart } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useAuth } from "@/contexts/AuthContext";
import { MOCK_EXPERIENCES } from "@/data/mockExperiences";
import BookingModal from "@/components/BookingModal/BookingModal";

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

export default function ExperienceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorite, toggle } = useFavorites();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const loadExperience = async () => {
      const experienceId = Number(id);
      if (!experienceId) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .eq("id", experienceId)
        .single();

      if (!error && data) {
        setExperience(data);
      } else {
        const fallback = MOCK_EXPERIENCES.find(
          (item) => item.id === experienceId,
        );
        setExperience(fallback || null);
      }
      setLoading(false);
    };

    loadExperience();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-80 rounded-3xl bg-gray-200" />
          <div className="h-8 w-1/3 rounded-full bg-gray-200" />
          <div className="h-6 w-1/2 rounded-full bg-gray-200" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-72 rounded-3xl bg-gray-200" />
            <div className="h-72 rounded-3xl bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen bg-white px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Experience not found
          </h1>
          <p className="mt-4 text-gray-500">
            The experience you were looking for could not be found.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 inline-flex items-center rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-black/5">
        <div className="relative h-[420px]">
          <img
            src={experience.image_url}
            alt={experience.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-slate-950/5 to-slate-950/60" />
          <div className="absolute left-5 top-5">
            <span className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm">
              {experience.category}
            </span>
          </div>
          <div className="absolute right-5 top-5 flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggle(experience.id)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-sm transition hover:bg-white"
            >
              <Heart
                className={`h-5 w-5 ${
                  isFavorite(experience.id) ? "text-rose-500" : "text-slate-400"
                }`}
              />
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-sm transition hover:bg-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-10 px-6 py-8 sm:px-8 sm:py-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <Star className="h-4 w-4 text-orange-500" />
                  {experience.rating?.toFixed(1) ?? "—"}
                </span>
                <span>{experience.reviews_count ?? 0} reviews</span>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {experience.location}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {experience.duration}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  up to {experience.max_participants}
                </span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                {experience.title}
              </h1>
              <p className="max-w-3xl text-base leading-7 text-slate-600">
                {experience.description}
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 text-right shadow-sm">
              <p className="text-4xl font-extrabold text-slate-950">
                ${experience.price}
              </p>
              <p className="mt-2 text-sm uppercase tracking-[0.2em] text-slate-500">
                per person
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Small group experience",
              "All materials included",
              "Free cancellation up to 24h",
              "Hosted in English",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-3xl bg-slate-50 px-5 py-4 text-slate-700"
              >
                <Check className="h-5 w-5 text-emerald-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white text-lg font-bold">
                  {experience.host_name?.charAt(0) ?? "H"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Hosted by {experience.host_name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {experience.host_bio}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900">
                What guests are saying
              </h2>
              <div className="mt-5 space-y-4">
                {REVIEWS.map((review) => (
                  <div
                    key={review.name}
                    className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-semibold text-slate-900">
                        {review.name}
                      </p>
                      <span className="flex items-center gap-1 text-orange-500">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            className={`h-4 w-4 ${
                              index < review.rating
                                ? "text-orange-500"
                                : "text-slate-300"
                            }`}
                          />
                        ))}
                      </span>
                    </div>
                    <p className="mt-3 text-slate-600">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 bg-white/95 border-t border-slate-200 px-4 py-4 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Total</p>
            <p className="text-2xl font-extrabold text-slate-950">
              ${experience.price}{" "}
              <span className="text-base font-medium text-slate-500">
                / person
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => setBooking(experience)}
            className="inline-flex items-center justify-center rounded-full bg-orange-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
          >
            Book now
          </button>
        </div>
      </div>

      {booking && (
        <BookingModal exp={booking} onClose={() => setBooking(null)} />
      )}
    </div>
  );
}
