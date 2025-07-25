import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

import SupportTicketsPage from "./SupportTicketsPage";
import ReviewsPage from "./ReviewsPage";
import SettingsPage from "./SettingsPage";
import PaymentsPage from "./UserPaymentsPage";

interface Booking {
  bookingId: number;
  hotelName: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  bookingStatus: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  totalAmount: number;
}

interface Payment {
  paymentId: number;
  bookingId: number;
  paymentStatus: "Pending" | "Completed" | "Failed";
  paymentDate?: string;
  amount: number | string;
  receiptUrl?: string;
}

export default function UserDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "overview" | "bookings" | "payments" | "profile" | "support" | "reviews" | "settings"
  >("overview");

  const [isCollapsed, setIsCollapsed] = useState(false);

  const firstName = localStorage.getItem("firstName") || "User";
  const lastName = localStorage.getItem("lastName") || "";
  const email = localStorage.getItem("email") || "N/A";
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  // BOOKINGS
  const {
    data: bookings = [],
    isLoading: bookingsLoading,
    isError: bookingsError,
    error: bookingsErrorObj,
  } = useQuery<Booking[]>({
    queryKey: ["myBookings"],
    queryFn: async () => {
      const res = await api.get("/bookings/my-bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.bookings || [];
    },
    enabled: !!token,
  });

  useEffect(() => {
    if ((bookingsErrorObj as any)?.response?.status === 401) {
      localStorage.clear();
      navigate("/login");
    }
  }, [bookingsErrorObj, navigate]);

  // PAYMENTS
  const {
    data: payments = [],
    isLoading: paymentsLoading,
    isError: paymentsError,
    error: paymentsErrorObj,
  } = useQuery<Payment[]>({
    queryKey: ["myPayments"],
    queryFn: async () => {
      const res = await api.get("/payments/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.payments || [];
    },
    enabled: !!token,
  });

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const upcomingBookings = bookings.filter((b) => b.bookingStatus === "Confirmed");
  const pastBookings = bookings.filter((b) => b.bookingStatus === "Completed");
  const cancelledBookings = bookings.filter((b) => b.bookingStatus === "Cancelled");
  const pendingPaymentsCount = payments.filter((p) => p.paymentStatus === "Pending").length;

  const totalBookings = bookings.length;
  const supportTicketsCount = 2;
  const reviewsCount = 5;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          isCollapsed ? "w-20" : "w-64"
        } bg-white dark:bg-gray-800 border-r dark:border-gray-700 shadow-lg flex flex-col transition-all duration-300`}
      >
        <div className="p-4 flex items-center justify-between border-b dark:border-gray-700">
          <h2
            className={`text-xl font-bold text-blue-700 dark:text-blue-400 transition-opacity ${
              isCollapsed ? "opacity-0 hidden" : "opacity-100"
            }`}
          >
            👋 {firstName}
          </h2>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-500 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            title="Toggle Sidebar"
          >
            {isCollapsed ? "➡" : "⬅"}
          </button>
        </div>

        {!isCollapsed && (
          <p className="text-gray-600 dark:text-gray-300 text-sm px-4 mt-2">{email}</p>
        )}

        <nav className="flex-1 px-2 py-4 space-y-1">
          <SidebarButton collapsed={isCollapsed} active={activeTab} name="overview" onClick={setActiveTab}>
            🏠 Dashboard
          </SidebarButton>
          <SidebarButton collapsed={isCollapsed} active={activeTab} name="bookings" onClick={setActiveTab}>
            📅 My Bookings
          </SidebarButton>
          <SidebarButton collapsed={isCollapsed} active={activeTab} name="payments" onClick={setActiveTab}>
            💳 Payments
          </SidebarButton>
          <SidebarButton collapsed={isCollapsed} active={activeTab} name="profile" onClick={setActiveTab}>
            👤 Profile
          </SidebarButton>
          <SidebarButton collapsed={isCollapsed} active={activeTab} name="support" onClick={setActiveTab}>
            📨 Support
          </SidebarButton>
          <SidebarButton collapsed={isCollapsed} active={activeTab} name="reviews" onClick={setActiveTab}>
            ⭐ Reviews
          </SidebarButton>
          <SidebarButton collapsed={isCollapsed} active={activeTab} name="settings" onClick={setActiveTab}>
            ⚙ Settings
          </SidebarButton>

          {!isCollapsed && (
            <Link
              to="/hotels"
              className="block w-full text-left px-4 py-2 rounded text-blue-700 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-gray-700"
            >
              🏨 Explore Hotels
            </Link>
          )}
        </nav>

        <div className="p-4 border-t dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {activeTab === "overview" && (
          <section>
            <h1 className="text-3xl font-bold mb-8">📊 Dashboard Overview</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <Card title="Upcoming Bookings" value={bookingsLoading ? "..." : upcomingBookings.length.toString()} />
              <Card title="Pending Payments" value={paymentsLoading ? "..." : pendingPaymentsCount.toString()} />
              <Card title="Past Bookings" value={bookingsLoading ? "..." : pastBookings.length.toString()} />
              <Card title="Total Bookings" value={bookingsLoading ? "..." : totalBookings.toString()} />
              <Card title="Cancelled Bookings" value={bookingsLoading ? "..." : cancelledBookings.length.toString()} />
              <Card title="Support Tickets" value={supportTicketsCount.toString()} />
              <Card title="Reviews Written" value={reviewsCount.toString()} />
            </div>
          </section>
        )}

        {activeTab === "bookings" && (
          <section>
            <h1 className="text-2xl font-bold mb-6">📅 My Bookings</h1>
            {bookingsLoading ? (
              <p>Loading...</p>
            ) : bookingsError ? (
              <p className="text-red-600">{String(bookingsErrorObj)}</p>
            ) : bookings.length === 0 ? (
              <p>No bookings yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 shadow rounded">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left">Hotel</th>
                      <th className="px-4 py-2 text-left">Room</th>
                      <th className="px-4 py-2 text-left">Check-In</th>
                      <th className="px-4 py-2 text-left">Check-Out</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.bookingId} className="border-t dark:border-gray-700">
                        <td className="px-4 py-2">{b.hotelName}</td>
                        <td className="px-4 py-2">{b.roomType}</td>
                        <td className="px-4 py-2">{b.checkInDate}</td>
                        <td className="px-4 py-2">{b.checkOutDate}</td>
                        <td className="px-4 py-2">{b.bookingStatus}</td>
                        <td className="px-4 py-2">${b.totalAmount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {activeTab === "payments" && (
          <PaymentsPage
            payments={payments}
            isLoading={paymentsLoading}
            isError={paymentsError}
            error={paymentsErrorObj}
          />
        )}

        {activeTab === "profile" && (
          <section>
            <h1 className="text-2xl font-bold mb-6">👤 Profile</h1>
            <p>Name: {firstName} {lastName}</p>
            <p>Email: {email}</p>
            <Link to="/profile" className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              ✏ Edit Profile
            </Link>
          </section>
        )}

        {activeTab === "support" && <SupportTicketsPage />}
        {activeTab === "reviews" && <ReviewsPage />}
        {activeTab === "settings" && <SettingsPage />}
      </main>
    </div>
  );
}

type SidebarButtonProps = {
  collapsed: boolean;
  active: string;
  name: string;
  children: React.ReactNode;
  onClick: (name: any) => void;
};

function SidebarButton({ collapsed, active, name, children, onClick }: SidebarButtonProps) {
  return (
    <button
      className={`w-full flex items-center gap-2 text-left px-4 py-2 rounded hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors ${
        active === name
          ? "bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-blue-300 font-semibold"
          : "text-gray-700 dark:text-gray-200"
      }`}
      onClick={() => onClick(name)}
    >
      {children}
      {collapsed && null}
    </button>
  );
}

type CardProps = {
  title: string;
  value: string;
};

function Card({ title, value }: CardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center transform transition-transform hover:scale-105 hover:shadow-xl cursor-pointer">
      <h3 className="text-gray-600 dark:text-gray-300 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">{value}</p>
    </div>
  );
}
