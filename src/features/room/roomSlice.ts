import { createSlice } from "@reduxjs/toolkit";

interface RoomState {
  rooms: any[]; // replace with Room[] if defined
}

const initialState: RoomState = {
  rooms: [],
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRooms(state, action) {
      state.rooms = action.payload;
    },
  },
});

export const { setRooms } = roomSlice.actions;
export default roomSlice.reducer;
