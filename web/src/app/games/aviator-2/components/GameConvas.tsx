"use client";
import { useEffect, useState } from "react";
import styles from './game-convas.module.css'

export default function GameCanvas() {
  const [multiplier, setMultiplier] = useState(1.0);

  useEffect(() => {
    const id = setInterval(() => {
      setMultiplier((m) => +(m + 0.02).toFixed(2));
    }, 100);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles.canvas}>
      <div className={styles.multiplier}>{multiplier}x</div>
      <div className={styles.plane}>✈</div>
    </div>
  );
}
