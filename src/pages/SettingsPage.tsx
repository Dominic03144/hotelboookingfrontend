import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SettingsPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle("dark", storedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    toast.info(`Switched to ${newTheme} mode`, { autoClose: 2000 });
  };

  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const updateEmail = async () => {
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You are not logged in.");
        return;
      }

      const response = await fetch("/api/settings/email", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newEmail: email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update email.");
      }

      const data = await response.json();
      toast.success(data.message, { autoClose: 3000 });
      localStorage.setItem("email", email);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    }
  };

  const changePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password should be at least 8 characters.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You are not logged in.");
        return;
      }

      const response = await fetch("/api/settings/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: currentPassword,
          newPassword: newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to change password.");
      }

      const data = await response.json();
      toast.success(data.message, { autoClose: 3000 });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    }
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    toast.info(
      `Notifications ${!notificationsEnabled ? "enabled" : "disabled"}`,
      { autoClose: 2000 }
    );
  };

  const deleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      // TODO: Call backend for real delete
      localStorage.clear();
      toast.success("Account deleted. Logging out...", { autoClose: 2000 });
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg mt-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400">
          Settings
        </h1>

        <button
          onClick={toggleTheme}
          className="flex items-center space-x-2 bg-yellow-400 dark:bg-yellow-600 text-black dark:text-white px-4 py-2 rounded hover:opacity-90 transition"
        >
          {theme === "light" ? (
            <span>🌙 Dark Mode</span>
          ) : (
            <span>☀️ Light Mode</span>
          )}
        </button>
      </div>

      {/* Update Email */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
          Update Email
        </h2>
        <input
          type="email"
          className="w-full p-3 border border-gray-300 rounded mb-4 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
        />
        <button
          onClick={updateEmail}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-semibold transition"
        >
          Save Email
        </button>
      </section>

      {/* Change Password */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
          Change Password
        </h2>
        <input
          type="password"
          className="w-full p-3 border border-gray-300 rounded mb-4 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input
          type="password"
          className="w-full p-3 border border-gray-300 rounded mb-4 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          className="w-full p-3 border border-gray-300 rounded mb-6 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          onClick={changePassword}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-semibold transition"
        >
          Change Password
        </button>
      </section>

      {/* Notifications */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
          Notifications
        </h2>
        <label className="inline-flex items-center space-x-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={toggleNotifications}
            className="form-checkbox h-6 w-6 text-blue-600"
          />
          <span className="text-gray-700 dark:text-gray-300 text-lg">
            Enable email notifications
          </span>
        </label>
      </section>

      {/* Delete Account */}
      <section className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4 text-red-600">
          Delete Account
        </h2>
        <button
          onClick={deleteAccount}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded font-semibold transition"
        >
          Delete My Account
        </button>
      </section>
    </div>
  );
}
