import React, { useState, useEffect } from "react";
import ExperienceGrid from "../components/ExperienceGrid/ExperienceGrid";
import Filters from "../components/Filters/Filters";
import { useFavorites } from "../context/FavoritesContext";

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

  const mockExperiences = [
    {
      id: 1,
      title: "Cooking Class in Tuscany",
      category: "Classes",
      description: "Learn authentic Italian cooking from a local chef.",
      price: 89,
      rating: 4.9,
      reviews_count: 127,
      image_url:
        "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=300&fit=crop",
      location: "Florence, Italy",
      duration: "3 hours",
      host_name: "Maria Rossi",
      host_bio: "Professional chef",
      max_participants: 8,
    },
    {
      id: 2,
      title: "Mountain Hiking Adventure",
      category: "Hiking",
      description: "Guided hiking through the Swiss Alps.",
      price: 120,
      rating: 4.8,
      reviews_count: 89,
      image_url:
        "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop",
      location: "Swiss Alps",
      duration: "Full day",
      host_name: "Hans Müller",
      host_bio: "Mountain guide",
      max_participants: 6,
    },
    {
      id: 3,
      title: "Photography Workshop",
      category: "Photography",
      description: "Master photography techniques.",
      price: 150,
      rating: 4.7,
      reviews_count: 64,
      image_url:
        "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=300&fit=crop",
      location: "Barcelona, Spain",
      duration: "4 hours",
      host_name: "Carlos Garcia",
      host_bio: "Award-winning photographer",
      max_participants: 5,
    },
    {
      id: 4,
      title: "Football Training Session",
      category: "Sports",
      description: "Professional football training.",
      price: 65,
      rating: 4.6,
      reviews_count: 45,
      image_url:
        "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=300&fit=crop",
      location: "London, UK",
      duration: "2 hours",
      host_name: "David Beckham Jr.",
      host_bio: "Former pro player",
      max_participants: 12,
    },
    {
      id: 5,
      title: "City Walking Tour",
      category: "Tours",
      description: "Explore hidden gems of Paris.",
      price: 45,
      rating: 4.5,
      reviews_count: 234,
      image_url:
        "https://images.unsplash.com/photo-1545987796-200677ee1011?w=400&h=300&fit=crop",
      location: "Paris, France",
      duration: "2.5 hours",
      host_name: "Sophie Martin",
      host_bio: "Local guide",
      max_participants: 10,
    },
    {
      id: 6,
      title: "Wine Tasting Experience",
      category: "Classes",
      description: "Taste premium wines.",
      price: 95,
      rating: 4.9,
      reviews_count: 156,
      image_url:
        "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&h=300&fit=crop",
      location: "Napa Valley, USA",
      duration: "3 hours",
      host_name: "John Smith",
      host_bio: "Certified sommelier",
      max_participants: 8,
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      if (showSaved) {
        const saved = mockExperiences.filter((exp) =>
          favorites.includes(exp.id),
        );
        setExperiences(saved);
      } else {
        setExperiences(mockExperiences);
      }
      setLoading(false);
    }, 500);
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
