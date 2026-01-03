import React from "react";
import AnimatedMultiplier from "./AnimatedMultiplier";
import styles from "./styles/gamearea.module.css";
import BetButton from "./BetButton";

export default function GameArea() {
  return (
    <div className={styles.container}>
      <div className={styles.multiplier}>
        <AnimatedMultiplier />
      </div>
      <div className={styles.betButton}>
        <BetButton />
        <BetButton />
      </div>
    </div>
  );
}
