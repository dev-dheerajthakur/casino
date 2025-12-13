// components/FilterSection.tsx
"use client";

import { useState } from "react";
import styles from "./styles/filter-section.module.css";

interface Filter {
  id: string;
  label: string;
  icon: string;
}

const filters: Filter[] = [
  { id: "all", label: "All Games", icon: "🎮" },
  { id: "slots", label: "Slots", icon: "🎰" },
  { id: "table", label: "Table Games", icon: "🃏" },
  { id: "live", label: "Live Casino", icon: "🎥" },
  { id: "crash", label: "Crash", icon: "🚀" },
  { id: "instant", label: "Instant Win", icon: "⚡" },
  { id: "hot", label: "Hot", icon: "🔥" },
  { id: "new", label: "New", icon: "✨" },
  { id: "trending", label: "Trending", icon: "📈" },
  { id: "exclusive", label: "Exclusive", icon: "👑" },
  { id: "jackpot", label: "Jackpot", icon: "💰" },
  { id: "popular", label: "Popular", icon: "⭐" },
];

export default function FilterSection() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className={styles.filterContainer}>
      <div className={styles.searchWrapper}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          type="text"
          placeholder="Search games..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className={styles.clearBtn}
          >
            ✕
          </button>
        )}
      </div>

      <div className={styles.filtersWrapper}>
        <div className={styles.filtersScroll}>
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`${styles.filterBtn} ${
                activeFilter === filter.id ? styles.filterBtnActive : ""
              }`}
            >
              <span className={styles.filterIcon}>{filter.icon}</span>
              <span className={styles.filterLabel}>{filter.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}