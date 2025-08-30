"use client"
import React from 'react'
import ChatSidebarHeader from './chat-sidebar-header'
import ChatSidebarBody from './chat-sidebar-body'
import { usePathname } from 'next/navigation'
import { useIsMobile } from '@/hooks/use-is-mobile'
const ChatsSidebar = () => {
  const pathname = usePathname()
  const {isMobile} =useIsMobile()
  const isChatOpen =pathname.split('/chats/').length>1
if(!isChatOpen || !isMobile)
  return (
    <div
    className='sm:w-[300px] w-full bg-muted-foreground/3 border-r flex flex-col h-screen  p-2 '
    >
      <ChatSidebarHeader/>
      <ChatSidebarBody/>
    </div>
  )
}

export default ChatsSidebar 