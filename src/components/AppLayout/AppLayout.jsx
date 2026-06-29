import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { supabase } from "@/lib/supabase";
import { PRICE_RANGES, CATEGORIES } from "@/data/categories";
import { MOCK_EXPERIENCES } from "@/data/mockExperiences";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useAuth } from "@/contexts/AuthContext";
import * as Icons from "lucide-react";
import { Sparkles, Heart } from "lucide-react";
import Header from "../Header/Header";
import Hero from "../Hero/Hero";
import Filters from "../Filters/Filters";
import ExperienceCard from "../ExperienceGrid/ExperienceCard";
import BookingModal from "../BookingModal/BookingModal";
import DetailModal from "../DetailModal/DetailModal";
import HostModal from "../HostModal/HostModal";
import AuthModal from "../AuthModal/AuthModal";
import MyBookingsModal from "../../pages/MyBookings";
import Footer from "../Footer/Footer";

export default function AppLayout() {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [priceIndex, setPriceIndex] = useState(0);
  const [sort, setSort] = useState("featured");

  const [booking, setBooking] = useState(null);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [showHost, setShowHost] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showBookings, setShowBookings] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const { favorites, toggle, isFavorite } = useFavorites();
  const exploreRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:3001/api/experiences");
        const data = await res.json();
        setExperiences(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch experiences:", err);
        setExperiences([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    let list = [...experiences];
    if (activeCategory !== "All")
      list = list.filter((e) => e.category === activeCategory);
    const range = PRICE_RANGES[priceIndex];
    list = list.filter((e) => e.price >= range.min && e.price <= range.max);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.host_name.toLowerCase().includes(q),
      );
    }
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    else if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else list.sort((a, b) => Number(b.featured) - Number(a.featured));
    return list;
  }, [experiences, activeCategory, priceIndex, search, sort]);

  const savedExperiences = experiences.filter((e) => favorites.includes(e.id));

  useEffect(() => {
    if (!id) {
      setSelectedExperience(null);
      return;
    }
    const found = experiences.find((e) => e.id === id || e.id === Number(id));
    setSelectedExperience(found || null);
  }, [id, experiences]);

  const scrollToExplore = () =>
    exploreRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-white">
      <Header
        search={search}
        setSearch={setSearch}
        favoritesCount={favorites.length}
        onHostClick={() => setShowHost(true)}
        onLogoClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        onAuthClick={() => setShowAuth(true)}
        onBookingsClick={() =>
          user ? setShowBookings(true) : setShowAuth(true)
        }
      />

      <Hero onExplore={scrollToExplore} onHostClick={() => setShowHost(true)} />

      {/* Category quick links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-10 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 grid grid-cols-3 sm:grid-cols-6 gap-2">
          {CATEGORIES.map((c) => {
            const Icon = Icons[c.icon] || Icons.Circle;
            return (
              <button
                key={c.name}
                onClick={() => {
                  setActiveCategory(c.name);
                  scrollToExplore();
                }}
                className="flex flex-col items-center gap-2 py-3 rounded-xl hover:bg-gray-50 transition"
              >
                <span
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.color}`}
                >
                  <Icon className="w-6 h-6" />
                </span>
                <span className="text-sm font-semibold text-gray-700">
                  {c.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Explore */}
      <section
        ref={exploreRef}
        id="explore"
        className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 scroll-mt-20"
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-orange-500" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Explore experiences
          </h2>
        </div>
        <p className="text-gray-500 mb-6">
          Hand-picked things to do, taught by people who love them.
        </p>

        <Filters
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          priceIndex={priceIndex}
          setPriceIndex={setPriceIndex}
          sort={sort}
          setSort={setSort}
          resultCount={filtered.length}
        />

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
                >
                  <div className="aspect-[4/3] bg-gray-100" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))
            : filtered.map((exp) => (
                <ExperienceCard
                  key={exp.id}
                  exp={exp}
                  onView={() => navigate(`/experience/${exp.id}`)}
                  isFavorite={isFavorite(exp.id)}
                  onToggleFavorite={toggle}
                />
              ))}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg font-semibold">
              No experiences match your filters.
            </p>
            <button
              onClick={() => {
                setActiveCategory("All");
                setPriceIndex(0);
                setSearch("");
              }}
              className="mt-3 text-orange-600 font-semibold hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </section>

      {/* Saved */}
      <section
        id="saved"
        className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 scroll-mt-20"
      >
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-5 h-5 text-rose-500" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Your saved experiences
          </h2>
        </div>
        {savedExperiences.length === 0 ? (
          <div className="mb-6">
            <p className="text-gray-500">
              Tap the heart on any experience to save it here for later.
            </p>
            {!user && (
              <button
                onClick={() => setShowAuth(true)}
                className="mt-2 text-sm font-semibold text-orange-600 hover:underline"
              >
                Sign in to sync your saves across devices →
              </button>
            )}
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedExperiences.map((exp) => (
              <ExperienceCard
                key={exp.id}
                exp={exp}
                onView={() => navigate(`/experience/${exp.id}`)}
                isFavorite
                onToggleFavorite={toggle}
              />
            ))}
          </div>
        )}
      </section>

      {/* Host CTA banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-20">
        <div className="rounded-3xl bg-gradient-to-br from-orange-500 to-rose-500 p-10 sm:p-14 text-white relative overflow-hidden">
          <div className="relative max-w-xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold">
              Share your passion. Earn doing what you love.
            </h2>
            <p className="mt-3 text-white/90 text-lg">
              Join thousands of hosts turning their skills into income. List for
              free and keep 85% of every booking.
            </p>
            <button
              onClick={() => setShowHost(true)}
              className="mt-6 px-7 py-3.5 rounded-full bg-white text-orange-600 font-bold hover:bg-orange-50 transition"
            >
              Start hosting today
            </button>
          </div>
        </div>
      </section>

      <Footer onHostClick={() => setShowHost(true)} />

      {booking && (
        <BookingModal exp={booking} onClose={() => setBooking(null)} />
      )}
      {selectedExperience && (
        <DetailModal
          exp={selectedExperience}
          onClose={() => {
            setSelectedExperience(null);
            navigate("/");
          }}
          onBook={(exp) => {
            setBooking(exp);
            setSelectedExperience(null);
            navigate("/");
          }}
          isFavorite={isFavorite(selectedExperience.id)}
          onToggleFavorite={toggle}
        />
      )}
      {showHost && <HostModal onClose={() => setShowHost(false)} />}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {showBookings && (
        <MyBookingsModal onClose={() => setShowBookings(false)} />
      )}
    </div>
  );
}
