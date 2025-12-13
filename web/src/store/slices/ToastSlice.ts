// src/lib/slices/toastSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ToastVariant = "success" | "error" | "info" | "warning" | "prompt";
export type ToastPosition = "bottom" | "top" | "center";

export interface ToastAction {
  label: string;
  onClick?: () => void; // note: non-serializable, see note below
  variant?: "primary" | "ghost";
}

export interface ToastOptions {
  id?: string;
  title?: string;
  message: string;
  variant?: ToastVariant;
  duration?: number; // ms, ignored for prompt
  actions?: ToastAction[];
  position?: ToastPosition;
}

export interface ToastInternal extends ToastOptions {
  id: string;
  position: ToastPosition;
  variant: ToastVariant;
}

interface ToastState {
  toasts: ToastInternal[];
}

const initialState: ToastState = {
  toasts: [],
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    addToast(state, action: PayloadAction<ToastInternal>) {
      state.toasts.push(action.payload);
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    clearToasts(state) {
      state.toasts = [];
    },
  },
});

export const { addToast, removeToast, clearToasts } = toastSlice.actions;
export default toastSlice.reducer;
