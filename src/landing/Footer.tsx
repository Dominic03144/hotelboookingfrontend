export default function Footer() {
  return (
    <footer className="bg-white border-t py-6 mt-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between text-sm text-gray-600">
        <p>&copy; {new Date().getFullYear()} HotelEase. All rights reserved.</p>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
          <a href="/contact">Contact</a>
        </div>
      </div>
    </footer>
  );
}
