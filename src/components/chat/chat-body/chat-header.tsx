/* eslint-disable  @typescript-eslint/no-non-null-asserted-optional-chain */
"use client"
import SendCallButton from '@/components/call/send-call-button'
import { useSocket } from '@/components/providers/global/socket-provider'
import UserAvatar from '@/components/user/avatar/user-avatar'
import { Chat } from '@/lib/types'
import { usersStatusStore } from '@/stores/users-status-store'

import React, { useEffect } from 'react'

const ChatHeader = ({chat}:{chat:Chat}) => {
  const socket =useSocket()
  const {getStatus} =usersStatusStore()
  useEffect(()=>{
    socket.emit("join:chat",chat.id)
  },[])
  return (
    <div className='w-full flex items-center justify-between gap-2 flex-wrap py-2 pb-3 px-2 border-b'>
        {chat.user &&
        <UserAvatar user={chat.user} enablesocket/>
        }
        <div className="info mr-auto">
            <p className='mr-auto '>{chat.user?.username}</p>
            <p className='text-xs text-muted-foreground leading-none'>
                                {getStatus(chat.user?.id!)? 'online':'offline'}

            </p>
        </div>
        <div className="actions flex items-center gap-3">
          <SendCallButton chat={chat}/> 
        </div>
    </div>
  )
}

export default ChatHeader