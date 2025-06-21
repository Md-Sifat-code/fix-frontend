import { NextResponse } from "next/server"
import Pusher from "pusher"

// Initialize Pusher
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
})

export async function POST(request: Request) {
  try {
    const { isOnline, userId, userName, userAvatar } = await request.json()

    // Validate required fields
    if (userId === undefined) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 })
    }

    const event = isOnline ? "user-online" : "user-offline"
    const data = isOnline
      ? {
          id: userId,
          name: userName || "Anonymous",
          avatar: userAvatar,
          lastSeen: new Date().toISOString(),
        }
      : { id: userId }

    // Broadcast presence via Pusher
    await pusher.trigger("chat", event, data)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unexpected error processing presence:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
