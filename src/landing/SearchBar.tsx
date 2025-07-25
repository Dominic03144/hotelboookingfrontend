import { useState } from "react";

export default function SearchBar() {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");

  const handleSearch = () => {
    console.log("Search for:", location, date);
    // Route to hotels page or perform API search
  };

  return (
    <section className="bg-white py-10 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center gap-4">
        <input
          type="text"
          placeholder="Enter location"
          className="w-full md:w-1/2 border rounded px-4 py-2"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="date"
          className="w-full md:w-1/3 border rounded px-4 py-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>
    </section>
  );
}
