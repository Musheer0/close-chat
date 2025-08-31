"use client"
import { getChatById } from '@/data/chat/get-chat-by-id'
import { useQuery, useQueryClient, InfiniteData } from '@tanstack/react-query'
import React, { useEffect, useRef, useState } from 'react'
import { Chat } from '@/lib/types'
import { ChatResponse } from '@/hooks/use-chats'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const CallView = ({ id }: { id: string }) => {
  const queryClient = useQueryClient()
  const [chat, setChat] = useState<Chat | null>(null)
  const [isFecthing, setISFecthing] = useState(false)
  const [picked, setPicked] = useState(false)
  const pickedRef = useRef(picked) // 👈 track latest picked
  const cacheKey = `chat:info:${id}`
  const router = useRouter()
  const { data, isLoading, isError } = useQuery({
    queryKey: [cacheKey],
    queryFn: () => getChatById(id),
    enabled: false,
  })

  // keep ref in sync with state
  useEffect(() => {
    pickedRef.current = picked
  }, [picked])

  useEffect(() => {
    const cached = queryClient.getQueryData<InfiniteData<ChatResponse>>(["chats"])
    if (cached) {
      const allChats = cached.pages.flatMap((p) => p.data)
      const found = allChats.find((c) => c.id === id)
      if (found) {
        setChat(found)
        return
      }
    }

    setISFecthing(true)
    queryClient.fetchQuery({
      queryKey: [cacheKey],
      queryFn: () => getChatById(id),
    }).then((c) => {
      setChat(c)
      setISFecthing(false) // 👈 move inside .then
    })

    
  }, [id, queryClient, cacheKey])

  if (isLoading) return <div>Loading...</div>
  if (!chat && isFecthing) return <div>Loading...</div>
  if (isError) return <div>Failed to load chat</div>
  if (!chat) return <div>No chat found</div>

  const showChatBody = chat.startedByMe ? true : chat.isAccepted
  return (
    <div className="flex flex-1 flex-col h-full ">
     {JSON.stringify(chat)}
    </div>
  )
}

export default CallView
