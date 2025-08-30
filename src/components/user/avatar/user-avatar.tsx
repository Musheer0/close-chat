"use client"
import { useSocket } from '@/components/providers/global/socket-provider'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { publicUser } from '@/lib/types'
import { cn } from '@/lib/utils'
import { usersStatusStore } from '@/stores/users-status-store'
import React, { useEffect, useState } from 'react'

const SocketUserAvatar = ({ user }: { user: publicUser }) => {
  const socket = useSocket()
  const {addStatus} = usersStatusStore()
  const [isOnline, setIsOnline] = useState(false)
  const [isJoined, setIsJoined] = useState(false)

  useEffect(() => {
    if (!socket) return

    const handler = (data: { online: boolean }) => {
      setIsOnline(data.online)
      if(user.id){
        addStatus(user.id,data.online)
      }
    }

    socket.on("online:status:" + user.id, handler)
    return () => {
      socket.off("online:status:" + user.id, handler)
    }
  }, [socket, user.id])

  useEffect(() => {
    if (!socket || isJoined) return
    socket.emit("join:status", user.id)
    setIsJoined(true)
  }, [socket, isJoined, user.id])

  return (
    <Avatar className="relative overflow-visible">
      <div
        className={cn(
          "absolute bottom-0 left-0 w-2 h-2 rounded-full",
          isOnline ? "bg-green-500" : "bg-gray-500"
        )}
      />
      <AvatarImage src={user.image!} className="rounded-full" />
      <AvatarFallback>{user.username.slice(0, 2)}</AvatarFallback>
    </Avatar>
  )
}

const NormalUserAvatar = ({ user }: { user: publicUser }) => {
  return (
    <Avatar>
      <AvatarImage src={user.image!} className="rounded-full" />
      <AvatarFallback>{user.username.slice(0, 2)}</AvatarFallback>
    </Avatar>
  )
}

const UserAvatar = ({ user, enablesocket }: { user: publicUser; enablesocket?: boolean }) => {
  if (enablesocket) return <SocketUserAvatar user={user} />
  return <NormalUserAvatar user={user} />
}

export default UserAvatar
