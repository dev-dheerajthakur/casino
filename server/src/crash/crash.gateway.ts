import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Injectable } from "@nestjs/common";
import { CrashService } from "./crash.service";

@WebSocketGateway({
  cors: { origin: "*" },
  namespace: "/crash",
})
export class CrashGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  server: Server;

  constructor(private readonly crashService: CrashService) {
    this.crashService.setGateway(this);
    // start the round loop automatically once gateway is ready
    setTimeout(() => {
      this.crashService.startRoundCycle();
    }, 200);
  }

  afterInit(server: Server) {
    this.server = server;
    console.log("CrashGateway initialized");
  }

  handleConnection(client: Socket) {
    console.log("Client connected", client.id);
    // you may authenticate client here
  }

  handleDisconnect(client: Socket) {
    console.log("Client disconnected", client.id);
  }

  // helper: broadcast
  broadcast(event: string, payload: any) {
    if (this.server) this.server.emit(event, payload);
  }

  sendToSocket(socketId: string, event: string, payload: any) {
    const client = this.server.sockets.sockets.get(socketId);
    if (client) client.emit(event, payload);
  }

  // client places bet (via socket)
  @SubscribeMessage("place_bet")
  handlePlaceBet(
    @MessageBody() data: { amount: number; autoCashout?: number | null },
    @ConnectedSocket() client: Socket
  ) {
    // you'd check balance & auth here
    const bet = this.crashService.placeBet(client.id, data.amount, data.autoCashout);
    if (!bet) {
      client.emit("bet_error", { message: "No active betting round" });
      return;
    }
    client.emit("bet_placed", { bet });
    // notify everyone about fresh bet (optional)
    this.server.emit("player_bet", {
      playerId: client.id,
      amount: data.amount,
      betId: bet.id,
    });
  }

  @SubscribeMessage("cash_out")
  handleCashOut(
    @MessageBody() data: { betId: string },
    @ConnectedSocket() client: Socket
  ) {
    // find bet and mark as cashed
    const r = this.crashService;
    const round = (r as any).round as any;
    if (!round) {
      client.emit("cash_error", { message: "No running round" });
      return;
    }
    const bet = round.bets.find((b: any) => b.id === data.betId && b.socketId === client.id);
    if (!bet) {
      client.emit("cash_error", { message: "Bet not found" });
      return;
    }
    if (bet.cashedOut) {
      client.emit("cash_error", { message: "Already cashed" });
      return;
    }
    const currentMult = (Math.floor(Math.exp(0.9 * ((Date.now() - round.startedAt) / 1000)) * 100) / 100) || 1;
    // For demo, compute payout at current multiplier (server authoritative)
    bet.cashedOut = true;
    bet.cashedAt = currentMult;
    client.emit("bet_cashed", {
      betId: bet.id,
      amount: bet.amount,
      cashedAt: bet.cashedAt,
      win: +(bet.amount * bet.cashedAt).toFixed(2),
    });
  }
}
