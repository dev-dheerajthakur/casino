import React from "react";
import styles from "./styles/games.module.css";
import Link from "next/link";

interface GameCard {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  gradient: string;
  href: string;
  multiplier?: string;
  players?: number;
  isHot?: boolean;
  isNew?: boolean;
}

let games: GameCard[] = [
  {
    id: 1,
    title: "CRASH",
    subtitle: "Multiplier Madness",
    image: "🚀",
    href: "/games/aviator",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    multiplier: "999x",
    players: 1581,
    isHot: true,
  },
  {
    id: 2,
    title: "PLINKO",
    subtitle: "Drop & Win",
    image: "🎯",
    href: "/game/plinko",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    multiplier: "420x",
    players: 892,
    isNew: true,
  },
  {
    id: 3,
    title: "WHEEL",
    subtitle: "Spin to Fortune",
    image: "🎡",
    href: "/game/wheel",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    multiplier: "175x",
    players: 654,
    isHot: true,
  },
  {
    id: 4,
    title: "MINES",
    subtitle: "Find the Gems",
    image: "💎",
    href: "/game/mines",
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    multiplier: "24x",
    players: 432,
  },
  {
    id: 5,
    title: "DICE",
    subtitle: "Roll Your Luck",
    image: "🎲",
    href: "/game/dice",
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    multiplier: "98x",
    players: 756,
    isNew: true,
  },
  {
    id: 6,
    title: "BLACKJACK",
    subtitle: "Beat the Dealer",
    image: "🃏",
    href: "/game/blackjack",
    gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
    multiplier: "21x",
    players: 923,
    isHot: true,
  },
  {
    id: 7,
    title: "ROULETTE",
    subtitle: "European Classic",
    image: "🎰",
    href: "/game/roulette",
    gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    multiplier: "35x",
    players: 567,
  },
  {
    id: 8,
    title: "SLOTS",
    subtitle: "Mega Jackpot",
    image: "🎰",
    href: "/game/slots",
    gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    multiplier: "5000x",
    players: 2134,
    isHot: true,
  },
];


games = [
  {
    id: 1,
    title: "CRASH",
    subtitle: "Multiplier Madness",
    image: "🚀",
    href: "/games/aviator",
    gradient: "linear-gradient(135deg, #3d4b8a 0%, #4a2c62 100%)",
    multiplier: "999x",
    players: 1581,
    isHot: true,
  },
  {
    id: 2,
    title: "PLINKO",
    subtitle: "Drop & Win",
    image: "🎯",
    href: "/game/plinko",
    gradient: "linear-gradient(135deg, #8a4b92 0%, #8a2d3c 100%)",
    multiplier: "420x",
    players: 892,
    isNew: true,
  },
  {
    id: 3,
    title: "WHEEL",
    subtitle: "Spin to Fortune",
    image: "🎡",
    href: "/game/wheel",
    gradient: "linear-gradient(135deg, #2d5f8a 0%, #00697a 100%)",
    multiplier: "175x",
    players: 654,
    isHot: true,
  },
  {
    id: 4,
    title: "MINES",
    subtitle: "Find the Gems",
    image: "💎",
    href: "/game/mines",
    gradient: "linear-gradient(135deg, #247a45 0%, #1f7c6b 100%)",
    multiplier: "24x",
    players: 432,
  },
  {
    id: 5,
    title: "DICE",
    subtitle: "Roll Your Luck",
    image: "🎲",
    href: "/game/dice",
    gradient: "linear-gradient(135deg, #8a3d52 0%, #8a6b20 100%)",
    multiplier: "98x",
    players: 756,
    isNew: true,
  },
  {
    id: 6,
    title: "BLACKJACK",
    subtitle: "Beat the Dealer",
    image: "🃏",
    href: "/game/blackjack",
    gradient: "linear-gradient(135deg, #1a6b6d 0%, #1a0438 100%)",
    multiplier: "21x",
    players: 923,
    isHot: true,
  },
  {
    id: 7,
    title: "ROULETTE",
    subtitle: "European Classic",
    image: "🎰",
    href: "/game/roulette",
    gradient: "linear-gradient(135deg, #5a7a78 0%, #8a6b7a 100%)",
    multiplier: "35x",
    players: 567,
  },
  {
    id: 8,
    title: "SLOTS",
    subtitle: "Mega Jackpot",
    image: "🎰",
    href: "/game/slots",
    gradient: "linear-gradient(135deg, #8a4d52 0%, #8a6b7f 100%)",
    multiplier: "5000x",
    players: 2134,
    isHot: true,
  },
];


export default function Games() {
  return (
    <div className={styles.cardContainer}>
      {games.map((game, idx) => (
        <div
          key={`${game.id}-${idx}`}
          className={`${styles.card} `}
        >
          <div
            className={styles.cardInner}
            style={{ background: game.gradient }}
          >
            {game.isHot && (
              <span className={styles.badge} style={{ background: "#ef4444" }}>
                🔥 HOT
              </span>
            )}
            {game.isNew && (
              <span className={styles.badge} style={{ background: "#10b981" }}>
                ✨ NEW
              </span>
            )}

            <div className={styles.cardImage}>
              <span className={styles.emoji}>{game.image}</span>
            </div>

            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{game.title}</h3>
              <p className={styles.cardSubtitle}>{game.subtitle}</p>

              <div className={styles.cardStats}>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Max Win</span>
                  <span className={styles.statValue}>{game.multiplier}</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Players</span>
                  <span className={styles.statValue}>👥 {game.players}</span>
                </div>
              </div>

              <Link href={game.href} className={styles.playBtn}>PLAY NOW</Link>
            </div>

            <div className={styles.cardGlow}></div>
          </div>
        </div>
      ))}
    </div>
  );
}
