import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"

interface Message {
  id: string
  content: string
  senderId: string
  senderName: string
  senderAvatar?: string
  timestamp: string
  attachments?: string[]
}

interface ChatMessageProps {
  message: Message
  isOwnMessage: boolean
}

export function ChatMessage({ message, isOwnMessage }: ChatMessageProps) {
  const formattedTime = formatDistanceToNow(new Date(message.timestamp), {
    addSuffix: true,
  })

  return (
    <div className={`flex gap-3 ${isOwnMessage ? "flex-row-reverse" : ""}`}>
      <Avatar className="h-8 w-8 shrink-0">
        {message.senderAvatar ? (
          <AvatarImage src={message.senderAvatar} alt={message.senderName} />
        ) : (
          <AvatarFallback>{message.senderName.substring(0, 2).toUpperCase()}</AvatarFallback>
        )}
      </Avatar>

      <div className={`space-y-1 max-w-[80%] ${isOwnMessage ? "items-end" : ""}`}>
        <div className={`flex items-center gap-2 ${isOwnMessage ? "flex-row-reverse" : ""}`}>
          <span className="text-sm font-medium">{message.senderName}</span>
          <span className="text-xs text-gray-400">{formattedTime}</span>
        </div>

        <div
          className={`rounded-lg p-3 ${
            isOwnMessage ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-gray-100 rounded-tl-none"
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>

          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.attachments.map((attachment, index) => (
                <div key={index} className="rounded bg-white p-2 flex items-center gap-2">
                  <div className="bg-gray-200 rounded p-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  <span className="text-sm truncate">{attachment.split("/").pop()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
