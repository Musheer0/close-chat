"use server";
import { ChatResponse } from "@/hooks/use-chats";
import { ChatWithUsers } from "@/lib/types";
import prisma from "@/prisma";
import { deleteCache, getCache, setCache } from "@/redis";
import { auth } from "@clerk/nextjs/server";
export async function rejectChat(chatId: string) {
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

  await prisma.chat.deleteMany({
    where:{
        id:chatId
    }
  })
    const Chatscache =await getCache<ChatResponse>(`sanitized:chat:${currentUserId}:cursor:'empty'`)
      if(Chatscache){
         await setCache(`sanitized:chat:${currentUserId}:cursor:'empty'`,{...Chatscache,data:Chatscache.data.filter((e)=>e.id!==chatId)})
      }
  await deleteCache(`chat:${chatId}`)
  return chatId
}
