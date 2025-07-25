// ✅ src/pages/LoginPage.tsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../layouts/NavBar";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../features/auth/authSlice";

import welcomeBackImg from "../assets/login/welcome-back.jpg";
import bgImage from "../assets/login/login-bg.jpg";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const from = location.state?.from?.pathname || "/dashboard";

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.message) {
      toast.info(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "https://hotelroombooking-jmh1.onrender.com/api/auth/login",
        form,
        {
          validateStatus: () => true,
          withCredentials: true,
        }
      );

      const { status, data } = response;

      if (status === 200) {
        const { token, user } = data;

        if (!token) {
          toast.error("❌ Server did not return a token.");
          return;
        }

        const firstName = user.firstName || user.firstname || "";
        const lastName = user.lastName || user.lastname || "";

        localStorage.setItem("token", token);
        localStorage.setItem("userId", user.userId.toString());
        localStorage.setItem("firstName", firstName);
        localStorage.setItem("lastName", lastName);
        localStorage.setItem("email", user.email);
        localStorage.setItem("role", user.role);

        dispatch(
          setUser({
            userId: user.userId,
            email: user.email,
            role: user.role,
            token: token,
            profileImageUrl: user.profileImageUrl || null,
          })
        );

        toast.success("✅ Login successful!");

        // ✅ Navigate immediately, do not wait for toast
        if (user.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          const unsafeFrom = from && (from === "/admin" || from.startsWith("/admin"));
          const safeRedirect = unsafeFrom ? "/dashboard" : from;
          navigate(safeRedirect, { replace: true });
        }

      } else if (status === 401) {
        toast.error("❌ Invalid email or password.");
      } else {
        toast.error(`❌ ${data.message || "Login failed."}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <Navbar />

      <div className="flex-grow flex items-center justify-center bg-black/40 backdrop-brightness-90 px-4 py-10">
        <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl bg-white/90 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden">
          {/* Left side */}
          <div className="hidden md:flex flex-col items-center justify-center w-1/2 p-10 bg-blue-50">
            <img
              src={welcomeBackImg}
              alt="Welcome Back"
              className="w-full max-w-xs rounded-xl shadow mb-6"
            />
            <h2 className="text-3xl font-bold text-blue-700 mb-2">
              Welcome Back!
            </h2>
            <p className="text-gray-700 text-center max-w-sm">
              Sign in to continue managing your bookings and enjoy your stay.
            </p>
          </div>

          {/* Right side */}
          <div className="w-full md:w-1/2 p-8 md:p-10">
            <button
              onClick={() => navigate(-1)}
              className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition duration-200"
            >
              ← Back
            </button>

            <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">
              Login to Your Account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Sign In"}
              </button>
            </form>

            <p className="mt-4 text-sm text-center text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="text-blue-700 hover:underline font-medium"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
