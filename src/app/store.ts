// ✅ src/app/store.ts

import { configureStore } from "@reduxjs/toolkit";

// ✅ Local slices
import authReducer from "../features/auth/authSlice";
import adminReducer from "../features/admin/adminSlice";
import bookingReducer from "../features/booking/bookingSlice";
import hotelReducer from "../features/hotel/hotelSlice";
import userReducer from "../features/user/userSlice";
import roomReducer from "../features/room/roomSlice";

// ✅ RTK Query API slices
import { adminApi } from "../features/admin/AdminApi";
import { userApi } from "../features/user/UserApi";
import { roomsApi } from "../features/admin/RoomsApi";
import { HotelsApi } from "../features/admin/HotelApi";

export const store = configureStore({
  reducer: {
    // ✅ Local reducers
    auth: authReducer,
    admin: adminReducer,
    booking: bookingReducer,
    hotel: hotelReducer,
    user: userReducer,
    room: roomReducer,

    // ✅ RTK Query API reducers
    [adminApi.reducerPath]: adminApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [roomsApi.reducerPath]: roomsApi.reducer,
    [HotelsApi.reducerPath]: HotelsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      adminApi.middleware,
      userApi.middleware,
      roomsApi.middleware,
      HotelsApi.middleware
    ),
  devTools: import.meta.env.MODE !== "production",
});

// ✅ These are required for typed hooks (useSelector & useDispatch)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
