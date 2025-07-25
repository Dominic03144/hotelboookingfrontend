import { Link } from "react-router-dom";

export default function CallToAction() {
  return (
    <section className="bg-blue-700 text-white py-16 text-center">
      <h2 className="text-3xl font-bold mb-4">Ready to Book Your Stay?</h2>
      <p className="mb-6 text-lg">Create an account to get started in seconds.</p>
      <Link
        to="/register"
        className="bg-white text-blue-700 font-semibold px-6 py-3 rounded hover:bg-gray-100 transition"
      >
        Get Started
      </Link>
    </section>
  );
}
