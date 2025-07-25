import React from "react";
import maryImg from "../assets/testimonials/amina.jpg";
import kevinImg from "../assets/testimonials/kevin.jpg";
import aminaImg from "../assets/testimonials/mary.jpg";

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

export default function Testimonials() {
  return (
    <section className="bg-gray-100 py-16">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-12">What Our Guests Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white p-6 rounded shadow-md hover:shadow-lg transition text-left"
            >
              <div className="flex items-center mb-4">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover mr-4 border"
                />
                <div>
                  <h4 className="font-semibold text-blue-700">{t.name}</h4>
                  <p className="text-sm text-gray-500">Stayed at {t.hotel}</p>
                </div>
              </div>
              <p className="italic text-gray-700 text-sm">"{t.feedback}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
