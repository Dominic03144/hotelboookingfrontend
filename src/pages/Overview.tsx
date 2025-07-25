export default function Overview() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-4 bg-white rounded shadow text-center">
          <p className="text-gray-500">Users</p>
          <h3 className="text-xl font-bold">128</h3>
        </div>
        <div className="p-4 bg-white rounded shadow text-center">
          <p className="text-gray-500">Hotels</p>
          <h3 className="text-xl font-bold">12</h3>
        </div>
        <div className="p-4 bg-white rounded shadow text-center">
          <p className="text-gray-500">Rooms</p>
          <h3 className="text-xl font-bold">85</h3>
        </div>
        <div className="p-4 bg-white rounded shadow text-center">
          <p className="text-gray-500">Bookings</p>
          <h3 className="text-xl font-bold">342</h3>
        </div>
      </div>
    </div>
  );
}
