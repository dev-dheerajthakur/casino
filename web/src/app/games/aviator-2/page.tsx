"use client"
import React, { useState, useEffect } from 'react';

const Aviator = () => {
  const [gameState, setGameState] = useState('betting'); // betting, flying, crashed
  const [multiplier, setMultiplier] = useState(1.00);
  const [betAmount, setBetAmount] = useState(10.00);
  const [balance, setBalance] = useState(0.66);
  const [totalWin, setTotalWin] = useState(0.00);
  const [betsCount, setBetsCount] = useState(771);
  const [totalBets, setTotalBets] = useState(771);
  const [previousMultipliers] = useState([2.84, 7.59, 4.79, 1.92, 1.12, 4.06, 1.24, 1.23, 1.14]);
  const [activeTab, setActiveTab] = useState('all');
  
  const [betsHistory] = useState([
    { player: '1****', bet: 6131.25, multiplier: 2.21, win: 13550.06 },
    { player: '1***2', bet: 5237.55, multiplier: 1.78, win: 9322.85 },
    { player: 'b***r', bet: 5109.37, multiplier: null, win: null },
    { player: 'b***r', bet: 5109.37, multiplier: null, win: null },
    { player: '1****', bet: 3065.62, multiplier: null, win: null },
    { player: '1***1', bet: 2618.77, multiplier: null, win: null },
    { player: '4***m', bet: 2203.71, multiplier: null, win: null },
    { player: 's***3', bet: 2109.24, multiplier: null, win: null },
    { player: 's***3', bet: 2109.24, multiplier: null, win: null },
    { player: '1***1', bet: 2095.02, multiplier: null, win: null },
    { player: '1***2', bet: 2095.02, multiplier: null, win: null },
    { player: 'h***o', bet: 2013.59, multiplier: 1.84, win: 3705.00 },
    { player: '2***b', bet: 2000.00, multiplier: 2.68, win: 5360.00 },
  ]);

  const startGame = () => {
    setGameState('flying');
    setMultiplier(1.00);
    
    const interval = setInterval(() => {
      setMultiplier(prev => {
        const newMultiplier = prev + Math.random() * 0.1;
        if (newMultiplier > 10 || Math.random() > 0.98) {
          clearInterval(interval);
          setGameState('crashed');
          setTimeout(() => setGameState('betting'), 2000);
          return prev;
        }
        return newMultiplier;
      });
    }, 100);
  };

  const adjustBet = (amount: number) => {
    setBetAmount(prev => Math.max(10, prev + amount));
  };

  const setBetPreset = (amount: number) => {
    setBetAmount(amount);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <button style={styles.backBtn}>←</button>
        <div style={styles.logo}>Aviator</div>
        <div style={styles.headerRight}>
          <div style={styles.currency}>
            <span style={styles.flag}>🇮🇳</span>
            <span>INR</span>
            <span style={styles.dropdown}>▼</span>
          </div>
          <button style={styles.depositBtn}>Deposit</button>
        </div>
      </header>

      {/* Balance */}
      <div style={styles.balanceSection}>
        <div style={styles.balance}>{balance.toFixed(2)} INR</div>
        <div style={styles.menuIcons}>
          <button style={styles.iconBtn}>☰</button>
          <button style={styles.iconBtn}>💬</button>
        </div>
      </div>

      {/* Previous Multipliers */}
      <div style={styles.multiplierStrip}>
        {previousMultipliers.map((mult, idx) => (
          <div key={idx} style={styles.multiplierChip}>
            {mult.toFixed(2)}x
          </div>
        ))}
        <div style={styles.multiplierMore}>...</div>
      </div>

      {/* Game Area */}
      <div style={styles.gameArea}>
        {gameState === 'betting' && (
          <div style={styles.gameContent}>
            <div style={styles.branding}>
              <div style={styles.ufcLogo}>UFC</div>
              <div style={styles.aviatorLogo}>Aviator</div>
              <div style={styles.officialPartners}>OFFICIAL PARTNERS</div>
            </div>
            <div style={styles.spribeBadge}>
              <div style={styles.spribeLogo}>SPRIBE</div>
              <div style={styles.officialGame}>Official Game ✓</div>
              <div style={styles.since}>Since 2019</div>
            </div>
          </div>
        )}
        
        {gameState === 'flying' && (
          <div style={styles.gameContent}>
            <div style={styles.multiplierDisplay}>
              {multiplier.toFixed(2)}x
            </div>
            <div style={styles.curve}></div>
          </div>
        )}

        {gameState === 'crashed' && (
          <div style={styles.gameContent}>
            <div style={styles.crashedMultiplier}>
              {multiplier.toFixed(2)}x
            </div>
            <div style={styles.crashedCurve}></div>
          </div>
        )}

        <div style={styles.planeIcon}>✈️</div>
        <div style={styles.playerCount}>
          <div style={styles.playerAvatars}>👤👤👤</div>
          <span>{betsCount}</span>
        </div>
      </div>

      {/* Betting Controls */}
      <div style={styles.bettingSection}>
        <div style={styles.betControl}>
          <div style={styles.betTabs}>
            <button style={{...styles.betTab, ...styles.betTabActive}}>Bet</button>
            <button style={styles.betTab}>Auto</button>
          </div>
          <div style={styles.betAmount}>
            <button style={styles.betBtn} onClick={() => adjustBet(-10)}>−</button>
            <div style={styles.amount}>{betAmount.toFixed(2)}</div>
            <button style={styles.betBtn} onClick={() => adjustBet(10)}>+</button>
          </div>
          <div style={styles.betPresets}>
            <button style={styles.preset} onClick={() => setBetPreset(100)}>100</button>
            <button style={styles.preset} onClick={() => setBetPreset(200)}>200</button>
            <button style={styles.preset} onClick={() => setBetPreset(500)}>500</button>
            <button style={styles.preset} onClick={() => setBetPreset(1000)}>1,000</button>
          </div>
          <button style={styles.placeBetBtn} onClick={startGame}>
            Bet<br />{betAmount.toFixed(2)} INR
          </button>
        </div>

        <div style={styles.betControl}>
          <div style={styles.betTabs}>
            <button style={{...styles.betTab, ...styles.betTabActive}}>Bet</button>
            <button style={styles.betTab}>Auto</button>
            <button style={styles.betTab}>⊟</button>
          </div>
          <div style={styles.betAmount}>
            <button style={styles.betBtn} onClick={() => adjustBet(-10)}>−</button>
            <div style={styles.amount}>{betAmount.toFixed(2)}</div>
            <button style={styles.betBtn} onClick={() => adjustBet(10)}>+</button>
          </div>
          <div style={styles.betPresets}>
            <button style={styles.preset} onClick={() => setBetPreset(100)}>100</button>
            <button style={styles.preset} onClick={() => setBetPreset(200)}>200</button>
            <button style={styles.preset} onClick={() => setBetPreset(500)}>500</button>
            <button style={styles.preset} onClick={() => setBetPreset(1000)}>1,000</button>
          </div>
          <button style={styles.placeBetBtn}>
            Bet<br />{betAmount.toFixed(2)} INR
          </button>
        </div>
      </div>

      {/* Bets History */}
      <div style={styles.historySection}>
        <div style={styles.historyTabs}>
          <button 
            style={{...styles.historyTab, ...(activeTab === 'all' ? styles.historyTabActive : {})}}
            onClick={() => setActiveTab('all')}
          >
            All Bets
          </button>
          <button 
            style={styles.historyTab}
            onClick={() => setActiveTab('previous')}
          >
            Previous
          </button>
          <button 
            style={styles.historyTab}
            onClick={() => setActiveTab('top')}
          >
            Top
          </button>
        </div>

        <div style={styles.statsRow}>
          <div style={styles.statsLeft}>
            <div style={styles.playerAvatars}>👤👤👤</div>
            <div style={styles.betsInfo}>{betsCount}/{totalBets} Bets</div>
          </div>
          <div style={styles.statsRight}>
            <div style={styles.totalWin}>{totalWin.toFixed(2)}</div>
            <div style={styles.totalWinLabel}>Total win INR</div>
          </div>
        </div>

        <div style={styles.historyTable}>
          <div style={styles.historyHeader}>
            <div style={styles.col}>Player</div>
            <div style={styles.col}>Bet INR</div>
            <div style={styles.col}>X</div>
            <div style={styles.col}>Win INR</div>
          </div>
          <div style={styles.historyBody}>
            {betsHistory.map((bet, idx) => (
              <div 
                key={idx} 
                style={{...styles.historyRow, ...(bet.win ? styles.winRow : {})}}
              >
                <div style={styles.colCell}>
                  <span style={styles.avatar}>👤</span>
                  {bet.player}
                </div>
                <div style={styles.colCell}>{bet.bet.toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
                <div style={styles.colCell}>
                  {bet.multiplier ? (
                    <span style={styles.multiplierBadge}>{bet.multiplier.toFixed(2)}x</span>
                  ) : ''}
                </div>
                <div style={styles.colCell}>
                  {bet.win ? bet.win.toLocaleString('en-IN', {minimumFractionDigits: 2}) : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.fairGame}>
          <span>🛡</span> Provably Fair Game
        </div>
        <div style={styles.poweredBy}>
          Powered by <strong>SPRIBE</strong>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    background: '#1a1d29',
    color: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    minHeight: '100vh',
    maxWidth: '575px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    background: '#0f1118',
    borderBottom: '1px solid #2a2d3a',
  },
  backBtn: {
    background: '#2a2d3a',
    border: 'none',
    color: '#ffffff',
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    fontSize: '20px',
    cursor: 'pointer',
  },
  logo: {
    fontFamily: 'Arial, sans-serif',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#ff1654',
    fontStyle: 'italic',
  },
  headerRight: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  currency: {
    background: '#2a2d3a',
    padding: '8px 12px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
  },
  flag: {
    fontSize: '18px',
  },
  dropdown: {
    fontSize: '12px',
    marginLeft: '4px',
  },
  depositBtn: {
    background: '#00e676',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    color: '#000000',
    fontWeight: 'bold',
    fontSize: '14px',
    cursor: 'pointer',
  },
  balanceSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    background: '#1a1d29',
  },
  balance: {
    color: '#00e676',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  menuIcons: {
    display: 'flex',
    gap: '12px',
  },
  iconBtn: {
    background: 'transparent',
    border: 'none',
    color: '#8b8e98',
    fontSize: '20px',
    cursor: 'pointer',
  },
  multiplierStrip: {
    display: 'flex',
    gap: '8px',
    padding: '12px 16px',
    overflowX: 'auto' as const,
    background: '#1a1d29',
  },
  multiplierChip: {
    background: '#2a2d3a',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#a855f7',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  },
  multiplierMore: {
    background: '#2a2d3a',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#8b8e98',
  },
  gameArea: {
    position: 'relative' as const,
    height: '400px',
    background: 'linear-gradient(135deg, #1a1d29 0%, #2a2d3a 100%)',
    margin: '0 16px 16px',
    borderRadius: '16px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameContent: {
    position: 'relative' as const,
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  branding: {
    textAlign: 'center' as const,
    marginBottom: '20px',
  },
  ufcLogo: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#ff1654',
    letterSpacing: '8px',
  },
  aviatorLogo: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#ff1654',
    fontStyle: 'italic',
    marginTop: '-10px',
  },
  officialPartners: {
    fontSize: '12px',
    color: '#8b8e98',
    marginTop: '8px',
    letterSpacing: '2px',
  },
  spribeBadge: {
    background: 'rgba(42, 45, 58, 0.8)',
    border: '2px solid #4ade80',
    borderRadius: '12px',
    padding: '16px 24px',
    textAlign: 'center' as const,
  },
  spribeLogo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: '2px',
  },
  officialGame: {
    color: '#4ade80',
    fontSize: '14px',
    marginTop: '4px',
  },
  since: {
    color: '#8b8e98',
    fontSize: '12px',
    marginTop: '4px',
  },
  multiplierDisplay: {
    fontSize: '80px',
    fontWeight: 'bold',
    color: '#ffffff',
    textShadow: '0 0 30px rgba(255, 255, 255, 0.5)',
  },
  crashedMultiplier: {
    fontSize: '80px',
    fontWeight: 'bold',
    color: '#ff1654',
    textShadow: '0 0 30px rgba(255, 22, 84, 0.5)',
  },
  curve: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: '200px',
    background: 'linear-gradient(to top right, #ff1654 0%, transparent 50%)',
    clipPath: 'polygon(0 100%, 100% 20%, 100% 100%)',
  },
  crashedCurve: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: '200px',
    background: 'linear-gradient(to top right, #ff1654 0%, transparent 50%)',
    clipPath: 'polygon(0 100%, 50% 30%, 100% 100%)',
  },
  planeIcon: {
    position: 'absolute' as const,
    bottom: '30px',
    left: '30px',
    fontSize: '40px',
    transform: 'rotate(-45deg)',
    filter: 'hue-rotate(340deg)',
  },
  playerCount: {
    position: 'absolute' as const,
    bottom: '20px',
    right: '20px',
    background: 'rgba(42, 45, 58, 0.9)',
    padding: '8px 16px',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  playerAvatars: {
    fontSize: '16px',
  },
  bettingSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    padding: '0 16px 16px',
  },
  betControl: {
    background: '#2a2d3a',
    borderRadius: '12px',
    padding: '16px',
  },
  betTabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '12px',
  },
  betTab: {
    background: '#1a1d29',
    border: 'none',
    color: '#8b8e98',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    flex: 1,
  },
  betTabActive: {
    color: '#ffffff',
    background: '#3a3d4a',
  },
  betAmount: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  betBtn: {
    background: '#3a3d4a',
    border: 'none',
    color: '#ffffff',
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    fontSize: '20px',
    cursor: 'pointer',
  },
  amount: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#ffffff',
  },
  betPresets: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
    marginBottom: '12px',
  },
  preset: {
    background: '#1a1d29',
    border: 'none',
    color: '#8b8e98',
    padding: '8px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  placeBetBtn: {
    background: '#00e676',
    border: 'none',
    color: '#000000',
    padding: '16px',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
    lineHeight: 1.4,
  },
  historySection: {
    background: '#2a2d3a',
    margin: '0 16px 80px',
    borderRadius: '12px',
    padding: '16px',
  },
  historyTabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
    borderBottom: '1px solid #3a3d4a',
  },
  historyTab: {
    background: 'transparent',
    border: 'none',
    color: '#8b8e98',
    padding: '12px 16px',
    cursor: 'pointer',
    fontSize: '14px',
    position: 'relative' as const,
  },
  historyTabActive: {
    color: '#ffffff',
    borderBottom: '2px solid #00e676',
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid #3a3d4a',
  },
  statsLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  betsInfo: {
    fontSize: '14px',
    color: '#8b8e98',
  },
  statsRight: {
    textAlign: 'right' as const,
  },
  totalWin: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#ffffff',
  },
  totalWinLabel: {
    fontSize: '12px',
    color: '#8b8e98',
  },
  historyTable: {
    fontSize: '13px',
  },
  historyHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 1.5fr 1fr 1.5fr',
    gap: '8px',
    padding: '8px 12px',
    color: '#8b8e98',
    fontSize: '12px',
  },
  historyBody: {
    maxHeight: '400px',
    overflowY: 'auto' as const,
  },
  historyRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1.5fr 1fr 1.5fr',
    gap: '8px',
    padding: '10px 12px',
    background: '#1a1d29',
    marginBottom: '4px',
    borderRadius: '6px',
    color: '#ffffff',
  },
  winRow: {
    background: 'linear-gradient(90deg, rgba(0, 230, 118, 0.1) 0%, transparent 100%)',
  },
  col: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  colCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  avatar: {
    fontSize: '14px',
  },
  multiplierBadge: {
    background: '#4ade80',
    color: '#000000',
    padding: '4px 8px',
    borderRadius: '4px',
    fontWeight: 'bold',
    fontSize: '12px',
  },
  footer: {
    position: 'fixed' as const,
    bottom: 0,
    left: 0,
    right: 0,
    maxWidth: '575px',
    margin: '0 auto',
    background: '#1a1d29',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #2a2d3a',
  },
  fairGame: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#8b8e98',
    fontSize: '12px',
  },
  poweredBy: {
    color: '#8b8e98',
    fontSize: '12px',
  },
};

export default Aviator;