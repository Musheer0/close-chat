"use client"
import React from 'react'
import { Loader2Icon, PhoneIcon} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Chat } from '@/lib/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sendCall } from '@/data/messages/send-call'
import { useRouter } from 'next/navigation'
import { updateChatCache } from '@/lib/cache/update-messages-cache'
import { toast } from 'sonner'
const SendCallButton = ({chat}:{chat:Chat}) => {
  const router =useRouter()
  const queryCliet =useQueryClient()
  const {mutate,isPending} =useMutation({
    mutationFn:sendCall,
    onSuccess:(data)=>{
      if(data){
        updateChatCache(queryCliet,chat.id,data)
        router.push('/chats/'+chat.id+'/'+data.id)
      }
    },
    onError(){
      toast.error("error calling user try again")
    }
  })
  return (
    <Button
    disabled={isPending}

    onClick={()=>mutate({chatId:chat.id})}
    size={'icon'} variant={'outline'}>
    {isPending ?
  <Loader2Icon/>
  :
              <PhoneIcon/>  
  }
            </Button>
  )
}

export default SendCallButton