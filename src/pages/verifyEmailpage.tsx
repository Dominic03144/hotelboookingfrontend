import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Use your new uploaded background image
import bgImage from "../assets/auth/verify-bg.jpg";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(localStorage.getItem("verifyEmail") || "");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verify-email`,
        { email, code },
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.success("✅ Email verified successfully");
        localStorage.removeItem("verifyEmail");
        navigate("/login");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "❌ Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center px-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <ToastContainer />
      <div className="absolute inset-0 bg-black/50" />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white/90 backdrop-blur-md shadow-2xl rounded-xl p-8 max-w-sm w-full"
      >
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
          ✉️ Verify Your Email
        </h2>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Verification Code
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify Now!"}
        </button>
      </form>
    </div>
  );
}
