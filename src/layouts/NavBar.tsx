// ✅ src/components/Navbar.tsx

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { isLoggedIn, logout, profileImageUrl } = useAuth();
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoggedIn) {
      const firstName =
        localStorage.getItem("firstName") || localStorage.getItem("firstname") || "";
      const lastName =
        localStorage.getItem("lastName") || localStorage.getItem("lastname") || "";
      const trimmed = `${firstName.trim()} ${lastName.trim()}`.trim();
      setUserName(trimmed);
    } else {
      setUserName("");
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    logout(() => navigate("/"));
  };

  // ✅ Hide auth links on login/register page
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center py-4">
        <Link
          to="/"
          className="text-2xl font-bold text-blue-700 hover:text-blue-800 transition"
        >
          HotelBook
        </Link>

        <ul className="flex flex-wrap gap-4 items-center text-gray-700 font-medium">
          <li>
            <Link to="/services" className="hover:text-blue-600 transition">
              Services
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-blue-600 transition">
              About
            </Link>
          </li>
          <li>
            <Link to="/hotels" className="hover:text-blue-600 transition">
              Hotels
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-blue-600 transition">
              Contact
            </Link>
          </li>

          {/* ✅ Hide these when on login/register */}
          {!isAuthPage &&
            (isLoggedIn ? (
              <>
                <li className="flex items-center gap-2">
                  <Link to="/profile" className="flex items-center gap-2">
                    {profileImageUrl ? (
                      <img
                        src={profileImageUrl}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover border border-gray-300"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {userName && (
                      <span className="text-sm text-gray-800 font-semibold">
                        Hi, {userName}
                      </span>
                    )}
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="px-4 py-1 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Register
                  </Link>
                </li>
              </>
            ))}
        </ul>
      </div>
    </nav>
  );
}
