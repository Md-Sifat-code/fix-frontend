import { NextResponse } from "next/server"
import Pusher from "pusher"
import { createClient } from "@/lib/supabase-client"
import { nanoid } from "nanoid"

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
    const { content, senderId, senderName, senderAvatar, attachments } = await request.json()

    // Validate required fields
    if (!content || !senderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const messageId = nanoid()
    const timestamp = new Date().toISOString()

    // Store message in Supabase
   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
   const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
   
   const supabase = createClient(supabaseUrl, supabaseKey)
    const { error: dbError } = await supabase.from("chat_messages").insert({
      id: messageId,
      content,
      user_id: senderId,
      user_name: senderName,
      user_avatar: senderAvatar,
      created_at: timestamp,
      attachments,
    })

    if (dbError) {
      console.error("Error saving message to Supabase:", dbError)
      return NextResponse.json({ error: "Failed to save message" }, { status: 500 })
    }

    // Format the message for Pusher
    const message = {
      id: messageId,
      content,
      senderId,
      senderName,
      senderAvatar,
      timestamp,
      attachments,
    }

    // Broadcast the message via Pusher
    await pusher.trigger("chat", "new-message", message)

    return NextResponse.json({ success: true, messageId })
  } catch (error) {
    console.error("Unexpected error sending message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
