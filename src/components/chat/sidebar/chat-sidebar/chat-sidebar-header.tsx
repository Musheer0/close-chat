"use client"
import { Button } from '@/components/ui/button'
import {Share2Icon, UserPlus2Icon, UserSearchIcon} from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import React from 'react'
import { DropdownMenu ,DropdownMenuContent,DropdownMenuItem,DropdownMenuLabel,DropdownMenuTrigger} from '@/components/ui/dropdown-menu'
import { useShareCard } from '@/hooks/use-share-card'
import Link from 'next/link'

const ChatSidebarHeader = () => {
    const {isOpen,setIsOpen}=useShareCard()
  return (
 <div className="header flex flex-col gap-3 items-center pb-4 pt-1.5 justify-between">
            <div className="top w-full flex items-center justify-between">
                <div className="logo flex items-center gap-2">
                <h1 className='text-lg font-bold tracking-tight'>Close Chat</h1>
            </div>
            <UserButton/>
            </div>
            <div className="botton w-full flex items-center  justify-between">
                <p>Your chats</p>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size={'icon'} variant={'outline'} title='add chat'>
                        <UserPlus2Icon/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                       <Link href={'/add'}>
                        <DropdownMenuItem>
                            <UserSearchIcon/>
                            <DropdownMenuLabel>
                                Add user 
                            </DropdownMenuLabel>
                        </DropdownMenuItem>
                       </Link>
                         <DropdownMenuItem 
                         onClick={()=>{
                            setIsOpen(!isOpen)
                         }}
                         >
                            <Share2Icon/>
                            <DropdownMenuLabel>
                                Share your profile
                            </DropdownMenuLabel>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
  )
}

export default ChatSidebarHeader