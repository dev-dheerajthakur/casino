import styles from './styles/bet-tabs.module.css';

interface Bet {
  id: string;
  avatar: string;
  username: string;
  amount: number;
  multiplier?: number;
  winAmount?: number;
}

// Mock data - replace with your actual data source
const betsData: Bet[] = [
  { id: '1', avatar: '🎮', username: 'm***8', amount: 8000.00 },
  { id: '2', avatar: '👤', username: 'm***8', amount: 8000.00 },
  { id: '3', avatar: '🌕', username: 'g***a', amount: 3000.00 },
  { id: '4', avatar: '🎯', username: '2***7', amount: 2658.43 },
  { id: '5', avatar: '⚪', username: 'j***a', amount: 2000.00 },
  { id: '6', avatar: '👨', username: '@***j', amount: 2000.00 },
  { id: '7', avatar: '🎮', username: '2***5', amount: 1535.06 },
  { id: '8', avatar: '🎮', username: '2***5', amount: 1535.06 },
  { id: '9', avatar: '👤', username: 'r***r', amount: 1500.00 },
  { id: '10', avatar: '👨', username: 'p***y', amount: 1500.00 },
  { id: '11', avatar: '👨', username: 'p***y', amount: 1500.00 },
  { id: '12', avatar: '🔴', username: '2***0', amount: 1330.38 },
  { id: '13', avatar: '🎯', username: '2***7', amount: 1023.37 },
  { id: '14', avatar: '👤', username: '2***7', amount: 1023.37 },
  { id: '15', avatar: '👨', username: '2***4', amount: 1023.37 },
  { id: '16', avatar: '👤', username: '1***7', amount: 1000.00 },
  { id: '17', avatar: '🎮', username: 's***h', amount: 1000.00 },
  { id: '18', avatar: '👨', username: '@***j', amount: 1000.00 },
];

const BetsTable = () => {
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${styles.active}`}>
            All Bets
          </button>
          <button className={styles.tab}>Previous</button>
          <button className={styles.tab}>Top</button>
        </div>
        
        <div className={styles.statsRow}>
          <div className={styles.betsInfo}>
            <div className={styles.avatarGroup}>
              <span className={styles.miniAvatar}>🎮</span>
              <span className={styles.miniAvatar}>👤</span>
              <span className={styles.miniAvatar}>🌕</span>
            </div>
            <span className={styles.betsCount}>3017/2017 Bets</span>
          </div>
          <div className={styles.totalWin}>
            <span className={styles.winAmount}>0.00</span>
            <span className={styles.winLabel}>Total win INR</span>
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className={styles.tableHeader}>
        <div className={styles.columnPlayer}>Player</div>
        <div className={styles.columnBet}>Bet INR</div>
        <div className={styles.columnMultiplier}>X</div>
        <div className={styles.columnWin}>Win INR</div>
      </div>

      {/* Bets List */}
      <div className={styles.betsList}>
        {betsData.map((bet) => (
          <div key={bet.id} className={styles.betRow}>
            <div className={styles.columnPlayer}>
              <div className={styles.playerInfo}>
                <span className={styles.avatar}>{bet.avatar}</span>
                <span className={styles.username}>{bet.username}</span>
              </div>
            </div>
            <div className={styles.columnBet}>
              {bet.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className={styles.columnMultiplier}>
              {bet.multiplier || '-'}
            </div>
            <div className={styles.columnWin}>
              {bet.winAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '-'}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <span className={styles.footerIcon}>🎲</span>
        <span className={styles.footerText}>Provably Fair Game</span>
        <span className={styles.poweredBy}>Powered by <strong>SPRIBE</strong></span>
      </div>
    </div>
  );
};

export default BetsTable;