import { CATEGORIES, PRICE_RANGES } from '@/data/categories';
import * as Icons from 'lucide-react';

export default function Filters({
  activeCategory, setActiveCategory, priceIndex, setPriceIndex, sort, setSort, resultCount,
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <CategoryPill label="All" active={activeCategory === 'All'} onClick={() => setActiveCategory('All')} />
        {CATEGORIES.map((c) => {
          const Icon = Icons[c.icon] || Icons.Circle;
          return (
            <CategoryPill
              key={c.name}
              label={c.name}
              icon={<Icon className="w-4 h-4" />}
              active={activeCategory === c.name}
              onClick={() => setActiveCategory(c.name)}
            />
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {PRICE_RANGES.map((r, i) => (
            <button
              key={r.label}
              onClick={() => setPriceIndex(i)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${
                priceIndex === i
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm text-gray-500 hidden sm:block">{resultCount} experiences</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 outline-none focus:border-orange-300"
          >
            <option value="featured">Featured</option>
            <option value="rating">Top rated</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function CategoryPill({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition ${
        active
          ? 'bg-orange-500 text-white border-orange-500 shadow-sm shadow-orange-500/30'
          : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300'
      }`}
    >
      {icon} {label}
    </button>
  );
}