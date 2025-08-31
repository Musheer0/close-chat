"use client"
import { endCall } from '@/data/messages/end-call'
import { callToastData, Chat } from '@/lib/types'
import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { Button } from '../ui/button'
import { useSocket } from '../providers/global/socket-provider'
import { useRouter } from 'next/navigation'

const CallToast = ({chat,data}:{chat:Chat,data:callToastData}) => {
    const socket =useSocket()
    const router =useRouter()
    const {mutate:endCallMutate,isPending:isRejecting} =useMutation({
        mutationFn:endCall
    })
  return (
  <div>
        <p>{data.user.username} is calling you </p>
        <Button
        disabled={isRejecting} 
        onClick={()=>{
        socket.emit('join:call',data.call_id)
        router.push('/chats/'+chat.id+'/'+data.call_id)
        }}
        className="bg-green-600 text-zinc-50 ">Accept</Button>
        <Button
        disabled={isRejecting}
        onClick={()=>endCallMutate({chatId:chat.id,id:data.call_id})}
        variant={'destructive'}>Reject</Button>
      </div>
  )
}

export default CallToast