// components/CrashGame.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';

interface Bet {
  id: string;
  user: string;
  amount: number;
  multiplier: number;
  profit: number;
}

interface Player {
  user: string;
  bet: number;
}

export default function CrashGame() {
  const [multiplier, setMultiplier] = useState(1.00);
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'crashed'>('waiting');
  const [betAmount, setBetAmount] = useState(0.10);
  const [currentBet, setCurrentBet] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([1.42, 2.14, 1.16, 5.41, 2.30, 1.31, 4.99, 3.63, 1.85, 7.70, 3.20, 7.28, 3.90, 9.66, 13.17]);
  const [allBets, setAllBets] = useState<Bet[]>([
    { id: '1', user: 'p***2', amount: 25.00, multiplier: 1.63, profit: 40.75 },
    { id: '2', user: 'p***e', amount: 20.00, multiplier: 2.02, profit: 40.40 },
    { id: '3', user: 'u***y', amount: 20.00, multiplier: 1.84, profit: 36.80 },
    { id: '4', user: 'p***ng', amount: 20.00, multiplier: 3.71, profit: 74.20 },
    { id: '5', user: 'g***9', amount: 18.30, multiplier: 2.28, profit: 41.72 },
    { id: '6', user: 'j***2', amount: 17.00, multiplier: 2.23, profit: 37.91 },
    { id: '7', user: 'k***e', amount: 15.00, multiplier: 1.38, profit: 20.70 },
  ]);
  const [activePlayers, setActivePlayers] = useState<Player[]>([
    { user: 'p***7', bet: 1.00 },
    { user: 'j***j', bet: 1.00 },
    { user: 'u***a', bet: 1.00 },
    { user: 'g***n', bet: 1.00 },
  ]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(null);

  useEffect(() => {
    if (gameState === 'waiting') {
      const timer = setTimeout(() => {
        setGameState('playing');
        setMultiplier(1.00);
      }, 3000);
      return () => clearTimeout(timer);
    }

    if (gameState === 'playing') {
      const crashPoint = Math.random() * 8 + 1;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / 100;
        const newMultiplier = 1 + (progress * 0.1);
        
        if (newMultiplier >= crashPoint) {
          setMultiplier(crashPoint);
          setGameState('crashed');
          setHistory(prev => [crashPoint, ...prev.slice(0, 14)]);
          if (currentBet !== null) {
            setCurrentBet(null);
          }
          return;
        }
        
        setMultiplier(newMultiplier);
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }

    if (gameState === 'crashed') {
      const timer = setTimeout(() => {
        setGameState('waiting');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [gameState, currentBet]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState === 'playing' || gameState === 'crashed') {
      const points: [number, number][] = [];
      const maxX = canvas.width;
      const maxY = canvas.height;
      const progress = Math.min(multiplier - 1, 10) / 10;

      for (let i = 0; i <= 100; i++) {
        const x = (i / 100) * maxX * progress;
        const normalizedMult = (multiplier - 1) / 10;
        const curveProgress = (i / 100) * progress;
        const y = maxY - (Math.pow(curveProgress, 0.7) * normalizedMult * maxY);
        points.push([x, y]);
      }

      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
      }
      ctx.lineTo(maxX * progress, maxY);
      ctx.lineTo(0, maxY);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(0, 0, 0, maxY);
      if (gameState === 'crashed') {
        gradient.addColorStop(0, 'rgba(220, 38, 38, 0.8)');
        gradient.addColorStop(1, 'rgba(220, 38, 38, 0)');
      } else {
        gradient.addColorStop(0, 'rgba(239, 68, 68, 0.8)');
        gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
      }
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
      }
      ctx.strokeStyle = gameState === 'crashed' ? '#dc2626' : '#ef4444';
      ctx.lineWidth = 3;
      ctx.stroke();

      if (gameState === 'playing') {
        const lastPoint = points[points.length - 1];
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(lastPoint[0], lastPoint[1], 18, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [multiplier, gameState]);

  const handleBet = () => {
    if (gameState === 'waiting' && currentBet === null) {
      setCurrentBet(betAmount);
    }
  };

  const handleCashout = () => {
    if (gameState === 'playing' && currentBet !== null) {
      const profit = currentBet * multiplier;
      setAllBets(prev => [{
        id: Date.now().toString(),
        user: 'You',
        amount: currentBet,
        multiplier: parseFloat(multiplier.toFixed(2)),
        profit: parseFloat(profit.toFixed(2))
      }, ...prev.slice(0, 9)]);
      setCurrentBet(null);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>Aviator</div>
        <div className={styles.headerRight}>
          <span className={styles.balance}>99.76 €</span>
          <button className={styles.menuBtn}>☰</button>
        </div>
      </header>

      <div className={styles.mainContent}>
        <aside className={styles.leftSidebar}>
          <div className={styles.tabs}>
            <button className={styles.tabActive}>All Bets</button>
            <button className={styles.tab}>My Bets</button>
            <button className={styles.tab}>Top</button>
          </div>
          
          <div className={styles.totalBets}>TOTAL BETS: 129</div>
          
          <div className={styles.betsList}>
            {allBets.map((bet) => (
              <div key={bet.id} className={styles.betItem}>
                <div className={styles.betUser}>{bet.user}</div>
                <div className={styles.betAmount}>{bet.amount.toFixed(2)} €</div>
                <div className={styles.betMultiplier}>{bet.multiplier.toFixed(2)}x</div>
                <div className={styles.betProfit}>{bet.profit.toFixed(2)} €</div>
              </div>
            ))}
          </div>
        </aside>

        <main className={styles.gameArea}>
          <div className={styles.historyBar}>
            {history.map((mult, idx) => (
              <span 
                key={idx} 
                className={`${styles.historyItem} ${mult >= 2 ? styles.historyHigh : ''}`}
              >
                {mult.toFixed(2)}x
              </span>
            ))}
          </div>

          <div className={styles.gameCanvas}>
            <canvas ref={canvasRef} className={styles.canvas}></canvas>
            <div className={styles.multiplierDisplay}>
              <div className={styles.multiplierText}>
                {gameState === 'waiting' ? 'Starting...' : 
                 gameState === 'crashed' ? 'CRASHED!' : 
                 `${multiplier.toFixed(2)}x`}
              </div>
            </div>
            {gameState === 'crashed' && (
              <div className={styles.crashedOverlay}>
                <div className={styles.crashIcon}>✈️</div>
              </div>
            )}
          </div>

          <div className={styles.controls}>
            <div className={styles.betPanel}>
              <div className={styles.betInputs}>
                <div className={styles.inputGroup}>
                  <label>Bet</label>
                  <input 
                    type="number" 
                    value={betAmount}
                    onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
                    step="0.10"
                    min="0.10"
                    disabled={currentBet !== null}
                  />
                  <div className={styles.quickBets}>
                    <button onClick={() => setBetAmount(b => b / 2)}>½</button>
                    <button onClick={() => setBetAmount(b => b * 2)}>2×</button>
                    <button onClick={() => setBetAmount(10)}>10€</button>
                  </div>
                </div>
              </div>
              <button 
                className={styles.betButton}
                onClick={gameState === 'playing' && currentBet !== null ? handleCashout : handleBet}
                disabled={gameState === 'crashed'}
              >
                {gameState === 'playing' && currentBet !== null 
                  ? `CASHOUT ${(currentBet * multiplier).toFixed(2)} €`
                  : 'BET'}
              </button>
            </div>

            <div className={styles.betPanel}>
              <div className={styles.betInputs}>
                <div className={styles.inputGroup}>
                  <label>Bet</label>
                  <input type="number" value="0.10" readOnly />
                  <div className={styles.quickBets}>
                    <button>½</button>
                    <button>2×</button>
                    <button>10€</button>
                  </div>
                </div>
              </div>
              <button className={styles.betButton}>BET</button>
            </div>
          </div>
        </main>

        <aside className={styles.rightSidebar}>
          <div className={styles.liveStats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>🎯 Free bets for everyone!</span>
            </div>
            
            <div className={styles.activeBets}>
              {activePlayers.map((player, idx) => (
                <div key={idx} className={styles.activePlayer}>
                  <span className={styles.playerName}>{player.user}</span>
                  <span className={styles.playerBet}>{player.bet.toFixed(2)} €</span>
                </div>
              ))}
              <div className={styles.totalActive}>
                Total of 15.00 €
              </div>
            </div>

            <div className={styles.chat}>
              <div className={styles.chatHeader}>💬 Chat</div>
              <div className={styles.chatMessages}>
                <div className={styles.chatMessage}>
                  <img src="/api/placeholder/32/32" alt="" className={styles.avatar} />
                  <div>
                    <div className={styles.chatUser}>p***7 • 5s</div>
                    <div className={styles.chatText}>gg!</div>
                  </div>
                </div>
              </div>
              <input type="text" placeholder="New message &" className={styles.chatInput} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}