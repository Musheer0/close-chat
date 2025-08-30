"use client"
import { publicUser } from '@/lib/types'
import React from 'react'
import UserAvatar from './avatar/user-avatar'
import { Button } from '../ui/button'
import { PlusIcon, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query'
import { createChat } from '@/data/chat/create-chat'
import { toast } from 'sonner'
import { ChatResponse } from '@/hooks/use-chats'

const AddUserCard = ({ data }: { data: publicUser }) => {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: createChat,
    onError: () => {
      toast.error("error sending request try again")
    },
    onSuccess: (res) => {
  if (!res.user) return;

  queryClient.setQueryData<InfiniteData<ChatResponse>>(
    ["chats"],
    (oldData) => {
      if (!oldData) {
        return {
          pages: [{ data: [res], cursor: null }],
          pageParams: []
        };
      }

      // make a new copy of pages with new chat added to first page
      const newPages = oldData.pages.map((page, idx) =>
        idx === 0
          ? { ...page, data: [ res,...page.data,] } // or [res, ...page.data] for newest first
          : page
      );

      return { ...oldData, pages: newPages, pageParams: [...oldData.pageParams] };
    }
  );
}
  })

  if (!data?.id) return null

  return (
    <div className="flex w-full items-center p-2 border rounded-xl gap-2">
      <UserAvatar user={data} />
      <div className="info">
        <p className="font-semibold">{data.username}</p>
        <p className="text-xs text-muted-foreground">{data.email}</p>
      </div>

      <Button
        onClick={() => mutate(data.id!)}
        size="icon"
        className="rounded-full ml-auto"
        variant="outline"
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="animate-spin" />
        ) : isSuccess ? (
          <CheckCircle2 className="text-green-500" />
        ) : isError ? (
          <XCircle className="text-red-500" />
        ) : (
          <PlusIcon />
        )}
      </Button>
    </div>
  )
}

export default AddUserCard
