// src/lib/store.ts
import { configureStore } from "@reduxjs/toolkit";
import toastReducer from "./slices/ToastSlice";

export const store = configureStore({
  reducer: {
    toast: toastReducer,
    // add more slices here
  },

  // Optional: disable serializableCheck because toast actions have functions
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// 🔹 Inferred types:
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
