// ✅ src/features/auth/authSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// ✅ Define UserType with consistent fields
export interface UserType {
  userId: number;               // Must match your DB/Drizzle schema
  email: string;
  role: string;
  token: string;
  profileImageUrl: string | null; // ✅ Always set this, null when missing
}

interface AuthState {
  user: UserType | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserType>) => {
      state.user = {
        ...action.payload,
        profileImageUrl: action.payload.profileImageUrl ?? null, // ✅ Ensure null fallback
      };
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
