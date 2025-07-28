// ✅ src/pages/AdminProfilePage.tsx

import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";
import axios from "axios";

export default function AdminProfilePage() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      toast.error("❌ Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/admin/profile`,
        {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          password: form.newPassword || undefined, // send only if entered
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        toast.success("✅ Profile updated!");
        setForm({ ...form, newPassword: "", confirmPassword: "" });
      } else {
        toast.error("❌ Update failed.");
      }
    } catch (err: any) {
      toast.error(err.message || "❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-md shadow-sm border">
      <h1 className="text-xl font-semibold mb-2 text-gray-600">
        Welcome back, Admin 👋
      </h1>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Account Settings
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-medium mb-1 text-gray-600">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1 text-gray-600">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1 text-gray-600">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1 text-gray-600">
            New Password (optional)
          </label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            placeholder="Leave blank to keep current"
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1 text-gray-600">
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            placeholder="Re-enter new password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold py-2 rounded transition"
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
