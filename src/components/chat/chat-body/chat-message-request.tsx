"use client"
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { acceptChat } from '@/data/chat/accept-chat-req'
import { rejectChat } from '@/data/chat/reject-chat-req'
import { ChatResponse } from '@/hooks/use-chats'
import { Chat } from '@/lib/types'
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

const ChatMessageRequest = ({chat}:{chat:Chat}) => {
    const queryClient = useQueryClient()
    const router = useRouter()
  const {mutate:acceptChatMutation,isPending:isAcceptMutationPending} =useMutation({
    mutationFn:acceptChat,
    onSuccess:(data)=>{
          const cached = queryClient.getQueryData<InfiniteData<ChatResponse>>(["chats"])
          if(data.user){
             cached?.pages.filter((e)=>e.data.filter((e)=>e.id!==data.id))
            queryClient.setQueryData<InfiniteData<ChatResponse>>(["chats"],()=>{
              return cached
            })
            cached?.pages[0].data.push(data)
            console.log(cached)
            queryClient.setQueryData<InfiniteData<ChatResponse>>(["chats"],()=>{
              return cached
            })
          }
    },
    onError(){
      toast.error("error accepting chat")
    }
  })
  const {mutate:rejectChatMutation,isPending:isRejectMutationPending} = useMutation({
  mutationFn:rejectChat,
  onSuccess:(data)=>{
      const cached = queryClient.getQueryData<InfiniteData<ChatResponse>>(["chats"])
          if(data){
            cached?.pages.filter((e)=>e.data.filter((e)=>e.id!==data))
            queryClient.setQueryData<InfiniteData<ChatResponse>>(["chats"],()=>{
              return cached
            })
            router.push('/chats')
          }
  },
  onError(){
    toast.error("error rejecting chat")
  }
  })
if(chat?.user)
  return (
    <div className='flex flex-col flex-1 p-6 justify-center items-center '>
        <Alert>
        <AlertTitle>
            {chat.user.username} wants to send you message
        </AlertTitle>
        <AlertDescription>
            If your don&apos;t recogninse this person you may just click on reject 
        </AlertDescription>
        <div className="actions py-3 flex items-center gap-4">
            <Button
            onClick={()=>rejectChatMutation(chat.id)}
            disabled={isAcceptMutationPending||isRejectMutationPending}
            variant={'destructive'}>Reject</Button>
            <Button
            onClick={()=>acceptChatMutation(chat.id)}
            disabled={isAcceptMutationPending||isRejectMutationPending}
            variant={'outline'}>Accept</Button>
        </div>
    </Alert>
    </div>
  )
}

export default ChatMessageRequest