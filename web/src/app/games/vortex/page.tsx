// components/VortexGame.tsx
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

const multipliers = [
  { value: 1.5, color: '#6366f1', probability: 20 },
  { value: 2.0, color: '#8b5cf6', probability: 15 },
  { value: 3.0, color: '#a855f7', probability: 12 },
  { value: 5.0, color: '#c026d3', probability: 10 },
  { value: 10.0, color: '#e11d48', probability: 8 },
  { value: 20.0, color: '#dc2626', probability: 6 },
  { value: 50.0, color: '#f97316', probability: 4 },
  { value: 100.0, color: '#f59e0b', probability: 2 },
];

export default function VortexGame() {
  const [balance, setBalance] = useState(100.50);
  const [betAmount, setBetAmount] = useState(10);
  const [selectedMultiplier, setSelectedMultiplier] = useState<number | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'spinning' | 'result'>('idle');
  const [rotation, setRotation] = useState(0);
  const [resultMultiplier, setResultMultiplier] = useState<number | null>(null);
  const [isWin, setIsWin] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  const [betHistory, setBetHistory] = useState<Bet[]>([
    { id: '1', user: 'Player1', amount: 50.00, multiplier: 5.0, profit: 200.00 },
    { id: '2', user: 'Player2', amount: 25.00, multiplier: 2.0, profit: 25.00 },
    { id: '3', user: 'Hidden', amount: 100.00, multiplier: 1.5, profit: 50.00 },
    { id: '4', user: 'Player3', amount: 15.00, multiplier: 10.0, profit: 135.00 },
  ]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(null);

  useEffect(() => {
    drawVortex();
  }, [rotation, gameState, resultMultiplier]);

  useEffect(() => {
    // Generate initial particles
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  const drawVortex = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = Math.min(centerX, centerY) - 20;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw spinning vortex rings
    const rings = 8;
    for (let i = 0; i < rings; i++) {
      const radius = maxRadius * ((rings - i) / rings);
      const segments = 12 + (i * 4);
      const segmentAngle = (Math.PI * 2) / segments;
      const rotationOffset = (rotation + (i * 15)) * Math.PI / 180;

      for (let j = 0; j < segments; j++) {
        const startAngle = (j * segmentAngle) + rotationOffset;
        const endAngle = startAngle + segmentAngle * 0.8;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.lineWidth = 10 - (i * 0.8);
        
        const hue = (rotation + (i * 30) + (j * 360 / segments)) % 360;
        ctx.strokeStyle = `hsla(${hue}, 70%, 60%, ${0.8 - (i * 0.08)})`;
        ctx.stroke();
      }
    }

    // Draw center circle
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 100);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.9)');
    gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.7)');
    gradient.addColorStop(1, 'rgba(168, 85, 247, 0.3)');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, 100, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw result or selected multiplier
    if (gameState === 'result' && resultMultiplier) {
      ctx.fillStyle = 'white';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${resultMultiplier}x`, centerX, centerY - 15);
      
      ctx.font = 'bold 20px Arial';
      ctx.fillStyle = isWin ? '#10b981' : '#ef4444';
      ctx.fillText(isWin ? 'WIN!' : 'LOST', centerX, centerY + 25);
    } else if (selectedMultiplier) {
      ctx.fillStyle = 'white';
      ctx.font = 'bold 42px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${selectedMultiplier}x`, centerX, centerY);
    } else {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('SELECT', centerX, centerY - 15);
      ctx.fillText('MULTIPLIER', centerX, centerY + 15);
    }

    // Draw pointer at top
    if (gameState === 'spinning' || gameState === 'result') {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(centerX, 20);
      ctx.lineTo(centerX - 15, 45);
      ctx.lineTo(centerX + 15, 45);
      ctx.closePath();
      ctx.fill();
    }
  };

  const spinVortex = () => {
    if (!selectedMultiplier || betAmount === 0 || gameState === 'spinning') return;

    setBalance(prev => prev - betAmount);
    setGameState('spinning');

    const spins = 5 + Math.random() * 3;
    const finalRotation = spins * 360;
    const duration = 4000;
    const startTime = Date.now();
    const startRotation = rotation;

    // Determine result based on probabilities
    const random = Math.random() * 100;
    let cumulativeProbability = 0;
    let result = multipliers[0];
    
    for (const mult of multipliers) {
      cumulativeProbability += mult.probability;
      if (random <= cumulativeProbability) {
        result = mult;
        break;
      }
    }

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setRotation(startRotation + finalRotation * easeOut);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setGameState('result');
        setResultMultiplier(result.value);
        
        const won = result.value >= selectedMultiplier;
        setIsWin(won);
        
        if (won) {
          const winAmount = betAmount * selectedMultiplier;
          setBalance(prev => prev + winAmount);
          
          // Add to history
          setBetHistory(prev => [{
            id: Date.now().toString(),
            user: 'You',
            amount: betAmount,
            multiplier: selectedMultiplier,
            profit: winAmount - betAmount,
          }, ...prev.slice(0, 9)]);
        }
        
        setTimeout(() => {
          setGameState('idle');
          setResultMultiplier(null);
        }, 3000);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
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
        {/* Animated particles background */}
        <div className={styles.particlesContainer}>
          {particles.map((particle) => (
            <div
              key={particle.id}
              className={styles.particle}
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                animationDelay: `${particle.delay}s`,
              }}
            />
          ))}
        </div>

        <div className={styles.gameSection}>
          <div className={styles.vortexContainer}>
            <canvas ref={canvasRef} className={styles.vortexCanvas}></canvas>
            
            {gameState === 'result' && (
              <div className={styles.resultOverlay}>
                <div className={`${styles.resultText} ${isWin ? styles.winText : styles.loseText}`}>
                  {isWin ? (
                    <>
                      <div className={styles.resultLabel}>YOU WON!</div>
                      <div className={styles.resultAmount}>₹{(betAmount * selectedMultiplier!).toFixed(2)}</div>
                    </>
                  ) : (
                    <>
                      <div className={styles.resultLabel}>TRY AGAIN</div>
                      <div className={styles.resultAmount}>Better luck next time</div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className={styles.multiplierGrid}>
            {multipliers.map((mult) => (
              <button
                key={mult.value}
                className={`${styles.multiplierBtn} ${
                  selectedMultiplier === mult.value ? styles.multiplierSelected : ''
                }`}
                style={{ 
                  background: selectedMultiplier === mult.value 
                    ? `linear-gradient(135deg, ${mult.color}, ${mult.color}dd)` 
                    : `linear-gradient(135deg, ${mult.color}88, ${mult.color}44)`,
                }}
                onClick={() => setSelectedMultiplier(mult.value)}
                disabled={gameState === 'spinning'}
              >
                <div className={styles.multiplierValue}>{mult.value}x</div>
                <div className={styles.multiplierChance}>{mult.probability}%</div>
              </button>
            ))}
          </div>

          <div className={styles.controls}>
            <div className={styles.amountSection}>
              <label className={styles.label}>Bet Amount</label>
              <div className={styles.amountInput}>
                <span className={styles.currencyFlag}>🇮🇳</span>
                <input 
                  type="number" 
                  value={betAmount}
                  onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
                  className={styles.input}
                  placeholder="0"
                  disabled={gameState === 'spinning'}
                />
                <div className={styles.quickBets}>
                  <button 
                    onClick={() => setBetAmount(prev => Math.max(1, prev / 2))}
                    disabled={gameState === 'spinning'}
                  >
                    1/2
                  </button>
                  <button 
                    onClick={() => setBetAmount(prev => prev * 2)}
                    disabled={gameState === 'spinning'}
                  >
                    2×
                  </button>
                  <button 
                    onClick={() => setBetAmount(100)}
                    disabled={gameState === 'spinning'}
                  >
                    100
                  </button>
                </div>
              </div>
            </div>

            <button 
              className={styles.spinButton}
              onClick={spinVortex}
              disabled={gameState === 'spinning' || !selectedMultiplier || betAmount === 0}
            >
              {gameState === 'spinning' ? 'SPINNING...' : 'SPIN'}
            </button>

            {selectedMultiplier && (
              <div className={styles.potentialWin}>
                Potential Win: <span className={styles.winAmount}>₹{(betAmount * selectedMultiplier).toFixed(2)}</span>
              </div>
            )}
          </div>

          <div className={styles.gameInfo}>
            <div className={styles.infoCard}>
              <div className={styles.infoLabel}>Selected</div>
              <div className={styles.infoValue}>{selectedMultiplier ? `${selectedMultiplier}x` : 'None'}</div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoLabel}>Bet Amount</div>
              <div className={styles.infoValue}>₹{betAmount.toFixed(2)}</div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoLabel}>Win Chance</div>
              <div className={styles.infoValue}>
                {selectedMultiplier 
                  ? `${multipliers.find(m => m.value === selectedMultiplier)?.probability}%` 
                  : '0%'}
              </div>
            </div>
          </div>

          <div className={styles.historySection}>
            <h3 className={styles.historyTitle}>Recent Bets</h3>
            <div className={styles.historyTable}>
              <div className={styles.tableHeader}>
                <div>Player</div>
                <div>Bet</div>
                <div>Multi</div>
                <div>Profit</div>
              </div>
              {betHistory.map((bet) => (
                <div key={bet.id} className={styles.betRow}>
                  <div className={styles.betUser}>{bet.user}</div>
                  <div className={styles.betAmount}>₹{bet.amount.toFixed(2)}</div>
                  <div className={styles.betMultiplier}>{bet.multiplier}x</div>
                  <div className={bet.profit > 0 ? styles.profitPositive : styles.profitNegative}>
                    {bet.profit > 0 ? '+' : ''}₹{bet.profit.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}