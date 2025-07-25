import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { DateRange, type RangeKeyDict, type Range } from "react-date-range";
import { addDays, differenceInDays } from "date-fns";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function BookingPage() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const roomId = new URLSearchParams(search).get("roomId");

  const [guests, setGuests] = useState<number>(1);
  const [dateRange, setDateRange] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: "selection",
    },
  ]);

  const nights =
    dateRange[0].startDate && dateRange[0].endDate
      ? differenceInDays(dateRange[0].endDate, dateRange[0].startDate)
      : 0;

  const nightlyRate = 100;
  const totalPrice = nights > 0 ? nights * nightlyRate * guests : 0;

  const handleConfirm = async () => {
    if (nights <= 0) {
      alert("Please select valid check-in and check-out dates.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to book.");
      return;
    }

    try {
      const res = await axios.post(
        "/api/bookings/",
        {
          roomId: Number(roomId),
          checkInDate: dateRange[0].startDate?.toISOString().split("T")[0],
          checkOutDate: dateRange[0].endDate?.toISOString().split("T")[0],
          totalAmount: totalPrice,
          guests,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const bookingId = res.data.booking?.bookingId;
      if (bookingId) {
        navigate(`/payment?bookingId=${bookingId}`);
      } else {
        alert("Booking failed.");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Error creating booking");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-10 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Complete Your Booking
        </h1>

        {/* Date Picker and Guests Grid */}
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Date Picker */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Select Stay Dates
            </label>
            <div className="rounded-lg overflow-hidden border border-gray-300">
              <DateRange
                editableDateInputs
                onChange={(ranges: RangeKeyDict) =>
                  setDateRange([ranges.selection as Range])
                }
                moveRangeOnFirstSelection={false}
                ranges={dateRange}
                minDate={new Date()}
              />
            </div>
          </div>

          {/* Guests */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Number of Guests
            </label>
            <select
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6].map((g) => (
                <option key={g} value={g}>
                  {g} {g === 1 ? "guest" : "guests"}
                </option>
              ))}
            </select>

            {/* Nights Summary */}
            <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-700 space-y-2">
              <div className="flex justify-between">
                <span>Nights:</span>
                <span>{nights}</span>
              </div>
              <div className="flex justify-between">
                <span>Guests:</span>
                <span>{guests}</span>
              </div>
              <div className="flex justify-between">
                <span>Price per night:</span>
                <span>${nightlyRate}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          className="mt-10 w-full bg-green-600 hover:bg-green-700 transition duration-200 text-white py-3 rounded-xl text-lg font-semibold"
        >
          Confirm & Pay
        </button>
      </div>
    </div>
  );
}
