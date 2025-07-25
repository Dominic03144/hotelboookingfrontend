export default function FeatureHighlights() {
  return (
    <section className="py-16 bg-gray-50 text-center">
      <h2 className="text-3xl font-bold mb-10">Why Book With Us?</h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
          <p className="text-gray-600">Affordable rates on all bookings.</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Instant Booking</h3>
          <p className="text-gray-600">Get confirmation within seconds.</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Trusted Hotels</h3>
          <p className="text-gray-600">All properties verified and reviewed.</p>
        </div>
      </div>
    </section>
  );
}
