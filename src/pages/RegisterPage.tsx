import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../layouts/NavBar";
import bgImage from "../assets/auth/register-bg.jpg";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    contactPhone: "",
    address: "",
    role: "customer",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed. Try again.");
      }

      localStorage.setItem("verifyEmail", form.email);

      toast.success(
        "✅ Registered successfully! Please check your email for the 6-digit code.",
        {
          position: "top-center",
          autoClose: 3000,
          onClose: () => navigate("/verify-email"),
        }
      );
    } catch (err: any) {
      console.error(err);
      toast.error(`❌ ${err.message}`, {
        position: "top-center",
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <Navbar />
      <ToastContainer />

      <div className="flex flex-1 items-center justify-center px-4 py-10 backdrop-brightness-90">
        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">
            ✨ Create Your Account
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 text-xs font-medium">First Name</label>
                <input
                  type="text"
                  name="firstname"
                  value={form.firstname}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-xs"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-xs font-medium">Last Name</label>
                <input
                  type="text"
                  name="lastname"
                  value={form.lastname}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-xs font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-2 border rounded text-xs"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-xs font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full p-2 border rounded text-xs"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-xs font-medium">Phone Number</label>
              <input
                type="tel"
                name="contactPhone"
                value={form.contactPhone}
                onChange={handleChange}
                className="w-full p-2 border rounded text-xs"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-xs font-medium">Address</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full p-2 border rounded text-xs"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-xs font-medium">Register As</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full p-2 border rounded text-xs"
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition disabled:opacity-50 text-xs"
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <p className="mt-3 text-xs text-center text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-700 hover:underline">
                Log In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
