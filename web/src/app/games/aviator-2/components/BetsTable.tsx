
import styles from './bet-table.module.css'

const rows = [
  { user: "1***", bet: "6,131.25", x: "2.21x", win: "13,550.06" },
  { user: "b***r", bet: "5,109.37", x: "—", win: "—" },
];

export default function BetsTable() {
  return (
    <div className={styles.table}>
      {rows.map((r, i) => (
        <div key={i} className={styles.row}>
          <span>{r.user}</span>
          <span>{r.bet}</span>
          <span className={styles.mult}>{r.x}</span>
          <span>{r.win}</span>
        </div>
      ))}
    </div>
  );
}
