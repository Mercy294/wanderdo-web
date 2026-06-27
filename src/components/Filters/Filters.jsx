import React from "react";
import { Search, Filter, X } from "lucide-react";

function Filters({ filters, setFilters }) {
  const categories = [
    "All",
    "Classes",
    "Hiking",
    "Photography",
    "Sports",
    "Tours",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      search: "",
      sort: "newest",
    });
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search experiences..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  category: cat === "All" ? "" : cat,
                }))
              }
              className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition ${
                (cat === "All" && !filters.category) || filters.category === cat
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 mt-4">
        {/* Price Range */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Price:</span>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
            placeholder="Min"
            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            placeholder="Max"
            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Sort */}
        <select
          name="sort"
          value={filters.sort}
          onChange={handleChange}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating_desc">Highest Rated</option>
        </select>

        {/* Clear Filters */}
        {(filters.search ||
          filters.category ||
          filters.minPrice ||
          filters.maxPrice) && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 transition"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}

export default Filters;
