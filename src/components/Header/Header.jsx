import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  User,
  LogOut,
  BookOpen,
  Heart,
  Menu,
  X,
  Home,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import AuthModal from "../AuthModal/AuthModal";

function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    setShowMobileMenu(false);
    navigate("/");
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <span className="text-2xl font-bold text-primary-600">
                Wanderdo
              </span>
            </Link>

            <div className="hidden md:flex flex-1 max-w-md mx-6">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search experiences..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value.trim()) {
                      navigate(
                        `/explore?search=${encodeURIComponent(e.target.value)}`,
                      );
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <Link
                to="/host"
                className="hidden sm:inline-block text-sm font-medium text-gray-700 hover:text-primary-600 px-3 py-1.5 rounded-full hover:bg-gray-100 transition"
              >
                Become a Host
              </Link>

              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                      {user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span className="hidden md:inline text-sm text-gray-700 max-w-[100px] truncate">
                      {user?.name}
                    </span>
                  </button>

                  {showDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowDropdown(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        <Link
                          to="/bookings"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                          onClick={() => setShowDropdown(false)}
                        >
                          <BookOpen className="h-4 w-4" />
                          My Bookings
                        </Link>
                        <Link
                          to="/saved"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                          onClick={() => setShowDropdown(false)}
                        >
                          <Heart className="h-4 w-4" />
                          Saved
                        </Link>
                        <hr className="my-1" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition"
                        >
                          <LogOut className="h-4 w-4" />
                          Log Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition shadow-sm hover:shadow"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}

              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-full transition"
              >
                {showMobileMenu ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="md:hidden pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search experiences..."
                className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    navigate(
                      `/explore?search=${encodeURIComponent(e.target.value)}`,
                    );
                    setShowMobileMenu(false);
                  }
                }}
              />
            </div>
          </div>
        </div>

        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 bg-white py-2">
            <div className="container-custom flex flex-col gap-1">
              <Link
                to="/"
                className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                onClick={() => setShowMobileMenu(false)}
              >
                <Home className="h-5 w-5" />
                Home
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/bookings"
                    className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <BookOpen className="h-5 w-5" />
                    My Bookings
                  </Link>
                  <Link
                    to="/saved"
                    className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <Heart className="h-5 w-5" />
                    Saved
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <LogOut className="h-5 w-5" />
                    Log Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    setShowAuthModal(true);
                  }}
                  className="flex items-center gap-3 px-3 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition"
                >
                  <User className="h-5 w-5" />
                  Sign In
                </button>
              )}
              <Link
                to="/host"
                className="px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                onClick={() => setShowMobileMenu(false)}
              >
                Become a Host
              </Link>
            </div>
          </div>
        )}
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}

export default Header;
