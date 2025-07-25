import { createSlice } from "@reduxjs/toolkit";

interface AdminState {
  dashboardMessage: string;
}

const initialState: AdminState = {
  dashboardMessage: "Welcome to Admin Dashboard",
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setDashboardMessage(state, action) {
      state.dashboardMessage = action.payload;
    },
  },
});

export const { setDashboardMessage } = adminSlice.actions;
export default adminSlice.reducer;
