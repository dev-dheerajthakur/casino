'use client';

import { useState } from 'react';
import styles from './styles/header.module.css'

const Header = () => {
  const [balance] = useState<number>(0.00);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logo}>
          <span className={styles.logoText}>Aviator</span>
        </div>

        {/* Right Section */}
        <div className={styles.rightSection}>
          {/* Balance */}
          <div className={styles.balance}>
            <span className={styles.balanceAmount}>
              {balance.toFixed(2)} INR
            </span>
          </div>

          {/* Menu Button */}
          <button 
            className={styles.menuButton}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 20 20" 
              fill="none"
            >
              <path 
                d="M3 5h14M3 10h14M3 15h14" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* User Button */}
          <button className={styles.userButton} aria-label="User profile">
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 20 20" 
              fill="none"
            >
              <circle 
                cx="10" 
                cy="7" 
                r="3" 
                stroke="currentColor" 
                strokeWidth="2"
              />
              <path 
                d="M4 17c0-3.314 2.686-6 6-6s6 2.686 6 6" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className={styles.menuOverlay} onClick={() => setMenuOpen(false)}>
          <div className={styles.menuContent} onClick={(e) => e.stopPropagation()}>
            {/* Add your menu items here */}
            <div className={styles.menuItem}>Menu Item 1</div>
            <div className={styles.menuItem}>Menu Item 2</div>
            <div className={styles.menuItem}>Menu Item 3</div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;