import { CATEGORIES, PRICE_RANGES } from "@/data/categories";
import * as Icons from "lucide-react";

export default function Filters({
  activeCategory,
  setActiveCategory,
  priceIndex,
  setPriceIndex,
  sort,
  setSort,
  resultCount,
  filters,
  setFilters,
}) {
  const usingLegacy = Boolean(filters && setFilters);

  const currentCategory = usingLegacy
    ? filters.category || "All"
    : activeCategory || "All";

  const currentSort = usingLegacy
    ? filters.sort || "newest"
    : sort || "featured";

  const legacyPriceIndex = PRICE_RANGES.findIndex((range) => {
    const min =
      filters?.minPrice === "" || filters?.minPrice === undefined
        ? 0
        : Number(filters.minPrice);
    const max =
      filters?.maxPrice === "" || filters?.maxPrice === undefined
        ? Infinity
        : Number(filters.maxPrice);
    return range.min === min && range.max === max;
  });

  const currentPriceIndex = usingLegacy
    ? legacyPriceIndex >= 0
      ? legacyPriceIndex
      : 0
    : priceIndex || 0;

  const updateCategory = (category) => {
    if (usingLegacy) {
      setFilters((prev) => ({ ...prev, category }));
    } else {
      setActiveCategory(category);
    }
  };

  const updatePriceIndex = (index) => {
    if (usingLegacy) {
      const range = PRICE_RANGES[index];
      setFilters((prev) => ({
        ...prev,
        minPrice: range.min === 0 ? "" : range.min,
        maxPrice: range.max === Infinity ? "" : range.max,
      }));
    } else {
      setPriceIndex(index);
    }
  };

  const updateSort = (value) => {
    if (usingLegacy) {
      setFilters((prev) => ({ ...prev, sort: value }));
    } else {
      setSort(value);
    }
  };

  const updateSearch = (value) => {
    if (usingLegacy) {
      setFilters((prev) => ({ ...prev, search: value }));
    }
  };

  return (
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => updateCategory("All")}
          className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition ${
            currentCategory === "All"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.name}
            type="button"
            onClick={() => updateCategory(c.name)}
            className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition ${
              currentCategory === c.name
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {PRICE_RANGES.map((range, index) => (
            <button
              key={range.label}
              type="button"
              onClick={() => updatePriceIndex(index)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                currentPriceIndex === index
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3">
          {resultCount !== undefined && (
            <span className="text-sm text-slate-500 hidden sm:inline">
              {resultCount} experiences
            </span>
          )}
          <div className="relative inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-2">
            <select
              value={currentSort}
              onChange={(e) => updateSort(e.target.value)}
              className="appearance-none rounded-full border-0 bg-transparent pr-8 text-sm text-slate-700 outline-none"
            >
              <option value="featured">Featured</option>
              <option value="rating">Top rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <span className="pointer-events-none absolute right-3 text-slate-400">
              ▾
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
