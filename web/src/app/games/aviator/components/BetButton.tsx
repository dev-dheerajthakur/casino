'use client'
import { useState } from 'react';
import styles from './styles/bet-button.module.css'

const BetButton = () => {
  const [activeTab, setActiveTab] = useState<'bet' | 'auto'>('bet');
  const [betAmount, setBetAmount] = useState<number>(10.00);

  const quickAmounts = [100, 200, 500, 1000];

  const handleIncrement = () => {
    setBetAmount(prev => prev + 10);
  };

  const handleDecrement = () => {
    setBetAmount(prev => Math.max(0, prev - 10));
  };

  const handleQuickAmount = (amount: number) => {
    setBetAmount(amount);
  };

  const handleBet = () => {
    console.log(`Placing bet: ${betAmount} INR`);
    // Add your bet logic here
  };

  return (
    <div className={styles.container}>
      {/* Tab Switcher */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'bet' ? styles.active : ''}`}
          onClick={() => setActiveTab('bet')}
        >
          Bet
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'auto' ? styles.active : ''}`}
          onClick={() => setActiveTab('auto')}
        >
          Auto
        </button>
      </div>

      {/* Betting Controls */}
      <div className={styles.controls}>
        {/* Left Side - Amount Controls */}
        <div className={styles.leftSection}>
          {/* Amount Adjuster */}
          <div className={styles.amountSection}>
            <button 
              className={styles.adjustButton}
              onClick={handleDecrement}
              aria-label="Decrease amount"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            
            <div className={styles.amountDisplay}>
              <span className={styles.amount}>{betAmount.toFixed(2)}</span>
            </div>
            
            <button 
              className={styles.adjustButton}
              onClick={handleIncrement}
              aria-label="Increase amount"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Quick Amount Buttons */}
          <div className={styles.quickAmounts}>
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                className={styles.quickButton}
                onClick={() => handleQuickAmount(amount)}
              >
                {amount}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side - Bet Button */}
        <button className={styles.betButton} onClick={handleBet}>
          <span className={styles.betText}>Bet</span>
          <span className={styles.betValue}>{betAmount.toFixed(2)} INR</span>
        </button>
      </div>
    </div>
  );
};

export default BetButton;