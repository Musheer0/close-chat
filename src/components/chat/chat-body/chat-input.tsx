/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client"
import { Button } from '@/components/ui/button'
import { sendMessage } from '@/data/messages/send-user-message'
import { updateChatCache } from '@/lib/cache/update-messages-cache'
import { Chat } from '@/lib/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SendIcon } from 'lucide-react'
import React, { useState } from 'react'
import TextareaAutosize from 'react-autosize-textarea'
import { toast } from 'sonner'

const ChatInput = ({ chat }: { chat: Chat }) => {
  const [content, setContent] = useState("")
  const queryClient=useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: sendMessage,
    onSuccess: (newMessage) => {
  if (!newMessage) return;
 updateChatCache(queryClient,chat.id,newMessage)
  setContent("")
},
    onError: () => {
      toast.error("error sending message try again")
    }
  })

  const handleSend = () => {
    if (!content.trim()) return
    mutate({
      chatId: chat.id,
      content
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex items-center gap-2 pr-2.5 border-t">
      <TextareaAutosize
       rows={2}
  maxRows={7}
  placeholder="Enter message"
  value={content}
  onChange={(e) => setContent(e.currentTarget.value)}
  onKeyDown={handleKeyDown}
  className="flex-1 border-t-0 border-l-0 p-1 px-3 outline-none resize-none"
  {...(undefined as any)}
      />
      <Button
        size="icon"
        className="rounded-full cursor-pointer"
        onClick={handleSend}
        disabled={isPending}
      >
        <SendIcon />
      </Button>
    </div>
  )
}

export default ChatInput
