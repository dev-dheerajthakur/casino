// app/register/page.tsx
"use client";

import { FormEvent, useMemo, useState } from "react";
import styles from './../../../styles/form.module.css'
import { Eye, EyeClosed } from "lucide-react";

const APP_NAME = "Edge of War Casino"; // change to your brand
const ISSUER = "EdgeOfWar"; // issuer for Google Authenticator

export default function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [twoFASecret, setTwoFASecret] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // In real app, this secret must come from your backend (and stored there)!
  const generateFakeSecret = () => {
    // Simple random base32-ish string (for demo only, not crypto-safe)
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let secret = "";
    for (let i = 0; i < 16; i++) {
      secret += chars[Math.floor(Math.random() * chars.length)];
    }
    return secret;
  };

  const handleGenerate2FA = () => {
    const secret = generateFakeSecret();
    setTwoFASecret(secret);
  };

  // otpauth URL for Google Authenticator
  const otpAuthUrl = useMemo(() => {
    if (!twoFASecret || !email) return "";
    const label = encodeURIComponent(`${ISSUER}:${email}`);
    const issuer = encodeURIComponent(ISSUER);
    return `otpauth://totp/${label}?secret=${twoFASecret}&issuer=${issuer}&digits=6&period=30`;
  }, [twoFASecret, email]);

  // Simple QR generator using public API (for demo)
  const qrUrl = useMemo(() => {
    if (!otpAuthUrl) return "";
    return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
      otpAuthUrl
    )}`;
  }, [otpAuthUrl]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const payload = {
      fullName,
      email,
      phone: `${countryCode}${phone}`,
      password,
      twoFASecret, // send to backend and link with user
    };

    console.log("Register payload:", payload);

    // TODO: call your API route: fetch("/api/register", { method: "POST", body: JSON.stringify(payload) })
    alert("Registration submitted (check console for payload).");
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create your account</h1>
        <p className={styles.subtitle}>
          Join {APP_NAME} and secure your account with 2FA.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="fullName">
              Full Name
            </label>
            <input
              id="fullName"
              className={styles.input}
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Phone with Country Code */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Phone Number</label>
            <div className={styles.phoneRow}>
              <select
                className={styles.countryCode}
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <div className={styles.passwordWrapper}>
              <input
                id="password"
                className={styles.input}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                required
                minLength={6}
                autoComplete="new-password"
                name="new-password"
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

          {/* Google Authenticator / 2FA Section */}
          <div className={styles.twoFASection}>
            <div className={styles.twoFAHeader}>
              <h2 className={styles.twoFATitle}>Secure your account (2FA)</h2>
              <span className={styles.badge}>Recommended</span>
            </div>
            <p className={styles.twoFAText}>
              Generate a secret and scan the QR code in{" "}
              <strong>Google Authenticator</strong> or any TOTP app.
            </p>

            <button
              type="button"
              className={styles.secondaryButton}
              onClick={handleGenerate2FA}
            >
              Generate 2FA Secret
            </button>

            {twoFASecret && (
              <div className={styles.twoFAContent}>
                {qrUrl && (
                  <div className={styles.qrWrapper}>
                    <img
                      src={qrUrl}
                      alt="Google Authenticator QR"
                      className={styles.qrImage}
                    />
                  </div>
                )}

                <div className={styles.secretBox}>
                  <span className={styles.secretLabel}>Secret Key</span>
                  <code className={styles.secretValue}>{twoFASecret}</code>
                  <p className={styles.helperText}>
                    If you can’t scan the QR, add a new account in Google
                    Authenticator and paste this key manually.
                  </p>
                </div>

                {otpAuthUrl && (
                  <div className={styles.linkBox}>
                    <span className={styles.secretLabel}>Direct Link</span>
                    <a href={otpAuthUrl} className={styles.otpLink}>
                      Add to Authenticator (otpauth://)
                    </a>
                    <p className={styles.helperText}>
                      On some devices you can tap this link to add the key
                      directly to your Authenticator app.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Submit */}
          <button type="submit" className={styles.primaryButton}>
            Create Account
          </button>

          <p className={styles.footerText}>
            Already have an account?{" "}
            <a href="/login" className={styles.link}>
              Login
            </a>
          </p>
          <p className={styles.footerText}>
            By creating an account, you confirm you are 18+ and agree to our{" "}
            <a href="/terms" className={styles.link}>
              Terms &amp; Conditions
            </a>
            .
          </p>
        </form>
      </div>
    </div>
  );
}
