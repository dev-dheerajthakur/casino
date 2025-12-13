import { Injectable } from "@nestjs/common";
import { randomBytes, createHash, createHmac } from "crypto";
import { CrashGateway } from "./crash.gateway";

export interface Bet {
  id: string;
  socketId: string;
  amount: number;
  autoCashout?: number | null;
  cashedOut?: boolean;
  cashedAt?: number | null;
}

export interface Round {
  id: string;
  serverSeed: string;
  serverHash: string;
  crashPoint: number;
  startedAt: number;
  bets: Bet[];
}

@Injectable()
export class CrashService {
  private gateway: CrashGateway;
  private round: Round | null = null;
  private roundInterval: NodeJS.Timeout | null = null;

  constructor() {}

  setGateway(gw: CrashGateway) {
    this.gateway = gw;
  }

  // Create serverSeed and serverHash
  createSeedAndHash() {
    const serverSeed = randomBytes(32).toString("hex"); // 256-bit
    const serverHash = createHash("sha256").update(serverSeed).digest("hex");
    return { serverSeed, serverHash };
  }

  // Provably fair crash calculation
  computeCrashFromSeed(serverSeed: string, roundId: string) {
    // HMAC_SHA256(serverSeed, roundId) -> hex
    const hmac = createHmac("sha256", serverSeed).update(roundId).digest("hex");
    // use first 13 hex characters -> 52 bits
    const slice = hmac.slice(0, 13);
    const num = parseInt(slice, 16); // up to 2^52
    const max = Math.pow(2, 52);
    const r = num / max; // 0..1
    // map to crash multiplier, using a heavy-tail transform
    const crash = Math.max(1, Math.floor((1 / (1 - r)) * 100) / 100);
    // clamp absurd values
    return Math.min(crash, 1000);
  }

  startRoundCycle() {
    // Start cycles forever
    this.scheduleNextRound();
  }

  private scheduleNextRound() {
    // betting window (seconds)
    const betSeconds = 7;
    setTimeout(() => this.startRound(betSeconds), 1000);
  }

  private startRound(betSeconds: number) {
    const roundId = Date.now().toString();
    const { serverSeed, serverHash } = this.createSeedAndHash();
    const crashPoint = this.computeCrashFromSeed(serverSeed, roundId);

    this.round = {
      id: roundId,
      serverSeed,
      serverHash,
      crashPoint,
      startedAt: Date.now(),
      bets: [],
    };

    // publish round hash to clients (they can verify after reveal)
    this.gateway.broadcast("round_hash", {
      roundId,
      serverHash,
      bettingSeconds: betSeconds,
    });

    // Allow betting for betSeconds, then run
    setTimeout(() => this.runRound(), betSeconds * 1000);
  }

  // Accept a bet (returns bet or null)
  placeBet(socketId: string, amount: number, autoCashout?: number | null) {
    if (!this.round) return null;
    const bet: Bet = {
      id: Date.now().toString() + "-" + Math.random().toString(36).slice(2, 8),
      socketId,
      amount,
      autoCashout: autoCashout ?? null,
      cashedOut: false,
      cashedAt: null,
    };
    this.round.bets.push(bet);
    return bet;
  }

  private runRound() {
    if (!this.round) return;

    const round = this.round;
    const tickIntervalMs = 60; // tick frequency
    let t = 0;
    let running = true;

    // Broadcast round_start
    this.gateway.broadcast("round_start", { roundId: round.id });

    // We'll increment multiplier by an exponential curve similar to Aviator.
    // Instead of calculating per-frame deterministically, we compute multiplier(t) = exp(k * t)
    const k = 0.9; // speed factor; adjust for desirable pace

    this.roundInterval = setInterval(() => {
      t += tickIntervalMs / 1000;
      const mult = Math.max(1, Math.floor(Math.exp(k * t) * 100) / 100);

      // Emit tick to clients
      this.gateway.broadcast("tick", { roundId: round.id, multiplier: mult });

      // Auto cashouts: evaluate each bet
      for (const bet of round.bets) {
        if (!bet.cashedOut && bet.autoCashout && mult >= bet.autoCashout) {
          bet.cashedOut = true;
          bet.cashedAt = bet.autoCashout;
          // notify client
          this.gateway.sendToSocket(bet.socketId, "bet_cashed", {
            betId: bet.id,
            amount: bet.amount,
            cashedAt: bet.cashedAt,
            win: +(bet.amount * bet.cashedAt).toFixed(2),
          });
        }
      }

      // Crash condition
      if (mult >= round.crashPoint) {
        running = false;
        // clear interval
        if (this.roundInterval) {
          clearInterval(this.roundInterval);
          this.roundInterval = null;
        }

        // finalize bets: lose those not cashed
        for (const bet of round.bets) {
          if (!bet.cashedOut) {
            // lose: nothing to do here for demo
            this.gateway.sendToSocket(bet.socketId, "bet_lost", {
              betId: bet.id,
              amount: bet.amount,
            });
          }
        }

        // broadcast crash and reveal serverSeed
        this.gateway.broadcast("crash", {
          roundId: round.id,
          crashPoint: round.crashPoint,
          serverSeed: round.serverSeed, // reveal for provably fair
        });

        // settle finished round, push history, etc
        this.round = null;

        // schedule next round after small delay
        setTimeout(() => this.startRound(7), 3000);
      }
    }, tickIntervalMs);
  }
}
