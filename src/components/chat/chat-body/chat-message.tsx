"use client"
import { Chat, MessageContent } from '@/lib/types'
import { cn } from '@/lib/utils'
import { message } from '@prisma/client'
import React from 'react'
import { formatDistanceToNow } from "date-fns"

const ChatMessage = ({ msg, chat }: { msg: message, chat: Chat }) => {
  return (
    <div
      className={`max-w-[70%] w-fit ${
        msg.sender_id !== chat.user?.id && "ml-auto"
      }`}
    >
        <span className="text-[10px] timestamp text-muted-foreground mt-1">
  {formatDistanceToNow(new Date(msg.createdat), { addSuffix: true })}
    </span>
      <p
        className={cn(
          "rounded-xl w-fit px-4 py-3",
          msg.sender_id !== chat.user?.id
            ? "ml-auto rounded-br-none bg-blue-500 text-white"
            : "bg-muted-foreground/10 text-black rounded-bl-none"
        )}
      >
        {(msg.content as MessageContent)?.text}
      </p>

     
    </div>
  )
}

export default ChatMessage
