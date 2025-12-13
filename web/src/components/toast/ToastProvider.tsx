// components/toast/ToastProvider.tsx
"use client";

import {
  ReactNode,
  useEffect,
  useState,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import styles from "./toast-provider.module.css";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  addToast,
  removeToast,
  type ToastOptions,
  type ToastInternal,
} from "@/store/slices/ToastSlice";

function uuid() {
  return (
    Math.random().toString(36).substring(2, 10) +
    Math.random().toString(36).substring(2, 10)
  );
}

/**
 * Hook you will use instead of the old context-based useToast
 */
export const useToast = () => {
  const dispatch = useAppDispatch();

  const showToast = useCallback(
    (options: ToastOptions) => {
      const id = options.id ?? uuid();
      const variant = options.variant ?? "info";
      const position = options.position ?? "bottom";

      const toast: ToastInternal = {
        ...options,
        id,
        variant,
        position,
      };

      dispatch(addToast(toast));

      // Auto-close for non-prompt toasts
      if (variant !== "prompt") {
        const duration = options.duration ?? 3500;
        setTimeout(() => {
          dispatch(removeToast(id));
        }, duration);
      }
    },
    [dispatch]
  );

  const hideToast = useCallback(
    (id: string) => {
      dispatch(removeToast(id));
    },
    [dispatch]
  );

  return { showToast, hideToast };
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const toasts = useAppSelector((state) => state.toast.toasts);
  const { hideToast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function renderToast(toast: ToastInternal) {
    return (
      <div
        key={toast.id}
        className={`${styles.toast} ${styles[toast.variant ?? "info"]}`}
      >
        <div className={styles.toastMain}>
          <div className={styles.iconDot} />
          <div className={styles.textBlock}>
            {toast.title && (
              <div className={styles.toastTitle}>{toast.title}</div>
            )}
            <div className={styles.toastMessage}>{toast.message}</div>
          </div>

          <button
            className={styles.closeButton}
            onClick={() => hideToast(toast.id)}
          >
            ×
          </button>
        </div>

        {toast.actions && toast.actions.length > 0 && (
          <div className={styles.actionsRow}>
            {toast.actions.map((action, idx) => (
              <button
                key={idx}
                className={
                  action.variant === "primary"
                    ? styles.actionPrimary
                    : styles.actionGhost
                }
                onClick={() => {
                  action.onClick?.();
                  hideToast(toast.id);
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (!mounted || typeof document === "undefined") {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      {createPortal(
        <>
          {/* bottom */}
          <div className={`${styles.stack} ${styles.bottom}`}>
            {toasts
              .filter((t) => t.position === "bottom")
              .map((t) => renderToast(t))}
          </div>

          {/* top */}
          <div className={`${styles.stack} ${styles.top}`}>
            {toasts
              .filter((t) => t.position === "top")
              .map((t) => renderToast(t))}
          </div>

          {/* center */}
          <div className={`${styles.stack} ${styles.center}`}>
            {toasts
              .filter((t) => t.position === "center")
              .map((t) => renderToast(t))}
          </div>
        </>,
        document.body
      )}
    </>
  );
}
