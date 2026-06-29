import React, { useState, useEffect } from "react";
import ExperienceGrid from "../components/ExperienceGrid/ExperienceGrid";
import Filters from "../components/Filters/Filters";
import { useFavorites } from "../context/FavoritesContext";

const API_URL = "http://localhost:3001/api";

function Explore({ showSaved = false }) {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    search: "",
    sort: "newest",
  });
  const { favorites } = useFavorites();

  useEffect(() => {
    const fetchExperiences = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.category) params.append("category", filters.category);
        if (filters.minPrice) params.append("minPrice", filters.minPrice);
        if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
        if (filters.search) params.append("search", filters.search);
        if (filters.sort) params.append("sort", filters.sort);

        const res = await fetch(`${API_URL}/experiences?${params}`);
        const data = await res.json();

        if (showSaved) {
          setExperiences(data.filter((exp) => favorites.includes(exp.id)));
        } else {
          setExperiences(data);
        }
      } catch (err) {
        console.error("Failed to fetch experiences:", err);
        setExperiences([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, [filters, showSaved, favorites]);

  return (
    <div className="container-custom py-12">
      {!showSaved && <Filters filters={filters} setFilters={setFilters} />}
      <h1 className="text-3xl font-bold mb-8">
        {showSaved ? "Your Saved Experiences" : "Explore All Experiences"}
      </h1>
      <ExperienceGrid experiences={experiences} loading={loading} />
    </div>
  );
}

export default Explore;
