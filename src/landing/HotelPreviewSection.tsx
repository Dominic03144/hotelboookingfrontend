// import React from "react";
import sunsetParadise from "../assets/sunset.jpeg";
import mountainInnImg from "../assets/mountain inn.jpeg";
import lakeviewResortImg from "../assets/lakeview.jpeg";

const hotels = [
  {
    id: 1,
    name: "Sunset Paradise",
    location: "Mombasa",
    price: "$85/night",
    image: sunsetParadise,
  },
  {
    id: 2,
    name: "Mountain Inn",
    location: "Nairobi",
    price: "$110/night",
    image: mountainInnImg,
  },
  {
    id: 3,
    name: "Lakeview Resort",
    location: "Naivasha",
    price: "$95/night",
    image: lakeviewResortImg,
  },
];

export default function HotelPreviewSection() {
  return (
    <section id="hotels" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          🌟 Featured Hotels
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              className="rounded-lg overflow-hidden border shadow hover:shadow-xl transition duration-300"
            >
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 bg-white">
                <h3 className="text-xl font-semibold text-gray-800">
                  {hotel.name}
                </h3>
                <p className="text-gray-500">{hotel.location}</p>
                <p className="mt-2 text-blue-600 font-semibold">
                  {hotel.price}
                </p>
                <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
