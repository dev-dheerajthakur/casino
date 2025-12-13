"use client";

import { useToast } from "@/components/toast/ToastProvider";

export default function SomeButton() {
  const { showToast } = useToast();

  // Example of an error toast
  showToast({
    variant: "error",
    title: "Login failed",
    message: "Wrong credentials or authentication code.",
  });

  // Example of a prompt toast
  showToast({
    variant: "prompt",
    title: "Cancel this bet?",
    message: "You placed ₹500 on Crash. Do you really want to cancel?",
    actions: [
      {
        label: "Keep Bet",
        variant: "ghost",
        onClick: () => {
          console.log("User kept bet");
        },
      },
      {
        label: "Cancel Bet",
        variant: "primary",
        onClick: () => {
          console.log("User cancelled bet");
          // Call your API here
        },
      },
    ],
  });

  showToast({
    variant: "success",
    message: "Welcome back!",
  });
  showToast({
    variant: "info",
    message: "New update available!",
    position: "top",
  });

  showToast({
    variant: "warning",
    message: "Poor network connection",
    position: "center",
  });

  showToast({
    variant: "prompt",
    title: "Allow withdrawal?",
    message: "Do you want to withdraw ₹5000?",
    position: "center",
    actions: [
      { label: "Cancel", variant: "ghost" },
      {
        label: "Allow",
        variant: "primary",
        onClick: () => console.log("User confirmed"),
      },
    ],
  });

  return (
    <button
      onClick={() =>
        showToast({
          variant: "success",
          title: "Logged in",
          message: "Welcome back to Edge of War!",
        })
      }
    >
      Test Toast
    </button>
  );
}
