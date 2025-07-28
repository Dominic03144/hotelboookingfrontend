import { useParams, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

import type { Hotel } from "../../types/hotel";

// Existing images
import grandPlazaHero from "../../assets/hotels/grand-plaza.jpg";
import grandPlazaGallery1 from "../../assets/hotels/grand-plaza-gallery1.jpg";
import grandPlazaGallery2 from "../../assets/hotels/grand-plaza-gallery2.jpg";

import coastalParadiseHero from "../../assets/hotels/coastal-paradise.jpg";
import coastalParadiseGallery1 from "../../assets/hotels/coastal-paradise-gallery1.jpg";
import coastalParadiseGallery2 from "../../assets/hotels/coastal-paradise-gallery2.jpg";

import westonHero from "../../assets/hotels/weston-hero.jpg";
import westonGallery1 from "../../assets/hotels/weston-gallery1.jpg";
import westonGallery2 from "../../assets/hotels/weston-gallery2.jpg";

import hustlerHero from "../../assets/hotels/hustler-hero.jpg";
import hustlerGallery1 from "../../assets/hotels/hustler-gallery1.jpg";
import hustlerGallery2 from "../../assets/hotels/hustler-gallery2.jpg";

interface Review {
  name: string;
  comment: string;
  stars: number;
}

const HotelDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchHotelAndReviews = async () => {
      try {
        const hotelRes = await fetch(`${API_BASE}/hotels/${id}`);
        if (!hotelRes.ok)
          throw new Error(`Hotel fetch error! Status: ${hotelRes.status}`);
        const hotelData = await hotelRes.json();
        setHotel(hotelData);

        const reviewsRes = await fetch(`${API_BASE}/hotels/${id}/reviews`);
        if (!reviewsRes.ok)
          throw new Error(`Reviews fetch error! Status: ${reviewsRes.status}`);
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData);
      } catch (err: any) {
        setError(err.message || "Failed to fetch hotel details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHotelAndReviews();
    } else {
      setError("No hotel ID found in URL.");
      setLoading(false);
    }
  }, [id, API_BASE]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading hotel details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        No hotel found.
      </div>
    );
  }

  let heroImage = hotel.imageUrl;
  let gallery: string[] = [];

  const name = hotel.hotelName.toLowerCase();
  if (name.includes("grand")) {
    heroImage = grandPlazaHero;
    gallery = [grandPlazaHero, grandPlazaGallery1, grandPlazaGallery2];
  } else if (name.includes("coastal")) {
    heroImage = coastalParadiseHero;
    gallery = [coastalParadiseHero, coastalParadiseGallery1, coastalParadiseGallery2];
  } else if (name.includes("weston")) {
    heroImage = westonHero;
    gallery = [westonHero, westonGallery1, westonGallery2];
  } else if (name.includes("hustler")) {
    heroImage = hustlerHero;
    gallery = [hustlerHero, hustlerGallery1, hustlerGallery2];
  } else {
    heroImage = hotel.imageUrl || "https://via.placeholder.com/1200x500?text=No+Image";
    gallery = [
      heroImage,
      "https://source.unsplash.com/random/800x400?hotel",
      "https://source.unsplash.com/random/800x400?resort",
    ];
  }

  if (hotel.galleryImages?.length) {
    gallery = hotel.galleryImages;
  }

  const amenities = hotel.amenities
    ? hotel.amenities.split(",").map((a) => a.trim())
    : ["Free WiFi", "Swimming Pool", "Spa", "Gym", "Parking"];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative overflow-hidden">
        <img
          src={heroImage}
          alt={hotel.hotelName}
          className="w-full h-80 object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute bottom-5 right-5">
          <Link
            to={`/hotels/${hotel.hotelId}/rooms`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow font-semibold"
          >
            View Rooms
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 md:p-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4 md:mb-0">
            {hotel.hotelName}
          </h1>
          <div className="flex flex-wrap gap-4 text-gray-700">
            <span className="bg-blue-50 px-3 py-1 rounded-full shadow text-sm">⭐ {hotel.rating}</span>
            <span className="bg-blue-50 px-3 py-1 rounded-full shadow text-sm">📍 {hotel.city}</span>
            <span className="bg-blue-50 px-3 py-1 rounded-full shadow text-sm">🏷️ {hotel.category}</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-10">
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold text-blue-700">About</h2>
            <p className="text-gray-700">
              Enjoy a luxurious stay at <strong>{hotel.hotelName}</strong> in {hotel.city}. Expect
              premium amenities, comfort, and exceptional service.
            </p>
          </div>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded shadow">
              <p className="text-gray-700">
                <strong>📍 Location:</strong> {hotel.location}
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded shadow">
              <p className="text-gray-700">
                <strong>🏠 Address:</strong> {hotel.address}
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded shadow">
              <p className="text-gray-700">
                <strong>📞 Contact:</strong> {hotel.contactPhone}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">Amenities</h2>
          <ul className="flex flex-wrap gap-3">
            {amenities.map((item, idx) => (
              <li
                key={idx}
                className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm shadow"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map((img, idx) => (
              <div
                key={idx}
                className="relative overflow-hidden rounded-xl shadow group"
              >
                <img
                  src={img}
                  alt={`Gallery ${idx + 1}`}
                  className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition duration-500" />
              </div>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">Reviews</h2>
          {reviews.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {reviews.map((review, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded shadow">
                  <p className="font-semibold">{review.name}</p>
                  <p className="text-yellow-500">{"⭐".repeat(review.stars)}</p>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No reviews yet for this hotel.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelDetailsPage;
