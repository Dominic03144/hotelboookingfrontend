// src/components/Footer.tsx

import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8 text-sm">
        <div>
          <h4 className="font-semibold text-lg mb-2">HotelBooking</h4>
          <p>Your gateway to the best hotel experiences in Kenya.</p>
        </div>
        <div>
          <h4 className="font-semibold text-lg mb-2">Quick Links</h4>
          <ul className="space-y-1">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/hotels" className="hover:underline">Hotels</Link></li>
            <li><Link to="/about" className="hover:underline">About</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-lg mb-2">Contact</h4>
          <p>Email: support@hotelbooking.co.ke</p>
          <p>Phone: +254 700 123 456</p>
        </div>
      </div>
      <div className="text-center text-gray-400 mt-6 text-xs">
        &copy; {new Date().getFullYear()} HotelBooking. All rights reserved.
      </div>
    </footer>
  );
}
