// src/pages/AdminOverview.tsx

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Users,
  Hotel,
  BedDouble,
  CalendarCheck2,
  TrendingUp,
  Clock,
  AlertCircle,
  DollarSign,
} from "lucide-react";
import CountUp from "react-countup";

type AdminOverviewStats = {
  totalUsers: number;
  totalHotels: number;
  totalRooms: number;
  totalBookings: number;
  upcomingBookings: number;
  totalRevenue: number;
  pendingPayments: number;
  openTickets: number;
  bookingsTrend: { date: string; bookings: number }[];
  revenueTrend: { date: string; revenue: number }[];
};

export default function AdminOverview() {
  const [stats, setStats] = useState<AdminOverviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/admin/overview", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch overview data.");
        const data: AdminOverviewStats = await res.json();
        setStats(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    document.title = "Admin Overview";
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error)
    return <p className="text-center text-red-600 font-semibold">Error: {error}</p>;
  if (!stats)
    return (
      <p className="text-center text-red-600 font-semibold">No data available</p>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto dark:bg-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-300">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-blue-800 dark:text-blue-300">
          Admin Overview
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard icon={<Users className="h-6 w-6 text-blue-700 dark:text-blue-400" />} title="Total Users" value={stats.totalUsers} badge="Active" percentage={90} />
        <StatCard icon={<Hotel className="h-6 w-6 text-purple-700 dark:text-purple-400" />} title="Total Hotels" value={stats.totalHotels} badge="Listed" percentage={75} />
        <StatCard icon={<BedDouble className="h-6 w-6 text-green-700 dark:text-green-400" />} title="Total Rooms" value={stats.totalRooms} badge="Available" percentage={60} />
        <StatCard icon={<CalendarCheck2 className="h-6 w-6 text-pink-700 dark:text-pink-400" />} title="Total Bookings" value={stats.totalBookings} badge="Confirmed" percentage={85} />
        <StatCard icon={<Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />} title="Upcoming Bookings" value={stats.upcomingBookings} badge="Upcoming" percentage={50} />
        <StatCard icon={<DollarSign className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />} title="Total Revenue" value={stats.totalRevenue} badge="Revenue" isCurrency percentage={95} />
        <StatCard icon={<AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />} title="Pending Payments" value={stats.pendingPayments} badge="Pending" percentage={30} />
        <StatCard icon={<TrendingUp className="h-6 w-6 text-indigo-700 dark:text-indigo-400" />} title="Open Tickets" value={stats.openTickets} badge="Open" percentage={40} />
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6 border-b-2 border-blue-600 inline-block pb-1 dark:text-blue-300">
          Bookings Trend (Last 7 Days)
        </h2>
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-4 md:p-6 hover:shadow-2xl transition">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats.bookingsTrend}>
              <defs>
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fill: "#4B5563" }} tickFormatter={formatDateShort} />
              <YAxis tick={{ fill: "#4B5563" }} allowDecimals={false} />
              <Tooltip contentStyle={{ backgroundColor: "#1E293B" }} labelStyle={{ color: "#fff" }} formatter={(value: number) => [value, "Bookings"]} />
              <Legend />
              <Line type="monotone" dataKey="bookings" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorBookings)" dot={{ r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6 border-b-2 border-green-600 inline-block pb-1 dark:text-green-300">
          Revenue Trend (Last 7 Days)
        </h2>
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-4 md:p-6 hover:shadow-2xl transition">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats.revenueTrend}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fill: "#4B5563" }} tickFormatter={formatDateShort} />
              <YAxis tick={{ fill: "#4B5563" }} tickFormatter={(val) => `$${formatNumber(val)}`} />
              <Tooltip contentStyle={{ backgroundColor: "#1E293B" }} labelStyle={{ color: "#fff" }} formatter={(value: number) => [`$${formatCurrency(value)}`, "Revenue"]} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" dot={{ r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-48">
      <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    </div>
  );
}

function StatCard({ title, value, icon, badge, percentage, isCurrency }: { title: string; value: number | string; icon: React.ReactNode; badge?: string; percentage?: number; isCurrency?: boolean; }) {
  return (
    <div className="bg-gradient-to-tr from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 shadow-lg rounded-xl p-6 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-transform duration-300 w-full">
      <div className="mb-3">{icon}</div>
      <h3 className="text-sm text-gray-500 dark:text-gray-300 mb-1">{title}</h3>
      <p className="text-3xl font-extrabold text-blue-900 dark:text-blue-100">
        <CountUp end={Number(value)} duration={1.5} separator="," decimals={isCurrency ? 2 : 0} prefix={isCurrency ? "$" : ""} />
      </p>
      {badge && <span className="mt-2 inline-block bg-blue-100 dark:bg-blue-900 dark:text-blue-200 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">{badge}</span>}
      {percentage !== undefined && (
        <div className="w-full mt-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
          <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600" style={{ width: `${percentage}%` }}></div>
        </div>
      )}
    </div>
  );
}

function formatNumber(num?: number | string | null) {
  const safeNum = Number(num);
  if (isNaN(safeNum)) return "-";
  return safeNum.toLocaleString();
}

function formatCurrency(num?: number | string | null) {
  const safeNum = Number(num);
  if (isNaN(safeNum)) return "-";
  return safeNum.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDateShort(dateStr: string) {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString(undefined, options);
}
