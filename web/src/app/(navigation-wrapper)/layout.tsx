import React from "react";
import styles from "./layout.module.css";
import BottomTabNavigation from "./navigators/BottomTab.navigation";
import DrawerNavigation from "./navigators/Drawer.navigation";

interface props {
  children: React.ReactNode;
}

export default function layout({ children }: props) {
  return (
    <div className={styles.container}>
      <BottomTabNavigation />
      {/* <DrawerNavigation /> */}
      <div className={styles.overlay}>
        {children}
      </div>
    </div>
  );
}
