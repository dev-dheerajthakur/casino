// components/MinesGame.tsx
'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

interface Tile {
  id: number;
  revealed: boolean;
  isMine: boolean;
  isGem: boolean;
}

export default function MinesGame() {
  const [balance, setBalance] = useState(0.66);
  const [betAmount, setBetAmount] = useState(0);
  const [minesCount, setMinesCount] = useState(4);
  const [gameMode, setGameMode] = useState<'manual' | 'auto'>('manual');
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [revealedCount, setRevealedCount] = useState(0);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.00);
  const [profit, setProfit] = useState(0);

  useEffect(() => {
    initializeTiles();
  }, []);

  const initializeTiles = () => {
    const newTiles: Tile[] = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      revealed: false,
      isMine: false,
      isGem: false,
    }));
    setTiles(newTiles);
  };

  const startGame = () => {
    if (betAmount === 0) return;

    // Initialize tiles with random mines
    const newTiles: Tile[] = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      revealed: false,
      isMine: false,
      isGem: false,
    }));

    // Place mines randomly
    const minePositions = new Set<number>();
    while (minePositions.size < minesCount) {
      const pos = Math.floor(Math.random() * 25);
      minePositions.add(pos);
    }

    minePositions.forEach(pos => {
      newTiles[pos].isMine = true;
    });

    // Mark gems (non-mine tiles)
    newTiles.forEach(tile => {
      if (!tile.isMine) {
        tile.isGem = true;
      }
    });

    setTiles(newTiles);
    setGameState('playing');
    setRevealedCount(0);
    setCurrentMultiplier(1.00);
    setProfit(0);
    setBalance(prev => prev - betAmount);
  };

  const revealTile = (index: number) => {
    if (gameState !== 'playing') return;
    if (tiles[index].revealed) return;

    const newTiles = [...tiles];
    newTiles[index].revealed = true;

    if (newTiles[index].isMine) {
      // Hit a mine - game over
      setTiles(newTiles);
      setGameState('lost');
      
      // Reveal all tiles after a short delay
      setTimeout(() => {
        const allRevealed = newTiles.map(t => ({ ...t, revealed: true }));
        setTiles(allRevealed);
      }, 500);
    } else {
      // Found a gem
      const newRevealedCount = revealedCount + 1;
      setRevealedCount(newRevealedCount);
      
      // Calculate multiplier based on revealed tiles
      const safeSpots = 25 - minesCount;
      const multiplier = calculateMultiplier(newRevealedCount, safeSpots);
      setCurrentMultiplier(multiplier);
      setProfit(betAmount * multiplier - betAmount);
      
      setTiles(newTiles);
      
      // Check if won (all safe tiles revealed)
      if (newRevealedCount === safeSpots) {
        setGameState('won');
        setBalance(prev => prev + betAmount * multiplier);
      }
    }
  };

  const calculateMultiplier = (revealed: number, totalSafe: number): number => {
    // Simple multiplier calculation based on risk
    const baseMultiplier = 1.0;
    const increment = (totalSafe / (totalSafe - revealed)) * 0.2;
    return parseFloat((baseMultiplier + (revealed * increment)).toFixed(2));
  };

  const cashOut = () => {
    if (gameState !== 'playing') return;
    
    const winAmount = betAmount * currentMultiplier;
    setBalance(prev => prev + winAmount);
    setGameState('won');
    
    // Reveal all tiles
    const allRevealed = tiles.map(t => ({ ...t, revealed: true }));
    setTiles(allRevealed);
  };

  const resetGame = () => {
    initializeTiles();
    setGameState('idle');
    setRevealedCount(0);
    setCurrentMultiplier(1.00);
    setProfit(0);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn}>←</button>
        <div className={styles.balanceSection}>
          <span className={styles.flag}>🇮🇳</span>
          <span className={styles.balance}>₹{balance.toFixed(2)}</span>
          <span className={styles.dropdown}>▼</span>
        </div>
        <button className={styles.addBtn}>+</button>
      </header>

      <div className={styles.mainContent}>
        <div className={styles.gameSection}>
          <div className={styles.resultText}>
            {gameState === 'idle' && 'Game result will be displayed'}
            {gameState === 'playing' && `${revealedCount} gems found - ${currentMultiplier.toFixed(2)}x`}
            {gameState === 'won' && `You won ₹${(betAmount * currentMultiplier).toFixed(2)}!`}
            {gameState === 'lost' && 'Game Over - Hit a mine!'}
          </div>

          <div className={styles.grid}>
            {tiles.map((tile) => (
              <button
                key={tile.id}
                className={`${styles.tile} ${
                  tile.revealed && tile.isMine ? styles.tileMinе :
                  tile.revealed && tile.isGem ? styles.tileGem :
                  styles.tileHidden
                }`}
                onClick={() => revealTile(tile.id)}
                disabled={gameState !== 'playing' || tile.revealed}
              >
                {tile.revealed && (
                  <>
                    {tile.isMine && <span className={styles.mineIcon}>💣</span>}
                    {tile.isGem && <span className={styles.gemIcon}>💎</span>}
                  </>
                )}
              </button>
            ))}
          </div>

          <div className={styles.controls}>
            <div className={styles.amountSection}>
              <label className={styles.label}>
                Amount <span className={styles.infoIcon}>ⓘ</span>
              </label>
              <div className={styles.amountInput}>
                <span className={styles.currencyFlag}>🇮🇳</span>
                <input 
                  type="number" 
                  value={betAmount}
                  onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
                  className={styles.input}
                  placeholder="0"
                  disabled={gameState === 'playing'}
                />
                <div className={styles.multiplierBtns}>
                  <button 
                    onClick={() => setBetAmount(prev => Math.max(0, prev / 2))}
                    disabled={gameState === 'playing'}
                  >
                    1/2
                  </button>
                  <button 
                    onClick={() => setBetAmount(prev => prev * 2)}
                    disabled={gameState === 'playing'}
                  >
                    2×
                  </button>
                  <button className={styles.expandBtn}>
                    <span>▲</span>
                    <span>▼</span>
                  </button>
                </div>
              </div>
            </div>

            {gameState === 'idle' ? (
              <button 
                className={styles.betButton}
                onClick={startGame}
                disabled={betAmount === 0}
              >
                Bet
              </button>
            ) : gameState === 'playing' ? (
              <button 
                className={styles.cashOutButton}
                onClick={cashOut}
              >
                Cash Out ₹{(betAmount * currentMultiplier).toFixed(2)}
              </button>
            ) : (
              <button 
                className={styles.betButton}
                onClick={resetGame}
              >
                New Game
              </button>
            )}

            <div className={styles.demoNotice}>
              <span className={styles.noticeIcon}>ⓘ</span>
              Betting with 0 will enter demo mode.
            </div>

            {gameState === 'playing' && profit > 0 && (
              <div className={styles.profitDisplay}>
                Current Profit: <span className={styles.profitAmount}>₹{profit.toFixed(2)}</span>
              </div>
            )}
          </div>

          <div className={styles.minesSection}>
            <div className={styles.minesHeader}>
              <span>Mines</span>
              <div className={styles.minesIcons}>
                <span>⛏️</span>
                <span>⛏️</span>
              </div>
            </div>
            <div className={styles.slider}>
              <span className={styles.sliderValue}>{minesCount}</span>
              <input 
                type="range" 
                min="1" 
                max="24" 
                value={minesCount}
                onChange={(e) => setMinesCount(parseInt(e.target.value))}
                className={styles.rangeInput}
                disabled={gameState === 'playing'}
              />
              <span className={styles.sliderValue}>24</span>
            </div>
            <button className={styles.expandSlider}>▼</button>
          </div>

          <div className={styles.modeTabs}>
            <button 
              className={gameMode === 'manual' ? styles.modeTabActive : styles.modeTab}
              onClick={() => setGameMode('manual')}
            >
              Manual
            </button>
            <button 
              className={gameMode === 'auto' ? styles.modeTabActive : styles.modeTab}
              onClick={() => setGameMode('auto')}
            >
              Auto
            </button>
          </div>

          <div className={styles.gameIcons}>
            <button className={styles.iconBtn}>○</button>
            <button className={styles.iconBtn}>★</button>
            <button className={styles.iconBtn}>∿</button>
          </div>
        </div>
      </div>
    </div>
  );
}