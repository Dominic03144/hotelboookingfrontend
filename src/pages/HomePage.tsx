import React from "react";
import { Link, useNavigate } from "react-router-dom";

import bgImage from "../assets/landing/hero.jpg";
import grandPlazaImg from "../assets/hotels/grand-plaza.jpg";
import coastalParadiseImg from "../assets/hotels/coastal-paradise.jpg";

import maryImg from "../assets/testimonials/mary.jpg";
import kevinImg from "../assets/testimonials/kevin.jpg";
import aminaImg from "../assets/testimonials/amina.jpg";

import Footer from "../components/footer";

type Hotel = {
  id: number;
  name: string;
  location: string;
  image: string;
  description: string;
};

const featuredHotels: Hotel[] = [
  {
    id: 1,
    name: "Grand Plaza Hotel",
    location: "Nairobi, Kenya",
    image: grandPlazaImg,
    description:
      "A luxury experience in the heart of Nairobi with rooftop dining and modern rooms.",
  },
  {
    id: 2,
    name: "Coastal Paradise",
    location: "Mombasa, Kenya",
    image: coastalParadiseImg,
    description:
      "Enjoy ocean views, beach access, and spa services at this tropical escape.",
  },
];

const testimonials = [
  {
    id: 1,
    name: "Mary N.",
    hotel: "Sunset Paradise",
    image: maryImg,
    feedback:
      "I booked a room for my vacation in under 5 minutes — super easy and affordable!",
  },
  {
    id: 2,
    name: "Kevin O.",
    hotel: "Mountain Inn",
    image: kevinImg,
    feedback:
      "The hotel was just as described, and check-in was smooth. Highly recommend!",
  },
  {
    id: 3,
    name: "Amina W.",
    hotel: "Lakeview Resort",
    image: aminaImg,
    feedback:
      "Customer support helped me change dates without any hassle. Very professional.",
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  const handleViewDetails = (id: number) => {
    navigate(`/hotels/${id}`);
  };

  const handleViewRooms = (id: number) => {
    navigate(`/hotels/${id}/rooms`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-grow w-full">
        {/* ✅ Hero Section with Search */}
        <section
          className="h-[80vh] bg-cover bg-center flex items-center justify-center text-white text-center relative overflow-hidden"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60 z-0"></div>
          <div className="relative z-10 px-6 py-10 max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow">
              Book Your Dream Stay
            </h1>
            <p className="text-lg md:text-xl mb-6 text-white drop-shadow">
              Trusted by thousands across Kenya & beyond
            </p>
            {/* 🔍 Mini Search */}
            <form className="bg-white/20 backdrop-blur p-4 rounded-lg grid gap-4 md:grid-cols-4">
              <input
                type="text"
                placeholder="Destination"
                className="px-4 py-2 rounded text-black"
              />
              <input
                type="date"
                placeholder="Check-in"
                className="px-4 py-2 rounded text-black"
              />
              <input
                type="date"
                placeholder="Check-out"
                className="px-4 py-2 rounded text-black"
              />
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded transition"
                onClick={() => navigate("/hotels")}
              >
                Search Hotels
              </button>
            </form>
          </div>
        </section>

        {/* ✅ How It Works */}
        <section className="py-16 bg-gray-50 text-center">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-blue-500">
              How It Works
            </h2>
            <div className="grid sm:grid-cols-3 gap-8 text-left">
              {[
                { icon: "🔍", title: "Search Hotels", desc: "Find hotels in your destination." },
                { icon: "🛏️", title: "Choose Room", desc: "Pick rooms that fit your style and budget." },
                { icon: "✅", title: "Book Instantly", desc: "Pay securely and receive instant confirmation." }
              ].map((step, i) => (
                <div key={i} className="bg-white p-6 rounded shadow hover:shadow-lg transition">
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-blue-500">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ✅ Stats Section */}
        <section className="py-12 bg-blue-500 text-white text-center">
          <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-8">
            {[
              { stat: "10,000+", label: "Happy Guests" },
              { stat: "500+", label: "Verified Hotels" },
              { stat: "24/7", label: "Customer Support" },
            ].map((item, i) => (
              <div key={i} className="p-4">
                <h4 className="text-3xl font-bold mb-2">{item.stat}</h4>
                <p className="text-lg">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ✅ Featured Hotels */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-blue-500">
              Featured Hotels
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredHotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="bg-white rounded shadow hover:shadow-xl transform hover:-translate-y-1 transition overflow-hidden"
                >
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {hotel.name}
                    </h3>
                    <p className="text-sm text-gray-500">{hotel.location}</p>
                    <p className="text-gray-700 text-sm">{hotel.description}</p>
                    <div className="mt-4 flex gap-4">
                      <button
                        onClick={() => handleViewDetails(hotel.id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleViewRooms(hotel.id)}
                        className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-50 transition"
                      >
                        View Rooms
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ✅ Testimonials */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-12 text-blue-500">
              What Our Guests Say
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="bg-white p-6 rounded shadow hover:shadow-xl transition transform hover:-translate-y-1 duration-300"
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-12 h-12 rounded-full object-cover mr-4 border"
                    />
                    <div>
                      <h4 className="font-semibold text-blue-500">{t.name}</h4>
                      <p className="text-sm text-gray-500">
                        Stayed at {t.hotel}
                      </p>
                    </div>
                  </div>
                  <p className="italic text-gray-700 text-sm">"{t.feedback}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ✅ CTA Banner */}
        <section className="bg-blue-500 text-white py-12 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-semibold mb-4">
              Ready to Book Your Stay?
            </h2>
            <p className="mb-6 text-lg">
              Secure your perfect hotel in just a few clicks.
            </p>
            <Link
              to="/hotels"
              className="inline-block bg-white text-blue-500 font-medium px-6 py-3 rounded hover:bg-gray-100 transition"
            >
              Get Started
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
