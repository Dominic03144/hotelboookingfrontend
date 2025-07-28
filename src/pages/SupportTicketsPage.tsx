import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface Ticket {
  ticketId: number;
  subject: string;
  description: string;
  status: string;
  createdAt: string;
}

export default function SupportTicketsPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // ✅ Fetch ONLY current user's tickets using `/my`
  useEffect(() => {
    const fetchMyTickets = async () => {
      try {
        const res = await axios.get("https://hotelroombooking-jmh1.onrender.com/api/tickets/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // ✅ Defensive: always set array
        const fetchedTickets = Array.isArray(res.data.tickets)
          ? res.data.tickets
          : [];
        setTickets(fetchedTickets);
      } catch (err) {
        console.error("❌ Error fetching tickets:", err);
        toast.error("Failed to load your tickets.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchMyTickets();
    } else {
      setLoading(false);
      toast.error("You are not logged in.");
    }
  }, [token]);

  // ✅ Submit new ticket
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill in both subject and message.");
      return;
    }

    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/api/tickets",
        {
          userId: Number(userId),
          subject: subject.trim(),
          description: message.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("✅ Ticket submitted!");

      // ✅ Backend returns: { ticket: {...} }
      const newTicket: Ticket = res.data.ticket || res.data;

      // ✅ Defensive: always prepend to array
      setTickets((prev) => [newTicket, ...(prev || [])]);

      // Clear form
      setSubject("");
      setMessage("");
    } catch (err: any) {
      console.error("❌ Error submitting ticket:", err);
      if (err.response?.data) {
        console.log("Backend response:", err.response.data);
      }
      toast.error("Failed to submit ticket.");
    }
  };

  return (
    <section className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Support Tickets</h1>
      <p className="mb-4 text-gray-600 dark:text-gray-300">
        Need help? Open a support ticket and our team will assist you.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded shadow mb-8"
      >
        <div className="mb-4">
          <label htmlFor="subject" className="block mb-2 text-sm font-medium">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-2 border rounded dark:bg-gray-900 dark:border-gray-700"
            placeholder="Ticket subject"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="message" className="block mb-2 text-sm font-medium">
            Message
          </label>
          <textarea
            id="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-2 border rounded dark:bg-gray-900 dark:border-gray-700"
            placeholder="Describe your issue..."
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Ticket
        </button>
      </form>

      <h2 className="text-xl font-bold mb-2">Your Tickets</h2>
      {loading ? (
        <p>Loading tickets...</p>
      ) : tickets.length === 0 ? (
        <p>No tickets yet.</p>
      ) : (
        <ul className="space-y-4">
          {tickets.map((ticket) => (
            <li
              key={ticket.ticketId}
              className="border p-4 rounded bg-white dark:bg-gray-800"
            >
              <h3 className="font-semibold">{ticket.subject}</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {ticket.description}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Status: {ticket.status} — Created:{" "}
                {new Date(ticket.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
