import { prisma } from "@/lib/prisma";
import { WebSocketServer, WebSocket } from "ws";

// Types
interface WebSocketMessage {
  type: "online" | "offline" | "ping" | "statusUpdate" | "error";
  userId?: string;
  isOnline?: boolean;
  message?: any;
}

interface ClientInfo {
  userId: string;
  lastPing: number;
}

export class CampusLeaderWebSocketServer {
  public wss: WebSocketServer;
  public clients: Map<WebSocket, ClientInfo>;
  public heartbeatInterval: NodeJS.Timeout;

  constructor(port: number) {
    this.wss = new WebSocketServer({ port });
    this.clients = new Map<WebSocket, ClientInfo>();

    this.wss.on("connection", this.handleConnection.bind(this));
    this.heartbeatInterval = setInterval(this.checkHeartbeats.bind(this), 10000);

    process.on("SIGINT", this.gracefulShutdown.bind(this));
    process.on("uncaughtException", this.handleUncaughtException.bind(this));
    process.on("unhandledRejection", this.handleUnhandledRejection.bind(this));

    console.log(`✅ WebSocket server running on ws://localhost:${port}`);
  }

  public handleConnection(ws: WebSocket) {
    console.log("🔗 Client connected");

    ws.on("message", async (data: Buffer) => {
      try {
        const msg: WebSocketMessage = JSON.parse(data.toString());
        switch (msg.type) {
          case "online":
            if (msg.userId) {
              await this.handleOnlineStatus(ws, msg.userId);
            }
            break;
          case "offline":
            if (msg.userId) {
              await this.handleOfflineStatus(msg.userId);
            }
            break;
          case "ping":
            this.handlePing(ws);
            break;
          default:
            console.warn("⚠️ Unknown message type:", msg.type);
        }
      } catch (err) {
        console.error(" Invalid WS message", err);
        this.sendError(ws, "Invalid message format");
      }
    });

    ws.on("close", async () => {
      await this.handleDisconnection(ws);
      await prisma.user.updateMany({ where: { isOnline: true }, data: { isOnline: false } });
      console.log("   Client disconnected");
    });

    ws.on("error", (error) => {
      console.error("❌ WebSocket error:", error);
    });
  }

  public async handleOnlineStatus(ws: WebSocket, userId: string): Promise<void> {
    this.clients.set(ws, { userId, lastPing: Date.now() });
    // Update DB: set user online
    try {
      await prisma.user.update({
        where: { id: Number(userId) },
        data: { isOnline: true },
      });
    } catch (e) {
      console.error(`❌ Failed to update user ${userId} online status in DB`, e);
    }
    this.broadcast({
      type: "statusUpdate",
      userId: userId,
      isOnline: true,
    });
    console.log(`👤 User ${userId} is now online`);
  }

  public async handleOfflineStatus(userId: string): Promise<void> {
    // Find the WebSocket for this user and remove it
    for (const [ws, client] of this.clients.entries()) {
      if (client.userId === userId) {
        this.clients.delete(ws);
        break;
      }
    }
    // Update DB: set user offline
    try {
      await prisma.user.update({
        where: { id: Number(userId) },
        data: { isOnline: false },
      });
    } catch (e) {
      console.error(`❌ Failed to update user ${userId} offline status in DB`, e);
    }
    this.broadcast({
      type: "statusUpdate",
      userId: userId,
      isOnline: false,
    });
    console.log(`👤 User ${userId} is now offline`);
  }

  public handlePing(ws: WebSocket): void {
    const client = this.clients.get(ws);
    if (client) {
      client.lastPing = Date.now();
    }
  }

  public async handleDisconnection(ws: WebSocket): Promise<void> {
    const client = this.clients.get(ws);
    if (client) {
      // Update DB: set user offline
      try {
        await prisma.user.update({
          where: { id: Number(client.userId) },
          data: { isOnline: false },
        });
      } catch (e) {
        console.error(`❌ Failed to update user ${client.userId} offline status in DB`, e);
      }
      this.broadcast({
        type: "statusUpdate",
        userId: client.userId,
        isOnline: false,
      });
      console.log(`👤 User ${client.userId} disconnected`);
      this.clients.delete(ws);
    }
  }

  public checkHeartbeats() {
    const now = Date.now();
    const timeout = 10000; // 10 seconds

    for (const [ws, client] of this.clients.entries()) {
      if (now - client.lastPing > timeout) {
        console.log(`⚠️ User ${client.userId} timed out`);
        this.broadcast({
          type: "statusUpdate",
          userId: client.userId,
          isOnline: false,
        });
        this.clients.delete(ws);
        if (ws.readyState === WebSocket.OPEN) {
          ws.close(1000, "Connection timeout");
        }
        // Update DB: set user offline
        prisma.user.update({
          where: { id: Number(client.userId) },
          data: { isOnline: false },
        }).catch(e => {
          console.error(`❌ Failed to update user ${client.userId} offline status in DB`, e);
        });
      }
    }
  }

  public broadcast(data: WebSocketMessage): void {
    const msg = JSON.stringify(data);
    console.log("📤 Broadcasted message:", msg);
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(msg);
          console.log("📤 Broadcasted message:", msg);
        } catch (error) {
          console.error("❌ Failed to broadcast message to client:", error);
        }
      }
    });
  }

  public sendError(ws: WebSocket, message: string): void {
    if (ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(
          JSON.stringify({
            type: "error",
            message: message,
          })
        );
      } catch (error) {
        console.error("❌ Failed to send error message:", error);
      }
    }
  }

  public gracefulShutdown() {
    console.log("🛑 Shutting down WebSocket server...");
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.close(1000, "Server shutdown");
      }
    });
    clearInterval(this.heartbeatInterval);
    this.wss.close();
    process.exit(0);
  }

  public handleUncaughtException(error: Error) {
    console.error("❌ Uncaught Exception:", error);
  }

  public handleUnhandledRejection(reason: any, promise: Promise<any>) {
    console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  }
}