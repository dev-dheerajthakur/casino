// app/profile/page.tsx
"use client";

import { useState } from "react";
import styles from './styles/profile.module.css'

const APP_NAME = "Edge of War Casino";

export default function ProfilePage() {
  const [copied, setCopied] = useState(false);

  // Fake user data – replace with real data from Redux / API
  const user = {
    fullName: "Dheeraj Thakur",
    username: "edge_dheeraj",
    email: "dheeraj@example.com",
    playerId: "EOW-928371",
    country: "India",
    phone: "+91 98765 43210",
    joinedAt: "2024-10-10",
    vipLevel: "VIP 2",
    kycStatus: "Verified",
    twoFAEnabled: true,
    lastLogin: "Today, 09:12 PM",
    currency: "INR",
    balance: 15240.5,
    bonusBalance: 1200,
    wagerRequirement: "40% completed",
  };

  const initials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(user.playerId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        {/* Left: Profile card */}
        <section className={styles.profileCard}>
          <div className={styles.headerRow}>
            <div className={styles.avatar}>
              <span className={styles.avatarInitials}>{initials}</span>
              <span className={styles.statusDot} />
            </div>

            <div className={styles.headerText}>
              <h1 className={styles.name}>{user.fullName}</h1>
              <p className={styles.username}>@{user.username}</p>
              <p className={styles.email}>{user.email}</p>
            </div>
          </div>

          <div className={styles.badgeRow}>
            <span className={`${styles.badge} ${styles.vipBadge}`}>
              {user.vipLevel}
            </span>
            <span className={`${styles.badge} ${styles.kycBadge}`}>
              {user.kycStatus}
            </span>
            <span
              className={`${styles.badge} ${
                user.twoFAEnabled ? styles.secureBadge : styles.insecureBadge
              }`}
            >
              {user.twoFAEnabled ? "2FA Enabled" : "2FA Not Enabled"}
            </span>
          </div>

          <div className={styles.metaRow}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Player ID</span>
              <div className={styles.metaValueRow}>
                <span className={styles.metaValue}>{user.playerId}</span>
                <button
                  type="button"
                  className={styles.copyButton}
                  onClick={handleCopyId}
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Country</span>
              <span className={styles.metaValue}>{user.country}</span>
            </div>

            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Joined</span>
              <span className={styles.metaValue}>{user.joinedAt}</span>
            </div>
          </div>

          <div className={styles.actionsRow}>
            <button type="button" className={styles.primaryButton}>
              Deposit
            </button>
            <button type="button" className={styles.secondaryButton}>
              Withdraw
            </button>
          </div>
        </section>

        {/* Right: Wallet + security + activity */}
        <section className={styles.rightCol}>
          {/* Balance */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Wallet Overview</h2>
              <span className={styles.currencyTag}>{user.currency}</span>
            </div>

            <div className={styles.balanceGrid}>
              <div className={styles.balanceBlock}>
                <span className={styles.label}>Total Balance</span>
                <div className={styles.amountRow}>
                  <span className={styles.amountMain}>
                    ₹{user.balance.toLocaleString("en-IN")}
                  </span>
                  <span className={styles.amountChip}>Playable</span>
                </div>
              </div>

              <div className={styles.balanceBlock}>
                <span className={styles.label}>Bonus Balance</span>
                <div className={styles.amountRow}>
                  <span className={styles.amountSub}>
                    ₹{user.bonusBalance.toLocaleString("en-IN")}
                  </span>
                  <span className={styles.amountChipMuted}>Bonus</span>
                </div>
                <p className={styles.helperText}>
                  Wagering: {user.wagerRequirement}
                </p>
              </div>
            </div>

            <div className={styles.inlineActions}>
              <button type="button" className={styles.chipButton}>
                View Transactions
              </button>
              <button type="button" className={styles.chipButton}>
                Set Deposit Limit
              </button>
            </div>
          </div>

          {/* Security & Account */}
          <div className={styles.gridTwo}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Security</h2>
              </div>
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <div>
                    <p className={styles.listTitle}>Two-Factor Auth</p>
                    <p className={styles.listDesc}>
                      Protect your account with Google Authenticator.
                    </p>
                  </div>
                  <button
                    type="button"
                    className={styles.smallButton}
                  >
                    {user.twoFAEnabled ? "Manage" : "Enable"}
                  </button>
                </li>
                <li className={styles.listItem}>
                  <div>
                    <p className={styles.listTitle}>Password</p>
                    <p className={styles.listDesc}>
                      Last changed 3 months ago.
                    </p>
                  </div>
                  <button type="button" className={styles.smallButton}>
                    Change
                  </button>
                </li>
                <li className={styles.listItem}>
                  <div>
                    <p className={styles.listTitle}>Last Login</p>
                    <p className={styles.listDesc}>{user.lastLogin}</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Account Details</h2>
              </div>
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <div>
                    <p className={styles.listTitle}>Phone</p>
                    <p className={styles.listDesc}>{user.phone}</p>
                  </div>
                  <button type="button" className={styles.smallButton}>
                    Edit
                  </button>
                </li>
                <li className={styles.listItem}>
                  <div>
                    <p className={styles.listTitle}>Email</p>
                    <p className={styles.listDesc}>{user.email}</p>
                  </div>
                  <button type="button" className={styles.smallButton}>
                    Edit
                  </button>
                </li>
                <li className={styles.listItem}>
                  <div>
                    <p className={styles.listTitle}>Responsible Gaming</p>
                    <p className={styles.listDesc}>
                      Session reminders and loss limits.
                    </p>
                  </div>
                  <button type="button" className={styles.smallButton}>
                    Configure
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Logout */}
          <div className={styles.card}>
            <div className={styles.logoutRow}>
              <div>
                <p className={styles.logoutTitle}>Logout from all devices</p>
                <p className={styles.logoutDesc}>
                  Securely sign out from all active sessions on {APP_NAME}.
                </p>
              </div>
              <button type="button" className={styles.dangerButton}>
                Logout
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
