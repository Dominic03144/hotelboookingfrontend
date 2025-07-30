import { useEffect, useState } from "react";
import axios from "axios";

type Payment = {
  paymentId: number;
  bookingId: number;
  userEmail: string;
  userName: string;
  amount: string;
  paymentStatus: string;
  paymentMethod: string | null;
  createdAt: string;
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/payments`,
        {
          withCredentials: true,
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      setPayments(response.data);
    } catch (err) {
      console.error("Failed to load payments", err);
    }
  };

  const handleExport = () => {
    const headers = [
      "Payment ID",
      "Booking ID",
      "User Email",
      "User Name",
      "Amount",
      "Status",
      "Method",
      "Created At",
    ];
    const rows = payments.map((p) => [
      p.paymentId,
      p.bookingId,
      p.userEmail,
      p.userName,
      p.amount,
      p.paymentStatus,
      p.paymentMethod ?? "",
      p.createdAt,
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "payments.csv");
    link.click();
  };

  const filteredPayments = payments.filter((p) => {
    const matchesStatus = statusFilter === "All" || p.paymentStatus === statusFilter;
    const matchesSearch =
      searchTerm === "" ||
      p.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.bookingId.toString().includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case "Pending":
        return "inline-block px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full";
      case "Completed":
        return "inline-block px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full";
      case "Failed":
        return "inline-block px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full";
      default:
        return "inline-block px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Payments</h1>
        <div className="flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Search by email or booking ID"
            className="px-3 py-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
          </select>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2 border">Payment ID</th>
              <th className="px-4 py-2 border">Booking ID</th>
              <th className="px-4 py-2 border">User</th>
              <th className="px-4 py-2 border">Amount</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Method</th>
              <th className="px-4 py-2 border">Created</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-center text-gray-500">
                  No payments found.
                </td>
              </tr>
            ) : (
              filteredPayments.map((p) => (
                <tr key={p.paymentId} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{p.paymentId}</td>
                  <td className="px-4 py-2 border">{p.bookingId}</td>
                  <td className="px-4 py-2 border">
                    {p.userName} <br />
                    <span className="text-sm text-gray-500">{p.userEmail}</span>
                  </td>
                  <td className="px-4 py-2 border">${p.amount}</td>
                  <td className="px-4 py-2 border">
                    <span className={getStatusBadgeClasses(p.paymentStatus)}>
                      {p.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-2 border">{p.paymentMethod ?? "-"}</td>
                  <td className="px-4 py-2 border">
                    {new Date(p.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
