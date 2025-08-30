"use client"
import { getChatById } from '@/data/chat/get-chat-by-id'
import { useQuery, useQueryClient, InfiniteData } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { Chat } from '@/lib/types'
import { ChatResponse } from '@/hooks/use-chats'

const CallView = ({ id }: { id: string }) => {
  const queryClient = useQueryClient()
  const [chat, setChat] = useState<Chat | null>(null)
  const [isFecthing,setISFecthing] = useState(false)
  const cacheKey = `chat:info:${id}`

  const { data, isLoading, isError } = useQuery({
    queryKey: [cacheKey],
    queryFn: () => getChatById(id),
    enabled: false, // don’t auto-run immediately
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

    // fallback: trigger query fetch if not cached
    setISFecthing(true)
    queryClient.fetchQuery({
      queryKey: [cacheKey],
      queryFn: () => getChatById(id),
    }).then(setChat)
    setISFecthing(false)
  }, [id, queryClient, cacheKey])

  if (isLoading) return <div>Loading...</div>
  if (!chat && !isFecthing) return <div>Loading...</div>
  if (isError) return <div>Failed to load chat</div>
  if (!chat) return <div>No chat found</div>

  const showChatBody = chat.startedByMe ? true : chat.isAccepted
  return (
    <div className='flex flex-1 flex-col h-full '>
      
     
    </div>
  )
}

export default CallView
