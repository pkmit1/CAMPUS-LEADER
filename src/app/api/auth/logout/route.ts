import { NextResponse, } from "next/server";
import { CampusLeaderWebSocketServer } from "../../server";
const abc=new CampusLeaderWebSocketServer(3004)

export async function POST(req: Request) {
  
  const { userId } = await req.json();
  console.log("🚀 ~ POST ~ userId:", userId)
  abc.handleOfflineStatus(userId);
  // Notify WebSocket server about offline status
  // Clear cookies or tokens (if you store JWT in cookies)
  const response = NextResponse.json({ message: "Logged out successfully" });
  // abc.handleOfflineStatus(req.json());
  response.cookies.set("token", "", {
    path: "/signin",
    httpOnly: true,
    expires: new Date(0), 
  });

  return response;
}