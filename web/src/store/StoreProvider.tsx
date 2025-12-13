"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { ToastProvider } from "@/components/toast/ToastProvider";
import { store } from "./store";

export function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ToastProvider>{children}</ToastProvider>
    </Provider>
  );
}
