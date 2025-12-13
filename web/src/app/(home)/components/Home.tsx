// app/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import styles from './styles/home.module.css'
import { useToast } from "@/components/toast/ToastProvider";

type Game = { id: string; title: string; provider: string; tag?: string };

const HERO_IMAGES = [
  "/file.svg",
  "/globe.svg",
];

const FEATURED: Game[] = [
  { id: "f1", title: "Crash", provider: "Spribe", tag: "999x" },
  { id: "f2", title: "Limbo", provider: "Own", tag: "500x" },
  { id: "f3", title: "Fortune Gems", provider: "Jili" },
];

const PROVIDERS = [
  "Spribe",
  "Own Games",
  "Pragmatic",
  "BGaming",
  "NetEnt",
  "Evolution",
];

export default function HomePage() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const heroTimer = useRef<number | null>(null);
  const featTimer = useRef<number | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    heroTimer.current = window.setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, 4000);
    featTimer.current = window.setInterval(() => {
      setFeaturedIndex((i) => (i + 1) % FEATURED.length);
    }, 3800);
    return () => {
      if (heroTimer.current) window.clearInterval(heroTimer.current);
      if (featTimer.current) window.clearInterval(featTimer.current);
    };
  }, []);

  function onPlay(game: Game) {
    showToast({ variant: "info", message: `Launching ${game.title}`, position: "bottom" });
    // integrate actual launch flow
  }

  return (
    <main className={styles.page}>
      {/* Top area: balance + hero */}
      <header className={styles.topbar}>
        <div className={styles.logo}>Edge of War</div>
        <div className={styles.actions}>
          <div className={styles.balance}>₹3.70</div>
          <button className={styles.depositBtn}>Deposit</button>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCarousel}>
          {HERO_IMAGES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`hero-${i}`}
              className={`${styles.heroImage} ${i === heroIndex ? styles.active : ""}`}
              draggable={false}
            />
          ))}
          <div className={styles.heroDots}>
            {HERO_IMAGES.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === heroIndex ? styles.dotActive : ""}`}
                onClick={() => setHeroIndex(i)}
                aria-label={`hero-${i}`}
              />
            ))}
          </div>
        </div>

        <div className={styles.bannerMini}>
          <div className={styles.miniItem}>
            <div className={styles.miniTitle}>Free Money</div>
            <div className={styles.miniSub}>Gifts & prizes</div>
          </div>
          <div className={styles.miniItem}>
            <div className={styles.miniTitle}>Bonuses</div>
            <div className={styles.miniSub}>Claim now</div>
          </div>
        </div>
      </section>

      {/* Featured games — large cards */}
      <section className={styles.featured}>
        <div className={styles.sectionHead}>
          <h3>Continue Playing</h3>
          <div className={styles.seeAll}>All &gt;</div>
        </div>
        <div className={styles.featuredRow}>
          <div className={styles.featuredCard}>
            <div className={styles.featuredThumb}>{FEATURED[featuredIndex].title}</div>
            <div className={styles.featuredMeta}>
              <div>
                <div className={styles.featuredName}>{FEATURED[featuredIndex].title}</div>
                <div className={styles.featuredProvider}>{FEATURED[featuredIndex].provider}</div>
              </div>
              <button className={styles.playBtn} onClick={() => onPlay(FEATURED[featuredIndex])}>Play</button>
            </div>
          </div>

          {/* small list next to featured */}
          <div className={styles.smallList}>
            {FEATURED.map((g, i) => (
              <div key={g.id} className={styles.smallCard}>
                <div className={styles.smallThumb}>{g.title}</div>
                <div className={styles.smallMeta}>
                  <div>{g.title}</div>
                  <div className={styles.providerLabel}>{g.provider}</div>
                </div>
                <button className={styles.smallPlay} onClick={() => onPlay(g)}>Play</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Providers */}
      <section className={styles.providers}>
        <h3>Providers</h3>
        <div className={styles.providersGrid}>
          {PROVIDERS.map((p) => (
            <div key={p} className={styles.provider}>
              <div className={styles.providerLogo}>{p[0]}</div>
              <div className={styles.providerName}>{p}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Game catalog */}
      <section className={styles.catalog}>
        <div className={styles.catalogHeader}>
          <h3>All games</h3>
          <div className={styles.filterRow}>
            <button className={styles.filterBtn}>All</button>
            <button className={styles.filterBtn}>Crash</button>
            <button className={styles.filterBtn}>Slots</button>
            <button className={styles.filterBtn}>Live</button>
            <button className={styles.filterBtn}>Exclusive</button>
          </div>
        </div>

        <div className={styles.gamesGrid}>
          {Array.from({ length: 12 }).map((_, i) => {
            const game: Game = { id: `g${i}`, title: `Game ${i + 1}`, provider: i % 2 ? "Spribe" : "Own" };
            return (
              <div key={game.id} className={styles.gameCard}>
                <div className={styles.gameThumb}>{game.title}</div>
                <div className={styles.gameInfo}>
                  <div>
                    <div className={styles.gameTitle}>{game.title}</div>
                    <div className={styles.gameProvider}>{game.provider}</div>
                  </div>
                  <button className={styles.playSmall} onClick={() => onPlay(game)}>Play</button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* promos */}
      <section className={styles.promoRow}>
        <div className={styles.promoCard}>
          <h4>Daily Bonus</h4>
          <p>Claim free spins & coins every 24h</p>
          <button className={styles.promoBtn} onClick={() => showToast({ variant: "success", message: "Bonus Claimed", position: "bottom" })}>Claim</button>
        </div>
        <div className={styles.promoCard}>
          <h4>Tournaments</h4>
          <p>Weekly leaderboards and prize pools</p>
          <button className={styles.promoBtnOutline} onClick={() => showToast({ variant: "info", message: "Opening tournaments", position: "bottom" })}>View</button>
        </div>
      </section>

      {/* mobile-style bottom nav (visual only) */}
      <nav className={styles.bottomNav}>
        <button className={styles.navBtn}>Menu</button>
        <button className={`${styles.navBtn} ${styles.active}`}>Home</button>
        <button className={styles.navBtn}>Casino</button>
        <button className={styles.navBtn}>Free money</button>
        <button className={styles.navBtn}>Chat</button>
      </nav>
    </main>
  );
}
