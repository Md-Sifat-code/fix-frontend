import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-client"

export async function GET() {
  try {
    const supabase = createClient()

    // Get messages from Supabase
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(100)

    if (error) {
      console.error("Error fetching messages:", error)
      return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
    }

    // Transform data to match the expected Message interface
    const messages = data.map((msg) => ({
      id: msg.id,
      content: msg.content,
      senderId: msg.user_id,
      senderName: msg.user_name,
      senderAvatar: msg.user_avatar,
      timestamp: msg.created_at,
      attachments: msg.attachments,
    }))

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Unexpected error fetching messages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
