// components/CasinoCarousel.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./styles/carousel.module.css";
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

const games: GameCard[] = [
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


export default function CasinoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  // Auto-scroll effect
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setDirection('right');
      setCurrentIndex((prev) => (prev + 1) % games.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  const goToSlide = (index: number) => {
    const diff = index - currentIndex;
    setDirection(diff > 0 || (diff < 0 && Math.abs(diff) > games.length / 2) ? 'right' : 'left');
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setDirection('left');
    setCurrentIndex((prev) => (prev - 1 + games.length) % games.length);
  };

  const goToNext = () => {
    setDirection('right');
    setCurrentIndex((prev) => (prev + 1) % games.length);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swiped left
      setDirection('right');
      goToNext();
    }

    if (touchStart - touchEnd < -75) {
      // Swiped right
      setDirection('left');
      goToPrevious();
    }
  };

  // Get visible cards (current + 2 on each side)
  const getVisibleCards = () => {
    const visible = [];
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + games.length) % games.length;
      visible.push({ ...games[index], position: i });
    }
    return visible;
  };

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carouselHeader}>
        <h2 className={styles.title}>
          <span className={styles.titleIcon}>🎮</span>
          Featured Games
        </h2>
        <div className={styles.controls}>
          <button
            className={styles.controlBtn}
            onClick={goToPrevious}
            aria-label="Previous"
          >
            ←
          </button>
          <button
            className={styles.controlBtn}
            onClick={goToNext}
            aria-label="Next"
          >
            →
          </button>
        </div>
      </div>
      <div
        className={styles.carousel}
        ref={carouselRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.carouselTrack}>
          {getVisibleCards().map((game, idx) => (
            <div
              key={`${game.id}-${idx}`}
              className={`${styles.card} ${
                game.position === 0 ? styles.cardActive : ""
              } ${
                game.position === -1 || game.position === 1
                  ? styles.cardAdjacent
                  : ""
              } ${direction === 'right' ? styles.slideRight : styles.slideLeft}`}
              style={{
                '--position': game.position,
                '--scale': game.position === 0 ? 1 : 0.85,
                '--opacity': Math.abs(game.position) > 1 ? 0.3 : 1,
                zIndex: 10 - Math.abs(game.position),
              } as React.CSSProperties}
              onClick={() => game.position !== 0 && goToSlide(game.id - 1)}
            >
              <div
                className={styles.cardInner}
                style={{ background: game.gradient }}
              >
                {game.isHot && (
                  <span
                    className={styles.badge}
                    style={{ background: "#ef4444" }}
                  >
                    🔥 HOT
                  </span>
                )}
                {game.isNew && (
                  <span
                    className={styles.badge}
                    style={{ background: "#10b981" }}
                  >
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
                      <span className={styles.statValue}>
                        {game.multiplier}
                      </span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statLabel}>Players</span>
                      <span className={styles.statValue}>
                        👥 {game.players}
                      </span>
                    </div>
                  </div>

                  <Link href={game.href} className={styles.playBtn}>PLAY NOW</Link>
                </div>

                <div className={styles.cardGlow}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.indicators}>
        {games.map((_, index) => (
          <button
            key={index}
            className={`${styles.indicator} ${
              index === currentIndex ? styles.indicatorActive : ""
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      <div className={styles.autoPlayInfo}>
        <span className={styles.autoPlayIcon}>{isPaused ? "⏸️" : "▶️"}</span>
        {isPaused ? "Paused" : "Auto-playing"}
      </div>
    </div>
  );
}