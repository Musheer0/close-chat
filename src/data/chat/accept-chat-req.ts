"use server";

import { ChatResponse } from "@/hooks/use-chats";
import { ChatWithUsers } from "@/lib/types";
import { sanitizeChat } from "@/lib/utils";
import prisma from "@/prisma";
import { getCache, setCache } from "@/redis";
import { auth } from "@clerk/nextjs/server";
export async function acceptChat(chatId: string) {
  const { userId: currentUserId } =await  auth();
  if (!currentUserId) throw new Error("Unauthorized");
  const cache = await getCache<ChatWithUsers>(`chat:${chatId}`)
  if(cache){
    if(cache.users){
      if(cache.users[0].id!==currentUserId){
         throw new Error("Chat not found");
      }
    }
    else{
       throw new Error("Chat not found");
    }
  }
  else{
    const chat = await prisma.chat.findFirst({
    where: { id: chatId, 
      users:{
        some:{
          id:currentUserId
        }
      }

    },
  });

  if (!chat) throw new Error("Chat not found");
  }


  const updated = await prisma.chat.update({
    where: { id: chatId },
    data: {
      isaccepted: true,
      isacceptedat: new Date(),
      acceptedby: currentUserId,
    },
    include:  { users:{
      where:{
        id:{not: currentUserId}
      }
    } },
  });
    const Chatscache =await getCache<ChatResponse>(`sanitized:chat:${currentUserId}:cursor:'empty'`)
    if(Chatscache){
       await setCache(`sanitized:chat:${currentUserId}:cursor:'empty'`,{...Chatscache,data:Chatscache.data.push(sanitizeChat(updated,currentUserId))})
    }
  await setCache(`chat:${updated.id}`,updated)
  return sanitizeChat(updated, currentUserId);
}
