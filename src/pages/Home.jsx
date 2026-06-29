import React, { useState, useEffect } from "react";
import Hero from "../components/Hero/Hero";
import ExperienceGrid from "../components/ExperienceGrid/ExperienceGrid";
import Filters from "../components/Filters/Filters";

const API_URL = "http://localhost:3001/api";

function Home() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    search: "",
    sort: "newest",
  });

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
        setExperiences(data);
      } catch (err) {
        console.error("Failed to fetch experiences:", err);
        setExperiences([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, [filters]);

  return (
    <div>
      <Hero />
      <div className="container-custom py-12">
        <Filters filters={filters} setFilters={setFilters} />
        <ExperienceGrid experiences={experiences} loading={loading} />
      </div>
    </div>
  );
}

export default Home;
