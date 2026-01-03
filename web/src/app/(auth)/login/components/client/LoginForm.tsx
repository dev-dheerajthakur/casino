// app/login/page.tsx
"use client";

import { FormEvent, useActionState, useState } from "react";
import styles from "./../../../styles/form.module.css";
import { ClipboardPaste, Eye, EyeClosed } from "lucide-react";
import { useToast } from "@/components/toast/ToastProvider";

const APP_NAME = "Edge of War Casino"; // change if needed

type LoginMode = "email" | "phone";
type Props = {
  onSubmit: (state: unknown, formData: FormData) => void;
};

export default function LoginForm({ onSubmit }: Props) {
  const { showToast } = useToast();
  const [loginMode, setLoginMode] = useState<LoginMode>("email");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authCode, setAuthCode] = useState("");
  const [state, formAction, isPending] = useActionState(onSubmit, undefined);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const identifier = loginMode === "email" ? email : `${countryCode}${phone}`;

    const payload = {
      loginMode,
      identifier,
      password,
      authCode,
    };

    console.log("Login payload:", payload);
    // TODO: call your API: /api/login
    showToast({
      variant: "success",
      title: "Login Successful",
      message: "Login submitted (check console for payload).",
    });
  };

  const emailActiveStyle =
    loginMode === "email"
      ? {
          background: "rgba(79,70,229,0.35)",
          boxShadow: "0 0 0 1px rgba(129,140,248,0.6)",
        }
      : undefined;

  const phoneActiveStyle =
    loginMode === "phone"
      ? {
          background: "rgba(79,70,229,0.35)",
          boxShadow: "0 0 0 1px rgba(129,140,248,0.6)",
        }
      : undefined;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>
          Log in to continue playing on {APP_NAME}.
        </p>

        <form className={styles.form} action={formAction}>
          {/* Login mode switch */}
          <div className={styles.formGroup}>
            <span className={styles.label}>Login with</span>
            <div
              style={{
                display: "flex",
                gap: 8,
              }}
            >
              <button
                type="button"
                className={styles.secondaryButton}
                style={emailActiveStyle}
                onClick={() => setLoginMode("email")}
              >
                Email
              </button>
              <button
                type="button"
                className={styles.secondaryButton}
                style={phoneActiveStyle}
                onClick={() => setLoginMode("phone")}
              >
                Phone
              </button>
            </div>
          </div>

          {/* Email OR Phone */}
          {loginMode === "email" ? (
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="emailOrUsername">
                Email
              </label>
              <input
                id="email"
                name="emailOrUsername"
                className={styles.input}
                type="text"
                // value={email}
                // onChange={(e) => setEmail(e.target.value)}
                placeholder="email or username"
                required
                autoComplete="email"
              />
            </div>
          ) : (
            <div className={styles.formGroup}>
              <label className={styles.label}>Phone Number</label>
              <div className={styles.phoneRow}>
                <select
                  className={styles.countryCode}
                  name="countryCode"
                  // value={countryCode}
                  // onChange={(e) => setCountryCode(e.target.value)}
                >
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+61">🇦🇺 +61</option>
                  <option value="+971">🇦🇪 +971</option>
                </select>
                <input
                  className={styles.input}
                  type="tel"
                  name="tel"
                  // value={phone}
                  // onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  required
                  autoComplete="tel"
                />
              </div>
            </div>
          )}

          {/* Password with toggle */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <div className={styles.passwordWrapper}>
              <input
                id="password"
                name="password"
                className={styles.input}
                type={showPassword ? "text" : "password"}
                // value={password}
                // onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                minLength={6}
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <Eye /> : <EyeClosed />}
              </button>
            </div>
          </div>

          {/* Authentication code (2FA) */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="authCode">
              Authentication Code
            </label>

            <div className={styles.authWrapper}>
              <input
                id="authCode"
                name="authCode"
                className={styles.input}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={6}
                // value={authCode}
                // onChange={(e) => setAuthCode(e.target.value)}
                placeholder="6-digit code"
              />

              <button
                type="button"
                className={styles.pasteButton}
                onClick={async () => {
                  try {
                    const text = await navigator.clipboard.readText();
                    setAuthCode(text.replace(/\D/g, "").slice(0, 6));
                  } catch {
                    showToast({
                      variant: "error",
                      title: "Clipboard access denied",
                      position: "top",
                      message:
                        "Unable to read clipboard. Please allow clipboard permissions.",
                    });
                  }
                }}
              >
                <ClipboardPaste />
              </button>
            </div>

            <p className={styles.helperText}>
              If 2FA is enabled, paste or enter the code from Google
              Authenticator.
            </p>
          </div>

          {/* Login button */}
          <button
            type="submit"
            className={styles.primaryButton}
            disabled={isPending}
            style={{ opacity: isPending ? 0.5 : 1 }}
          >
            Login jhg
          </button>

          {/* Links */}
          <p className={styles.footerText}>
            Don&apos;t have an account?{" "}
            <a href="/register" className={styles.link}>
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
