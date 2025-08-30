"use client"
import { ScrollArea } from '@/components/ui/scroll-area'
import { useChats } from '@/hooks/use-chats'
import ChartCard from './chat-card'
import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const ChatSidebarBody = () => {
    const {data,isLoading} =useChats()
    const chats = data ? data.pages.flatMap((e)=>e.data) :[]
  return (
    <div className='w-full flex flex-col flex-1  '>
        <ScrollArea className='flex-1 flex flex-col gap-2'>
           {chats.map((e,i)=>{
            return(
              <React.Fragment key={i}>
                <ChartCard e={e}/>
              </React.Fragment>
            )
           })}
           {isLoading &&
           <>
           <div className='flex flex-col gap-2'>
            <Skeleton className='w-full h-[60px] '/>
           <Skeleton className='w-full h-[60px] '/>
           <Skeleton className='w-full h-[60px] '/>
           <Skeleton className='w-full h-[60px] '/>
           <Skeleton className='w-full h-[60px] '/>
           </div>
           </>
           }
        </ScrollArea>
    </div>
  )
}

export default ChatSidebarBody