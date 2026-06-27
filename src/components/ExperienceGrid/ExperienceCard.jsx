import React, { useState } from "react";
import { Heart, Star, MapPin, Clock } from "lucide-react";
import { useFavorites } from "../../context/FavoritesContext";

function ExperienceCard({ experience }) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const isFav = isFavorite(experience.id);

  const handleFavorite = (e) => {
    e.stopPropagation();
    if (isFav) {
      removeFavorite(experience.id);
    } else {
      addFavorite(experience.id);
    }
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer border border-gray-100">
      <div className="relative h-48 overflow-hidden">
        <img
          src={
            experience.image_url ||
            "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&h=300&fit=crop"
          }
          alt={experience.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition"
        >
          <Heart
            className={`h-5 w-5 ${isFav ? "fill-red-500 text-red-500" : "text-gray-600"}`}
          />
        </button>
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
          {experience.category}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
            {experience.title}
          </h3>
          <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            {experience.rating}
          </div>
        </div>

        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
          <MapPin className="h-3.5 w-3.5" />
          <span className="truncate">{experience.location}</span>
        </div>

        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
          <Clock className="h-3.5 w-3.5" />
          <span>{experience.duration}</span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-primary-600">
            ${experience.price}
          </span>
          <span className="text-sm text-gray-500">
            {experience.reviews_count} reviews
          </span>
        </div>
      </div>
    </div>
  );
}

export default ExperienceCard;
