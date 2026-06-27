import React, { useState, useEffect } from "react";
import Hero from "../components/Hero/Hero";
import ExperienceGrid from "../components/ExperienceGrid/ExperienceGrid";
import Filters from "../components/Filters/Filters";

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

  const mockExperiences = [
    {
      id: 1,
      title: "Cooking Class in Tuscany",
      category: "Classes",
      description:
        "Learn authentic Italian cooking from a local chef in the heart of Tuscany.",
      price: 89,
      rating: 4.9,
      reviews_count: 127,
      image_url:
        "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=300&fit=crop",
      location: "Florence, Italy",
      duration: "3 hours",
      host_name: "Maria Rossi",
      host_bio: "Professional chef with 15 years of experience",
      max_participants: 8,
    },
    {
      id: 2,
      title: "Mountain Hiking Adventure",
      category: "Hiking",
      description:
        "Guided hiking tour through the breathtaking Swiss Alps with stunning views.",
      price: 120,
      rating: 4.8,
      reviews_count: 89,
      image_url:
        "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop",
      location: "Swiss Alps, Switzerland",
      duration: "Full day",
      host_name: "Hans Müller",
      host_bio: "Mountain guide with 10+ years experience",
      max_participants: 6,
    },
    {
      id: 3,
      title: "Photography Workshop",
      category: "Photography",
      description:
        "Master photography techniques with a professional photographer in Barcelona.",
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
      description:
        "Professional football training with former pro players. Improve your skills.",
      price: 65,
      rating: 4.6,
      reviews_count: 45,
      image_url:
        "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=300&fit=crop",
      location: "London, UK",
      duration: "2 hours",
      host_name: "David Beckham Jr.",
      host_bio: "Former professional player",
      max_participants: 12,
    },
    {
      id: 5,
      title: "City Walking Tour",
      category: "Tours",
      description:
        "Explore the hidden gems of Paris with a local guide. Visit famous landmarks.",
      price: 45,
      rating: 4.5,
      reviews_count: 234,
      image_url:
        "https://images.unsplash.com/photo-1545987796-200677ee1011?w=400&h=300&fit=crop",
      location: "Paris, France",
      duration: "2.5 hours",
      host_name: "Sophie Martin",
      host_bio: "Local guide with 8 years experience",
      max_participants: 10,
    },
    {
      id: 6,
      title: "Wine Tasting Experience",
      category: "Classes",
      description:
        "Taste premium wines and learn about wine making from expert sommeliers.",
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
    setExperiences(mockExperiences);
    setLoading(false);
  }, []);

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
