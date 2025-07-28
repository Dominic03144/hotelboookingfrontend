import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ContactPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Message sent:", form);
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition duration-200"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-extrabold text-center text-blue-800 mb-6">
          📞 Contact Us
        </h1>

        {submitted && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center text-sm">
            ✅ Thank you! Your message has been sent.
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-xl px-6 py-6"
        >
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Your name"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Your Message
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              required
              placeholder="How can we help you?"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded font-semibold hover:bg-blue-800 transition"
          >
            📧 Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
