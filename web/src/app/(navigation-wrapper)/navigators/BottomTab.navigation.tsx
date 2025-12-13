import React from "react";
import styles from "./styles/bottom-tab.navigation.module.css";
import {
  ChessKnight,
  HeartPlus,
  Logs,
  MessageSquareHeart,
  Telescope,
} from "lucide-react";
import InteractiveLink from "./components/client/bottom-tab/InteractiveLink";

const tabLinks = [
  { name: "Menu", href: "/menu", icon: <Logs /> },
  { name: "Explore", href: "/explore", icon: <Telescope /> },
  { name: "Casino", href: "/casino", icon: <HeartPlus /> },
  { name: "Sports", href: "/sports", icon: <ChessKnight /> },
  { name: "Chat", href: "/chat", icon: <MessageSquareHeart /> },
];

export default async function BottomTabNavigation() {
  return (
    <div className={styles.container}>
      {tabLinks.map((link, index) => (
        <InteractiveLink href={link.href} key={index} classname={styles.interactiveLink}>
            {React.cloneElement(link.icon, {
              size: 22,
              className: styles.linkIcon,
            })}
            <div className={styles.linkText}>{link.name}</div>
        </InteractiveLink>
      ))}
    </div>
  );
}
