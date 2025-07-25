// ✅ src/pages/AdminTicketsPage.tsx

import React, { useState } from "react";
import {
  useGetAllTicketsQuery,
  useUpdateTicketStatusMutation,
  type Ticket,
} from "../features/admin/AdminApi";
import { toast } from "react-toastify";
import { CheckCircleIcon, EyeIcon } from "lucide-react"; // ✅ Modern icons

export default function AdminTicketsPage() {
  const { data: tickets, isLoading, isError } = useGetAllTicketsQuery();
  const [updateStatus] = useUpdateTicketStatusMutation();
  const [filterStatus, setFilterStatus] = useState<"All" | "Open" | "Resolved">("All");
  const [search, setSearch] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const handleResolve = async (ticketId: number) => {
    try {
      await updateStatus({ ticketId, status: "Resolved" }).unwrap();
      toast.success("✅ Ticket marked as resolved");
    } catch {
      toast.error("❌ Failed to update ticket");
    }
  };

  const filteredTickets = (tickets || []).filter((t) => {
    const matchesStatus = filterStatus === "All" || t.status === filterStatus;
    const matchesSearch =
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.user.firstname.toLowerCase().includes(search.toLowerCase()) ||
      t.user.lastname.toLowerCase().includes(search.toLowerCase()) ||
      t.user.email.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (isLoading) return <p className="p-6">Loading tickets...</p>;
  if (isError) return <p className="p-6 text-red-500">Failed to load tickets.</p>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">🎫 Support Tickets</h1>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <label className="font-medium text-gray-700">Filter:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring focus:border-blue-400"
          >
            <option value="All">All</option>
            <option value="Open">Open</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div className="flex items-center w-full md:w-auto">
          <input
            type="text"
            placeholder="🔍 Search by subject or user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-64 border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full text-sm text-left">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredTickets.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center px-4 py-6 text-gray-500">
                  No tickets found.
                </td>
              </tr>
            ) : (
              filteredTickets.map((t) => (
                <tr key={t.ticketId} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{t.subject}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-700">
                      {t.user.firstname} {t.user.lastname}
                    </div>
                    <div className="text-xs text-gray-500">{t.user.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    {t.status === "Open" ? (
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                        Open
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Resolved
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(t.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 flex flex-wrap gap-2">
                    {t.status === "Open" && (
                      <button
                        onClick={() => handleResolve(t.ticketId)}
                        className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                      >
                        <CheckCircleIcon className="w-4 h-4" /> Mark Resolved
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedTicket(t)}
                      className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                    >
                      <EyeIcon className="w-4 h-4" /> View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-3 text-gray-800">{selectedTicket.subject}</h2>
            <p className="mb-4 text-gray-600">{selectedTicket.description}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedTicket(null)}
                className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
