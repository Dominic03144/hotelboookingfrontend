import { createSlice } from "@reduxjs/toolkit";

interface BookingState {
  bookings: any[]; // replace with Booking[] if you define a type
}

const initialState: BookingState = {
  bookings: [],
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBookings(state, action) {
      state.bookings = action.payload;
    },
  },
});

export const { setBookings } = bookingSlice.actions;
export default bookingSlice.reducer;
