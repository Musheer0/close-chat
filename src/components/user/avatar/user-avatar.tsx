"use client"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { publicUser } from '@/lib/types'
import React from 'react'

const UserAvatar = ({user}:{user:publicUser}) => {
  return (
    <Avatar>
        <AvatarImage src={user.image!}/>
        <AvatarFallback>{user.username.slice(0,2)}</AvatarFallback>
    </Avatar>
  )
}

export default UserAvatar