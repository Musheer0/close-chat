"use client"
import UserAvatar from '@/components/user/avatar/user-avatar'
import Link from 'next/link'
import React, { useEffect } from 'react'

import { Chat } from '@/lib/types'
import { usersStatusStore } from '@/stores/users-status-store'
import { useSocket } from '@/components/providers/global/socket-provider'

const ChatCard = ({e}:{e:Chat}) => {
  const {getStatus} =usersStatusStore()
  const socket = useSocket()
  useEffect(()=>{
    socket.emit("join:chat",e.id)
  },[])
if(e.user)
  return (
    <Link href={'/chats/'+e.id} className='w-full flex rounded-lg pl-2 hover:bg-muted-foreground/5 py-3 items-center gap-3'>
                 <UserAvatar user={e.user} enablesocket/>
                 <div className="info">
                 <p className='text-sm font-semibold'>{e.user.username}</p>
                 <p className='text-xs text-muted-foreground leading-none'> 
                  {getStatus(e.user.id)? 'online':'offline'}
                   </p>
                 </div>
                 </Link>
  )
}

export default ChatCard