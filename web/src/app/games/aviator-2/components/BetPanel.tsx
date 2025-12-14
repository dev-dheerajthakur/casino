
import styles from './bet-panel.module.css'

export default function BetPanel() {
  return (
    <div className={styles.panel}>
      <div className={styles.amount}>
        <button>-</button>
        <span>10.00</span>
        <button>+</button>
      </div>

      <button className={styles.bet}>Bet 10.00 INR</button>
    </div>
  );
}
