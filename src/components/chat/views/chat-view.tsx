"use client"
import { getChatById } from '@/data/chat/get-chat-by-id'
import { useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { Chat } from '@/lib/types'
import { ChatResponse } from '@/hooks/use-chats'
import ChatHeader from '../chat-body/chat-header'
import ChatBody from '../chat-body/chat-body'
import ChatInput from '../chat-body/chat-input'
import ChatMessageRequest from '../chat-body/chat-message-request'



const ChatView = ({ id }: { id: string }) => {
  const queryClient = useQueryClient()
  const [chat, setChat] = useState<Chat | null>(null)

  const { mutate, isPending, isError } = useMutation({
    mutationFn: getChatById,
    onSuccess: (data) => {
      setChat(data)
    }
  })

  useEffect(() => {
    // grab cached infinite query data safely
    const cached = queryClient.getQueryData<InfiniteData<ChatResponse>>(["chats"])
    if (cached) {
      const allChats = cached.pages.flatMap((p) => p.data)
      const found = allChats.find((c) => c.id === id)
      if (found) {
        setChat(found)
        return
      }
    }

    // fallback: fetch chat if not cached
    mutate(id)
  }, [id, queryClient, mutate])

  if (isPending ) return <div>Loading...</div>
  if (isError) return <div>Failed to load chat</div>
  if (!chat) return <div>No chat found</div>
  const showChatBody = chat.startedByMe ? true : chat.isAccepted
  return (
    <div className='flex flex-1 flex-col h-full '>
      <ChatHeader chat={chat}/>
      {showChatBody ?
      <>
      <ChatBody chat={chat}/>
      <ChatInput chat={chat}/>
      </>
      :
      <ChatMessageRequest chat={chat}/>
      }
    </div>
  )
}

export default ChatView
