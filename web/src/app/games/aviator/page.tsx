import React from "react";
import Header from "./components/Header";
import AnimatedMultiplier from "./components/AnimatedMultiplier";
import BetContainer from "./components/BetButton";
import BetInfo from "./components/BetInfo";
import BetsTable from "./components/BetTabs";
import styles from "./page.module.css";
import GameArea from "./components/GameArea";

export default async function page() {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        <GameArea />
        <BetsTable />
      </div>
      {/* <div className={styles.footer}></div> */}
      {/* <AnimatedMultiplier />
      <BetContainer />
      <BetContainer /> */}
    </div>
  );
}
