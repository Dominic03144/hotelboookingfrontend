export default function ServicesSection() {
  return (
    <section id="services" className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-10">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-xl font-semibold mb-2">Instant Booking</h4>
            <p className="text-gray-600">Book your favorite hotel in seconds.</p>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-2">Secure Payments</h4>
            <p className="text-gray-600">100% secure checkout with Stripe integration.</p>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-2">24/7 Support</h4>
            <p className="text-gray-600">We’re here to help anytime, anywhere.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
