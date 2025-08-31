"use client"
import React from 'react'
import { Loader2Icon, PhoneIcon} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Chat } from '@/lib/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sendCall } from '@/data/messages/send-call'
import { useRouter } from 'next/navigation'
import { updateChatCache } from '@/lib/cache/update-messages-cache'
import { toast } from 'sonner'
import {useSocket} from '@/components/providers/global/socket-provider'
import { useUser } from '@clerk/nextjs'
const SendCallButton = ({chat}:{chat:Chat}) => {
  const router =useRouter()
  const queryCliet =useQueryClient()
  const socket =useSocket()
  const {user}=useUser()
  const {mutate,isPending} =useMutation({
    mutationFn:sendCall,
    onSuccess:(data)=>{
      if(data){
        updateChatCache(queryCliet,chat.id,data)
        if(user){
           socket.emit("send:chat:message",data)
          socket.emit('initialize:call',{id:chat.user?.id,info:{call_id:'test',user:{username:user.username,id:user.id}}})
        }
      }
    },
    onError(){
      toast.error("error calling user try again")
    }
  })
if(user)
  return (
    <Button
    disabled={isPending}

    onClick={()=>mutate({chatId:chat.id})}
    size={'icon'} variant={'outline'}>
    {isPending ?
  <Loader2Icon/>
  :
              <PhoneIcon/>  
  }
            </Button>
  )
}

export default SendCallButton