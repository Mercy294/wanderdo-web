import { useState, useRef, useEffect } from "react";
import {
  Compass,
  Heart,
  Search,
  Plus,
  User as UserIcon,
  Ticket,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Header({
  search,
  setSearch,
  favoritesCount,
  onHostClick,
  onLogoClick,
  onAuthClick,
  onBookingsClick,
}) {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const displayName =
    user?.user_metadata?.name || user?.email?.split("@")[0] || "Account";

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        <button
          onClick={onLogoClick}
          className="flex items-center gap-2 shrink-0"
        >
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center text-white">
            <Compass className="w-5 h-5" />
          </span>
          <span className="font-extrabold text-xl tracking-tight text-gray-900 hidden sm:block">
            Wander<span className="text-orange-500">do</span>
          </span>
        </button>

        <div className="flex-1 max-w-xl mx-auto relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search experiences, places, hosts..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-gray-100 focus:bg-white border border-transparent focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none text-sm transition"
          />
        </div>

        <button
          onClick={onHostClick}
          className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-orange-600 transition"
        >
          <Plus className="w-4 h-4" /> Become a host
        </button>

        <button
          onClick={() =>
            document
              .getElementById("saved")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="relative p-2 rounded-full hover:bg-gray-100 transition"
          aria-label="Saved experiences"
        >
          <Heart className="w-5 h-5 text-gray-700" />
          {favoritesCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center font-bold">
              {favoritesCount}
            </span>
          )}
        </button>

        {user ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full border border-gray-200 hover:shadow-sm transition"
            >
              <span className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-rose-400 flex items-center justify-center text-white text-sm font-bold uppercase">
                {displayName.charAt(0)}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-50">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {displayName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onBookingsClick();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Ticket className="w-4 h-4" /> My bookings
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    document
                      .getElementById("saved")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Heart className="w-4 h-4" /> Saved experiences
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    signOut();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 border-t border-gray-50 mt-1"
                >
                  <LogOut className="w-4 h-4" /> Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onAuthClick}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold transition"
          >
            <UserIcon className="w-4 h-4" />{" "}
            <span className="hidden sm:inline">Sign in</span>
          </button>
        )}
      </div>
    </header>
  );
}
