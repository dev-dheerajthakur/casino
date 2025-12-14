import styles from "./header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <span className={styles.logo}>Aviator</span>
      </div>

      <div className={styles.right}>
        <span className={styles.balance}>0.66 INR</span>
        <button className={styles.deposit}>Deposit</button>
      </div>
    </header>
  );
}
