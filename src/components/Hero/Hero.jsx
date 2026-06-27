import React from "react";
import { Search, Star, Users, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            Discover Unique Experiences
          </h1>
          <p className="text-lg md:text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Book cooking classes, hiking adventures, photography workshops, and
            more — all led by passionate local hosts.
          </p>

          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for experiences..."
                className="w-full pl-12 pr-4 py-3 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-white text-primary-700 font-semibold rounded-full hover:bg-gray-100 transition shadow-lg hover:shadow-xl"
            >
              Explore Now
            </button>
          </form>

          <div className="grid grid-cols-3 gap-4 mt-12 max-w-lg mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                4.9
              </div>
              <p className="text-sm text-primary-100">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">500+</div>
              <p className="text-sm text-primary-100">Experiences</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">10k+</div>
              <p className="text-sm text-primary-100">Happy Customers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
