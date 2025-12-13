// components/WheelGame.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';

interface Bet {
  id: string;
  user: string;
  multiplier: string;
  profit: string;
  currency: string;
}

interface GameCard {
  id: string;
  title: string;
  bgColor: string;
  multiplier: string;
  players: number;
}

const wheelSegments = [
  { multiplier: 4.0, color: '#4a5568' },
  { multiplier: 2.5, color: '#2d3748' },
  { multiplier: 1.4, color: '#4a5568' },
  { multiplier: 8.0, color: '#2d3748' },
  { multiplier: 20.0, color: '#4a5568' },
  { multiplier: 21.0, color: '#2d3748', bonus: true },
  { multiplier: 45.0, color: '#4a5568' },
  { multiplier: 87.5, color: '#2d3748' },
  { multiplier: 175.0, color: '#4a5568' },
  { multiplier: 70.5, color: '#2d3748' },
  { multiplier: 28.5, color: '#4a5568' },
  { multiplier: 8.0, color: '#2d3748' },
  { multiplier: 5.0, color: '#4a5568' },
  { multiplier: 16.5, color: '#2d3748' },
  { multiplier: 53.0, color: '#4a5568' },
  { multiplier: 66.0, color: '#2d3748' },
  { multiplier: 7.5, color: '#4a5568', bonus: true },
  { multiplier: 28.5, color: '#2d3748' },
];

export default function WheelGame() {
  const [balance, setBalance] = useState(0.66);
  const [betAmount, setBetAmount] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [gameState, setGameState] = useState<'idle' | 'spinning' | 'result'>('idle');
  const [winAmount, setWinAmount] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [showCashOutPanel, setShowCashOutPanel] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [betHistory, setBetHistory] = useState<Bet[]>([
    { id: '1', user: 'Hidden', multiplier: '2.5x', profit: '+0.529902 BCD', currency: 'BCD' },
    { id: '2', user: 'RAKeshM', multiplier: '2.5x', profit: '+₹3.00', currency: 'INR' },
    { id: '3', user: 'Hidden', multiplier: '0x', profit: '-₹1.00', currency: 'INR' },
    { id: '4', user: 'Hidden', multiplier: '13x', profit: '+₹24.00', currency: 'INR' },
    { id: '5', user: 'Zxvyrellctcc', multiplier: '0x', profit: '-1.51552 ALGO', currency: 'ALGO' },
  ]);

  const games: GameCard[] = [
    { id: '1', title: 'CRASH', bgColor: 'linear-gradient(135deg, #a855f7, #ec4899)', multiplier: '999x', players: 1581 },
    { id: '2', title: 'PLINKO', bgColor: 'linear-gradient(135deg, #10b981, #059669)', multiplier: '420x', players: 130 },
    { id: '3', title: 'WHEEL', bgColor: 'linear-gradient(135deg, #3b82f6, #2563eb)', multiplier: '49.50x', players: 56 },
  ];

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    drawWheel();
  }, [rotation]);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw segments
    const segmentAngle = (Math.PI * 2) / wheelSegments.length;
    
    wheelSegments.forEach((segment, index) => {
      const startAngle = (index * segmentAngle) + (rotation * Math.PI / 180);
      const endAngle = startAngle + segmentAngle;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = segment.color;
      ctx.fill();
      ctx.strokeStyle = '#1a1a2e';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + segmentAngle / 2);
      ctx.textAlign = 'center';
      ctx.fillStyle = 'white';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(`${segment.multiplier}x`, radius * 0.7, 5);
      if (segment.bonus) {
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 10px Arial';
        ctx.fillText('BONUS', radius * 0.7, 18);
      }
      ctx.restore();
    });

    // Draw center circle with diamond
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 80);
    gradient.addColorStop(0, '#374151');
    gradient.addColorStop(1, '#1f2937');
    ctx.beginPath();
    ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw diamond icon
    ctx.fillStyle = '#a78bfa';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 30);
    ctx.lineTo(centerX + 20, centerY);
    ctx.lineTo(centerX, centerY + 30);
    ctx.lineTo(centerX - 20, centerY);
    ctx.closePath();
    ctx.fill();

    // Draw pointer at top
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(centerX, 10);
    ctx.lineTo(centerX - 10, 30);
    ctx.lineTo(centerX + 10, 30);
    ctx.closePath();
    ctx.fill();
  };

  const spinWheel = () => {
    if (betAmount === 0 || isSpinning) return;

    setIsSpinning(true);
    setGameState('spinning');

    const spins = 5 + Math.random() * 3;
    const finalRotation = spins * 360 + Math.random() * 360;
    const duration = 4000;
    const startTime = Date.now();
    const startRotation = rotation;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setRotation(startRotation + finalRotation * easeOut);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        setGameState('result');
        
        const segmentIndex = Math.floor(((finalRotation % 360) / 360) * wheelSegments.length);
        const winMultiplier = wheelSegments[segmentIndex].multiplier;
        const win = betAmount * winMultiplier;
        setWinAmount(win);
        setBalance(prev => prev + win);
        
        setTimeout(() => {
          setGameState('idle');
          setShowCashOutPanel(true);
        }, 2000);
      }
    };

    requestAnimationFrame(animate);
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
          <div className={styles.gameResult}>
            <div className={styles.resultText}>Game result will be displayed</div>
            <canvas 
              ref={canvasRef} 
              width={400} 
              height={400} 
              className={styles.wheelCanvas}
            />
            <div className={styles.profitDisplay}>
              Total profit ₹{winAmount.toFixed(2)} ({winAmount > 0 ? `${winAmount.toFixed(0)}x` : '0x'})
            </div>
          </div>

          <div className={styles.bettingPanel}>
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
                />
                <div className={styles.multiplierBtns}>
                  <button onClick={() => setBetAmount(prev => prev / 2)}>1/2</button>
                  <button onClick={() => setBetAmount(prev => prev * 2)}>2×</button>
                  <button className={styles.expandBtn}>
                    <span>▲</span>
                    <span>▼</span>
                  </button>
                </div>
              </div>
            </div>

            <button 
              className={styles.betButton}
              onClick={spinWheel}
              disabled={isSpinning || betAmount === 0}
            >
              {isSpinning ? 'Spinning...' : 'Bet'}
            </button>

            <div className={styles.demoNotice}>
              <span className={styles.noticeIcon}>ⓘ</span>
              Betting with 0 will enter demo mode.
            </div>
          </div>

          {showCashOutPanel && (
            <div className={styles.cashOutSection}>
              <button className={styles.cashOutLatest}>Cash Out Latest</button>
              <button className={styles.cashOutAll}>Cash Out All</button>
              <div className={styles.winAmountDisplay}>
                <div className={styles.winLabel}>Win Amount</div>
                <div className={styles.winValue}>
                  <span className={styles.flag}>🇮🇳</span> {winAmount.toFixed(2)}
                </div>
              </div>
            </div>
          )}

          <div className={styles.gameIcons}>
            <button className={styles.iconBtn}>○</button>
            <button className={styles.iconBtn}>★</button>
            <button className={styles.iconBtn}>∿</button>
            <button className={styles.iconBtn}>⚡</button>
          </div>

          <div className={styles.twistSection}>
            <div className={styles.twistInfo}>
              <div className={styles.twistTitle}>Twist</div>
              <div className={styles.twistBy}>By <span className={styles.bcOriginals}>BC Originals</span></div>
            </div>
            <div className={styles.twistIcon}>🎰</div>
            <button className={styles.twistDropdown}>▼</button>
            <button className={styles.playTwist}>▶</button>
          </div>
        </div>

        <div className={styles.recommendedSection}>
          <div className={styles.sectionHeader}>
            <h3>Recommended Games</h3>
            <div className={styles.navButtons}>
              <button className={styles.allBtn}>All</button>
              <button className={styles.navBtn}>←</button>
              <button className={styles.navBtn}>→</button>
            </div>
          </div>

          <div className={styles.gameCards}>
            {games.map((game) => (
              <div key={game.id} className={styles.gameCard} style={{ background: game.bgColor }}>
                <div className={styles.gameMultiplier}>{game.multiplier}</div>
                <div className={styles.gameTitle}>{game.title}</div>
                <div className={styles.gamePlayers}>
                  ORIGINAL GAME 👥 {game.players}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.betsSection}>
          <div className={styles.sectionHeader}>
            <h3>Latest bet & Race</h3>
            <select className={styles.limitSelect}>
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
          </div>

          <div className={styles.betsTabs}>
            <button 
              className={activeTab === 'all' ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab('all')}
            >
              All bets
            </button>
            <button 
              className={activeTab === 'my' ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab('my')}
            >
              My bets
            </button>
            <button 
              className={activeTab === 'high' ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab('high')}
            >
              High Roller
            </button>
            <button 
              className={activeTab === 'wager' ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab('wager')}
            >
              Wager Contest
            </button>
          </div>

          <div className={styles.betsTable}>
            <div className={styles.tableHeader}>
              <div>Bet ID</div>
              <div>User</div>
              <div>Multiplier</div>
              <div>Profit</div>
            </div>
            {betHistory.map((bet) => (
              <div key={bet.id} className={styles.betRow}>
                <div className={styles.betId}>1851...{bet.id.padStart(4, '0')}</div>
                <div className={styles.betUser}>{bet.user}</div>
                <div className={styles.betMultiplier}>{bet.multiplier}</div>
                <div className={bet.profit.startsWith('+') ? styles.profitPositive : styles.profitNegative}>
                  {bet.profit}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}