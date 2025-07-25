import { createSlice } from "@reduxjs/toolkit";

interface HotelState {
  hotels: any[]; // replace with Hotel[] if defined
}

const initialState: HotelState = {
  hotels: [],
};

const hotelSlice = createSlice({
  name: "hotel",
  initialState,
  reducers: {
    setHotels(state, action) {
      state.hotels = action.payload;
    },
  },
});

export const { setHotels } = hotelSlice.actions;
export default hotelSlice.reducer;
