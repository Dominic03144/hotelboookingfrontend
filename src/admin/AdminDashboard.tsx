// ✅ src/admin/AdminDashboard.tsx

import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

// ✅ Page titles for Header
const pageTitles: Record<string, string> = {
  "/admin": "Overview",
  "/admin/users": "Users",
  "/admin/hotels": "Hotels",
  "/admin/rooms": "Rooms",
  "/admin/rooms/add": "Add Room",
  "/admin/rooms/edit": "Edit Room",
  "/admin/bookings": "Bookings",
  "/admin/tickets": "Tickets",
  "/admin/payments": "Payments",
};

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const location = useLocation();

  // ✅ Load dark mode preference
  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored === "true") setDarkMode(true);
  }, []);

  // ✅ Apply dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  return (
    <div className="flex min-h-screen dark:bg-gray-900">
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        mobileOpen={mobileSidebar}
        setMobileOpen={setMobileSidebar}
      />

      {mobileSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileSidebar(false)}
        />
      )}

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          pageTitle={
            Object.entries(pageTitles).find(([path]) =>
              location.pathname.startsWith(path)
            )?.[1] || "Admin"
          }
          toggleSidebar={() => setMobileSidebar(!mobileSidebar)}
          toggleDarkMode={() => setDarkMode(!darkMode)}
          darkMode={darkMode}
        />

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
