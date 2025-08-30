"use client"
import UserAvatar from '@/components/user/avatar/user-avatar'
import Link from 'next/link'
import React from 'react'

import { Chat } from '@/lib/types'

const ChatCard = ({e}:{e:Chat}) => {
if(e.user)
  return (
    <Link href={'/chats/'+e.id} className='w-full flex rounded-lg pl-2 hover:bg-muted-foreground/5 py-3 items-center gap-3'>
                 <UserAvatar user={e.user} enablesocket/>
                 <div className="info">
                 <p className='text-sm font-semibold'>{e.user.username}</p>
                 <p className='text-xs text-muted-foreground leading-none'> offline </p>
                 </div>
                 </Link>
  )
}

export default ChatCard