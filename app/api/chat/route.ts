import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const message = formData.get("message")
    const userId = formData.get("userId")
    const channelId = formData.get("channelId")
    const file = formData.get("file")

    console.log("Received message:", message)
    console.log("From user:", userId)
    console.log("To channel:", channelId)
    console.log("File attached:", file ? "Yes" : "No")

    // Here you would typically save the message to a database
    // and perform any other necessary operations

    // For now, we'll just echo back the received data
    return NextResponse.json({
      id: Date.now().toString(),
      message,
      userId,
      channelId,
      fileReceived: !!file,
    })
  } catch (error) {
    console.error("Error in /api/chat:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
