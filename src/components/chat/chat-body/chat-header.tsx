"use client"
import { Button } from '@/components/ui/button'
import UserAvatar from '@/components/user/avatar/user-avatar'
import { Chat } from '@/lib/types'
import { PhoneIcon, VideoIcon } from 'lucide-react'
import React from 'react'

const ChatHeader = ({chat}:{chat:Chat}) => {
  return (
    <div className='w-full flex items-center justify-between gap-2 flex-wrap py-2 pb-3 px-2 border-b'>
        {chat.user &&
        <UserAvatar user={chat.user}/>
        }
        <div className="info mr-auto">
            <p className='mr-auto '>{chat.user?.username}</p>
            <p className='text-xs text-muted-foreground leading-none'>offline</p>
        </div>
        <div className="actions flex items-center gap-3">
            <Button size={'icon'} variant={'outline'}>
                <PhoneIcon/>
            </Button>
            <Button size={'icon'} variant={'outline'}>
                <VideoIcon/>
            </Button>
        </div>
    </div>
  )
}

export default ChatHeader